# RevoLab

Plataforma interna de e-learning de la agencia. Funciona de forma similar a Udemy o Platzi, pero pensada para el equipo: cada persona crea su perfil, explora cursos por área y avanza en su desarrollo profesional dentro de la organización. Incluye también un espacio de creación y gestión de cursos para instructores y administradores.

El nombre combina **Revo** (el concepto de *re-evolucionar*) y **Lab** (experimentar, explorar, descubrir).

**Repositorio:** https://github.com/RCD-Devs/rcd-revolab
**Producción:** https://revolab-dev.vercel.app

---

## Tabla de contenidos

- [Funcionalidades](#funcionalidades)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Convenciones de trabajo](#convenciones-de-trabajo)

---

## Funcionalidades

**Para quien consume cursos (rol `STUDENT`, y cualquier `INSTRUCTOR`/`ADMIN` también puede consumir):**

- Inicio de sesión con dominio institucional (Auth.js) y perfil editable (nombre, foto, contraseña, área, rango).
- Home con cursos recomendados, nuevos y "continúa donde lo dejaste".
- Catálogo de cursos con búsqueda y filtro por categoría.
- Detalle del curso: descripción, temario (módulos/lecciones), comentarios y quiz.
- Reproductor de lección con transcripción, materiales descargables y progreso real por lección.
- Quiz por lección y examen final del curso, con certificado en PDF descargable al aprobar.
- Sistema de rangos (gamificación) e inscripción automática al primer acceso al contenido, con opción de cancelar inscripción.

**Para quien crea y gestiona cursos (rol `INSTRUCTOR`):**

- Panel de instructor para crear, editar, publicar y despublicar cursos propios.
- Editor de curso: información básica, portada, clasificación (área/categoría/nivel), contenido de la página pública (about/aprenderás/herramientas), módulos y lecciones (con reordenamiento y borrado), subida de video directo a storage, materiales complementarios y transcripción.
- Vista de estudiantes inscritos por curso, con progreso individual y resultado del examen final.

**Para administración (rol `ADMIN`):**

- Control total sobre cursos de cualquier instructor (editar, publicar, eliminar).
- Gestión completa de usuarios: crear, cambiar rol/área, desactivar (papelera con reasignación de email) y borrado permanente cuando no tiene historial asociado.
- Métricas globales (usuarios activos, cursos publicados).

---

## Stack tecnológico

| Capa                  | Tecnología                                                       |
|------------------------|-------------------------------------------------------------------|
| Framework              | Next.js (App Router, React) — un solo proyecto para frontend y API |
| Autenticación          | Auth.js v5 (`next-auth`), sesión JWT, Credentials Provider        |
| ORM / Base de datos    | Prisma + PostgreSQL (hosteado en Supabase)                        |
| Storage de archivos    | Cloudflare R2 (S3-compatible) en producción; filesystem local en desarrollo, mismo contrato para ambos |
| Estilos                | CSS Modules                                                       |
| Infraestructura        | Vercel (Root Directory: `frontend`)                                |
| Gestor de paquetes     | pnpm (workspaces)                                                  |

> El backend **no es un servidor Express separado**: es un paquete interno (`@revolab/backend`) con el schema de Prisma, repositorios y servicios, consumido directamente por los Route Handlers y Server Components de Next.js dentro del mismo proceso.

---

## Estructura del proyecto

Monorepo con pnpm workspaces (`frontend/` + `backend/`):

```
rcd-revolab/
├── pnpm-workspace.yaml
├── package.json            # scripts raíz (dev, build, lint delegan a frontend/)
├── backend/                 # paquete interno @revolab/backend, sin servidor propio
│   ├── prisma/
│   │   ├── schema.prisma    # modelo de datos
│   │   ├── migrations/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/          # conexión a Prisma
│   │   ├── auth/            # hashing de contraseñas
│   │   ├── integrations/    # storage (local / R2)
│   │   ├── repositories/    # acceso a datos (Prisma) por dominio
│   │   ├── services/        # lógica de negocio, lo que consume el frontend
│   │   ├── validations/     # slugs, etc.
│   │   └── constants/       # valores sin dependencias, importables desde el cliente
│   └── .env.example
└── frontend/                # Next.js App Router
    ├── src/
    │   ├── app/              # rutas (páginas + Route Handlers bajo app/api/)
    │   ├── components/       # componentes por dominio (courses, instructor, admin, profile...)
    │   ├── lib/               # helpers de Route Handlers (ej. requireRole)
    │   ├── data/              # contenido editorial fijo (no mocks de datos reales)
    │   ├── auth.js / auth.config.js  # Auth.js completo / config liviana para proxy
    │   └── proxy.js           # protección de rutas por sesión/rol (antes middleware.js)
    └── .env.local.example
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [pnpm](https://pnpm.io/) 9 o superior
- Git
- Acceso a la organización de **Supabase** (base de datos) — pedir invitación a quien la administre.

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/RCD-Devs/rcd-revolab.git
cd rcd-revolab
```

### 2. Instalar dependencias (una sola vez, desde la raíz)

```bash
pnpm install
```

### 3. Configurar las variables de entorno

Ver la sección [Variables de entorno](#variables-de-entorno) — hay que crear `backend/.env` y `frontend/.env.local` a partir de sus respectivos `.env.example`. Ninguno se sube al repositorio.

### 4. Preparar la base de datos

```bash
cd backend
pnpm exec prisma generate      # genera el cliente de Prisma
pnpm exec prisma migrate dev   # aplica migraciones pendientes
pnpm exec prisma db seed       # opcional: siembra categorías, departamentos, rangos y usuarios de prueba
cd ..
```

### 5. Levantar el proyecto

```bash
pnpm dev
```

Queda arriba en `http://localhost:3000`.

---

## Variables de entorno

**`backend/.env`** (copiar desde `backend/.env.example`):

```env
DATABASE_URL="postgresql://usuario:password@host:6543/postgres?pgbouncer=true"  # pooler de Supabase
DIRECT_URL="postgresql://usuario:password@host:5432/postgres"                   # conexión directa, para migraciones
STORAGE_PROVIDER="local"   # "local" en dev, "r2" cuando se prueba contra el bucket real
# R2_ACCOUNT_ID=
# R2_ACCESS_KEY_ID=
# R2_SECRET_ACCESS_KEY=
# R2_BUCKET_NAME=
# R2_PUBLIC_URL=
```

**`frontend/.env.local`** (copiar desde `frontend/.env.local.example`):

```env
DATABASE_URL="..."          # el mismo valor de arriba — Next.js corre @revolab/backend en su propio proceso
AUTH_SECRET="..."           # generar uno propio: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
STORAGE_PROVIDER="local"
```

En Vercel, las variables de producción ya están cargadas en el proyecto — no hace falta tocarlas salvo que cambie algo.

---

## Scripts disponibles

Desde la raíz del repo:

| Comando         | Descripción                                            |
|-----------------|---------------------------------------------------------|
| `pnpm dev`      | Levanta el frontend (y con él, la API) en modo desarrollo. |
| `pnpm build`    | Build de producción del frontend.                        |
| `pnpm lint`     | Corre ESLint sobre el frontend.                           |

Desde `backend/`:

| Comando                     | Descripción                                  |
|------------------------------|-----------------------------------------------|
| `pnpm exec prisma studio`    | Explorador visual de la base de datos.        |
| `pnpm exec prisma migrate dev` | Aplica migraciones pendientes en local.     |
| `pnpm exec prisma db seed`   | Siembra datos base (categorías, rangos, usuarios de prueba). |

---

## Convenciones de trabajo

- Flujo de ramas: `feature/*` → PR → `develop` (integración, se despliega como Preview en Vercel) → PR → `main` (producción).
- El archivo `.env`/`.env.local` y `node_modules/` nunca se suben al repositorio (ver `.gitignore`).
- Mantener actualizado el `.env.example` correspondiente cuando se agreguen nuevas variables.
- Documentación adicional del proyecto: `revolab-guia-continuidad.md` (onboarding rápido), `revolab-checklist-backend.md` (estado de avance por etapa) y `revolab-estructura-decisiones.md` (por qué se eligió cada pieza del stack).
