'use server';

import { cookies } from 'next/headers';
import {
  verifyPasscode,
  createSessionToken,
  isValidSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/adminAuth';
import { addProductEntry, deleteProductEntry, type StoreActionResult } from '@/lib/products-store';

export async function verifyPasscodeAction(formData: FormData): Promise<{ success: boolean }> {
  const candidate = String(formData.get('passcode') ?? '');
  if (!verifyPasscode(candidate)) return { success: false };

  const token = createSessionToken();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/admin',
  });
  return { success: true };
}

// The layout already hides these forms from unauthenticated visitors, but a
// Server Action is a callable endpoint in its own right — re-check the
// session here rather than trusting the UI alone.
function requireSession(): StoreActionResult | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return { success: false, message: 'Session expirée ou non authentifiée — reconnectez-vous.' };
  }
  return null;
}

export async function addProductAction(formData: FormData): Promise<StoreActionResult> {
  const authError = requireSession();
  if (authError) return authError;
  return addProductEntry(formData);
}

export async function deleteProductAction(formData: FormData): Promise<StoreActionResult> {
  const authError = requireSession();
  if (authError) return authError;
  const identifier = String(formData.get('identifier') ?? '').trim();
  return deleteProductEntry(identifier);
}
