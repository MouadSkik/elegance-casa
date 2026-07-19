import { getProducts } from '@/lib/products-store';
import { AddProductForm } from '@/components/admin/AddProductForm';
import { DeleteProductForm } from '@/components/admin/DeleteProductForm';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-linen px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="tracked-caps text-xs text-gold-deep">Élégance Casa — Interne</p>
        <h1 className="font-display mt-2 text-4xl italic text-ink">Console d&apos;inventaire</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {products.length} pièces actuellement dans le catalogue.
        </p>

        <div className="mt-12 grid gap-10 border-t rule pt-10 md:grid-cols-2">
          <section className="border rule bg-white/40 p-8">
            <p className="tracked-caps text-xs text-ink-soft">Opération A</p>
            <h2 className="font-display mt-1 text-2xl italic text-ink">Ajouter une pièce</h2>
            <AddProductForm />
          </section>

          <section className="border rule bg-white/40 p-8">
            <p className="tracked-caps text-xs text-ink-soft">Opération B</p>
            <h2 className="font-display mt-1 text-2xl italic text-ink">Retirer une pièce</h2>
            <DeleteProductForm />
          </section>
        </div>
      </div>
    </main>
  );
}
