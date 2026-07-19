'use client';

import { useState, useEffect } from 'react';
import { addProductAction, deleteProductAction } from './actions';
import { getProducts } from '@/lib/products-store';

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState<number>(0);
  const [addLoading, setAddLoading] = useState(false);
  const [addStatus, setAddStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getProducts();
        setProductCount(data.length);
      } catch (err) {
        console.error("Error loading statistics:", err);
      }
    }
    loadStats();
  }, [addStatus, deleteStatus]);

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setAddLoading(true);
    setAddStatus(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await addProductAction(formData);
      setAddStatus(result);
      if (result.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      setAddStatus({ success: false, message: err.message || "Une erreur s'est produite." });
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDeleteProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteLoading(true);
    setDeleteStatus(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await deleteProductAction(formData);
      setDeleteStatus(result);
      if (result.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      setDeleteStatus({ success: false, message: err.message || "Une erreur s'est produite." });
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcfaf4] px-6 py-14 md:py-20 font-sans">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#a8845c] font-light">
          Élégance Casa — Interne
        </p>
        <h1 className="font-display mt-2 text-4xl font-light italic text-[#111111] tracking-wide">
          Console d&apos;inventaire
        </h1>
        <p className="mt-2 text-xs font-light text-neutral-400">
          {productCount} pièces actuellement configurées dans votre base Supabase cloud.
        </p>

        <div className="mt-12 grid gap-10 border-t border-[#e3d9bf]/30 pt-10 md:grid-cols-2">
          
          {/* ADD PRODUCT MODULE */}
          <section className="rounded-[1.75rem] border border-[#e3d9bf]/20 bg-white/50 p-8 shadow-sm">
            <p className="text-[9px] uppercase tracking-widest text-[#a8845c] font-light">Opération A</p>
            <h2 className="font-display mt-1 text-2xl font-light italic text-[#111111] tracking-wide">
              Ajouter une pièce
            </h2>
            
            <form onSubmit={handleAddProduct} className="mt-6 flex flex-col space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
                  Nom du produit / Titre *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
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
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
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
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
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
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
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
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
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
                  required
                  className="w-full text-xs text-neutral-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-[#C5A880] text-white py-3 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all cursor-pointer"
              >
                {addLoading ? 'Enregistrement...' : 'Ajouter au catalogue'}
              </button>

              {addStatus && (
                <div className={`p-4 rounded-xl text-xs font-light tracking-wide mt-2 ${
                  addStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {addStatus.message}
                </div>
              )}
            </form>
          </section>

          {/* REMOVE PRODUCT MODULE */}
          <section className="rounded-[1.75rem] border border-[#e3d9bf]/20 bg-white/50 p-8 shadow-sm">
            <p className="text-[9px] uppercase tracking-widest text-[#a8845c] font-light">Opération B</p>
            <h2 className="font-display mt-1 text-2xl font-light italic text-[#111111] tracking-wide">
              Retirer une pièce
            </h2>
            
            <form onSubmit={handleDeleteProduct} className="mt-6 flex flex-col space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-light mb-1">
                  Nom du produit ou ID unique *
                </label>
                <input
                  type="text"
                  name="identifier"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
                  placeholder="Ex: bague-royal-coque"
                />
              </div>

              <button
                type="submit"
                disabled={deleteLoading}
                className="w-full bg-red-600 text-white py-3 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all cursor-pointer"
              >
                {deleteLoading ? 'Suppression...' : 'Supprimer du catalogue'}
              </button>

              {deleteStatus && (
                <div className={`p-4 rounded-xl text-xs font-light tracking-wide mt-2 ${
                  deleteStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {deleteStatus.message}
                </div>
              )}
            </form>
          </section>

        </div>
      </div>
    </main>
  );
}
