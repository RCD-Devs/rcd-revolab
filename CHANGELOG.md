# Changelog

## [0.2.0] - 2026-06-29

### Added - Frontend

- **Archivos modificados**: `.cursor/rules/frontend-pnpm-only.mdc`, `frontend/.npmrc`, `frontend/package.json`
- Regla de Cursor para que el agente use solo pnpm en `frontend/`.
- Bloqueo técnico con `only-allow pnpm`, `packageManager` y `engines` para evitar instalaciones con npm u otros gestores.

### Changed - Frontend

- **Archivos modificados**: `frontend/README.md`
- Instrucciones de arranque actualizadas para documentar únicamente pnpm.
