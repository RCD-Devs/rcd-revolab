const ACCENT_MAP = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ü: 'u',
  ñ: 'n',
  Á: 'a',
  É: 'e',
  Í: 'i',
  Ó: 'o',
  Ú: 'u',
  Ü: 'u',
  Ñ: 'n',
};

function removeAccents(text) {
  return text.replace(/[áéíóúüñÁÉÍÓÚÜÑ]/g, (char) => ACCENT_MAP[char] ?? char);
}

export function slugify(text) {
  return removeAccents(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
