// Storage local (filesystem) para desarrollo. Guarda archivos fuera del
// repo trackeado (backend/.storage/) y se sirven vía el Route Handler
// frontend/src/app/api/media/[...path]/route.js.
import { mkdir, writeFile, readFile, unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_ROOT = path.resolve(__dirname, '../../../.storage');

function resolveKeyPath(key) {
  const safeKey = key.replace(/^\/+/, '');
  const fullPath = path.resolve(STORAGE_ROOT, safeKey);

  if (!fullPath.startsWith(STORAGE_ROOT)) {
    throw new Error(`Storage key inválida: ${key}`);
  }

  return fullPath;
}

export async function upload(key, buffer) {
  const fullPath = resolveKeyPath(key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, buffer);
  return { key };
}

// El storage local no firma URLs; expone la key como ruta del Route Handler que sirve el archivo.
export async function getSignedUrl(key) {
  return `/api/media/${key.replace(/^\/+/, '')}`;
}

// Local no distingue público/privado: mismo Route Handler para ambos.
export async function getPublicUrl(key) {
  return getSignedUrl(key);
}

// Equivalente local al PUT prefirmado de R2: en dev no hay bucket real, así
// que la "subida directa" apunta a un Route Handler propio que escribe en
// filesystem (frontend/src/app/api/media-upload/[...path]/route.js).
export async function getUploadUrl(key) {
  return `/api/media-upload/${key.replace(/^\/+/, '')}`;
}

export async function exists(key) {
  try {
    await stat(resolveKeyPath(key));
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function readFileByKey(key) {
  return readFile(resolveKeyPath(key));
}

export async function remove(key) {
  await unlink(resolveKeyPath(key)).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
}
