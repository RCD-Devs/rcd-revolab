import sharp from "sharp";

async function processLogo(input, output, targetWidth) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r < 45 && g < 45 && b < 45) {
      data[i + 3] = 0;
    }
  }

  let pipeline = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).trim();

  if (targetWidth) {
    pipeline = pipeline.resize({ width: targetWidth });
  }

  await pipeline.webp({ quality: 100, alphaQuality: 100, lossless: true }).toFile(output);

  const meta = await sharp(output).metadata();
  console.log(`${output}: ${meta.width}x${meta.height}, alpha=${meta.hasAlpha}`);
}

await processLogo(
  "public/images/revolab-logo-source.png",
  "public/images/revolab-logo-desktop.webp"
);
await processLogo(
  "public/images/revolab-logo-source.png",
  "public/images/revolab-logo-mobile.webp",
  139
);
