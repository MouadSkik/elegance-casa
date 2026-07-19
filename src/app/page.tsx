import { Storefront } from '@/components/storefront';
import { Catalogue } from '@/components/Catalogue';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
export const dynamic = 'force-dynamic';


export default function Home() {
  return (
    <>
      <Storefront />
      <main>
        <Catalogue />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
