'use client';

import { useState } from 'react';
import { addProductAction } from '@/app/admin/dashboard/actions';

export function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 🌟 CRITICAL: Completely freezes the page from trying to redirect and hitting a 404!
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await addProductAction(formData); // Sends data direct to Supabase background pipelines
      
      setStatus(result);
      if (result.success) {
        (e.target as HTMLFormElement).reset(); // Clears out your text fields automatically on success
      }
    } catch (err: any) {
      setStatus({ success: false, message: err.message || "Une erreur inconnue s'est produite." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
          Nom du produit / Titre *
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#c5a880]"
          placeholder="Ex: Bague Éclat Éternel"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
            Prix (MAD) *
          </label>
          <input
            type="number"
            name="price"
            required
            className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#c5a880]"
            placeholder="690"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
            Catégorie *
          </label>
          <select
            name="category"
            required
            className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#c5a880] appearance-none"
          >
            <option value="bagues">Bagues</option>
            <option value="boucles">Boucles</option>
            <option value="chaines">Chaînes</option>
            <option value="bracelets">Bracelets</option>
            <option value="parures">Parures</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
          Matière / Description
        </label>
        <input
          type="text"
          name="material"
          className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#c5a880]"
          placeholder="Ex: Plaqué or fin 18 carats"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
          Tailles (séparées par des virgules)
        </label>
        <input
          type="text"
          name="sizes"
          className="w-full rounded-xl border border-neutral-200 bg-white/50 px-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#c5a880]"
          placeholder="Ex: 52, 54, 56"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
          Photo du produit *
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-medium file:bg-[#c5a880]/10 file:text-[#c5a880] hover:file:bg-[#c5a880]/20 cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C5A880] text-white py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium shadow-md transition-all hover:bg-[#a8845c] disabled:opacity-50 active:scale-98 mt-2 cursor-pointer"
      >
        {loading ? 'Enregistrement...' : 'Ajouter au catalogue'}
      </button>

      {/* Dynamic inline real-time feedback status indicators */}
      {status && (
        <div className={`p-4 rounded-xl text-xs font-light tracking-wide mt-2 ${
          status.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {status.message}
        </div>
      )}
    </form>
  );
}
