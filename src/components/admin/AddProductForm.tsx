'use client';

import { useRef, useState, useTransition } from 'react';
import { addProductAction } from '@/app/admin/dashboard/actions';

const CATEGORIES = [
  { slug: 'bagues', label: 'Bagues' },
  { slug: 'boucles', label: 'Boucles' },
  { slug: 'chaines', label: 'Chaînes' },
  { slug: 'bracelets', label: 'Bracelets' },
  { slug: 'parures', label: 'Parures' },
];

const inputClass =
  'w-full border rule bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-gold-deep';

export function AddProductForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.set('image', imageFile);

    startTransition(async () => {
      const result = await addProductAction(formData);
      setMessage({ type: result.success ? 'success' : 'error', text: result.message });
      if (result.success) {
        formRef.current?.reset();
        setImageFile(null);
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
      <Field label="Nom du produit / Titre">
        <input name="name" required className={inputClass} placeholder="Bague Royale Zirée" />
      </Field>

      <Field label="ID / Slug unique">
        <input name="id" required className={inputClass} placeholder="bagues-025" />
      </Field>

      <Field label="Catégorie">
        <select name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choisir…
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Prix de vente (MAD)">
        <input name="price" type="number" min="1" step="1" required className={inputClass} placeholder="690" />
      </Field>

      <Field label="Formulation matière">
        <input name="material" required className={inputClass} placeholder="Or Fin 18k" />
      </Field>

      <Field label="Tailles (séparées par des virgules)">
        <input name="sizes" className={inputClass} placeholder="50, 52, 54" />
      </Field>

      <div>
        <p className="tracked-caps mb-2 text-xs text-ink-soft">Photo</p>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 border rule border-dashed px-4 py-8 text-center text-xs text-ink-soft transition-colors ${
            dragActive ? 'border-gold-deep bg-linen-deep/40' : ''
          }`}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {imageFile ? (
            <span className="text-ink">{imageFile.name}</span>
          ) : (
            <span>Glissez une image ici, ou cliquez pour parcourir</span>
          )}
        </label>
      </div>

      {message && (
        <p className={`text-xs ${message.type === 'success' ? 'text-gold-deep' : 'text-red-700'}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="pill-gold tracked-caps mt-2 rounded-full py-3 text-xs disabled:opacity-50"
      >
        {pending ? 'Ajout en cours…' : 'Ajouter au catalogue'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="tracked-caps mb-2 block text-xs text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
