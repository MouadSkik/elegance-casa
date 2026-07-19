'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPasscodeAction } from '@/app/admin/dashboard/actions';

export function PasscodeGate() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [denied, setDenied] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('passcode', value);
    startTransition(async () => {
      const result = await verifyPasscodeAction(formData);
      if (result.success) {
        setDenied(false);
        router.refresh();
      } else {
        setDenied(true);
        setValue('');
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-6">
      <div className="w-full max-w-sm text-center">
        <p className="tracked-caps text-xs text-gold-deep">Élégance Casa</p>
        <h1 className="font-display mt-2 text-3xl italic text-ink">Console d&apos;administration</h1>
        <p className="mt-2 text-sm text-ink-soft">Accès réservé — code requis.</p>

        {denied && (
          <div className="mt-8 border rule bg-linen-deep/60 px-6 py-6">
            <p className="tracked-caps text-xs text-ink-soft">Accès refusé</p>
            <p className="mt-2 text-sm text-ink-soft">Le code saisi est incorrect. Réessayez.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="password"
            required
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Code d'accès"
            className="border rule bg-transparent px-4 py-3 text-center text-sm tracking-widest focus:outline-none focus:border-gold-deep"
          />
          <button
            type="submit"
            disabled={pending}
            className="pill-gold tracked-caps rounded-full py-3 text-xs disabled:opacity-50"
          >
            {pending ? 'Vérification…' : 'Entrer'}
          </button>
        </form>
      </div>
    </main>
  );
}
