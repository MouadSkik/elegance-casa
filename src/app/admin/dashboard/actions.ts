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
  
  // FIXED: Await the async cookie store container before modifying entries
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/admin',
  });
  return { success: true };
}

// FIXED: Converted to an async function to gracefully await the incoming request cookies
async function requireSession(): Promise<StoreActionResult | null> {
  // FIXED: Await the cookie store container to fetch the session token safely
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return { success: false, message: 'Session expirée ou non authentifiée — reconnectez-vous.' };
  }
  return null;
}

export async function addProductAction(formData: FormData): Promise<StoreActionResult> {
  // FIXED: Awaited the async authorization session function block check
  const authError = await requireSession();
  if (authError) return authError;
  return addProductEntry(formData);
}

export async function deleteProductAction(formData: FormData): Promise<StoreActionResult> {
  // FIXED: Awaited the async authorization session function block check
  const authError = await requireSession();
  if (authError) return authError;
  const identifier = String(formData.get('identifier') ?? '').trim();
  return deleteProductEntry(identifier);
}
