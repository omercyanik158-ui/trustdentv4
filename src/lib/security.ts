const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;

export function sanitizeText(input: string, maxLength = 200): string {
  return input
    .replace(CONTROL_CHARS_REGEX, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(input: string): string {
  return sanitizeText(input, 120).toLowerCase();
}

export function sanitizePhone(input: string): string {
  return input.replace(/[^\d+\-() ]/g, "").slice(0, 30).trim();
}
