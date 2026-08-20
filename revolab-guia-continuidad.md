# RevoLab — Guía de continuidad (para retomar en otro equipo)

Última actualización: 2026-08-19. Punto de partida rápido si retomas el
proyecto desde una máquina nueva. Para el detalle completo, ver:

- `revolab-checklist-backend.md` — **estado real, etapa por etapa, qué falta**.
- `revolab-estructura-decisiones.md` — por qué se eligió cada pieza del stack.
- `revolab-roadmap-backend.md` — detalle técnico original (schema, endpoints).

---

## 1. Clonar y levantar el proyecto

```bash
git clone https://github.com/RCD-Devs/rcd-revolab.git
cd rcd-revolab
pnpm install
```

`pnpm install` ya corre `prisma generate` automáticamente (postinstall en
`backend/package.json`).

## 2. Variables de entorno necesarias

Ninguna vive en el repo (todas gitignored, correcto). Hay que recrearlas a
mano en dos lugares:

**`backend/.env`** (copia `backend/.env.example` como base):
```env
DATABASE_URL="postgresql://...pooler...:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...pooler...:5432/postgres"
STORAGE_PROVIDER="local"
```
Sacar `DATABASE_URL`/`DIRECT_URL` desde el dashboard de Supabase del
proyecto **RevoLab** → botón **Connect** → pestaña **ORM** → **Prisma**
(la UI de Supabase cambia cada tanto; si no está ahí, buscar en
Project Settings → Database). Necesitas ser miembro de la organización de
Supabase — pídele acceso a quien administre la cuenta.

**`frontend/.env.local`** (copia `frontend/.env.local.example` como base):
```env
DATABASE_URL="..."       # el mismo valor de arriba — Next.js corre
                          # @revolab/backend en su propio proceso
AUTH_SECRET="..."        # genera uno nuevo: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
STORAGE_PROVIDER="local"
```
`AUTH_SECRET` no necesita coincidir con el de producción — es solo para
firmar sesiones localmente, genera uno propio.

En Vercel, las variables de producción ya están cargadas en el proyecto
(Project Settings → Environment Variables); no hace falta tocarlas a menos
que cambie algo.

## 3. Base de datos

La base ya existe en Supabase con datos reales (no hace falta re-sembrar).
Si necesitas resetear/re-sembrar en un ambiente nuevo:

```bash
cd backend
pnpm exec prisma migrate dev   # aplica migraciones pendientes
pnpm exec prisma db seed       # siembra categorías, departamentos, rangos,
                                # usuario admin + instructor, curso piloto
```

Los usuarios de seed son `admin@rompecabeza.cl` e
`ariel.jeria@rompecabeza.cl` — la contraseña está en la constante
`SEED_PASSWORD` de `backend/prisma/seed.js` (no se repite acá para no
dejarla como texto plano en un repo público).

Para inspeccionar la base visualmente: `pnpm exec prisma studio` (desde
`backend/`).

## 4. Levantar en local

```bash
pnpm dev            # desde la raíz, levanta frontend/ en :3000
```

## 5. Cuentas externas involucradas

- **Supabase** (Postgres) — organización compartida, pedir acceso.
- **Vercel** (`revolab-dev.vercel.app`) — el ambiente **Production** sigue
  la rama `main`, no `develop` (ver nota en la Etapa 0 del checklist: el
  Root Directory del proyecto en Vercel debe ser `frontend`). Todo lo que
  llega a `develop` se despliega como **Preview**, no como producción.
- **Cloudflare R2** — todavía no existe la cuenta/bucket (pendiente, Etapa 8
  del checklist). El código de storage ya soporta activarlo apenas exista.

## 6. Flujo de ramas

`feature/*` → PR → `develop` (integración) → PR → `main` (producción). Es
normal que GitHub sugiera un PR de `main` de vuelta a `develop` después de
mergear a producción — es solo para sincronizar historiales, se puede
aceptar sin problema.

## 7. Qué revisar primero al retomar

Ver la sección **"Etapa 8 — Producción real y deuda técnica (pendiente)"**
en `revolab-checklist-backend.md` — es la lista priorizada de lo que sigue.
