# RevoLab — Checklist de construcción del Backend (MVP 1)

> **Actualizado 2026-08-19.** Etapas 0–7 completas y en `develop`. Este archivo
> ahora es el registro de estado real del proyecto, no solo el plan original.
> Complementa a `revolab-roadmap-backend.md` (detalle técnico: schema Prisma,
> endpoints) y `revolab-estructura-decisiones.md` (por qué se eligió cada
> pieza del stack).

Notación:
- `[x]` hecho / `[ ]` pendiente
- 🔒 **Bloqueante**: nada de la etapa siguiente podía avanzar hasta terminar esto.
- 🔀 **Paralelizable**: tracks que no dependían entre sí.

---

## Etapa 0 — Fundaciones 🔒 ✅ completa

- [x] Retirar/archivar el Express legacy de `backend/`.
- [x] Crear proyecto en Supabase y obtener `DATABASE_URL` (pooler) + `DIRECT_URL`.
- [x] Configurar `pnpm-workspace.yaml` en la raíz (`frontend` + `backend`).
- [x] Reescribir `backend/package.json` como paquete interno (`@revolab/backend`).
- [x] Agregar `@revolab/backend` como dependencia `workspace:*` en `frontend/package.json`.
- [x] Crear `.env` en `backend/` con `DATABASE_URL`/`DIRECT_URL`.

**Nota de despliegue real que costó descubrir:** en Vercel, el **Root
Directory** del proyecto debe ser `frontend` (con "Include files outside of
the Root Directory" activado), no la raíz del repo — si no, Next.js no
detecta la dependencia `next` y el build falla con "No Next.js version
detected".

---

## Etapa 1 — Modelo de datos 🔒 ✅ completa

- [x] Escribir `backend/prisma/schema.prisma` completo (`User`, `Course`,
      `Module`, `Lesson`, `Quiz`, `Question`, `Option`, `QuizAttempt`,
      `Enrollment`, `LessonProgress`, `Certificate`, `Rank`, `Notification`,
      `Comment`, más `isActive` en `User` agregado en la Etapa 7).
- [x] `courseCategories` (catálogo) e `instructorAreas` (departamentos) se
      separaron en dos modelos reales: `Category` y `Department` — son
      conceptos distintos en el frontend, no el mismo dato.
- [x] Primera migración corrida contra Supabase.
- [x] `backend/prisma/seed.js`: categorías, departamentos, los 7 rangos,
      usuario admin + instructor inicial (con `passwordHash` real, bcrypt).
- [x] Curso piloto "Growth Hacking Avanzado" migrado completo (módulo, 3
      lecciones, quiz de lección, examen final) como caso end-to-end real.

---

## Etapa 2 — Tres tracks en paralelo 🔀 ✅ completa

### Track A — Autenticación (Auth.js) ✅
- [x] Dominio institucional habilitado: solo `@rompecabeza.cl` por ahora
      (los otros dominios del mock — `@mind`, `@souldigital` — nunca se
      confirmaron completos; agregar cuando se sepan los reales).
- [x] `next-auth@beta` (Auth.js v5) instalado, Credentials Provider con
      contraseña (bcrypt), sesión JWT.
- [x] Middleware protegiendo `/admin/**`, `/instructor/**`, `/perfil/**`,
      `/home/**` y progreso de curso, por rol.
- [x] `login-form.js` usa `signIn()` real.
- [x] **Fix no trivial:** el middleware corre en Edge runtime, donde Prisma
      no funciona. La config de Auth.js se separó en `auth.config.js`
      (liviana, la usa el middleware) y `auth.js` (completa con Prisma, la
      usa la ruta de login). Sin esto el login se quedaba colgado.

### Track B — Storage abstraído ✅ (local activo, R2 codificado sin activar)
- [x] Interfaz `storage-provider.ts` (`upload`, `getSignedUrl`, `delete`).
- [x] `local-storage.js` funcionando (filesystem en `backend/.storage/`).
- [x] Route Handler `/api/media/[...path]` sirviendo archivos locales.
- [x] `r2-storage.js` implementado con el SDK de S3, listo para activar con
      `STORAGE_PROVIDER=r2` **cuando exista la cuenta de Cloudflare R2** —
      eso todavía no se creó (ver Etapa 8).
- [ ] `drive-storage.ts` — opcional, no se hizo (no era necesario).

### Track C — Endpoints públicos de catálogo ✅
- [x] `GET /api/courses` (filtros: categoría, nuevos, populares, búsqueda).
- [x] `GET /api/courses/[id]`, `GET /api/courses/[id]/modules`.
- [x] `GET /api/search`, `GET /api/home/recommended`.
- [x] `GET /api/categories`, `GET /api/departments` (no estaban en el plan
      original, se agregaron en la Etapa 5 al conectar el frontend real).

---

## Etapa 3 — Progreso, quiz, examen y certificado 🔒 ✅ completa

- [x] `GET /api/lessons/[id]`, `POST /api/lessons/[id]/complete` (recalcula
      `Enrollment.progressPercent` real), `PATCH /api/lessons/[id]/position`.
- [x] `calculateExamScore` movido a `backend/src/services/quiz.js` — el
      cliente ya no recibe qué opción es correcta antes de responder.
- [x] `GET/POST /api/lessons/[id]/quiz(/submit)`,
      `GET/POST /api/courses/[id]/exam(/submit)`.
- [x] `certificates.js`: genera el PDF con `pdf-lib`, lo sube al storage,
      arma el `linkedinMessage`. Certificado automático al aprobar el examen
      si `autoCertificate` está activo.
- [x] `GET /api/certificates/[id]` + `GET /api/certificates/[id]/pdf`.

**Probado end-to-end real:** login → completar las 3 lecciones → quiz →
examen (100%) → certificado PDF descargable, con el usuario instructor de
seed.

---

## Etapa 4 — Paneles de gestión 🔀 ✅ completa (alcance ampliado en Etapa 7)

### Track F — Panel Instructor ✅
- [x] CRUD completo de cursos propios: crear borrador (slug único
      autogenerado), editar info básica, publicar, subir portada, agregar
      módulos/lecciones, subir video de lección.

### Track G — Panel Admin ✅ (el plan original solo pedía lectura)
- [x] `GET /api/admin/users`, `GET /api/admin/stats`.

### Complementario ✅
- [x] `GET /api/profile`, `/api/profile/courses`, `/api/profile/rank`.
- [x] `GET /api/notifications`, `PATCH /api/notifications/[id]/read`.

---

## Etapa 5 — Conectar el frontend a datos reales 🔒 ✅ completa

Los 10 mocks de `frontend/src/data/*.js` fueron reemplazados por los
endpoints reales (quedan sin usar, no se borraron los archivos por si sirven
de referencia — pendiente decidir si limpiarlos, ver Etapa 8):

- [x] `courses-menu-data.js` → categorías reales.
- [x] `courses-data.js` / `course-detail-data.js` → catálogo y detalle.
- [x] `home-data.js` → home (recomendados, nuevos, "continúa donde lo dejaste").
- [x] `course-lesson-data.js` → lección + progreso real.
- [x] `course-quiz-data.js` / `course-assessment-questions.js` → quiz real
      (cambio de UX: ya no hay feedback instantáneo por pregunta, se
      envían todas las respuestas al final — necesario para no filtrar
      las respuestas correctas al cliente).
- [x] `course-exam-data.js` → examen + certificado real.
- [x] `profile-data.js` → perfil + rango real.
- [x] `instructor-data.js` → CRUD real de cursos.
- [x] `admin-data.js` → usuarios y stats reales.
- [x] `notifications-data.js`, `search-data.js` → reales.
- [x] `intro-data.js` (landing pública `/`) → los cursos destacados también
      se conectaron a datos reales en la Etapa 7 (quedaba inconsistente
      mostrar cursos falsos en el único punto de entrada público).

---

## Etapa 6 — Salida a producción 🔒 ⚠️ parcial

- [x] Probar el flujo completo en local: login → catálogo → curso →
      lección → quiz → examen → certificado → perfil.
- [ ] Migrar storage de local a Cloudflare R2 en staging — **pendiente**,
      falta crear la cuenta/bucket de Cloudflare.
- [ ] Actualizar `README.md` raíz — **pendiente**, sigue describiendo el
      stack viejo (Express + "React a definir") desde antes de la Etapa 0.
- [x] Deploy en Vercel funcionando (`revolab-dev.vercel.app`, ambiente
      Production apuntando a `main`) con `DATABASE_URL`/`AUTH_SECRET`
      configurados.

---

## Etapa 7 — Roles y permisos (no estaba en el plan original) ✅ completa

Etapa agregada después de una revisión de producto: el plan original de
Admin/Perfil (Etapa 4) solo contemplaba **lectura**, y al usarlo se sintió
demasiado limitado. Alcance definido con el equipo:

- [x] Perfil editable para **todos los roles**: nombre, foto (subida real),
      cambio de contraseña (verifica la actual).
- [x] Admin con **control total** sobre cursos de cualquier instructor, no
      solo los propios: editar, publicar/despublicar, eliminar (el borrado
      falla con mensaje claro si el curso tiene inscripciones/certificados,
      en vez de romper integridad referencial).
- [x] Admin con gestión completa de usuarios: crear (con contraseña
      temporal mostrada una sola vez), cambiar rol, cambiar departamento,
      **desactivar** (no borrado permanente — ver decisión pendiente abajo).
- [x] Login rechaza usuarios desactivados (`User.isActive`).
- [x] Landing pública (`/`) conectada a cursos reales.

**Decisión sin cerrar:** se pidió "crear/editar/desactivar/eliminar
usuarios". Se implementó desactivar (soft-delete vía `isActive`) pero NO
borrado permanente, por la misma razón que el borrado de cursos: un usuario
con historial de inscripciones/certificados no se puede borrar sin romper
integridad referencial o destruir certificados reales ya emitidos. Falta
confirmar si esto es suficiente o si se necesita borrado real bajo algún
escenario (ej. usuario sin ningún historial).

---

## Etapa 8 — Producción real y deuda técnica (en curso)

No estaba en el plan original; es lo que quedó abierto después de la
Etapa 7. Decisiones tomadas el 2026-08-20 con Alexis, y avance real:

- [x] Estilos: modal de crear usuario, formulario de cambio de contraseña,
      tabla de moderación de cursos y botón "marcar lección completada"
      ya tienen CSS (rama `feature/etapa8-css-roles`).
- [x] **Bug encontrado y corregido:** el nav (desktop y mobile) nunca tuvo
      wiring a la sesión — no existía ningún link a `/admin` (había que
      escribir la URL a mano), "Cerrar sesión" era un enlace muerto que no
      llamaba a `signOut()`, y el nombre mostrado era un placeholder fijo.
      Corregido conectando `useSession()` en `header-profile-menu.js` y
      `header-mobile-menu.js`.
- [x] Dominios institucionales: confirmados y agregados `@somosmind.com` y
      `@souldigital.cl` a `ALLOWED_EMAIL_DOMAINS` (antes solo
      `@rompecabeza.cl`). Se eliminó también una lista duplicada de
      dominios en `login-form.js` que no estaba sincronizada con el backend.
      **Pendiente (feature más grande, no iniciada):** hacerlo administrable
      desde el panel admin (tabla nueva + UI CRUD) en vez de hardcodeado.
- [x] **Decisión de diseño tomada — borrado de usuarios ("papelera"):** el
      email institucional se reasigna entre personas distintas con el
      tiempo (alguien deja la agencia, el correo se reutiliza para otra
      persona). El historial de cursos/certificados/inscripciones **no
      puede depender de que la cuenta de usuario siga existiendo**, así
      que al mandar una cuenta a la papelera se libera el email real
      (se renombra internamente, guardando el original para auditoría)
      para que pueda reasignarse de inmediato a una cuenta nueva — el
      historial viejo queda intacto, enganchado a la fila de usuario vieja,
      nunca se mezcla con la cuenta nueva. Si la persona vuelve a la
      agencia, empieza con cuenta nueva de cero (no se resucita la vieja).
      Borrado permanente solo se implementará si el usuario no tiene
      historial. **Implementación pendiente:** migración de schema +
      endpoint de enviar a papelera + vista de papelera en admin.
- [x] **Decisión final de storage: Cloudflare R2 en capa gratuita.** Se
      evaluó Google Drive como alternativa y se descartó — una cuenta de
      servicio no tiene cuota de almacenamiento propia sin Google Workspace
      pagado, los links de Drive no soportan bien range-requests (necesario
      para adelantar/retroceder video) y se limitan por cuota de descargas,
      y no hay URLs firmadas con expiración al estilo S3. R2 gratis da 10GB
      + sin cobro de egress, y el código ya está listo.
- [x] **Bug encontrado y corregido antes de activar R2:** `uploadCourseCover`
      y `updateProfileAvatar` guardaban en la BD el resultado de
      `getSignedUrl()` (URL con firma que expira en 1h) en vez de una URL
      estable — con storage local no se notaba porque su versión de
      `getSignedUrl` nunca expira, pero con R2 activo las portadas de curso
      y avatares se hubieran roto una hora después de subirse. También
      `lessons.js` armaba la URL de video con un path hardcodeado a
      `/api/media/`, que solo existe para storage local — con R2 hubiera
      dado 404 siempre. Se agregó `getPublicUrl(key)` al contrato de
      storage-provider (rama `feature/etapa8-css-roles`).
- [x] **Cuenta y bucket creados por Alexis** (2026-08-20): bucket
      `revolab-media`, acceso público habilitado, API token generado.
      Probado en local con credenciales reales: subida de avatar contra
      el bucket funcionando de punta a punta.
- [x] **Fix adicional necesario para que funcionara:** `next/image` exige
      whitelist explícita de dominios remotos — se agregó `remotePatterns`
      para `*.r2.dev` en `frontend/next.config.mjs` (si no, tira
      "Invalid src prop ... hostname not configured").
- [x] **R2 activo y confirmado en producción** (2026-08-20): Alexis seteó
      las 6 env vars en Vercel (Production) y mergeó `feature/etapa8-css-roles`
      a `main`. Probado con una subida de foto de perfil real en
      `revolab-dev.vercel.app` — persiste después de recargar la página,
      o sea quedó guardada en la BD con una URL pública de R2 funcional.
      **Etapa 8 storage: cerrada.**
- [ ] Actualizar `README.md` raíz para reflejar el stack real.
- [ ] Limpieza: borrar `frontend/src/data/*.js` que ya no se usan (todos
      salvo, potencialmente, contenido editorial fijo si queda alguno).
- [ ] Actualizar Prisma 5.22 → 7.x (hay un salto de versión mayor
      disponible, no se hizo por no estar en el alcance pedido).
- [ ] Migrar `middleware.js` a la convención `proxy.js` que pide Next.js 16
      (hoy solo un warning en build, no error).
- [x] **Repo: queda público por ahora** (decisión confirmada 2026-08-20).

**Fuera de alcance MVP, documentado desde el inicio, no urgente:**
comentarios reales en curso, "Constructor de Rutas de Aprendizaje",
transcripciones generadas por IA, automatización de requisitos de rango,
exportar reportes del panel admin.

---

## Vista rápida de paralelización (histórica, ya ejecutada)

```text
Etapa 0 (fundaciones) ──▶ Etapa 1 (modelo de datos)
                                  │
                  ┌───────────────┼────────────────┐
                  ▼               ▼                ▼
            Track A (Auth)   Track B (Storage)  Track C (Catálogo público)
                  │               │                │
                  └───────┬───────┴────────┬────────┘
                          ▼                ▼
                  Track D (Progreso)  Track E (Quiz/Examen/Certificado)
                          │                │
                          └───────┬────────┘
                                  ▼
                  ┌───────────────┴────────────────┐
                  ▼                                ▼
          Track F (Panel Instructor)       Track G (Panel Admin)
                  │                                │
                  └───────────────┬────────────────┘
                                  ▼
                    Etapa 5 (conectar frontend, incremental)
                                  │
                                  ▼
                         Etapa 6 (producción)
                                  │
                                  ▼
                    Etapa 7 (roles y permisos, ampliación)
                                  │
                                  ▼
                    Etapa 8 (produccion real + deuda tecnica)
```
