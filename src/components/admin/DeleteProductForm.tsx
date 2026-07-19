'use client';

import { useState, useTransition } from 'react';
import { deleteProductAction } from '@/app/admin/dashboard/actions';

export function DeleteProductForm() {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (!window.confirm(`Retirer définitivement "${value.trim()}" du catalogue ?`)) return;

    const formData = new FormData();
    formData.set('identifier', value.trim());

    startTransition(async () => {
      const result = await deleteProductAction(formData);
      setMessage({ type: result.success ? 'success' : 'error', text: result.message });
      if (result.success) setValue('');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
      <label className="block">
        <span className="tracked-caps mb-2 block text-xs text-ink-soft">
          Titre du produit ou ID / slug
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="w-full border rule bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-gold-deep"
          placeholder="bagues-014 ou « Bague Royale Zirée »"
        />
      </label>

      {message && (
        <p className={`text-xs ${message.type === 'success' ? 'text-gold-deep' : 'text-red-700'}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="tracked-caps mt-2 rounded-full border border-red-700/40 py-3 text-xs text-red-700 transition-colors hover:bg-red-700 hover:text-linen disabled:opacity-50"
      >
        {pending ? 'Suppression…' : 'Retirer du catalogue'}
      </button>
    </form>
  );
}
