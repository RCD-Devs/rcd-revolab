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
