const ADMIN_PASSWORD = "yombal2026";

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
