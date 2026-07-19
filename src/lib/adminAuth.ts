import crypto from 'crypto';

// A small, dependency-free session scheme: sign an expiry timestamp with an
// HMAC keyed on the admin passcode itself. Rotating ADMIN_PASSCODE
// automatically invalidates every outstanding session — a nice side effect
// of not needing a second SESSION_SECRET env var for a tool this size.

export const SESSION_COOKIE = 'ea_admin_session';
export const SESSION_MAX_AGE_SECONDS = 6 * 60 * 60; // 6 hours

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a same-cost comparison so a mismatched length doesn't
    // return measurably faster than a mismatched value.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyPasscode(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  // Fail closed: an unset passcode must never mean "any input is accepted".
  if (!expected) return false;
  return safeCompare(candidate, expected);
}

function sign(payload: string): string {
  const secret = process.env.ADMIN_PASSCODE ?? '';
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  if (!safeCompare(signature, sign(payload))) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}
