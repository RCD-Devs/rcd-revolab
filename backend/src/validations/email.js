export const ALLOWED_EMAIL_DOMAINS = ['rompecabeza.cl', 'somosmind.com', 'souldigital.cl'];

export function isAllowedInstitutionalEmail(email) {
  const domain = email?.split('@')[1]?.toLowerCase();
  return Boolean(domain) && ALLOWED_EMAIL_DOMAINS.includes(domain);
}
