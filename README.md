# RevoLab

Plataforma interna de e-learning de la agencia. Funciona de forma similar a Udemy, pero pensada para el equipo: cada persona crea su perfil, explora cursos por área y avanza en su desarrollo profesional dentro de la organización. Incluye también un espacio de creación y gestión de cursos para instructores y administradores.

El nombre combina **Revo** (el concepto de *re-evolucionar*) y **Lab** (experimentar, explorar, descubrir).

**Repositorio:** https://github.com/RCD-Devs/rcd-revolab

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

**Para quien consume cursos:**

- Inicio de sesión y perfil de usuario (área, progreso, cursos realizados, rango).
- Home con cursos recomendados, nuevos y en desarrollo.
- Catálogo de cursos separado por áreas de aprendizaje.
- Detalle del curso: descripción, contenido, comentarios y quiz final.
- Reproductor de clases (curso player) para avanzar clase a clase.
- Quiz final para aprobar y registrar la finalización del curso.
- Espacio trainee con seguimiento de cursos obligatorios y mentor asignado.

**Para quien crea y gestiona cursos:**

- Panel de instructor para crear y administrar cursos.
- Carga de curso: información base (título, descripción, portada), módulos y contenido, y reglas de acceso (público o con permiso).
- Panel de administración para gestionar usuarios y cursos, con métricas de usuarios activos, cursos publicados y tasa de finalización.

> El alcance del primer MVP prioriza el flujo crítico: **iniciar sesión → revisar cursos disponibles → entrar a un curso → comenzar la primera clase**, con la condición habilitante de poder crear y cargar cursos.

---

## Stack tecnológico

### Definido

| Capa          | Tecnología                          |
|---------------|-------------------------------------|
| Backend       | Node.js + Express                   |
| Frontend      | React + TypeScript                  |
| ORM           | Prisma                              |
| Base de datos | PostgreSQL                          |

### En evaluación

| Aspecto              | Opciones en evaluación                      |
|----------------------|---------------------------------------------|
| Meta-framework front | React a secas o con Astro                   |
| Autenticación        | Auth.js o JWT                               |
| Storage de archivos  | Cloudflare R2, AWS S3 o Cloudinary          |
| Infraestructura      | Railway, Vercel o Cloudflare                |
| Infra de base de datos | Supabase                        |

---

## Estructura del proyecto

Monorepo con el backend y el frontend en un mismo repositorio:

```
revolab/
├── .gitignore
├── README.md
├── backend/
│   ├── prisma/
│   │   └── schema.prisma   # modelo de datos de Prisma
│   ├── src/
│   │   ├── config/         # conexión a DB, configuración general
│   │   ├── routes/         # definición de rutas
│   │   ├── controllers/    # lógica de cada endpoint
│   │   ├── services/       # lógica de negocio
│   │   ├── models/         # modelos de datos
│   │   ├── middlewares/    # auth, validaciones, manejo de errores
│   │   ├── utils/          # helpers
│   │   └── app.js          # configuración de Express
│   ├── .env.example        # plantilla de variables de entorno
│   ├── package.json
│   └── server.js           # punto de entrada
└── frontend/
    └── ...                 # según el stack que se defina
```

Cada lado (`backend/` y `frontend/`) maneja sus propias dependencias y su propio `node_modules`.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- npm (incluido con Node.js)
- Git

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/RCD-Devs/rcd-revolab.git
cd rcd-revolab
```

### 2. Configurar el backend

```bash
cd backend
npm install
cp .env.example .env       # luego completar los valores reales
npx prisma generate        # genera el cliente de Prisma
npx prisma migrate dev     # aplica las migraciones a la base de datos
npm run dev
```

El servidor quedará corriendo en `http://localhost:3000` (o el puerto definido en `.env`).
Para verificar que está arriba, puedes consultar el endpoint de salud: `http://localhost:3000/api/health`.

### 3. Configurar el frontend

```bash
cd frontend
npm install
npm run dev
```

> El frontend será **React + TypeScript** (queda por confirmar si se suma Astro como meta-framework). Las instrucciones se afinarán una vez cerrada esa decisión.

---

## Variables de entorno

El backend usa un archivo `.env` que **no se sube al repositorio**. Para crearlo, copia la plantilla `.env.example` y completa los valores:

```
PORT=3000

# Base de datos (Prisma + PostgreSQL)
DATABASE_URL="postgresql://usuario:password@host:5432/revolab?schema=public"

# Autenticación (por definir: Auth.js o JWT)
# JWT_SECRET=

# Storage (por definir: R2 / S3 / Cloudinary)
# STORAGE_KEY=
# STORAGE_SECRET=
```

---

## Scripts disponibles

Dentro de `backend/`:

| Comando         | Descripción                                            |
|-----------------|--------------------------------------------------------|
| `npm run dev`   | Levanta el servidor en modo desarrollo (con nodemon).  |
| `npm start`     | Levanta el servidor en modo producción.                |

---

## Convenciones de trabajo

- El desarrollo se organiza bajo metodología Sprint.
- El archivo `.env` y la carpeta `node_modules/` nunca se suben al repositorio (ver `.gitignore`).
- Mantener actualizado `.env.example` cuando se agreguen nuevas variables, para que el resto del equipo pueda replicar la configuración.