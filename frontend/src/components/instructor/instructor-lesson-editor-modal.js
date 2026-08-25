"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./instructor-lesson-editor-modal.module.css";
import { MAX_LESSON_VIDEO_BYTES } from "@revolab/backend/constants/lesson-video";

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Sube directo al storage (R2 en producción, el shim local en dev) con la
// URL prefirmada que entrega el backend, reportando progreso real. fetch()
// no expone progreso de subida de forma confiable; XHR sí.
function putWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Subida directa falló (status ${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Subida directa falló por un error de red"));
    xhr.send(file);
  });
}

export default function InstructorLessonEditorModal({ lesson, onClose, onLessonUpdated }) {
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content ?? "");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? null);
  const [materials, setMaterials] = useState(lesson.materials ?? []);
  const [isSavingText, setIsSavingText] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false);
  const [savedHint, setSavedHint] = useState(false);
  const [error, setError] = useState("");

  async function saveText() {
    const response = await fetch(`/api/instructor/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) {
      setError("No se pudo guardar la lección.");
      return false;
    }
    onLessonUpdated(lesson.id, { title, content });
    return true;
  }

  async function handleSaveText(event) {
    event.preventDefault();
    setIsSavingText(true);
    setError("");
    try {
      const ok = await saveText();
      if (ok) {
        setSavedHint(true);
        setTimeout(() => setSavedHint(false), 2000);
      }
    } finally {
      setIsSavingText(false);
    }
  }

  async function handleSaveAndClose() {
    setIsSavingText(true);
    setError("");
    try {
      const ok = await saveText();
      if (ok) onClose();
    } finally {
      setIsSavingText(false);
    }
  }

  async function handleVideoUpload(file) {
    if (file.size > MAX_LESSON_VIDEO_BYTES) {
      setError(
        `El video pesa ${formatFileSize(file.size)}, y el máximo permitido es ${formatFileSize(MAX_LESSON_VIDEO_BYTES)}. Intenta con un archivo más liviano.`,
      );
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(0);
    setError("");
    try {
      const urlResponse = await fetch(`/api/instructor/lessons/${lesson.id}/video/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });

      let urlData = null;
      try {
        urlData = await urlResponse.json();
      } catch {
        // Sin este catch, response.json() tira si la respuesta no fue JSON
        // y el error queda silencioso, como si "no pasara nada".
      }

      if (!urlResponse.ok || !urlData?.uploadUrl) {
        setError(urlData?.error || `No se pudo iniciar la subida (error ${urlResponse.status}).`);
        return;
      }

      await putWithProgress(urlData.uploadUrl, file, setVideoUploadProgress);

      const confirmResponse = await fetch(`/api/instructor/lessons/${lesson.id}/video/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: urlData.key }),
      });

      let confirmData = null;
      try {
        confirmData = await confirmResponse.json();
      } catch {
        // Ver comentario equivalente más arriba.
      }

      if (!confirmResponse.ok || !confirmData?.videoUrl) {
        setError(confirmData?.error || `No se pudo confirmar el video (error ${confirmResponse.status}).`);
        return;
      }

      setVideoUrl(confirmData.videoUrl);
      onLessonUpdated(lesson.id, { videoUrl: confirmData.videoUrl });
    } catch {
      setError("No se pudo subir el video. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadProgress(0);
    }
  }

  async function handleMaterialUpload(files) {
    setIsUploadingMaterial(true);
    setError("");
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`/api/instructor/lessons/${lesson.id}/materials`, {
          method: "POST",
          body: formData,
        });

        let data = null;
        try {
          data = await response.json();
        } catch {
          // Ver comentario equivalente en handleVideoUpload.
        }

        if (!response.ok || !data?.material) {
          setError(
            response.status === 413
              ? `"${file.name}" pesa demasiado para subirlo así (${formatFileSize(file.size)}).`
              : data?.error || `No se pudo subir "${file.name}" (error ${response.status}).`,
          );
          continue;
        }
        setMaterials((current) => {
          const next = [...current, data.material];
          onLessonUpdated(lesson.id, { materials: next });
          return next;
        });
      }
    } catch {
      setError("No se pudieron subir los archivos. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setIsUploadingMaterial(false);
    }
  }

  async function handleMaterialDelete(materialId) {
    const response = await fetch(`/api/instructor/lessons/${lesson.id}/materials/${materialId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setError("No se pudo eliminar el archivo.");
      return;
    }
    setMaterials((current) => {
      const next = current.filter((material) => material.id !== materialId);
      onLessonUpdated(lesson.id, { materials: next });
      return next;
    });
  }

  const hasContent = Boolean(content.trim() || videoUrl);

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-editor-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="lesson-editor-title" className={styles.title}>
          Editar lección
        </h3>

        {!hasContent && (
          <p className={styles.hint}>
            Agrega texto o video: una lección necesita al menos uno de los dos.
          </p>
        )}

        <form onSubmit={handleSaveText} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lesson-title">
              Título
            </label>
            <input
              id="lesson-title"
              type="text"
              className={styles.input}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="lesson-content">
              Texto de la lección
            </label>
            <textarea
              id="lesson-content"
              className={styles.textarea}
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escribe el contenido de la lección..."
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              disabled={isSavingText}
              onClick={handleSaveAndClose}
            >
              {isSavingText ? "Guardando..." : "Guardar lección"}
            </button>
            <button type="submit" className={styles.secondaryButton} disabled={isSavingText}>
              {savedHint ? "Guardado" : "Guardar texto"}
            </button>
          </div>
        </form>

        <button type="button" className={styles.cancelLink} onClick={onClose}>
          Cancelar sin guardar
        </button>

        <div className={styles.field}>
          <span className={styles.label}>Video de la lección</span>
          {videoUrl && <video src={videoUrl} controls className={styles.videoPreview} />}
          <label className={styles.uploadZone}>
            <input
              type="file"
              accept="video/*"
              className={styles.uploadInput}
              disabled={isUploadingVideo}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleVideoUpload(file);
                event.target.value = "";
              }}
            />
            <Image src="/icons/instructor-upload.svg" alt="" width={28} height={28} />
            <span className={styles.uploadTitle}>
              {isUploadingVideo
                ? `Subiendo... ${videoUploadProgress}%`
                : videoUrl
                  ? "Reemplazar video"
                  : "Sube el video de la lección"}
            </span>
          </label>
          {isUploadingVideo && (
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={videoUploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className={styles.progressFill} style={{ width: `${videoUploadProgress}%` }} />
            </div>
          )}
          <span className={styles.uploadHint}>
            Máximo {formatFileSize(MAX_LESSON_VIDEO_BYTES)} por video.
          </span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Material complementario</span>
          {materials.length > 0 && (
            <ul className={styles.materialList}>
              {materials.map((material) => (
                <li key={material.id} className={styles.materialItem}>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.materialLink}
                  >
                    {material.fileName}
                  </a>
                  <button
                    type="button"
                    className={styles.materialDelete}
                    onClick={() => handleMaterialDelete(material.id)}
                    aria-label={`Eliminar ${material.fileName}`}
                  >
                    <Image src="/icons/instructor-trash.svg" alt="" width={16} height={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label className={styles.uploadZone}>
            <input
              type="file"
              multiple
              className={styles.uploadInput}
              disabled={isUploadingMaterial}
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length > 0) handleMaterialUpload(files);
                event.target.value = "";
              }}
            />
            <Image src="/icons/instructor-upload.svg" alt="" width={28} height={28} />
            <span className={styles.uploadTitle}>
              {isUploadingMaterial ? "Subiendo..." : "Sube archivos de apoyo (PDF, guías, etc.)"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
