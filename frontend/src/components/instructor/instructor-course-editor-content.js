"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCourseDraft,
  instructorAreas,
  instructorCourseSteps,
  instructorDefaultModule,
  instructorEmptyModule,
  instructorEnrollmentOptions,
  instructorLessonTypes,
  instructorVisibilityOptions,
} from "@/data/instructor-data";
import styles from "./instructor-course-editor.module.css";

function cloneDefaultModule() {
  return {
    ...instructorDefaultModule,
    lessons: instructorDefaultModule.lessons.map((lesson) => ({ ...lesson })),
  };
}

function createEmptyModule() {
  return {
    ...instructorEmptyModule,
    id: `module-${Date.now()}`,
    lessons: [],
  };
}

function StepBasic({ draft, onChange }) {
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
            value={draft.area}
            onChange={(event) => onChange({ area: event.target.value })}
            className={styles.select}
          >
            {instructorAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <Image
            src="/icons/chevron-down.svg"
            alt=""
            width={10}
            height={10}
            className={styles.selectIcon}
          />
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Portada del Curso</span>
        <label className={styles.uploadZone}>
          <input type="file" accept="image/*" className={styles.uploadInput} />
          <Image src="/icons/instructor-upload.svg" alt="" width={40} height={40} />
          <span className={styles.uploadTitle}>Sube una imagen o arrástrala aquí</span>
          <span className={styles.uploadHint}>1920x1080px (Recomendado)</span>
        </label>
      </div>
    </div>
  );
}

function LessonRow({ lesson }) {
  const typeConfig = instructorLessonTypes.find((item) => item.id === lesson.type);

  return (
    <div className={styles.lessonRow}>
      <Image src="/icons/instructor-drag.svg" alt="" width={16} height={16} />
      {typeConfig && (
        <Image src={typeConfig.icon} alt="" width={16} height={16} />
      )}
      <span className={styles.lessonTitle}>{lesson.title}</span>
    </div>
  );
}

function ModuleCard({ module, onDelete }) {
  return (
    <article className={styles.moduleCard}>
      <header className={styles.moduleHeader}>
        <Image src="/icons/instructor-drag.svg" alt="" width={20} height={20} />
        <input
          type="text"
          defaultValue={module.title}
          className={styles.moduleTitleInput}
          aria-label="Título del módulo"
        />
        <button
          type="button"
          className={styles.moduleDelete}
          onClick={onDelete}
          aria-label="Eliminar módulo"
        >
          <Image src="/icons/instructor-trash.svg" alt="" width={16} height={16} />
        </button>
      </header>

      <div className={styles.moduleBody}>
        {module.lessons.length > 0 ? (
          module.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))
        ) : (
          <div className={styles.moduleEmpty}>Módulo vacío. Agrega lecciones.</div>
        )}

        <div className={styles.lessonActions}>
          {instructorLessonTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`${styles.lessonAction} ${styles[`lessonAction_${type.tone}`]}`}
            >
              <Image src={type.icon} alt="" width={12} height={12} />
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

function StepContent({ viewTitle, modules, onAddModule, onDeleteModule }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.contentHeader}>
        <h2 className={styles.stepTitle}>{viewTitle}</h2>
        <button type="button" className={styles.addModuleButton} onClick={onAddModule}>
          <Image src="/icons/instructor-add-module.svg" alt="" width={16} height={16} />
          Agregar Módulo
        </button>
      </div>

      <div className={styles.moduleList}>
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onDelete={() => onDeleteModule(module.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EnrollmentDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);
  const selected = instructorEnrollmentOptions.find((option) => option.id === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownWrap} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.dropdownTrigger} ${isOpen ? styles.dropdownTriggerOpen : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selected?.label}</span>
        <Image
          src="/icons/chevron-down.svg"
          alt=""
          width={12}
          height={12}
          className={styles.dropdownChevron}
        />
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu} role="listbox">
          {instructorEnrollmentOptions.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                className={`${styles.dropdownOption} ${
                  option.id === value ? styles.dropdownOptionActive : ""
                }`}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
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
        <p className={styles.rulesHint}>
          Selecciona si este curso requiere completar otro curso primero o si es exclusivo
          para un rango en específico.
        </p>
        <EnrollmentDropdown
          value={draft.enrollmentRequirement}
          onChange={(enrollmentRequirement) => onChange({ enrollmentRequirement })}
        />
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
            <span className={styles.checkboxHint}>
              Al aprobar el quiz final con más del 80%
            </span>
          </span>
        </label>
      </section>
    </div>
  );
}

export default function InstructorCourseEditorContent({ courseId, isNew = false }) {
  const initialDraft = getCourseDraft(isNew ? "nuevo" : courseId);
  const [activeStep, setActiveStep] = useState("basic");
  const [draft, setDraft] = useState(initialDraft);
  const [isDirty, setIsDirty] = useState(isNew);

  const updateDraft = (changes) => {
    setDraft((current) => ({ ...current, ...changes }));
    setIsDirty(true);
  };

  const handleStepChange = (stepId) => {
    setActiveStep(stepId);

    if (stepId === "content") {
      setDraft((current) => {
        if (current.modules.length > 0) {
          return current;
        }

        return {
          ...current,
          modules: [cloneDefaultModule()],
        };
      });
    }
  };

  const handleAddModule = () => {
    setDraft((current) => ({
      ...current,
      modules: [...current.modules, createEmptyModule()],
    }));
    setIsDirty(true);
  };

  const handleDeleteModule = (moduleId) => {
    setDraft((current) => ({
      ...current,
      modules: current.modules.filter((module) => module.id !== moduleId),
    }));
    setIsDirty(true);
  };

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
              {isDirty ? "Borrador no guardado" : "Borrador guardado"}
            </p>
          </div>
        </Link>

        <div className={styles.subheaderActions}>
          <button type="button" className={styles.saveButton}>
            <Image src="/icons/instructor-save.svg" alt="" width={16} height={16} />
            Guardar
          </button>
          <button type="button" className={styles.publishButton}>
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
                onClick={() => handleStepChange(step.id)}
              >
                <Image
                  src={step.icon}
                  alt=""
                  width={16}
                  height={16}
                  className={styles.stepNavIcon}
                />
                {step.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.main} key={activeStep}>
          {activeStep === "basic" && (
            <>
              <h2 className={styles.stepTitle}>{activeStepMeta?.viewTitle}</h2>
              <StepBasic draft={draft} onChange={updateDraft} />
            </>
          )}

          {activeStep === "content" && (
            <StepContent
              viewTitle={activeStepMeta?.viewTitle}
              modules={draft.modules}
              onAddModule={handleAddModule}
              onDeleteModule={handleDeleteModule}
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
    </div>
  );
}
