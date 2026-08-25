"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import editorStyles from "./instructor-course-editor.module.css";
import styles from "./instructor-course-students-content.module.css";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const STATUS_LABELS = {
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completado",
};

export default function InstructorCourseStudentsContent({ courseId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/instructor/courses/${courseId}/students`)
      .then((res) => res.json())
      .then((body) => {
        if (!body.students) {
          setError(body.error || "No se pudo cargar el curso.");
          return;
        }
        setData(body);
      })
      .catch(() => setError("No se pudo cargar el curso. Revisa tu conexión."))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  return (
    <div className={editorStyles.page}>
      <div className={editorStyles.subheader}>
        <Link href={`/instructor/cursos/${courseId}/editar`} className={editorStyles.subheaderBack}>
          <Image src="/icons/chevron-left.svg" alt="" width={24} height={24} />
          <div className={editorStyles.subheaderCopy}>
            <h1 className={editorStyles.subheaderTitle}>
              {data ? data.course.title : "Estudiantes"}
            </h1>
            <p className={editorStyles.subheaderSubtitle}>Estudiantes inscritos</p>
          </div>
        </Link>
      </div>

      <div className={styles.main}>
        {isLoading && <p className={styles.hint}>Cargando...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {data && data.students.length === 0 && (
          <p className={styles.hint}>Todavía no hay nadie inscrito en este curso.</p>
        )}

        {data && data.students.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Estado</th>
                  <th>Progreso</th>
                  <th>Inscrito</th>
                  <th>Completado</th>
                  {data.hasFinalExam && <th>Examen final</th>}
                </tr>
              </thead>
              <tbody>
                {data.students.map((student) => (
                  <tr key={student.userId}>
                    <td>
                      <span className={styles.studentName}>{student.name}</span>
                      <span className={styles.studentEmail}>{student.email}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          student.status === "COMPLETED" ? styles.statusCompleted : ""
                        }`}
                      >
                        {STATUS_LABELS[student.status] ?? student.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.progressCell}>
                        <div className={styles.progressTrack}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                        <span>{student.progressPercent}%</span>
                      </div>
                    </td>
                    <td>{formatDate(student.enrolledAt)}</td>
                    <td>{formatDate(student.completedAt)}</td>
                    {data.hasFinalExam && (
                      <td>
                        {student.examResult ? (
                          <span
                            className={`${styles.statusBadge} ${
                              student.examResult.passed ? styles.statusCompleted : styles.statusFailed
                            }`}
                          >
                            {student.examResult.score}% · {student.examResult.passed ? "Aprobado" : "No aprobado"}
                          </span>
                        ) : (
                          <span className={styles.hint}>Sin rendir</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
