import sharp from "sharp";
import { readdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");

const RASTER_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const SKIP_FILES = new Set(["revolab-logo.webp"]);

const MAX_WIDTH_RULES = [
  { pattern: /profile\/avatar/i, width: 256 },
  { pattern: /profile\/course-/i, width: 640 },
  { pattern: /profile\/rank-bg/i, width: 1280 },
  { pattern: /home\/instructor-/i, width: 400 },
  { pattern: /home\/course-/i, width: 800 },
  { pattern: /home\/hero-bg/i, width: 1920 },
  { pattern: /team\//i, width: 640 },
];

const WEBP_OPTIONS = { quality: 82, effort: 6, smartSubsample: true };
const PNG_OPTIONS = { compressionLevel: 9, adaptiveFiltering: true };
const JPEG_OPTIONS = { quality: 82, mozjpeg: true };

const dryRun = process.argv.includes("--dry-run");

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getMaxWidth(relativePath) {
  for (const rule of MAX_WIDTH_RULES) {
    if (rule.pattern.test(relativePath)) {
      return rule.width;
    }
  }

  return 1920;
}

async function collectRasterFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectRasterFiles(fullPath)));
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (RASTER_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function encodeImage(inputBuffer, extension, meta, maxWidth) {
  let pipeline = sharp(inputBuffer, { failOn: "none" });

  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  switch (extension) {
    case ".webp":
      return pipeline.webp(WEBP_OPTIONS).toBuffer();
    case ".png":
      return pipeline.png(PNG_OPTIONS).toBuffer();
    default:
      return pipeline.jpeg(JPEG_OPTIONS).toBuffer();
  }
}

async function optimizeFile(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(IMAGES_DIR, filePath).replace(/\\/g, "/");

  if (SKIP_FILES.has(fileName) || fileName.includes("-source.")) {
    console.log(`omitido: ${relativePath}`);
    return null;
  }

  const beforeSize = (await stat(filePath)).size;
  const inputBuffer = await readFile(filePath);
  const meta = await sharp(inputBuffer, { failOn: "none" }).metadata();
  const extension = path.extname(filePath).toLowerCase();
  const maxWidth = getMaxWidth(relativePath);

  const outputBuffer = await encodeImage(inputBuffer, extension, meta, maxWidth);
  const afterSize = outputBuffer.length;

  if (afterSize >= beforeSize) {
    console.log(`sin mejora: ${relativePath} (${formatBytes(beforeSize)})`);
    return null;
  }

  if (!dryRun) {
    await writeFile(filePath, outputBuffer);
  }

  const saved = beforeSize - afterSize;
  const savedPercent = ((saved / beforeSize) * 100).toFixed(1);
  const prefix = dryRun ? "[dry-run] " : "";

  console.log(
    `${prefix}${relativePath}: ${formatBytes(beforeSize)} → ${formatBytes(afterSize)} (-${savedPercent}%)`,
  );

  return { beforeSize, afterSize, saved };
}

async function main() {
  const files = await collectRasterFiles(IMAGES_DIR);

  if (files.length === 0) {
    console.log("No se encontraron imágenes raster en public/images.");
    return;
  }

  console.log(
    dryRun
      ? "Simulación de optimización en public/images...\n"
      : "Optimizando imágenes en public/images...\n",
  );

  const totals = { beforeSize: 0, afterSize: 0, saved: 0, optimized: 0 };

  for (const filePath of files) {
    const result = await optimizeFile(filePath);

    if (!result) {
      continue;
    }

    totals.beforeSize += result.beforeSize;
    totals.afterSize += result.afterSize;
    totals.saved += result.saved;
    totals.optimized += 1;
  }

  console.log("\n--- Resumen ---");
  console.log(`Archivos optimizados: ${totals.optimized}/${files.length}`);

  if (totals.optimized > 0) {
    console.log(
      `Ahorro total: ${formatBytes(totals.saved)} (${formatBytes(totals.beforeSize)} → ${formatBytes(totals.afterSize)})`,
    );
  }

  if (dryRun) {
    console.log("\nEjecuta `pnpm run optimize:images` para aplicar los cambios.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
