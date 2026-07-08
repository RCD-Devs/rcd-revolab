This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Convenciones de código

El proyecto usa **EditorConfig**, **Prettier** y **ESLint** para mantener el mismo estilo entre desarrolladores.

| Herramienta  | Archivo             | Qué define                                |
| ------------ | ------------------- | ----------------------------------------- |
| EditorConfig | `.editorconfig`     | Indentación (2 espacios), fin de línea LF |
| Prettier     | `.prettierrc`       | Comillas, punto y coma, ancho de línea    |
| ESLint       | `eslint.config.mjs` | Reglas de calidad Next.js/React           |

### Scripts disponibles

```bash
pnpm format          # Formatea todo el código
pnpm format:check    # Verifica formato sin modificar archivos
pnpm lint            # Ejecuta ESLint
pnpm lint:fix        # Corrige problemas de ESLint automáticamente
```

Antes de subir cambios, ejecuta `pnpm format` y `pnpm lint`.

### Extensiones recomendadas (Cursor / VS Code)

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Opcional: activar **Format on Save** en tu editor local para formatear al guardar.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
