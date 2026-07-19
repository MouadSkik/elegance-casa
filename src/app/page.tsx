import { Storefront } from '@/components/storefront';
import { Catalogue } from '@/components/Catalogue';
import { getProducts } from '@/lib/products-store';

// Force Next.js to skip all static caching pipelines and read fresh items from Supabase on every visit
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch your live product data catalog matrix from your Supabase cloud database tables
  const liveProducts = await getProducts();

  return (
    <main className="min-h-screen bg-[#fcfaf4]">
      {/* Editorial branding showcase elements banner loops */}
      <Storefront />
      
      {/* Product list collections grid deck block wrapper layout */}
      <div className="bg-[#fcfaf4]">
        <Catalogue initialProducts={liveProducts} />
      </div>
    </main>
  );
}
