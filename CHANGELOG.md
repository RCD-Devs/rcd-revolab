# Changelog

## [0.3.0] - 2026-07-09

### Added - Administración

- **Archivos modificados**: `frontend/src/app/(site)/admin/page.jsx`, `frontend/src/components/admin/admin-page.js`, `frontend/src/components/admin/admin-page-content.js`, `frontend/src/components/admin/admin-page.module.css`, `frontend/src/data/admin-data.js`, `frontend/public/icons/admin-stat-users.svg`, `frontend/public/icons/admin-stat-courses.svg`, `frontend/public/icons/admin-stat-chart.svg`
- Panel de administración en `/admin` con métricas, búsqueda de usuarios y tabla desktop según Figma.
- Vista mobile con tarjetas de usuario, contador de cursos y acción "Ver más usuarios".

## [0.2.0] - 2026-06-29

### Added - Frontend

- **Archivos modificados**: `.cursor/rules/frontend-pnpm-only.mdc`, `frontend/.npmrc`, `frontend/package.json`
- Regla de Cursor para que el agente use solo pnpm en `frontend/`.
- Bloqueo técnico con `only-allow pnpm`, `packageManager` y `engines` para evitar instalaciones con npm u otros gestores.

### Changed - Frontend

- **Archivos modificados**: `frontend/README.md`
- Instrucciones de arranque actualizadas para documentar únicamente pnpm.
