"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InstructorLessonEditorModal from "./instructor-lesson-editor-modal";
import styles from "./instructor-course-editor.module.css";

const instructorCourseSteps = [
  { id: "basic", label: "Información Básica", viewTitle: "Información Básica", icon: "/icons/instructor-step-info.svg" },
  { id: "content", label: "Contenido y Módulos", viewTitle: "Contenido del Curso", icon: "/icons/instructor-step-content.svg" },
  { id: "rules", label: "Reglas y Publicación", viewTitle: "Reglas y Publicación", icon: "/icons/instructor-step-rules.svg" },
];

const instructorEnrollmentOptions = [
  { id: "NONE", label: "Sin requisitos" },
  { id: "RANK_SPECIALIST", label: "Exclusivo: Rango Especialista o superior" },
];

const instructorVisibilityOptions = [
  { id: "PUBLIC", label: "Público (Catálogo General)" },
  { id: "HIDDEN", label: "Oculto (Solo con enlace)" },
];

const LESSON_TYPE_LABELS = { VIDEO: "Video", DOCUMENT: "Documento", QUIZ: "Quiz", TOOLS: "Herramientas" };

function StepBasic({
  draft,
  onChange,
  departments,
  onCoverUpload,
  isUploadingCover,
  coverError,
  onContinue,
  continueError,
}) {
  return (
    <div className={styles.stepForm}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="course-title">
          Título del Curso
        </label>
        <input
          id="course-title"
          type="text"
          value={draft.title}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Growth Hacking Avanzado"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="course-description">
          Descripción Breve
        </label>
        <textarea
          id="course-description"
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Escribe un resumen atractivo para la tarjeta del curso..."
          className={styles.textarea}
          rows={4}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="course-area">
          Área
        </label>
        <div className={styles.selectWrap}>
          <select
            id="course-area"
            value={draft.departmentId ?? ""}
            onChange={(event) => onChange({ departmentId: event.target.value })}
            className={styles.select}
          >
            <option value="">Selecciona un área</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.label}
              </option>
            ))}
          </select>
          <Image src="/icons/chevron-down.svg" alt="" width={10} height={10} className={styles.selectIcon} />
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Portada del Curso</span>
        {draft.coverImageUrl && (
          <Image
            src={draft.coverImageUrl}
            alt=""
            width={320}
            height={180}
            className={styles.uploadPreview}
          />
        )}
        <label
          className={`${styles.uploadZone} ${draft.coverImageUrl ? styles.uploadZoneCompact : ""}`}
        >
          <input
            type="file"
            accept="image/*"
            className={styles.uploadInput}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onCoverUpload(file);
            }}
            disabled={isUploadingCover}
          />
          {!draft.coverImageUrl && (
            <Image src="/icons/instructor-upload.svg" alt="" width={40} height={40} />
          )}
          <span className={styles.uploadTitle}>
            {isUploadingCover
              ? "Subiendo..."
              : draft.coverImageUrl
                ? "Reemplazar portada"
                : "Sube una imagen o arrástrala aquí"}
          </span>
          {!draft.coverImageUrl && (
            <span className={styles.uploadHint}>1920x1080px (Recomendado)</span>
          )}
        </label>
        {coverError && <p className={styles.stepError}>{coverError}</p>}
      </div>

      {continueError && <p className={styles.stepError}>{continueError}</p>}
      <button type="button" className={styles.continueButton} onClick={onContinue}>
        Continuar
      </button>
    </div>
  );
}

function LessonRow({ lesson, onClick }) {
  const hasContent = Boolean(lesson.content?.trim() || lesson.videoUrl);

  return (
    <button type="button" className={styles.lessonRow} onClick={onClick}>
      <Image src="/icons/instructor-drag.svg" alt="" width={16} height={16} />
      <span className={styles.lessonTitle}>{lesson.title}</span>
      {!hasContent && <span className={styles.lessonMissing}>Falta texto o video</span>}
      <span className={styles.lessonType}>{LESSON_TYPE_LABELS[lesson.type] ?? lesson.type}</span>
      <Image src="/icons/instructor-edit.svg" alt="" width={14} height={14} />
    </button>
  );
}

function ModuleCard({ module, onAddLesson, onDeleteModule, onLessonClick }) {
  const [newLessonTitle, setNewLessonTitle] = useState("");

  return (
    <article className={styles.moduleCard}>
      <header className={styles.moduleHeader}>
        <Image src="/icons/instructor-drag.svg" alt="" width={20} height={20} />
        <span className={styles.moduleTitleInput}>{module.title}</span>
        <button
          type="button"
          className={styles.moduleDelete}
          onClick={() => onDeleteModule(module.id)}
          aria-label={`Eliminar ${module.title}`}
        >
          <Image src="/icons/instructor-trash.svg" alt="" width={16} height={16} />
        </button>
      </header>

      <div className={styles.moduleBody}>
        {module.lessons.length > 0 ? (
          module.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onClick={() => onLessonClick(module.id, lesson)}
            />
          ))
        ) : (
          <div className={styles.moduleEmpty}>Módulo vacío. Agrega lecciones.</div>
        )}

        <div className={styles.lessonActions}>
          <input
            type="text"
            value={newLessonTitle}
            onChange={(event) => setNewLessonTitle(event.target.value)}
            placeholder="Título de la nueva lección"
            className={styles.input}
          />
          <button
            type="button"
            className={styles.lessonAction}
            onClick={() => {
              if (!newLessonTitle.trim()) return;
              onAddLesson(module.id, newLessonTitle.trim());
              setNewLessonTitle("");
            }}
          >
            + Agregar lección
          </button>
        </div>
      </div>
    </article>
  );
}

function StepContent({
  viewTitle,
  modules,
  onAddModule,
  onAddLesson,
  onDeleteModule,
  onLessonClick,
  onNext,
  nextErrors,
}) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.contentHeader}>
        <h2 className={styles.stepTitle}>{viewTitle}</h2>
        <button type="button" className={styles.addModuleButton} onClick={onAddModule}>
          <Image src="/icons/instructor-add-module.svg" alt="" width={16} height={16} />
          Agregar Módulo
        </button>
      </div>

      {nextErrors.length > 0 && (
        <ul className={styles.stepErrorList}>
          {nextErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      <div className={styles.moduleList}>
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onAddLesson={onAddLesson}
            onDeleteModule={onDeleteModule}
            onLessonClick={onLessonClick}
          />
        ))}
        {modules.length === 0 && (
          <p className={styles.moduleEmpty}>Aún no hay módulos. Agrega el primero.</p>
        )}
      </div>

      <button type="button" className={styles.continueButton} onClick={onNext}>
        Siguiente
      </button>
    </div>
  );
}

function StepRules({ draft, onChange }) {
  return (
    <div className={styles.rulesPanel}>
      <section className={styles.rulesSection}>
        <h3 className={styles.rulesHeading}>Visibilidad del Curso</h3>
        <div className={styles.radioGroup}>
          {instructorVisibilityOptions.map((option) => (
            <label key={option.id} className={styles.radioLabel}>
              <input
                type="radio"
                name="visibility"
                value={option.id}
                checked={draft.visibility === option.id}
                onChange={() => onChange({ visibility: option.id })}
                className={styles.radioInput}
              />
              <span className={styles.radioControl} aria-hidden="true" />
              {option.label}
            </label>
          ))}
        </div>
      </section>

      <section className={styles.rulesSection}>
        <h3 className={styles.rulesHeading}>Requisitos de Inscripción</h3>
        <div className={styles.selectWrap}>
          <select
            value={draft.enrollmentRequirement}
            onChange={(event) => onChange({ enrollmentRequirement: event.target.value })}
            className={styles.select}
          >
            {instructorEnrollmentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={styles.rulesSection}>
        <h3 className={styles.rulesHeading}>Certificación</h3>
        <label className={styles.checkboxCard}>
          <input
            type="checkbox"
            checked={draft.autoCertificate}
            onChange={(event) => onChange({ autoCertificate: event.target.checked })}
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxControl} aria-hidden="true" />
          <span className={styles.checkboxCopy}>
            <span className={styles.checkboxTitle}>Otorgar Certificado Automático</span>
            <span className={styles.checkboxHint}>Al aprobar el examen final con más del 80%</span>
          </span>
        </label>
      </section>
    </div>
  );
}

const EMPTY_DRAFT = {
  title: "",
  description: "",
  departmentId: "",
  coverImageUrl: null,
  visibility: "PUBLIC",
  enrollmentRequirement: "NONE",
  autoCertificate: false,
  modules: [],
};

export default function InstructorCourseEditorContent({ courseId, isNew = false }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState("basic");
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [id, setId] = useState(isNew ? null : courseId);
  const [departments, setDepartments] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [basicError, setBasicError] = useState("");
  const [contentErrors, setContentErrors] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments ?? []))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    if (isNew || !id) return;
    fetch(`/api/instructor/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course) setDraft({ ...EMPTY_DRAFT, ...data.course });
      });
  }, [id, isNew]);

  const updateDraft = (changes) => {
    setDraft((current) => ({ ...current, ...changes }));
    setIsDirty(true);
  };

  async function ensureCourseExists() {
    if (id) return id;
    const response = await fetch("/api/instructor/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draft.title || "Nuevo curso", description: draft.description }),
    });
    const data = await response.json();
    const newId = data.course.id;
    setId(newId);
    return newId;
  }

  // La URL solo se sincroniza aca (tras guardar), nunca dentro de
  // ensureCourseExists: navegar a /editar/[id] desmonta este componente
  // (son rutas distintas), y si eso ocurre a mitad de una subida (portada,
  // video, etc.) la actualizacion de estado se pierde porque apunta a una
  // instancia ya desmontada. Ver bug: la portada se subia pero no se veia.
  async function handleSave() {
    setIsSaving(true);
    try {
      const currentId = await ensureCourseExists();
      await fetch(`/api/instructor/courses/${currentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          departmentId: draft.departmentId || undefined,
          visibility: draft.visibility,
          enrollmentRequirement: draft.enrollmentRequirement,
          autoCertificate: draft.autoCertificate,
        }),
      });
      setIsDirty(false);
      if (isNew) router.replace(`/instructor/cursos/${currentId}/editar`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    await handleSave();
    const currentId = await ensureCourseExists();
    await fetch(`/api/instructor/courses/${currentId}/publish`, { method: "POST" });
    router.push("/instructor");
  }

  async function handleCoverUpload(file) {
    setIsUploadingCover(true);
    setCoverError("");
    try {
      const currentId = await ensureCourseExists();
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/instructor/courses/${currentId}/cover`, {
        method: "POST",
        body: formData,
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        // Respuesta no-JSON (ej. 413 de la plataforma): sin este catch,
        // response.json() tira y el error queda silencioso.
      }

      if (!response.ok || !data?.coverImageUrl) {
        setCoverError(
          response.status === 413
            ? "La imagen pesa demasiado para subirla así."
            : data?.error || `No se pudo subir la portada (error ${response.status}).`,
        );
        return;
      }
      updateDraft({ coverImageUrl: data.coverImageUrl });
    } catch {
      setCoverError("No se pudo subir la portada. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function handleAddModule() {
    const currentId = await ensureCourseExists();
    const response = await fetch(`/api/instructor/courses/${currentId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    setDraft((current) => ({
      ...current,
      modules: [...current.modules, { ...data.module, lessons: [] }],
    }));
  }

  async function handleAddLesson(moduleId, title) {
    const currentId = await ensureCourseExists();
    const response = await fetch(
      `/api/instructor/courses/${currentId}/modules/${moduleId}/lessons`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type: "VIDEO" }),
      },
    );
    const data = await response.json();
    const newLesson = { content: null, videoUrl: null, materials: [], ...data.lesson };
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((moduleItem) =>
        moduleItem.id === moduleId
          ? { ...moduleItem, lessons: [...moduleItem.lessons, newLesson] }
          : moduleItem,
      ),
    }));
  }

  async function handleDeleteModule(moduleId) {
    const currentId = await ensureCourseExists();
    await fetch(`/api/instructor/courses/${currentId}/modules/${moduleId}`, {
      method: "DELETE",
    });
    setDraft((current) => ({
      ...current,
      modules: current.modules.filter((moduleItem) => moduleItem.id !== moduleId),
    }));
  }

  function handleLessonUpdated(lessonId, changes) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((moduleItem) => ({
        ...moduleItem,
        lessons: moduleItem.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, ...changes } : lesson,
        ),
      })),
    }));
  }

  async function handleContinueToContent() {
    if (!draft.title.trim()) {
      setBasicError("Ingresa un título para el curso antes de continuar.");
      return;
    }
    setBasicError("");
    await handleSave();
    setActiveStep("content");
  }

  function handleNextToRules() {
    const errors = [];
    if (draft.modules.length === 0) {
      errors.push("Agrega al menos un módulo.");
    }
    draft.modules.forEach((moduleItem, moduleIndex) => {
      if (moduleItem.lessons.length === 0) {
        errors.push(`El módulo ${moduleIndex + 1} ("${moduleItem.title}") no tiene lecciones.`);
        return;
      }
      moduleItem.lessons.forEach((lesson) => {
        if (!lesson.content?.trim() && !lesson.videoUrl) {
          errors.push(`La lección "${lesson.title}" necesita texto o video.`);
        }
      });
    });

    setContentErrors(errors);
    if (errors.length === 0) setActiveStep("rules");
  }

  const activeStepMeta = instructorCourseSteps.find((step) => step.id === activeStep);
  const displayTitle = draft.title || "Nuevo Curso";

  return (
    <div className={styles.page}>
      <div className={styles.subheader}>
        <Link href="/instructor" className={styles.subheaderBack}>
          <Image src="/icons/chevron-left.svg" alt="" width={24} height={24} />
          <div className={styles.subheaderCopy}>
            <h1 className={styles.subheaderTitle}>{displayTitle}</h1>
            <p className={styles.subheaderSubtitle}>
              {isDirty ? "Cambios sin guardar" : "Guardado"}
            </p>
          </div>
        </Link>

        <div className={styles.subheaderActions}>
          <button type="button" className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
            <Image src="/icons/instructor-save.svg" alt="" width={16} height={16} />
            Guardar
          </button>
          <button type="button" className={styles.publishButton} onClick={handlePublish} disabled={isSaving}>
            <Image src="/icons/instructor-publish.svg" alt="" width={16} height={16} />
            Publicar
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        <aside className={styles.sidebar} aria-label="Pasos del curso">
          <nav className={styles.stepNav}>
            {instructorCourseSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                className={`${styles.stepNavItem} ${
                  activeStep === step.id ? styles.stepNavItemActive : ""
                }`}
                aria-current={activeStep === step.id ? "step" : undefined}
                onClick={() => setActiveStep(step.id)}
              >
                <Image src={step.icon} alt="" width={16} height={16} className={styles.stepNavIcon} />
                {step.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.main} key={activeStep}>
          {activeStep === "basic" && (
            <>
              <h2 className={styles.stepTitle}>{activeStepMeta?.viewTitle}</h2>
              <StepBasic
                draft={draft}
                onChange={updateDraft}
                departments={departments}
                onCoverUpload={handleCoverUpload}
                isUploadingCover={isUploadingCover}
                coverError={coverError}
                onContinue={handleContinueToContent}
                continueError={basicError}
              />
            </>
          )}

          {activeStep === "content" && (
            <StepContent
              viewTitle={activeStepMeta?.viewTitle}
              modules={draft.modules}
              onAddModule={handleAddModule}
              onAddLesson={handleAddLesson}
              onDeleteModule={handleDeleteModule}
              onLessonClick={(moduleId, lesson) => setEditingLesson({ moduleId, lesson })}
              onNext={handleNextToRules}
              nextErrors={contentErrors}
            />
          )}

          {activeStep === "rules" && (
            <>
              <h2 className={styles.stepTitle}>{activeStepMeta?.viewTitle}</h2>
              <StepRules draft={draft} onChange={updateDraft} />
            </>
          )}
        </main>
      </div>

      {editingLesson && (
        <InstructorLessonEditorModal
          lesson={editingLesson.lesson}
          onClose={() => setEditingLesson(null)}
          onLessonUpdated={handleLessonUpdated}
        />
      )}
    </div>
  );
}
