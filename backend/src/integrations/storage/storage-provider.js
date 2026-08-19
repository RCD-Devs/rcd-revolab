// Fábrica de storage: expone siempre el mismo contrato
// { upload(key, buffer, contentType?), getSignedUrl(key, options?), remove(key) }
// sin importar el proveedor activo. Cambiar STORAGE_PROVIDER en el .env
// alterna entre local y R2 sin tocar los endpoints que lo consumen.
import * as localStorage from './local-storage.js';
import * as r2Storage from './r2-storage.js';

export function getStorageProvider() {
  const provider = process.env.STORAGE_PROVIDER ?? 'local';
  return provider === 'r2' ? r2Storage : localStorage;
}
