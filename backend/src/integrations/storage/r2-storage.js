// Storage en Cloudflare R2 (SDK compatible con S3). Se activa con
// STORAGE_PROVIDER=r2 una vez que existan las credenciales del bucket.
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl as presignUrl } from '@aws-sdk/s3-request-presigner';

let client;

function getClient() {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
}

export async function upload(key, buffer, contentType) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  return { key };
}

export async function getSignedUrl(key, { expiresInSeconds = 3600 } = {}) {
  const command = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key });
  return presignUrl(getClient(), command, { expiresIn: expiresInSeconds });
}

// URL prefirmada de subida: el navegador hace PUT directo contra R2 con esta
// URL, sin pasar el archivo por una función serverless de Vercel (que corta
// el body en 4.5 MB). Requiere que el bucket tenga CORS habilitado para el
// origen del sitio (ver R2_PUBLIC_URL en .env.example).
export async function getUploadUrl(key, contentType, { expiresInSeconds = 900 } = {}) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  return presignUrl(getClient(), command, { expiresIn: expiresInSeconds });
}

export async function exists(key) {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
    return true;
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) return false;
    throw error;
  }
}

// URL pública estable (no expira) para contenido servido desde un bucket con
// acceso público habilitado: portadas de curso, avatares y video de lección.
// Requiere R2_PUBLIC_URL (el dominio r2.dev del bucket o un dominio propio).
// No usar para contenido sensible — para eso, getSignedUrl.
export async function getPublicUrl(key) {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '');
  return `${base}/${key}`;
}

export async function remove(key) {
  await getClient().send(
    new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
  );
}
