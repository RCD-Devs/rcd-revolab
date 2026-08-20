# RevoLab — Estructura del proyecto y decisiones técnicas

> **Actualizado 2026-08-19:** estas decisiones ya están implementadas (no
> son propuestas). El stack, la estructura de carpetas y las convenciones
> descritas abajo son las que efectivamente usa el proyecto hoy. Para el
> estado de avance por etapa, ver `revolab-checklist-backend.md`.

## Contexto general

RevoLab es una plataforma interna de e-learning para la agencia. La idea es construir una solución similar a Udemy, pero orientada al equipo interno: cada persona puede crear su perfil, explorar cursos por área y avanzar en su desarrollo profesional dentro de la organización.

La plataforma también considera un espacio de creación y gestión de cursos para instructores y administradores.

El objetivo del proyecto es mantener una arquitectura simple, escalable para el uso interno esperado y, especialmente, con costo de desarrollo e infraestructura inicial lo más cercano posible a $0.

---

## Stack definitivo

| Capa | Tecnología |
|---|---|
| Frontend + Backend | Next.js + TypeScript |
| ORM | Prisma |
| Base de datos | Supabase PostgreSQL |
| Autenticación | Auth.js |
| Storage de videos | Cloudflare R2 |
| Dominio, DNS y CDN | Cloudflare |

---

## Decisión principal de arquitectura

La decisión base es construir RevoLab como una aplicación **Next.js full stack**, no como dos aplicaciones separadas.

Esto significa que Next.js será responsable tanto de la interfaz como de la lógica backend necesaria para la plataforma, usando recursos como:

- páginas y layouts con App Router;
- componentes React;
- Route Handlers en `src/app/api`;
- Server Actions cuando corresponda;
- integración con Prisma;
- integración con Auth.js;
- conexión a Supabase PostgreSQL;
- integración con Cloudflare R2 para almacenamiento de videos.

No se definió usar un servidor Express separado para producción. Si existe una carpeta `backend/`, esta no debería transformarse en una aplicación independiente con su propio proceso de servidor.

---

## Estructura de repositorio acordada

Se puede mantener una separación visual y organizacional entre `frontend/` y `backend/`, aunque la aplicación desplegable sea una sola.

La estructura general puede mantenerse así:

```text
rcd-revolab/
├── frontend/
│   ├── public/
│   ├── scripts/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── next.config.mjs
│   └── tsconfig.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── validations/
│   │   ├── auth/
│   │   └── integrations/
│   └── package.json
│
├── README.md
├── CHANGELOG.md
└── .gitignore
```

La carpeta `frontend/` contiene la aplicación Next.js real. La carpeta `backend/` puede mantenerse como espacio separado para lógica de negocio, Prisma, servicios, validaciones, integraciones y código reutilizable por la aplicación Next.js.

---

## Separación entre frontend y backend

La separación deseada es organizacional, no de infraestructura.

### `frontend/`

Debe contener:

- aplicación Next.js;
- rutas públicas y privadas;
- layouts;
- componentes visuales;
- estilos;
- Route Handlers en `src/app/api`;
- puntos de entrada HTTP;
- consumo de servicios internos;
- configuración de Next.js.

Ejemplo:

```text
frontend/src/app/api/courses/route.ts
frontend/src/app/login/page.tsx
frontend/src/app/(site)/page.tsx
frontend/src/components/home/home-hero.tsx
```

### `backend/`

Debe contener lógica no visual y reutilizable, por ejemplo:

- servicios de negocio;
- repositorios de datos;
- validaciones;
- helpers;
- integración con Prisma;
- integración con R2;
- lógica de permisos;
- seeds o scripts auxiliares.

Ejemplo:

```text
backend/src/services/courses.ts
backend/src/repositories/course-repository.ts
backend/src/validations/course-schema.ts
backend/src/integrations/r2/upload-video.ts
backend/prisma/schema.prisma
```

La aplicación Next.js puede importar lógica desde `backend/`, pero las rutas HTTP deben seguir viviendo dentro de `frontend/src/app/api`.

---

## Cómo debería funcionar el backend dentro de Next.js

Aunque exista una carpeta `backend/`, los endpoints públicos o internos de la plataforma deberían declararse dentro de Next.js.

Ejemplo conceptual:

```ts
// frontend/src/app/api/courses/route.ts

import { getCourses } from '@revolab/backend/services/courses';

export async function GET() {
  const courses = await getCourses();
  return Response.json(courses);
}
```

En este modelo:

```text
frontend/src/app/api/.../route.ts
```

actúa como la entrada HTTP, mientras que:

```text
backend/src/services/...
backend/src/repositories/...
backend/src/integrations/...
```

contiene la lógica de negocio real.

---

## Uso de monorepo / workspace

Para mantener esta separación de carpetas sin convertir `backend/` en otra aplicación desplegable, se recomienda usar un workspace con pnpm.

Ejemplo de `pnpm-workspace.yaml` en la raíz del repositorio:

```yaml
packages:
  - frontend
  - backend
```

Ejemplo de `backend/package.json`:

```json
{
  "name": "@revolab/backend",
  "private": true,
  "type": "module",
  "exports": {
    "./services/*": "./src/services/*.ts",
    "./repositories/*": "./src/repositories/*.ts",
    "./validations/*": "./src/validations/*.ts",
    "./auth": "./src/auth/index.ts",
    "./r2": "./src/integrations/r2/index.ts"
  }
}
```

Ejemplo de dependencia en `frontend/package.json`:

```json
{
  "dependencies": {
    "@revolab/backend": "workspace:*"
  }
}
```

Esto permite mantener código separado, pero consumido desde la aplicación Next.js.

---

## Base de datos

La base de datos definida es **Supabase PostgreSQL**.

Supabase se utilizará como proveedor de PostgreSQL administrado, aprovechando su plan gratuito durante la etapa inicial del proyecto.

Prisma será el ORM encargado de modelar y acceder a los datos.

La ubicación recomendada para el schema de Prisma dependerá de cómo se consolide el workspace, pero la decisión conceptual es:

```text
backend/prisma/schema.prisma
```

o, si se decide simplificar más adelante:

```text
frontend/prisma/schema.prisma
```

La recomendación, dado que se quiere conservar separación de capas, es mantener Prisma dentro de `backend/`.

---

## Autenticación

La autenticación definida es **Auth.js**.

Auth.js debe integrarse con Next.js y utilizarse para manejar:

- inicio de sesión;
- sesiones;
- usuarios autenticados;
- protección de rutas;
- roles o permisos cuando corresponda.

Como la plataforma es interna, probablemente el modelo de permisos debería contemplar al menos:

```text
admin
instructor
student / member
```

La definición exacta de roles puede ajustarse cuando se diseñe el modelo de datos.

---

## Storage de videos

El almacenamiento de videos definido es **Cloudflare R2**.

R2 se utilizará para guardar archivos pesados, especialmente videos de cursos, evitando cargar esos archivos directamente en el repositorio o en el filesystem de la aplicación.

La lógica de subida, lectura y firma de URLs puede vivir en:

```text
backend/src/integrations/r2/
```

Y ser utilizada desde endpoints de Next.js dentro de:

```text
frontend/src/app/api/
```

---

## Convenciones de ramas

La estrategia de ramas acordada es compatible con GitFlow:

```text
feature/* → develop

develop → integración y pruebas

main → producción
```

`main` representa el ambiente productivo.

`develop` es la rama principal de trabajo diario e integración.

Después de fusionar cambios desde `develop` hacia `main`, es normal que GitHub sugiera comparar o abrir un PR desde `main` hacia `develop`, porque el merge a producción puede generar un commit nuevo en `main`. Ese flujo puede mantenerse para sincronizar historiales si el equipo lo considera necesario.

---

## Decisiones importantes

### 1. No separar infraestructura de frontend y backend

Aunque existan carpetas `frontend/` y `backend/`, no se busca tener dos aplicaciones desplegadas por separado.

La plataforma debe funcionar como una sola aplicación Next.js full stack.

### 2. No usar Express como backend productivo

Express puede existir como referencia o código temporal, pero no forma parte del stack definitivo.

El backend productivo debe vivir integrado en Next.js mediante Route Handlers, Server Actions y servicios internos.

### 3. Mantener costo inicial en $0

El stack se eligió pensando en evitar costos iniciales:

- Vercel para la aplicación;
- Supabase Free para PostgreSQL;
- Cloudflare R2 para videos;
- Cloudflare para DNS/CDN;
- GitHub como repositorio colaborativo.

### 4. Mantener separación de responsabilidades

Aunque Next.js sea full stack, no se debe mezclar toda la lógica dentro de los componentes.

La separación recomendada es:

```text
components/ → UI
app/ → rutas, layouts y endpoints
services/ → lógica de negocio
repositories/ → acceso a datos
validations/ → validaciones y esquemas
integrations/ → servicios externos como R2
```

### 5. `backend/` como paquete interno

La carpeta `backend/` debería evolucionar hacia un paquete interno reutilizable, consumido por `frontend/`, no hacia una API independiente.

---

## Estado actual observado

Actualmente el repositorio contiene una carpeta `frontend/` con estructura de Next.js:

```text
frontend/
├── public/
├── scripts/
├── src/
│   ├── app/
│   └── components/
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
└── pnpm-workspace.yaml
```

También existe una carpeta `backend/`, pero todavía no se ha consolidado la lógica backend definitiva.

Esto permite avanzar primero con el frontend y luego integrar progresivamente las capas de backend, Prisma, Auth.js y R2 sin romper la estructura del repositorio.

---

## Próximo paso técnico recomendado

Antes de avanzar demasiado con nuevas funcionalidades, conviene alinear el repositorio con estas decisiones:

1. Confirmar que `frontend/` seguirá siendo la aplicación Next.js principal.
2. Definir `backend/` como paquete interno del workspace.
3. Mover o crear `prisma/schema.prisma` dentro de `backend/`.
4. Crear servicios iniciales en `backend/src/services`.
5. Crear repositorios iniciales en `backend/src/repositories`.
6. Crear endpoints en `frontend/src/app/api` que consuman esos servicios.
7. Documentar esta decisión en el README principal para que todos los colaboradores trabajen con la misma arquitectura.

---

## Resumen corto

RevoLab debe mantenerse como un repositorio con separación entre `frontend/` y `backend/`, pero con una sola aplicación desplegable basada en Next.js.

`frontend/` contiene la app Next.js y las rutas API.

`backend/` contiene lógica de negocio, Prisma, validaciones e integraciones como paquete interno.

No se usará Express como backend productivo.

La arquitectura busca mantener costo inicial $0 usando Vercel, Supabase PostgreSQL, Auth.js, Prisma, Cloudflare R2 y Cloudflare.
