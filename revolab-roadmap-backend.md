# RevoLab — Roadmap técnico de Backend (MVP 1)

> **Actualizado 2026-08-19: este roadmap ya se ejecutó completo** (Etapas
> 0–6 de `revolab-checklist-backend.md`). Se conserva como referencia del
> razonamiento técnico original, pero para el estado real del proyecto y lo
> que falta, ver `revolab-checklist-backend.md`.

## Resumen

Sí, es completamente viable. Este documento traza el camino paso a paso para construir el backend de RevoLab sobre la arquitectura ya acordada en `revolab-estructura-decisiones.md` (Next.js full-stack + Prisma + Supabase Postgres + Auth.js + Cloudflare R2), partiendo del frontend que ya existe (actualmente 100% mockeado con datos estáticos en `frontend/src/data/*.js`).

Este roadmap **no modifica el proyecto**. Es un instructivo para ejecutar en fases posteriores.

---

## 0. Hallazgo importante antes de empezar

La carpeta `backend/` actual **no sigue la decisión de arquitectura ya tomada**:

- Es un esqueleto Express independiente (`server.js`, `src/app.js`, `src/controllers`, `src/routes`, `src/middlewares`) pensado para correr como servidor propio.
- Según `revolab-estructura-decisiones.md`, Express no debe ser el backend productivo, y `backend/` debe evolucionar hacia un **paquete interno** (sin servidor propio) consumido por `frontend/src/app/api`.
- El `schema.prisma` actual solo tiene modelos de ejemplo (`User`, `Course`) sin relación con lo que el frontend realmente necesita.
- El `README.md` raíz todavía describe el stack antiguo (backend Express, frontend "React + TypeScript a definir"), lo cual quedó desactualizado por el archivo de decisiones. Vale la pena actualizarlo cuando se ejecute este roadmap (no se modifica ahora).

**Fase 0 = decisión de limpieza**, antes de escribir código nuevo:

1. Congelar/retirar el Express actual (`server.js`, `src/app.js`, `src/controllers`, `src/routes`, `src/middlewares`, `src/models`). Se puede archivar en una rama o eliminar, ya que es código de ejemplo, no producto real.
2. Convertir `backend/` en workspace de pnpm (`pnpm-workspace.yaml` en la raíz con `frontend` y `backend`), tal como está documentado en las decisiones.
3. Reescribir `backend/package.json` como paquete interno (`@revolab/backend`, `type: module`, sin `express` ni `nodemon`, con `exports` apuntando a `services/`, `repositories/`, `validations/`, `auth/`, `integrations/`).
4. Mover el `schema.prisma` real a `backend/prisma/schema.prisma` (reemplazando el de ejemplo).

---

## 1. Alcance del MVP 1

Basado en lo que el frontend ya construyó (rutas en `frontend/src/app/(site)/**`), el MVP 1 debe cubrir el ciclo completo, no solo login → catálogo → primera clase:

**Dentro de alcance:**
- Login con correo institucional + sesión (Auth.js).
- Catálogo de cursos por categoría/área, cursos nuevos/populares, home con recomendados y "continuar viendo".
- Detalle de curso (descripción, contenido, tabs).
- Reproductor de lección con progreso y transcripción.
- Quiz por lección (con corrección automática).
- Examen final con umbral de aprobación (80%) y generación de certificado.
- Certificado descargable (PDF) y mensaje pre-armado para compartir en LinkedIn.
- Perfil de usuario: cursos en progreso/terminados/certificados, rango (Career IQ).
- Panel de instructor: crear/editar curso (info básica, portada, módulos/lecciones, reglas de publicación), listar cursos propios.
- Panel de administración: listado de usuarios, métricas agregadas (usuarios activos, cursos publicados, tasa de finalización).
- Notificaciones básicas (curso publicado, comentario nuevo).
- Buscador simple de cursos.
- Subida de portada de curso y video de lección a un storage (con storage intercambiable, ver Fase 5).

**Fuera de alcance MVP 1 (dejar como Fase 2 / post-MVP, solo dejar el modelo de datos preparado si es trivial):**
- Comentarios reales en el detalle del curso (hoy es un tab de UI, sin persistencia evidenciada más que la notificación mock).
- Transcripciones generadas por IA (hoy es texto estático).
- "Constructor de Rutas de Aprendizaje" (botón visible en `/instructor`, sin pantalla implementada).
- Automatización completa de requisitos de rango (hoy son ítems administrados a mano: "2 Charlas de Marketing", "1 Rompecabeza Day", etc. — no son eventos que el sistema pueda detectar solo).
- Exportar reportes del panel admin.

---

## 2. Modelo de datos (Prisma) propuesto

Extraído de `frontend/src/data/*.js` (cursos, módulos, lecciones, quiz, examen, certificado, perfil, rango, instructor, admin, notificaciones). Este schema es **referencial**: ajustar nombres/tipos antes de correr la primera migración.

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  INSTRUCTOR
  STUDENT
}

enum CourseStatus {
  DRAFT
  REVIEW
  PUBLISHED
}

enum CourseVisibility {
  PUBLIC
  HIDDEN
}

enum EnrollmentRequirement {
  NONE
  RANK_SPECIALIST
}

enum LessonType {
  VIDEO
  DOCUMENT
  QUIZ
  TOOLS
}

enum QuizKind {
  LESSON_QUIZ
  FINAL_EXAM
}

enum EnrollmentStatus {
  IN_PROGRESS
  COMPLETED
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  nombre        String
  avatarUrl     String?
  role          Role      @default(STUDENT)
  areaId        String?
  area          Area?     @relation(fields: [areaId], references: [id])
  rankId        String?
  rank          Rank?     @relation(fields: [rankId], references: [id])
  careerIqNote  String?   // ej: "En progreso 75%" hacia el próximo rango
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  coursesTaught     Course[]           @relation("InstructorCourses")
  enrollments       Enrollment[]
  lessonProgress    LessonProgress[]
  quizAttempts      QuizAttempt[]
  certificates      Certificate[]
  notifications     Notification[]
  comments          Comment[]
}

model Area {
  id     String @id @default(uuid())
  slug   String @unique
  label  String
  users   User[]
  courses Course[]
}

model Course {
  id                    String                 @id @default(uuid())
  slug                  String                 @unique
  title                 String
  description           String
  about                 String[]
  learningOutcomes      String[]
  tools                 Json?                  // [{ emoji, name }]
  coverImageUrl         String?
  level                 String?                // "Fundamentos" | "Nivel Intermedio" | "Nivel Avanzado"
  durationLabel         String?
  videoHoursLabel       String?
  status                CourseStatus           @default(DRAFT)
  visibility            CourseVisibility       @default(PUBLIC)
  enrollmentRequirement EnrollmentRequirement  @default(NONE)
  autoCertificate       Boolean                @default(false)
  areaId                String?
  area                  Area?                  @relation(fields: [areaId], references: [id])
  instructorId          String
  instructor            User                   @relation("InstructorCourses", fields: [instructorId], references: [id])
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  publishedAt           DateTime?

  modules      Module[]
  enrollments  Enrollment[]
  certificates Certificate[]
  comments     Comment[]
  finalExam    Quiz?         @relation("CourseFinalExam")
}

model Module {
  id       String   @id @default(uuid())
  courseId String
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title    String
  order    Int

  lessons Lesson[]
}

model Lesson {
  id           String     @id @default(uuid())
  moduleId     String
  module       Module     @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title        String
  type         LessonType @default(VIDEO)
  order        Int
  videoKey     String?    // key/path en el storage (R2/local/Drive)
  documentUrl  String?
  durationSeconds Int?
  transcript   String[]

  quiz     Quiz?             @relation("LessonQuiz")
  progress LessonProgress[]
}

model Quiz {
  id            String    @id @default(uuid())
  kind          QuizKind
  title         String
  description   String?
  passThreshold Int       @default(80)

  lessonId String? @unique
  lesson   Lesson? @relation("LessonQuiz", fields: [lessonId], references: [id], onDelete: Cascade)

  courseId String? @unique
  course   Course? @relation("CourseFinalExam", fields: [courseId], references: [id], onDelete: Cascade)

  questions Question[]
  attempts  QuizAttempt[]
}

model Question {
  id     String   @id @default(uuid())
  quizId String
  quiz   Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  text   String
  order  Int

  options Option[]
}

model Option {
  id         String   @id @default(uuid())
  questionId String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  label      String
  isCorrect  Boolean  @default(false)
  order      Int
}

model QuizAttempt {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  quizId    String
  quiz      Quiz     @relation(fields: [quizId], references: [id])
  answers   Json     // { [questionId]: optionId }
  score     Int
  passed    Boolean
  createdAt DateTime @default(now())
}

model Enrollment {
  id              String            @id @default(uuid())
  userId          String
  user            User              @relation(fields: [userId], references: [id])
  courseId        String
  course          Course            @relation(fields: [courseId], references: [id])
  status          EnrollmentStatus  @default(IN_PROGRESS)
  progressPercent Int               @default(0)
  enrolledAt      DateTime          @default(now())
  completedAt     DateTime?

  @@unique([userId, courseId])
}

model LessonProgress {
  id                 String    @id @default(uuid())
  userId             String
  user               User      @relation(fields: [userId], references: [id])
  lessonId           String
  lesson             Lesson    @relation(fields: [lessonId], references: [id])
  completed          Boolean   @default(false)
  lastPositionSeconds Int      @default(0)
  completedAt        DateTime?

  @@unique([userId, lessonId])
}

model Certificate {
  id               String   @id @default(uuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  courseId         String
  course           Course   @relation(fields: [courseId], references: [id])
  pdfKey           String   // key/path en storage
  linkedinMessage  String
  issuedAt         DateTime @default(now())

  @@unique([userId, courseId])
}

model Rank {
  id       String  @id @default(uuid())
  key      String  @unique // "cadete", "tripulante", ...
  title    String
  category String  // EXPLORACION | EXPANSION | TRASCENDENCIA
  order    Int
  users    User[]
}

model Notification {
  id          String   @id @default(uuid())
  userId      String?  // null = broadcast a todos
  user        User?    @relation(fields: [userId], references: [id])
  title       String
  description String
  type        String   // "course" | "comment" | ...
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())
}

// Placeholder de Fase 2 (post-MVP), incluido solo para no romper el modelo después
model Comment {
  id        String   @id @default(uuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  body      String
  createdAt DateTime @default(now())
}
```

**Nota:** en los datos mock aparecen dos listados de "áreas" distintos: `courseCategories` (13 categorías del catálogo, ej. "Analytics & SEO", "Branding y Estrategia de Marca") en `courses-menu-data.js`, e `instructorAreas` (4 áreas de la organización: Experiencia Digital, Marketing, Tecnología, RRHH) en `instructor-data.js`. Conviene confirmar con el equipo si son el mismo concepto (`Area`) o si hay que separar "categoría de catálogo" de "departamento del usuario/curso" en dos modelos distintos antes de migrar.

---

## 3. Autenticación (Auth.js)

El login actual (`frontend/src/components/login/login-form.js`) es 100% mock: valida que el correo contenga `@rompecabeza.cl`, `@mind` o `@souldigital`, y guarda usuario/token en `localStorage` + cookie sin backend real.

Pasos:

1. Confirmar con el equipo los dominios institucionales reales permitidos (los strings `@mind` y `@souldigital` en el código lucen incompletos, probablemente `@mindagency.cl` u otro — validar antes de reproducir la regla en el backend).
2. Instalar Auth.js en `frontend/` (`next-auth@beta` para App Router).
3. Definir un **Credentials Provider** (o Magic Link por correo si se quiere evitar manejar contraseñas) que:
   - Valide el dominio institucional.
   - Cree o recupere el `User` en la base de datos (Prisma) en el primer login.
   - Asigne rol `STUDENT` por defecto; `INSTRUCTOR`/`ADMIN` se asignan manualmente (seed o panel admin).
4. Usar el **Prisma Adapter de Auth.js** para persistir sesiones en Supabase.
5. Middleware de Next.js (`middleware.ts`) para proteger:
   - `/instructor/**` → rol `INSTRUCTOR` o `ADMIN`.
   - `/admin/**` → rol `ADMIN`.
   - `/perfil`, `/cursos/**` (progreso/quiz/examen) → cualquier usuario autenticado.
6. Reemplazar el `localStorage`/cookie manual del `login-form.js` por `signIn()` de Auth.js.

---

## 4. Storage (videos, portadas, certificados)

El stack definitivo es **Cloudflare R2**, pero para probar rápido sin fricción se recomienda construir una **capa de abstracción de storage** desde el día uno, no acoplar el código a un proveedor:

```text
backend/src/integrations/storage/
├── storage-provider.ts     // interfaz: upload(), getSignedUrl(), delete()
├── local-storage.ts        // implementación para desarrollo
├── r2-storage.ts           // implementación real (S3-compatible SDK)
└── drive-storage.ts        // implementación opcional para pruebas
```

Recomendación de orden:

1. **Local filesystem** primero (guardar en una carpeta fuera del repo, ej. `backend/.storage/` con `.gitignore`, servido vía un Route Handler `frontend/src/app/api/media/[...path]/route.ts`). Es la opción de menor fricción para validar el flujo completo de subida/lectura sin credenciales externas.
2. **Cloudflare R2** en paralelo o inmediatamente después: R2 es compatible con el SDK de S3 (`@aws-sdk/client-s3`), así que la implementación es casi idéntica a un storage S3 estándar. Se generan URLs firmadas (`getSignedUrl`) para subir/reproducir sin exponer credenciales.
3. **Google Drive** es viable solo como prueba adicional, no como reemplazo serio de R2: requiere OAuth2 o una cuenta de servicio, tiene cuotas de API más restrictivas, y no está pensado para servir video en streaming (no hay range requests nativos como en R2/S3). Sugerido únicamente si se quiere validar "subir un archivo a un proveedor externo real" antes de tener la cuenta de Cloudflare lista.

Qué se sube a storage:
- Portada de curso (`instructor-course-editor-content.js`, input `accept="image/*"`, recomendado 1920x1080).
- Video de lección (no hay input de upload visible aún en el editor — falta agregarlo en el paso "Contenido y Módulos"; hoy el reproductor de lección solo muestra una imagen estática con botón "play", `course-lesson-player.js`).
- Certificado en PDF (`certificate.pdfUrl` en `course-exam-data.js` / `profile-data.js`).
- Avatar de usuario (`profile-data.js`, `avatar`).

Con la interfaz común, cambiar de local → R2 → Drive es solo cambiar qué implementación se inyecta, sin tocar los endpoints ni los componentes.

---

## 5. Endpoints (Route Handlers en `frontend/src/app/api`)

Organizados por dominio. La lógica real vive en `backend/src/services` y `backend/src/repositories`; cada ruta es una capa delgada.

**Auth**
- `POST /api/auth/[...nextauth]` (manejado por Auth.js)

**Catálogo / Home**
- `GET /api/courses` — filtros: categoría, nuevos, populares, búsqueda
- `GET /api/courses/[id]` — detalle completo (tabs, tools, instructor)
- `GET /api/home/recommended`
- `GET /api/home/continue-watching`
- `GET /api/search?q=`

**Curso / Lección**
- `GET /api/courses/[id]/modules`
- `GET /api/lessons/[id]`
- `POST /api/lessons/[id]/complete` — marca `LessonProgress`, recalcula `Enrollment.progressPercent`
- `PATCH /api/lessons/[id]/position` — guarda `lastPositionSeconds` (resume)

**Quiz / Examen**
- `GET /api/lessons/[id]/quiz`
- `POST /api/lessons/[id]/quiz/submit` — crea `QuizAttempt`, retorna score
- `GET /api/courses/[id]/exam`
- `POST /api/courses/[id]/exam/submit` — crea `QuizAttempt` (kind `FINAL_EXAM`), si aprueba y `autoCertificate` genera `Certificate`

**Certificado**
- `GET /api/certificates/[id]`
- `GET /api/certificates/[id]/pdf` — sirve el PDF desde storage

**Perfil**
- `GET /api/profile`
- `GET /api/profile/courses?status=in-progress|completed|certificates`
- `GET /api/profile/rank`

**Instructor**
- `GET /api/instructor/courses`
- `POST /api/instructor/courses` — crea borrador
- `PATCH /api/instructor/courses/[id]` — guarda info básica/reglas
- `POST /api/instructor/courses/[id]/publish`
- `POST /api/instructor/courses/[id]/cover` — upload portada (storage)
- `POST /api/instructor/courses/[id]/modules`
- `POST /api/instructor/courses/[id]/modules/[moduleId]/lessons`
- `POST /api/instructor/lessons/[id]/video` — upload video (storage)

**Admin**
- `GET /api/admin/users`
- `GET /api/admin/stats` (usuarios activos, cursos publicados, tasa de finalización)

**Notificaciones**
- `GET /api/notifications`
- `PATCH /api/notifications/[id]/read`

---

## 6. Lógica de negocio a implementar en `backend/src/services`

- `courses.ts`: listar/filtrar/crear/publicar cursos.
- `enrollments.ts`: inscribir usuario, recalcular progreso al completar lecciones.
- `lesson-progress.ts`: marcar avance, resume de video.
- `quiz.ts`: **reutilizar la lógica de `calculateExamScore` ya escrita en `frontend/src/data/course-exam-data.js`** (recorre preguntas, compara con opción marcada `correct: true`, calcula %) — moverla a `backend/src/services/quiz.ts` para que sea la fuente de verdad en servidor, no en el cliente.
- `certificates.ts`: generar PDF (ej. `@react-pdf/renderer` o `pdf-lib`), subirlo a storage, persistir registro, arma el `linkedinMessage` con la plantilla ya vista en `course-exam-data.js`.
- `rank.ts`: dado el progreso de certificaciones del usuario, calcular avance hacia el próximo rango (MVP: cálculo simple basado en cantidad de certificados + checklist manual administrado por admin, no motor de reglas completo).
- `admin-stats.ts`: agregaciones (`COUNT` de usuarios, cursos publicados, tasa de finalización = enrollments completados / total).

---

## 7. Seeds iniciales (`backend/prisma/seed.ts`)

Necesarios para que el frontend deje de depender de los mocks:

1. Áreas/categorías (las 13 de `courses-menu-data.js` + confirmar si se unifican con `instructorAreas`).
2. Rangos (los 7 de `profileData.careerRanks`, con su `category` y `order`).
3. Usuario admin inicial + usuario instructor inicial (ej. "Ariel Jeria").
4. 1-2 cursos completos de ejemplo (ideal: migrar el curso "Growth Hacking Avanzado" con sus 3 lecciones, quiz y examen, ya que es el más desarrollado en los mocks) para probar el flujo end-to-end real.

---

## 8. Conectar el frontend a datos reales

Reemplazar, uno por uno, los imports de `frontend/src/data/*.js` por llamadas `fetch`/Server Components a los endpoints reales. Orden sugerido (de menor a mayor riesgo):

1. `courses-menu-data.js` → categorías reales.
2. `courses-data.js` / `course-detail-data.js` → catálogo y detalle.
3. `home-data.js` → home (recomendados, nuevos, continuar viendo).
4. `course-lesson-data.js` → lección + progreso real.
5. `course-quiz-data.js` / `course-assessment-questions.js` → quiz real con corrección server-side.
6. `course-exam-data.js` → examen + generación de certificado real.
7. `profile-data.js` → perfil + rango real.
8. `instructor-data.js` → CRUD real de cursos.
9. `admin-data.js` → usuarios y stats reales.
10. `notifications-data.js`, `search-data.js` → por último, son las de menor complejidad.

---

## 9. Variables de entorno necesarias

```env
# Base de datos
DATABASE_URL="postgresql://...supabase..."
DIRECT_URL="postgresql://...supabase (conexión directa para migraciones)..."

# Auth.js
AUTH_SECRET=
AUTH_URL=

# Storage (según proveedor activo)
STORAGE_PROVIDER=local # local | r2 | drive
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
DRIVE_CLIENT_EMAIL=
DRIVE_PRIVATE_KEY=
DRIVE_FOLDER_ID=
```

---

## 10. Orden de ejecución recomendado (checklist)

1. [ ] Retirar/archivar el Express legacy de `backend/`.
2. [ ] Crear proyecto en Supabase, obtener `DATABASE_URL`/`DIRECT_URL`.
3. [ ] Configurar `pnpm-workspace.yaml` + `backend/package.json` como paquete interno.
4. [ ] Escribir `schema.prisma` real (sección 2) y correr primera migración.
5. [ ] Seeds de áreas/categorías, rangos y usuarios base (sección 7).
6. [ ] Integrar Auth.js con Credentials Provider + Prisma Adapter (sección 3).
7. [ ] Construir la capa de storage abstracta, partir con local (sección 4).
8. [ ] Migrar el curso "Growth Hacking Avanzado" completo como dato real (curso + módulos + lecciones + quiz + examen).
9. [ ] Implementar endpoints de catálogo/detalle/lección (sección 5).
10. [ ] Implementar quiz/examen/certificado con lógica server-side (sección 6).
11. [ ] Implementar endpoints de instructor (crear/editar/publicar curso, subir portada y video).
12. [ ] Implementar endpoints de admin (usuarios, stats).
13. [ ] Conectar el frontend reemplazando mocks (sección 8), en el orden sugerido.
14. [ ] Probar el flujo completo: login → catálogo → curso → lección → quiz → examen → certificado → perfil.
15. [ ] Migrar storage de local a Cloudflare R2 en un ambiente de staging.
16. [ ] Actualizar `README.md` raíz para reflejar el stack real (ya no Express/React puro).
17. [ ] Deploy en Vercel + variables de entorno de producción.

---

## Resumen corto

Es posible y el camino es claro: limpiar el Express legacy, modelar los datos reales que el frontend ya espera (cursos, módulos, lecciones, quiz, examen, certificado, rango, notificaciones), integrar Auth.js con validación de dominio institucional, construir una capa de storage intercambiable (local → R2, con Drive como opción de prueba), exponer los endpoints vía Route Handlers de Next.js consumiendo servicios en `backend/`, y migrar el frontend mock a datos reales curso por curso, empezando por "Growth Hacking Avanzado" como caso piloto end-to-end.
