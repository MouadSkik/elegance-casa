import { cookies } from 'next/headers';
import { isValidSessionToken, SESSION_COOKIE } from '@/lib/adminAuth';
import { PasscodeGate } from '@/components/admin/PasscodeGate';

export const dynamic = 'force-dynamic';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(SESSION_COOKIE)?.value;

  if (!isValidSessionToken(token)) {
    return <PasscodeGate />;
  }

  return <>{children}</>;
}
