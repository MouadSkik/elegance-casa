import { cookies } from 'next/headers';
import { isValidSessionToken, SESSION_COOKIE } from '@/lib/adminAuth';
import { PasscodeGate } from '@/components/admin/PasscodeGate';

export const dynamic = 'force-dynamic';

// FIXED: Converted to an async Server Component to allow cookie resolution
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  
  // FIXED: Await the async cookie store container before reading properties
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!isValidSessionToken(token)) {
    return <PasscodeGate />;
  }

  return <>{children}</>;
}
