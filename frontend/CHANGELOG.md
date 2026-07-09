# [0.24.4] - 2026-07-09

### Changed - Home
- **Archivos modificados**: `src/components/home/home-hero.js`, `src/components/home/home-hero.module.css`, `src/data/home-data.js`
- Los botones "Realizar curso" del hero enlazan al detalle del curso correspondiente en cada banner

# [0.24.3] - 2026-07-09

### Changed - Refactor
- **Archivos modificados**: `src/data/course-assessment-questions.js`, `src/data/course-exam-data.js`, `src/data/course-quiz-data.js`, `src/components/courses/course-exam-page.js`, `src/components/courses/course-quiz-page.js`, `src/components/courses/course-assessment-page.module.css`, `src/components/courses/course-detail-content.js`, `src/components/courses/course-lesson-page.js`
- **Archivos eliminados**: `src/components/courses/course-lesson-quiz-cta.js`, `src/components/courses/course-exam-page.module.css`, `src/components/courses/course-quiz-page.module.css`
- Se centralizan las preguntas compartidas de examen y quiz, el layout de páginas de evaluación y la ruta del quiz para reducir duplicación sin cambiar la UI

# [0.24.2] - 2026-07-09

### Changed - Home
- **Archivos modificados**: `src/components/home/course-card.js`, `src/components/home/course-card.module.css`, `src/data/home-data.js`
- Las cards de recomendados y nuevos cursos enlazan al detalle del curso correspondiente en el catálogo
- Los datos del home reutilizan IDs reales del catálogo para evitar rutas inválidas

# [0.24.1] - 2026-07-09

### Changed - Estilos
- **Archivos modificados**: `src/styles/tokens.css`, `src/components/courses/course-quiz.module.css`, `src/components/courses/course-exam.module.css`, `src/components/courses/course-detail-panel.module.css`, `src/components/courses/course-lesson-nav.module.css`, `src/components/courses/course-lesson-sidebar.module.css`, `src/components/courses/course-exam-nav.module.css`, `src/components/courses/course-certificate-page.module.css`, `src/components/courses/course-certificate-linkedin-modal.module.css`, `src/components/login/login-form.module.css`, `src/components/intro/intro-nav.module.css`, `src/components/intro/intro-featured-courses.module.css`, `src/components/instructor/instructor-page.module.css`, `src/components/instructor/instructor-course-editor.module.css`, `src/components/admin/admin-page.module.css`, `src/components/profile/profile-certificate-card.module.css`
- Los hovers de botones usan el estado inverso (fondo/texto/borde) en toda la app, excepto carruseles y hero que se mantienen igual

# [0.24.0] - 2026-07-09

### Changed - Cursos
- **Archivos modificados**: `src/data/course-quiz-data.js`, `src/components/courses/course-detail-content.js`
- Todos los cursos del catálogo incluyen quiz de lección con preguntas por defecto y CTA hacia el módulo de quiz
- Growth Hacking mantiene preguntas específicas del curso

# [0.23.5] - 2026-07-09

### Fixed - Cursos
- **Archivos modificados**: `src/components/courses/course-detail-content.js`
- La pestaña Quiz del detalle del curso muestra el CTA de quiz y enlaza al módulo de quiz en lugar del examen final

# [0.23.4] - 2026-07-09

### Changed - Scripts
- **Archivos modificados**: `package.json`, `scripts/process-logo.mjs`
- `prebuild` ejecuta `optimize:assets` automáticamente antes de `pnpm run build`
- El procesado del logo se omite de forma segura si no existe el PNG fuente

# [0.23.3] - 2026-07-09

### Added - Scripts
- **Archivos modificados**: `scripts/optimize-images.mjs`, `package.json`
- Se añade script de optimización de imágenes raster en `public/images` con Sharp (redimensionado por tipo y recompresión WebP/PNG/JPEG)
- Nuevos comandos: `optimize:images`, `optimize:images:dry` y `optimize:assets` (logo + imágenes)

### Changed - Assets
- **Archivos modificados**: `public/images/home/*.webp`, `public/images/profile/*.webp`
- Se optimizan las imágenes raster existentes con el nuevo script, reduciendo ~2.18 MB de peso total

# [0.23.2] - 2026-07-09

### Changed - Admin / Instructor
- **Archivos modificados**: `src/app/(site)/admin/page.jsx`, `src/app/(site)/instructor/page.jsx`, `src/app/(site)/instructor/cursos/nuevo/page.jsx`, `src/app/(site)/instructor/cursos/[id]/editar/page.jsx`, `src/components/admin/admin-page-content.js`, `src/components/admin/admin-page.module.css`, `src/components/instructor/instructor-page-content.js`, `src/components/instructor/instructor-page.module.css`, `src/components/instructor/instructor-course-editor-content.js`, `src/data/instructor-data.js`
- **Archivos eliminados**: `src/components/admin/admin-page.js`, `src/components/instructor/instructor-page.js`, `src/components/instructor/instructor-course-editor-page.js`
- Se eliminan wrappers redundantes y se importan los componentes de contenido directamente desde las rutas
- Se unifica la tarjeta de curso del instructor en un solo componente responsive y se retira CSS/JS duplicado
- Se corrigen clases CSS inexistentes y datos redundantes (`hasCover`, `statCard_*`) en admin e instructor

# [0.23.1] - 2026-07-09

### Fixed - Instructor
- **Archivos modificados**: `src/components/instructor/instructor-course-editor-content.js`, `src/data/instructor-data.js`
- El sidebar navega correctamente a "Contenido del Curso" (con módulos iniciales y estado de dos pantallas al agregar otro) y a "Reglas y Publicación" como pasos independientes con su propio título de vista

# [0.23.0] - 2026-07-09

### Added - Instructor
- **Archivos modificados**: `src/app/(site)/instructor/page.jsx`, `src/app/(site)/instructor/cursos/nuevo/page.jsx`, `src/app/(site)/instructor/cursos/[id]/editar/page.jsx`, `src/components/instructor/instructor-page.js`, `src/components/instructor/instructor-page-content.js`, `src/components/instructor/instructor-page.module.css`, `src/components/instructor/instructor-course-editor-page.js`, `src/components/instructor/instructor-course-editor-content.js`, `src/components/instructor/instructor-course-editor.module.css`, `src/data/instructor-data.js`, `public/icons/instructor-*.svg`
- Se implementa el panel de instructor según Figma con listado de cursos, tarjeta de rutas de aprendizaje y acceso a crear o editar cursos
- Se añade el flujo de carga de cursos con sidebar de pasos (Información Básica, Contenido y Módulos, Reglas y Publicación), formularios, módulos con lecciones y desplegable de requisitos de inscripción

# [0.22.9] - 2026-07-09

### Fixed - Introducción
- **Archivos modificados**: `src/components/intro/intro-hero.module.css`
- Se añade espacio inferior al hero entre el botón "Explorar Cursos" y la sección de beneficios, alineándolo con el diseño de referencia

# [0.22.8] - 2026-07-08

### Fixed - Header
- **Archivos modificados**: `src/components/header.module.css`
- Los desplegables del header vuelven a mostrarse sobre el contenido al quitar el recorte por `overflow: hidden` y elevar el `z-index` del contenedor sticky

# [0.22.7] - 2026-07-08

### Changed - Examen
- **Archivos modificados**: `src/components/courses/course-module-cta.js`, `src/components/courses/course-module-cta.module.css`, `src/components/courses/course-lesson-quiz-cta.js`, `src/components/courses/course-detail-content.js`, `src/components/courses/course-detail-panel.js`, `src/components/courses/course-detail-panel.module.css`, `src/components/courses/course-exam-panel.js`, `src/data/course-exam-data.js`
- Se unifica el CTA de acceso al examen y al quiz en `course-module-cta`, eliminando componentes y CSS duplicados del módulo
- Se simplifican los datos mock del examen y se retira la lógica de certificado bloqueado que ya no aplicaba

### Changed - Quiz
- **Archivos modificados**: `src/components/courses/course-lesson-quiz-cta.js`
- El CTA de quiz en lección reutiliza el componente compartido `course-module-cta`

# [0.22.6] - 2026-07-08

### Fixed - Header
- **Archivos modificados**: `src/components/header.module.css`
- Se aumenta la altura del header compacto al hacer scroll (60px desktop / 48px mobile) para que el avatar y el logo no se corten

# [0.22.5] - 2026-07-08

### Fixed - Header
- **Archivos modificados**: `src/components/header.js`, `src/components/header.module.css`
- Se restaura la reducción de altura del header al hacer scroll con transición suave, manteniendo histéresis y altura animada en el contenedor para evitar parpadeo

# [0.22.4] - 2026-07-08

### Fixed - Header
- **Archivos modificados**: `src/components/header.js`, `src/components/header.module.css`
- Se elimina el parpadeo del header sticky fijando su altura al hacer scroll y aplicando histéresis en el listener para evitar cambios rápidos cerca del umbral

# [0.22.3] - 2026-07-08

### Fixed - Examen
- **Archivos modificados**: `src/data/course-exam-data.js`
- El examen final queda disponible para todos los cursos del catálogo (incluido `marketing-digital`), usando preguntas mock genéricas y conservando las preguntas específicas de Growth Hacking

# [0.22.2] - 2026-07-08

### Fixed - Detalle de curso
- **Archivos modificados**: `src/components/courses/course-detail-panel.js`, `src/components/courses/course-detail-panel.module.css`
- El botón "Realizar examen" queda visible debajo de "Comenzar curso" en el panel del detalle, en lugar de ocultarse dentro del bloque de certificado

### Fixed - Examen
- **Archivos modificados**: `src/components/courses/course-exam-page.js`, `src/components/courses/course-exam-page.module.css`
- Se corrige el contenedor de la página de examen para que el fondo y la tarjeta central se rendericen correctamente

# [0.22.1] - 2026-07-08

### Changed - Detalle de curso
- **Archivos modificados**: `src/components/courses/course-detail-panel.js`, `src/components/courses/course-detail-panel.module.css`, `src/components/courses/course-detail-content.js`, `src/components/courses/course-detail-exam-cta.js`, `src/components/courses/course-detail-exam-cta.module.css`
- El bloque de certificado y la pestaña Quiz muestran el botón "Realizar examen" cuando el curso tiene examen final disponible, enlazando a `/cursos/{id}/examen`

# [0.22.0] - 2026-07-08

### Added - Examen
- **Archivos modificados**: `src/app/(site)/cursos/[id]/examen/page.jsx`, `src/app/(site)/cursos/[id]/examen/certificado/page.jsx`, `src/components/courses/course-exam-page.js`, `src/components/courses/course-exam-page.module.css`, `src/components/courses/course-exam-panel.js`, `src/components/courses/course-exam-question.js`, `src/components/courses/course-exam-nav.js`, `src/components/courses/course-exam-nav.module.css`, `src/components/courses/course-exam.module.css`, `src/components/courses/course-certificate-page.js`, `src/components/courses/course-certificate-page.module.css`, `src/components/courses/course-certificate-linkedin-modal.js`, `src/components/courses/course-certificate-linkedin-modal.module.css`, `src/data/course-exam-data.js`, `public/icons/exam-failure.svg`, `public/icons/download-white.svg`, `public/icons/linkedin.svg`
- Flujo completo del examen final con pantallas de inicio, preguntas, éxito y rechazo según Figma, incluyendo cálculo de puntuación con umbral del 80%
- Página de certificado con vista previa, descarga PDF, bloque Career IQ y modal para compartir en LinkedIn

### Changed - Lección
- **Archivos modificados**: `src/components/courses/course-lesson-sidebar.js`, `src/components/courses/course-lesson-sidebar.module.css`, `src/data/course-lesson-data.js`
- El examen final desbloqueado en el sidebar enlaza a `/cursos/{id}/examen` en lugar de mostrar solo el candado

# [0.21.1] - 2026-07-08

### Changed - Quiz
- **Archivos modificados**: `src/components/courses/course-quiz-page.js`, `src/components/courses/course-quiz-page.module.css`, `src/components/courses/course-quiz-panel.js`, `src/components/courses/course-quiz.module.css`, `src/components/courses/course-quiz-question.js`, `src/components/courses/course-lesson-quiz-cta.js`, `src/components/courses/course-lesson-quiz-cta.module.css`, `src/components/courses/course-lesson-page.js`, `src/data/course-quiz-data.js`
- Se unifican estilos del quiz en un único módulo CSS compartido y se consolidan intro y resultados en `course-quiz-panel`
- El CTA de lección reutiliza textos y estilos del quiz desde `getLessonQuiz`

### Fixed - Quiz
- **Archivos modificados**: `src/components/courses/course-quiz-intro.js`, `src/components/courses/course-quiz-intro.module.css`, `src/components/courses/course-quiz-result.js`, `src/components/courses/course-quiz-result.module.css`, `src/components/courses/course-quiz-question.module.css`, `public/icons/arrow-right-white-bold.svg`
- Se eliminan componentes, CSS duplicados y el icono `arrow-right-white-bold.svg` que ya no se referenciaban

# [0.21.0] - 2026-07-08

### Added - Lección
- **Archivos modificados**: `src/components/courses/course-lesson-page.js`, `src/components/courses/course-lesson-quiz-cta.js`, `src/components/courses/course-lesson-quiz-cta.module.css`, `src/data/course-quiz-data.js`
- Se añade un bloque de acceso al quiz al final del contenido de la lección con enlace directo a "Comenzar Quiz"
- El CTA solo se muestra en cursos que tienen quiz disponible

# [0.20.0] - 2026-07-08

### Added - Quiz
- **Archivos modificados**: `src/app/(site)/cursos/[id]/leccion/[lessonId]/quiz/page.jsx`, `src/components/courses/course-quiz-page.js`, `src/components/courses/course-quiz-page.module.css`, `src/components/courses/course-quiz-intro.js`, `src/components/courses/course-quiz-intro.module.css`, `src/components/courses/course-quiz-question.js`, `src/components/courses/course-quiz-question.module.css`, `src/components/courses/course-quiz-result.js`, `src/components/courses/course-quiz-result.module.css`, `src/data/course-quiz-data.js`, `public/icons/quiz-brain.svg`, `public/icons/quiz-success.svg`, `public/icons/quiz-failure.svg`, `public/icons/arrow-right-white-bold.svg`
- Se implementa el flujo completo del quiz de lección con pantallas de inicio, preguntas, éxito y rechazo según el diseño de Figma
- Se añaden datos mock de tres preguntas para el curso Growth Hacking y la navegación inferior reutiliza el componente de lección

# [0.19.1] - 2026-07-08

### Changed - Limpieza
- **Archivos modificados**: `src/components/intro/intro-nav.js`, `src/components/site-logo.js`, `src/components/site-logo.module.css`, `src/components/footer.module.css`, `src/components/profile/profile-content.js`, `src/components/profile/profile-content.module.css`, `src/components/home/course-carousel.js`, `scripts/process-logo.mjs`
- Se reutiliza `SiteLogo` en el nav de introducción para evitar duplicar el markup del logo
- Se unifican estilos de grid en el perfil y se elimina CSS de placeholder sin uso
- El script de procesamiento de logo genera un único `revolab-logo.webp`

### Fixed - Limpieza
- **Archivos modificados**: `public/images/revolab-logo-desktop.webp`, `public/images/revolab-logo-mobile.webp`, `public/icons/profile-courses.svg`
- Se eliminan logos antiguos y el icono `profile-courses.svg`, que ya no se referenciaban en el código

# [0.19.0] - 2026-07-08

### Changed - Logo
- **Archivos modificados**: `src/components/site-logo.js`, `src/components/site-logo.module.css`, `src/components/login/login-logo.js`, `src/components/login/login-logo.module.css`, `src/components/intro/intro-nav.js`, `src/components/intro/intro-nav.module.css`, `public/images/revolab-logo.webp`
- Se reemplaza el logo del header, footer, login y nav de introducción por el nuevo logo con fondo transparente
- Se corrige el tamaño del logo en el nav de la introducción, que se mostraba demasiado grande, dimensionándolo por altura para respetar su proporción

### Fixed - Introducción
- **Archivos modificados**: `src/components/intro/intro-page.module.css`
- El nav de la página de introducción vuelve a quedar fijo (sticky) al hacer scroll; se corrige el `overflow` del contenedor que anulaba la fijación

# [0.18.1] - 2026-07-08

### Changed - Introducción
- **Archivos modificados**: `src/components/intro/intro-page.js`, `public/icons/intro-ai.svg`, `public/icons/intro-career.svg`, `public/icons/intro-certifications.svg`
- La página de introducción reutiliza el footer global del sitio en lugar de un footer propio
- Los iconos de la sección de beneficios se exportan desde Figma como SVG para respetar el diseño original (cerebro IA, cohete Career IQ y libro de certificaciones)

### Fixed - Introducción
- **Archivos modificados**: `src/components/intro/intro-footer.js`, `src/components/intro/intro-footer.module.css`
- Se elimina el footer duplicado de la introducción al unificarlo con el del resto del sitio

# [0.18.0] - 2026-07-08

### Added - Introducción
- **Archivos modificados**: `src/app/page.jsx`, `src/app/login/page.jsx`, `src/components/intro/intro-page.js`, `src/components/intro/intro-page.module.css`, `src/components/intro/intro-nav.js`, `src/components/intro/intro-nav.module.css`, `src/components/intro/intro-hero.js`, `src/components/intro/intro-hero.module.css`, `src/components/intro/intro-features.js`, `src/components/intro/intro-features.module.css`, `src/components/intro/intro-featured-courses.js`, `src/components/intro/intro-featured-courses.module.css`, `src/components/intro/intro-footer.js`, `src/components/intro/intro-footer.module.css`, `src/data/intro-data.js`, `public/icons/intro-ai.svg`, `public/icons/intro-career.svg`, `public/icons/intro-certifications.svg`, `public/icons/arrow-right-dark.svg`
- La URL raíz muestra la nueva página de introducción según el diseño Figma en desktop y mobile, con hero, beneficios, cursos destacados y footer propio
- El botón "Iniciar Sesión" navega a `/login`, donde queda el formulario de acceso que antes estaba en la raíz

### Changed - Login
- **Archivos modificados**: `src/components/login/login-logo.js`
- El logo del login vuelve a enlazar a la página de introducción en la raíz

# [0.17.1] - 2026-07-08

### Changed - Header
- **Archivos modificados**: `src/components/header.module.css`
- Se reduce un 30% adicional el alto del header al hacer scroll para compactarlo aún más en desktop y mobile

# [0.17.0] - 2026-07-08

### Changed - Header
- **Archivos modificados**: `src/components/header.js`, `src/components/header.module.css`
- El header sticky reduce su alto en un 40% al hacer scroll, con transición suave, para ganar espacio de contenido en desktop y mobile

# [0.16.1] - 2026-07-08

### Changed - Carrusel
- **Archivos modificados**: `src/components/home/home-hero.module.css`
- Las flechas del hero vuelven a su estilo original (fondo translúcido y flecha blanca) y se les incorpora hover inverso: al pasar el cursor el fondo pasa a blanco y la flecha a azul oscuro

# [0.16.0] - 2026-07-08

### Changed - Carrusel
- **Archivos modificados**: `src/components/home/course-carousel.js`, `src/components/home/course-carousel.module.css`, `src/components/home/home-hero.js`, `src/components/home/home-hero.module.css`
- Las flechas de los carruseles de cursos se unifican con fondo de marca (#00E5C8), borde blanco y flecha azul oscuro
- Se añade hover inverso en las flechas de los carruseles: al pasar el cursor el fondo pasa a azul oscuro y la flecha a color de marca

# [0.15.1] - 2026-07-08

### Changed - Carrusel
- **Archivos modificados**: `src/components/home/course-carousel.js`, `src/components/home/course-carousel.module.css`, `public/icons/chevron-left-dark.svg`, `public/icons/chevron-right-dark.svg`
- Las flechas de los carruseles adoptan fondo de color de marca (#00E5C8) y borde blanco, con la flecha interior en azul oscuro para mejor contraste y legibilidad

# [0.15.0] - 2026-07-08

### Changed - Carrusel
- **Archivos modificados**: `src/components/home/course-carousel.js`, `src/components/home/course-carousel.module.css`
- Las flechas de los carruseles "Recomendado para ti" y "Nuevos cursos" se ubican fuera del contenedor de las tarjetas para mayor visibilidad
- Los carruseles avanzan en bucle continuo, repitiendo las tarjetas de forma fluida en lugar de volver de golpe al inicio

### Fixed - Header
- **Archivos modificados**: `src/app/globals.css`
- El header vuelve a quedar fijo (sticky) al desplazar la página; se corrige el `overflow-x` horizontal que anulaba la fijación

# [0.14.0] - 2026-07-08

### Added - Perfil
- **Archivos modificados**: `src/components/profile/profile-certificate-card.js`, `src/components/profile/profile-certificate-card.module.css`, `src/components/profile/profile-content.js`, `src/components/profile/profile-content.module.css`, `src/components/profile/profile-page.js`, `src/data/profile-data.js`, `public/icons/profile-certificate-medal.svg`, `public/icons/profile-download.svg`
- El sub-tab "Certificados" en Mis Cursos muestra cards con medalla, fecha de emisión y enlace "Descargar PDF" según el diseño Figma
- En desktop los certificados se presentan en grid de dos columnas con el mismo espaciado que los cursos terminados

# [0.13.0] - 2026-07-08

### Added - Perfil
- **Archivos modificados**: `src/components/profile/profile-course-card.js`, `src/components/profile/profile-course-card.module.css`, `src/components/profile/profile-content.js`, `src/components/profile/profile-content.module.css`, `src/components/profile/profile-page.js`, `src/data/profile-data.js`, `public/icons/profile-course-check.svg`, `public/images/profile/course-completed.webp`
- El sub-tab "Terminados" en Mis Cursos muestra cards de cursos completados con icono de check, meta "Completado" y progreso al 100% según el diseño Figma
- En desktop los cursos terminados se presentan en grid de dos columnas, diferenciándose del listado de cursos en proceso

# [0.12.3] - 2026-07-08

### Changed - Header
- **Archivos modificados**: `src/components/header-profile-menu.js`
- Se elimina la opción "Mis Cursos" del menú desplegable de perfil en el header, quedando solo "Mi Perfil" y "Cerrar sesión" hasta una etapa posterior

# [0.12.2] - 2026-07-08

### Changed - Perfil
- **Archivos modificados**: `src/components/profile/profile-content.js`, `src/components/profile/profile-content.module.css`, `src/components/profile/profile-page.js`, `src/data/profile-data.js`
- En mobile las tabs del perfil ahora son las mismas que en desktop (Mis Cursos y Mi Rango), eliminando la tab exclusiva "Mi Progreso" para que el contenido sea idéntico en ambas vistas
- Se elimina la lógica de detección de viewport, mostrando el mismo contenido de tabs sin distinción de dispositivo

### Fixed - Perfil
- **Archivos modificados**: `src/components/profile/profile-radar-chart.js`, `src/components/profile/profile-radar-chart.module.css`, `src/components/profile/profile-ai-recommendation.js`, `src/components/profile/profile-ai-recommendation.module.css`, `public/icons/profile-ai.svg`, `public/images/profile/recommendation-ux.webp`
- Se elimina el gráfico radar, la recomendación IA y sus datos e íconos asociados, que solo se usaban en la tab exclusiva de mobile ya retirada

# [0.12.1] - 2026-07-08

### Fixed - Perfil
- **Archivos modificados**: `src/components/profile/profile-sidebar.module.css`
- El título "Mi Perfil" se alinea en la parte superior de la cabecera de la tarjeta, dando más separación respecto a la foto de perfil que quedaba demasiado pegada

# [0.12.0] - 2026-07-08

### Added - Perfil
- **Archivos modificados**: `src/components/profile/profile-rank-panel.js`, `src/components/profile/profile-rank-panel.module.css`, `src/components/profile/profile-content.js`, `src/components/profile/profile-page.js`, `src/data/profile-data.js`, `public/icons/rank-cadete.svg`, `public/icons/rank-current.svg`, `public/icons/rank-locked.svg`, `public/icons/rank-check.svg`
- El tab "Mi Rango (Career IQ)" ahora muestra la línea de progresión de rangos, los requisitos para subir de nivel y los beneficios a desbloquear según el diseño Figma
- Se separa el contenido de "Mi Progreso" del de "Mi Rango", evitando que compartan el radar y la recomendación IA

# [0.11.2] - 2026-07-08

### Changed - Cursos
- **Archivos modificados**: `src/components/courses/courses-mobile-carousel.js`, `src/components/courses/course-lesson-player.js`, `src/components/courses/course-lesson-player.module.css`, `src/components/courses/course-detail-panel.js`, `src/data/course-lesson-data.js`, `src/data/courses-data.js`, `src/data/course-detail-data.js`, `src/components/courses/courses-page-content.js`
- Limpieza del flujo de Cursos: se eliminan imports sin uso, props y ramas de código muertas en el reproductor de lección, el alias `featuredMarketingCourses`, la función `getFirstLessonUrl` y datos duplicados en el catálogo
- Se simplifican exportaciones internas (`growthHackingCourse`, `newCourses`, `popularCourses`) que solo se usaban dentro del módulo de datos

# [0.11.1] - 2026-07-08

### Changed - Cursos
- **Archivos modificados**: `src/components/courses/course-lesson-body.js`, `src/components/courses/course-lesson-body.module.css`, `src/components/courses/course-lesson-page.js`, `src/components/courses/course-lesson-page.module.css`, `src/components/courses/course-lesson-sidebar.js`, `src/components/courses/course-lesson-sidebar.module.css`
- En mobile, las tabs de la lección ahora son las mismas que en desktop (Transcripción, Recursos y Comentarios), eliminando la pestaña "Contenido" exclusiva de mobile
- El sidebar con progreso y lecciones se muestra en mobile debajo del contenido principal, manteniendo la misma información que en desktop

# [0.11.0] - 2026-07-08

### Changed - Cursos
- **Archivos modificados**: `src/components/courses/course-lesson-sidebar.js`, `src/components/courses/course-lesson-sidebar.module.css`, `public/icons/exam-medal.svg`
- El botón de "Examen Final" en el sidebar de la lección adopta el estilo del diseño: fondo azul oscuro `#0b0b43`, borde `#1a1a6b`, icono de medalla en color primario y candado a la derecha

### Changed - Scripts
- **Archivos modificados**: `src/components/courses/course-lesson-nav.js`, `src/components/courses/course-lesson-nav.module.css`
- Los botones de navegación de la lección (Anterior / Siguiente lección) ahora invierten sus colores al pasar el cursor, mostrando el estado inverso al normal
- Los iconos de flecha se renderizan con máscara para que hereden el color del texto y se inviertan junto con el botón

# [0.10.1] - 2026-07-08

### Fixed - Cursos
- **Archivos modificados**: `src/components/courses/course-lesson-page.module.css`, `src/components/courses/course-lesson-page.js`, `src/components/courses/course-lesson-body.module.css`
- El fondo de la zona de contenido de la lección ahora usa el tono más oscuro `#0a1118` del diseño, en lugar del azul `#0d1b2a`
- Se corrige el padding del contenido bajo el video: el reproductor ocupa todo el ancho y el texto (título, tabs y transcripción) usa el margen horizontal del diseño, con ajustes responsivos

# [0.10.0] - 2026-07-08

### Added - Header
- **Archivos modificados**: `src/components/header-courses-menu.js`, `src/components/header-courses-menu.module.css`
- El desplegable de "Cursos" ahora incluye "Ver todos los cursos" como primera opción, que lleva al catálogo completo en `/cursos`

### Changed - Header
- **Archivos modificados**: `src/components/header-courses-menu.js`, `src/components/courses/courses-page-content.js`, `src/app/(site)/cursos/page.jsx`
- Al seleccionar una categoría en el desplegable de "Cursos" ahora se abre el catálogo filtrado mostrando solo los cursos de esa categoría, mediante el parámetro `categoria` en la URL

# [0.9.0] - 2026-07-08

### Added - Cursos
- **Archivos modificados**: `src/app/(site)/cursos/[id]/leccion/[lessonId]/page.jsx`, `src/components/courses/course-lesson-page.js`, `src/components/courses/course-lesson-page.module.css`, `src/components/courses/course-lesson-player.js`, `src/components/courses/course-lesson-player.module.css`, `src/components/courses/course-lesson-sidebar.js`, `src/components/courses/course-lesson-sidebar.module.css`, `src/components/courses/course-lesson-body.js`, `src/components/courses/course-lesson-body.module.css`, `src/components/courses/course-lesson-nav.js`, `src/components/courses/course-lesson-nav.module.css`, `src/components/courses/course-detail-panel.js`, `src/components/courses/course-detail-panel.module.css`, `src/data/course-lesson-data.js`, `public/icons/lesson-active.svg`, `public/icons/lesson-pending.svg`
- Nueva página de lección en `/cursos/[id]/leccion/[lessonId]` según diseño Figma desktop y mobile, con reproductor, transcripción, sidebar de progreso y navegación entre lecciones
- Los botones de play y "Comenzar curso" en el detalle del curso ahora abren el paso 1 de la lección

# [0.8.1] - 2026-07-08

### Changed - Cursos
- **Archivos modificados**: `src/components/courses/courses-section.js`, `src/components/courses/courses-page-content.js`
- El enlace "Ver todo el catálogo" de cada sección ahora aplica el filtro de su categoría, mostrando solo las cards de esa categoría igual que los filtros del menú lateral

# [0.8.0] - 2026-07-08

### Added - Cursos
- **Archivos modificados**: `src/app/(site)/cursos/[id]/page.jsx`, `src/components/courses/course-detail-hero.js`, `src/components/courses/course-detail-hero.module.css`, `src/components/courses/course-detail-panel.js`, `src/components/courses/course-detail-panel.module.css`, `src/components/courses/course-detail-content.js`, `src/components/courses/course-detail-content.module.css`, `src/components/courses/course-detail-page.js`, `src/components/courses/course-detail-page.module.css`, `src/data/course-detail-data.js`, `src/components/home/course-card.js`, `src/components/home/course-card.module.css`, `public/icons/course-play.svg`, `public/icons/course-level.svg`, `public/icons/course-transcript.svg`, `public/icons/course-certificate.svg`, `public/icons/course-lock.svg`, `public/icons/check-teal.svg`
- Nueva página de detalle de curso en `/cursos/[id]` según diseño Figma desktop y mobile, con hero, panel de acción, tabs de descripción y cards enlazadas desde el catálogo

# [0.7.5] - 2026-07-08

### Changed - Cursos
- **Archivos modificados**: `src/data/courses-data.js`
- Cada categoría del menú lateral ahora despliega su propio conjunto de cards, y las opciones Cursos nuevos, Populares y Marketing muestran su selección correspondiente, de modo que al presionar una categoría solo se ven sus cursos

# [0.7.4] - 2026-07-08

### Fixed - Cursos
- **Archivos modificados**: `src/components/home/course-card.module.css`, `src/components/courses/courses-section.module.css`
- Se agrega padding inferior al botón de las cards del catálogo para que no quede pegado al borde, con la misma separación que los laterales

# [0.7.3] - 2026-07-08

### Changed - Cursos
- **Archivos modificados**: `src/components/home/course-card.module.css`, `src/components/courses/courses-section.module.css`, `src/components/courses/courses-mobile-carousel.module.css`, `src/components/courses/courses-page-content.module.css`, `src/data/courses-data.js`
- La imagen de las cards del catálogo se reduce un 30% de alto y la altura de la card se ajusta al contenido, solo en la vista de Cursos para no afectar el home
- El título de la card se limita a una línea con puntos suspensivos, evitando que empuje la descripción y que los iconos se monten sobre el texto
- Se reducen los márgenes laterales del contenido de Cursos para dar más ancho a las cards
- Se añade la etiqueta "Nuevo" a algunas cards del catálogo

# [0.7.2] - 2026-07-08

### Fixed - Cursos
- **Archivos modificados**: `src/components/courses/courses-section.module.css`, `src/components/home/course-card.module.css`
- Las cards del catálogo ahora ocupan el ancho de su columna en el grid para evitar que se monten en resoluciones intermedias
- La descripción de las cards se limita a dos líneas con puntos suspensivos cuando el texto es más largo

# [0.7.1] - 2026-07-08

### Fixed - Cursos
- **Archivos modificados**: `src/components/courses/courses-sidebar.js`, `src/components/courses/courses-sidebar.module.css`, `src/components/courses/courses-page-content.module.css`
- El menú lateral de Cursos ahora replica el diseño Figma: sin caja con borde, separador vertical, títulos en mayúsculas, links planos en la sección Cursos y pills con borde teal izquierdo en Categorías activas

# [0.7.0] - 2026-07-08

### Added - Cursos
- **Archivos modificados**: `src/app/(site)/cursos/page.jsx`, `src/components/courses/courses-page-content.js`, `src/components/courses/courses-page-content.module.css`, `src/components/courses/courses-breadcrumb.js`, `src/components/courses/courses-breadcrumb.module.css`, `src/components/courses/courses-sidebar.js`, `src/components/courses/courses-sidebar.module.css`, `src/components/courses/courses-filter-bar.js`, `src/components/courses/courses-filter-bar.module.css`, `src/components/courses/courses-section.js`, `src/components/courses/courses-section.module.css`, `src/components/courses/courses-mobile-carousel.js`, `src/components/courses/courses-mobile-carousel.module.css`, `src/data/courses-data.js`, `src/components/home/course-carousel.js`, `src/components/home/course-carousel.module.css`, `src/components/header-courses-menu.js`, `src/components/header-mobile-menu.js`
- Nueva página de catálogo en `/cursos` según diseño Figma desktop y mobile, con sidebar de filtros, pills horizontales en móvil, breadcrumb, secciones por categoría y cards reutilizando el componente del home
- Enlaces de navegación del header y del home actualizados para apuntar al catálogo

# [0.6.2] - 2026-07-08

### Changed - Styles
- **Archivos modificados**: `src/app/globals.css`, `src/styles/tokens.css`, `src/components/dropdown-panel.module.css`, `src/components/header-search.module.css`, `src/hooks/use-dropdown-behavior.js`, `public/vercel.svg`, `public/window.svg`, `public/file.svg`
- Limpieza de código y estilos sin uso: se eliminan assets por defecto de Next, variables CSS huérfanas, la clase `.container`, `.panelAlignEnd` y el retorno `wrapRef` del hook de desplegables; `globals.css` usa los tokens del diseño en lugar del tema claro/oscuro genérico

# [0.6.1] - 2026-07-08

### Fixed - Home
- **Archivos modificados**: `src/components/home/course-carousel.module.css`
- Las flechas de navegación de los carruseles Recomendado para ti y Nuevos cursos se desplazan hacia afuera para quedar a mitad sobre el borde de las cards y dejar de tapar su texto

# [0.6.0] - 2026-07-08

### Changed - Header
- **Archivos modificados**: `src/components/header.js`, `src/components/header.module.css`
- Se elimina el enlace "Espacio Trainee" de la navegación del header y se retiran los estilos asociados que quedaron sin uso

# [0.5.9] - 2026-07-08

### Changed - Login
- **Archivos modificados**: `src/app/page.jsx`, `src/app/login.module.css`, `src/app/(site)/page.jsx`, `src/app/login/page.jsx`, `src/app/login/layout.js`, `src/app/login/login.module.css`, `src/app/login/hook/index.js`
- El login pasa a ser la ruta raíz `/`; se elimina la ruta `/login` y la redirección previa de la raíz hacia `/home`

# [0.5.8] - 2026-07-08

### Changed - Home
- **Archivos modificados**: `src/app/(site)/home/page.jsx`, `src/app/(site)/home/home.module.css`, `src/app/(site)/page.jsx`, `src/components/site-logo.js`, `src/components/login/login-form.js`, `src/components/login/login-logo.js`, `src/components/header-mobile-menu.js`
- El home ahora vive en `/home`; la raíz `/` redirige allí y los enlaces del logo, login y menú móvil apuntan a la nueva ruta

# [0.5.7] - 2026-07-07

### Added - Home
- **Archivos modificados**: `src/components/home/course-carousel.js`, `src/app/(site)/page.jsx`
- Los carruseles Recomendado para ti y Nuevos cursos ahora navegan en loop: al llegar al final la flecha siguiente vuelve al inicio y viceversa, con ambas flechas siempre disponibles cuando hay más de una página

# [0.5.6] - 2026-07-07

### Fixed - Footer
- **Archivos modificados**: `src/components/footer.module.css`
- En móvil el footer pasa a layout vertical centrado con el logo arriba y el crédito debajo, según el diseño Figma, sin afectar la disposición horizontal en desktop

# [0.5.5] - 2026-07-07

### Fixed - Home
- **Archivos modificados**: `src/components/home/course-carousel.module.css`
- En móvil, la primera card de Recomendado para ti y Nuevos cursos ahora respeta el margen izquierdo alineado con el título, según el diseño Figma; el carrusel sigue extendiéndose hacia la derecha para mostrar el borde de la siguiente card

# [0.5.4] - 2026-07-07

### Fixed - Header
- **Archivos modificados**: `src/components/header-mobile-menu.js`
- El menú hamburguesa móvil vuelve a abrirse tras cerrarse; antes el fondo invisible quedaba montado y bloqueaba el disparador

# [0.5.3] - 2026-07-07

### Changed - Header
- **Archivos modificados**: `src/components/header.js`, `src/components/header.module.css`
- En móvil el header muestra únicamente el logo y el icono del menú hamburguesa; la campana de notificaciones y el perfil se ocultan porque su contenido vive dentro del menú desplegable, según el diseño Figma

# [0.5.2] - 2026-07-07

### Added - Home
- **Archivos modificados**: `src/components/home/home-hero.js`, `src/components/home/course-carousel.module.css`
- Carrusel principal ahora se puede cambiar de banner deslizando con el dedo, además de las flechas y los bullets
- Desplazamiento con inercia táctil en el carrusel de cursos para una navegación más fluida en móvil

# [0.5.1] - 2026-07-07

### Changed - Header
- **Archivos modificados**: `src/components/header-mobile-menu.js`, `src/components/header-mobile-menu.module.css`, `public/icons/close.svg`, `public/icons/nav-user.svg`, `public/icons/nav-home.svg`, `public/icons/nav-explore.svg`, `public/icons/nav-learning.svg`, `public/icons/nav-certificate.svg`, `public/icons/nav-logout.svg`
- Menú hamburguesa móvil rehecho como panel lateral deslizable según el diseño Figma, con cabecera de perfil, secciones Navegación (Inicio, Explorar Cursos, Mis Aprendizajes, Certificados) y Cuenta (Cerrar sesión)
- Cierre del panel mediante botón, tecla Escape, clic en el fondo o al seleccionar una opción, con bloqueo de scroll mientras está abierto

# [0.5.0] - 2026-07-07

### Added - Header
- **Archivos modificados**: `src/components/header-mobile-menu.js`, `src/components/header-mobile-menu.module.css`, `src/components/header.js`, `public/icons/menu.svg`
- Menú hamburguesa visible solo en móvil que despliega la navegación principal (categorías de Cursos y Espacio Trainee), ocultas en esa vista, con el mismo comportamiento del resto de desplegables

# [0.4.9] - 2026-07-07

### Changed - Home
- **Archivos modificados**: `src/app/(site)/home.module.css`, `src/components/home/continue-card.module.css`
- Sección Continúa donde lo dejaste ahora muestra las cards de dos en dos por fila en escritorio y una por fila en móvil

# [0.4.8] - 2026-07-07

### Changed - Home
- **Archivos modificados**: `src/components/home/course-carousel.js`, `src/app/(site)/page.jsx`
- Enlace Ver todo el catálogo ahora es opcional en el carrusel y se eliminó de la sección Nuevos cursos

# [0.4.7] - 2026-07-07

### Changed - Home
- **Archivos modificados**: `src/data/home-data.js`, `src/components/home/course-carousel.module.css`
- Sección Recomendado para ti ampliada a 8 cards para que el carrusel paginado de tres en tres sea más evidente
- Flecha del enlace Ver todo el catálogo visible en desktop junto al texto

# [0.4.6] - 2026-07-07

### Changed - Home
- **Archivos modificados**: `src/components/home/course-carousel.js`
- El carrusel de cursos avanza y retrocede de tres en tres, y los bullets ahora son proporcionales a la cantidad de páginas (movimientos) en lugar de a la cantidad de cards

# [0.4.5] - 2026-07-07

### Added - Header
- **Archivos modificados**: `src/components/header.module.css`, `src/components/header-courses-menu.module.css`, `src/components/header-profile-menu.module.css`, `src/components/header-notifications.js`, `src/components/header-notifications.module.css`
- Estado hover en los botones del header (Cursos, Espacio Trainee, nombre de perfil e icono de notificaciones) con cambio de color a #00E5C8

### Added - Home
- **Archivos modificados**: `src/components/home/home-hero.js`, `src/components/home/home-hero.module.css`
- Estado hover en el botón del banner del carrusel principal con colores invertidos respecto al estado inicial

# [0.4.4] - 2026-07-07

### Changed - Home
- **Archivos modificados**: `src/components/home/course-carousel.js`, `src/components/home/course-carousel.module.css`, `src/components/home/course-card.module.css`
- Carrusel de cursos funcional: muestra tres cards y media, con flechas de navegación que aparecen solo cuando hay cards ocultas a la izquierda o la derecha
- Bullets funcionales que permiten navegar entre cards y cuyo número coincide con la cantidad de cards disponibles

# [0.4.3] - 2026-07-07

### Added - Home
- **Archivos modificados**: `src/components/home/home-hero.js`, `src/components/home/home-hero.module.css`
- Transición de movimiento direccional entre banners del carrusel: avanzan de derecha a izquierda con la flecha derecha o un bullet posterior, y de izquierda a derecha con la flecha izquierda o un bullet anterior
- La transición se omite cuando el sistema tiene activado prefers-reduced-motion

# [0.4.2] - 2026-07-07

### Fixed - Home
- **Archivos modificados**: `src/components/home/home-hero.js`, `src/components/home/home-hero.module.css`, `public/images/home/hero-bg.png`
- Imagen de fondo del banner reemplazada por la del diseño Figma para que el primer banner muestre el fondo correcto
- Alineación de los textos del banner corregida: las flechas se posicionan en los bordes sin desplazar el contenido y el bloque de texto respeta las medidas del diseño

# [0.4.1] - 2026-07-07

### Added - Header
- **Archivos modificados**: `src/components/header-profile-menu.js`, `src/components/header-profile-menu.module.css`, `src/components/header.js`, `src/components/header.module.css`, `public/icons/profile-user.svg`, `public/icons/profile-courses.svg`, `public/icons/profile-logout.svg`
- Menú de perfil desplegable al hacer clic en el nombre o el avatar, con opciones Mi Perfil, Mis Cursos y Cerrar sesión según diseño Figma
- Menú de perfil con el mismo comportamiento del resto de desplegables: transición, cierre por clic fuera, blur y mouse leave, puente invisible y despliegue centrado respecto al disparador

# [0.4.0] - 2026-07-07

### Added - Header
- **Archivos modificados**: `src/components/header-notifications.js`, `src/components/header-notifications.module.css`
- Cada notificación del panel es clickeable y al seleccionarla se marca como leída y cierra el desplegable
- Efecto hover, foco y estado activo en cada notificación para reforzar que son interactivas

# [0.3.10] - 2026-07-07

### Fixed - Header
- **Archivos modificados**: `src/components/header-notifications.module.css`
- Puente invisible del panel de notificaciones ya no se recorta, evitando el cierre del desplegable al mover el cursor desde el icono hacia el panel

# [0.3.9] - 2026-07-07

### Fixed - Header
- **Archivos modificados**: `src/components/header-courses-menu.js`, `src/components/header-courses-menu.module.css`, `src/components/dropdown-panel.module.css`
- Menú de cursos centrado respecto del botón que lo despliega, con clases de animación reutilizables para desplegables centrados de ancho variable

# [0.3.8] - 2026-07-07

### Fixed - Header
- **Archivos modificados**: `src/components/header-notifications.module.css`, `src/components/header-notifications.js`, `src/components/dropdown-panel.module.css`
- Panel de notificaciones centrado respecto del icono para que el puente invisible cubra el hueco y no se cierre al mover el cursor hacia el desplegable

# [0.3.7] - 2026-07-07

### Added - Header
- **Archivos modificados**: `src/components/header-notifications.js`, `src/components/header-notifications.module.css`, `src/components/header.js`, `src/data/notifications-data.js`, `public/icons/bell.svg`, `public/icons/notification-course.svg`, `public/icons/notification-comment.svg`
- Icono de notificaciones con dos estados según Figma: campana con indicador cuando hay notificaciones nuevas y campana simple cuando no las hay
- Panel de notificaciones al interactuar con el icono cuando existen alertas pendientes, con listado, contador y acción de marcar como leídas

### Changed - Header
- **Archivos modificados**: `src/hooks/use-dropdown-behavior.js`, `src/components/header-search.js`, `src/components/header-courses-menu.js`, `src/components/dropdown-panel.module.css`
- Comportamiento unificado de desplegables extraído a un hook reutilizable para aplicar el mismo patrón en futuros menús del header

# [0.3.6] - 2026-07-07

### Changed - Header
- **Archivos modificados**: `src/components/header-search.js`, `src/components/header-search.module.css`, `src/components/header-courses-menu.js`, `src/components/header-courses-menu.module.css`
- Todos los desplegables del header se cierran al salir del disparador o del propio desplegable, tanto con el mouse como al perder el foco
- Puente invisible entre el disparador y el desplegable para evitar el cierre al cruzar el espacio intermedio

# [0.3.5] - 2026-07-07

### Changed - Header
- **Archivos modificados**: `src/components/header-search.js`, `src/components/header-courses-menu.js`, `src/components/dropdown-panel.module.css`, `src/hooks/use-dropdown-transition.js`, `src/components/header-courses-menu.module.css`
- Transiciones de entrada y salida añadidas a los desplegables de búsqueda y menú Cursos para una apertura y cierre más fluidos

# [0.3.4] - 2026-07-07

### Added - Header
- **Archivos modificados**: `src/components/header-courses-menu.js`, `src/components/header-courses-menu.module.css`, `src/components/header.js`, `src/data/courses-menu-data.js`
- Menú secundario de categorías de cursos al seleccionar "Cursos" según diseño Figma

# [0.3.3] - 2026-07-07

### Added - Header
- **Archivos modificados**: `src/components/header-search.js`, `src/components/header-search.module.css`, `src/components/header.js`, `src/data/search-data.js`, `public/icons/history.svg`
- Tooltip de búsqueda predictiva al enfocar el buscador con búsquedas recientes y cursos recomendados según diseño Figma

# [0.3.2] - 2026-07-07

### Fixed - Footer
- **Archivos modificados**: `src/components/footer.js`, `src/components/footer.module.css`
- Footer alineado al diseño Figma con logo WebP del login, layout horizontal y medidas de padding según especificación

# [0.3.1] - 2026-07-07

### Fixed - Header
- **Archivos modificados**: `src/components/site-logo.js`, `src/components/site-logo.module.css`
- Logo del header reemplazado por la misma imagen WebP del login para coincidir con el diseño

# [0.3.0] - 2026-07-07

### Added - Home
- **Archivos modificados**: `src/app/(site)/page.jsx`, `src/app/(site)/home.module.css`, `src/data/home-data.js`, `src/components/home/home-hero.js`, `src/components/home/home-hero.module.css`, `src/components/home/course-card.js`, `src/components/home/course-card.module.css`, `src/components/home/course-carousel.js`, `src/components/home/course-carousel.module.css`, `src/components/home/continue-card.js`, `src/components/home/continue-card.module.css`, `public/images/home/*.webp`, `public/icons/search.svg`, `public/icons/chevron-down.svg`, `public/icons/chevron-left.svg`, `public/icons/chevron-right.svg`, `public/icons/bell.svg`, `public/icons/users.svg`, `public/icons/clock.svg`, `public/icons/book-open.svg`, `public/icons/arrow-right-primary.svg`, `public/icons/arrow-right-white.svg`, `public/icons/logo-flask.svg`
- Página home implementada según diseño Figma desktop y mobile con hero, carruseles de cursos, sección de progreso y estados hover en tarjetas
- Imágenes del home exportadas desde Figma y optimizadas en WebP

### Changed - Header
- **Archivos modificados**: `src/components/header.js`, `src/components/header.module.css`, `src/components/site-logo.js`, `src/components/site-logo.module.css`
- Header del sitio con búsqueda, navegación, notificaciones y perfil según diseño desktop; versión compacta en mobile

### Changed - Footer
- **Archivos modificados**: `src/components/footer.js`, `src/components/footer.module.css`
- Footer con logo RevoLab y crédito del equipo según diseño Figma

### Changed - Styles
- **Archivos modificados**: `src/styles/tokens.css`
- Tokens de color y dimensiones del home agregados al sistema de diseño

### Fixed - Rutas
- **Archivos modificados**: `src/app/page.jsx` (eliminado)
- Home centralizada en el grupo `(site)` para usar layout con header y footer

# [0.2.4] - 2026-07-07

### Fixed - Login
- **Archivos modificados**: `public/images/revolab-logo-desktop.webp`, `public/images/revolab-logo-mobile.webp`, `src/components/login/login-logo.js`, `src/components/login/login-logo.module.css`, `scripts/process-logo.mjs`
- Logo regenerado con fondo transparente eliminando el negro del asset original
- Imágenes servidas sin optimización de Next.js para preservar el canal alpha en mobile

# [0.2.3] - 2026-07-07

### Fixed - Login
- **Archivos modificados**: `public/images/revolab-logo-desktop.webp`, `public/images/revolab-logo-mobile.webp`, `src/components/login/login-logo.js`, `src/components/login/login-logo.module.css`
- Logo reemplazado por el asset proporcionado, recortado y convertido a WebP para preservar proporciones correctas
- CSS ajustado para escalar solo por ancho y mantener relación de aspecto sin deformar la imagen

# [0.2.2] - 2026-07-07

### Changed - Login
- **Archivos modificados**: `src/components/login/login-logo.js`, `src/components/login/login-logo.module.css`, `public/images/revolab-logo-desktop.webp`, `public/images/revolab-logo-mobile.webp`
- Logo REVO LAB reemplazado por imagen exportada desde Figma en desktop y mobile para coincidir pixel-perfect con el diseño

# [0.2.1] - 2026-07-07

### Fixed - Login
- **Archivos modificados**: `public/icons/eye-hidden.svg`, `public/icons/eye-visible.svg`, `src/components/login/login-form.js`, `src/components/login/login-form.module.css`, `src/app/login/login.module.css`
- Íconos de visibilidad de contraseña reemplazados por vectores de Figma en blanco para mejor legibilidad sobre fondo oscuro
- Espaciado del footer REVO / BUSINESS EVOLUTION corregido eliminando márgenes extra y fijando altura de 48px según diseño

# [0.2.0] - 2026-07-07

### Added - Login
- **Archivos modificados**: `src/app/login/page.jsx`, `public/icons/logo-flask.svg`, `public/icons/arrow-right.svg`, `public/icons/eye-hidden.svg`, `public/icons/eye-visible.svg`, `public/icons/error.svg`
- Página de inicio de sesión conectada a los componentes y estilos del diseño Figma (desktop y mobile)
- Íconos SVG optimizados para logo, flecha, visibilidad de contraseña y errores de validación

### Changed - Layout
- **Archivos modificados**: `src/app/layout.js`, `src/app/globals.css`
- Layout raíz sin Header/Footer para permitir pantalla de login a pantalla completa
- Fuente Inter y tokens de diseño cargados globalmente

### Changed - Login
- **Archivos modificados**: `src/components/login/login-logo.js`, `src/components/login/login-form.module.css`
- Logo con navegación Next.js Link
- Padding del campo contraseña en foco corregido para no desplazar el ícono de visibilidad

### Fixed - Rutas
- **Archivos modificados**: `src/app/page.jsx` (eliminado)
- Eliminada página duplicada en raíz que conflictuaba con el grupo `(site)`
