import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Gem, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { buildProductPageMessage, formatMAD, whatsappHref } from '@/lib/whatsapp';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.id);
  if (!product) return {};
  return {
    title: `${product.name} — Élégance Casa`,
    description: `${product.name} — ${formatMAD(product.price)}. Joaillerie fine façonnée à Casablanca.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.id);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category);
  const categoryLabel = category?.label ?? product.category;
  const hasImage = Boolean(product.image);
  const colourOption = product.material.toLowerCase().includes('argent') ? 'Argent 925' : 'Or Fin 18k';
  const whatsappMessage = buildProductPageMessage(product, categoryLabel);

  return (
    <main className="mx-auto max-w-7xl bg-[#fcfaf4] px-6 py-16 md:py-24 animate-[fadeIn_0.8s_ease-out]">
      {/* Editorial Micro Breadcrumbs */}
      <div className="mb-12 flex items-center justify-between border-b border-[#e3d9bf]/20 pb-6">
        <p className="font-sans text-[10px] tracking-[0.24em] uppercase text-neutral-400 font-light flex items-center gap-2">
          <Link href="/" className="transition-colors hover:text-[#c5a880] flex items-center gap-1">
            <ArrowLeft size={10} /> Maison
          </Link>
          {' / '}
          <span className="text-neutral-500">{categoryLabel}</span>
          {' / '}
          <span className="text-[#111111] font-medium">{product.name}</span>
        </p>
        <Link href="/" className="font-sans text-[10px] tracking-widest uppercase text-[#c5a880] font-light hover:underline">
          Retour au catalogue
        </Link>
      </div>

      {/* Main Luxury 2-Column Balanced Partition Deck Grid */}
      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-16 lg:gap-x-24 items-start">
        
        {/* Left Aspect Grid: Showcase Image Canvas Frame with Micro Fades */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-[#f2ebd4] shadow-[0_32px_90px_rgba(28,26,23,0.06)] group border border-[#e3d9bf]/20">
          {hasImage ? (
            <Image
              src={product.image as string}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-103"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f2ede5]">
              <Gem size={44} strokeWidth={1} className="text-neutral-300" />
            </div>
          )}
          <span className="absolute top-6 left-6 bg-[#C5A880] text-[#fcfaf4] text-[9px] tracking-[0.2em] font-light uppercase px-3 py-1 rounded-full shadow-sm z-20">
            SOLDE
          </span>
        </div>

        {/* Right Aspect Grid: Fine Typography Spec Sheet Matrix */}
        <div className="flex flex-col space-y-8 md:pt-4">
          <div>
            <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#a8845c] font-light mb-2">
              Collection Privée
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-light italic text-[#111111] tracking-wide leading-tight">
              {product.name}
            </h1>
            <p className="mt-4 font-sans text-xl font-medium text-[#a8845c] tracking-wide">
              {product.price} MAD
            </p>
          </div>

          {/* Description Paragraph Container */}
          <p className="font-sans text-[13px] font-light leading-relaxed text-neutral-500 max-w-xl">
            Une silhouette claire, précise, façonnée pour capturer la lumière du quotidien. La sophistication à l'état pur, sans aucun excès.
          </p>

          {/* Selective Custom Variant Attribute Chips */}
          <div className="space-y-6 pt-4 border-t border-[#e3d9bf]/20">
            <div>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light mb-3">Couleur</p>
              <div className="inline-block rounded-full border border-[#c5a880] bg-[#FAF6F0] px-5 py-2 text-[11px] tracking-widest text-[#a8845c] font-light">
                ✨ {colourOption}
              </div>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light mb-3">Tailles disponibles / Sizing</p>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => (
                    <span key={size} className="flex h-9 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white font-sans text-xs text-neutral-500 font-light shadow-sm select-none">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata Split Matrix Layout Rule */}
          <div className="grid grid-cols-2 divide-x divide-[#e3d9bf]/30 border-y border-[#e3d9bf]/20 py-5">
            <div className="pr-4 space-y-0.5">
              <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-light">Matière première</p>
              <p className="font-sans text-[13px] font-light text-[#111111]">{product.material}</p>
            </div>
            <div className="pl-6 space-y-0.5">
              <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-light">Ligne stylistique</p>
              <p className="font-sans text-[13px] font-light text-[#111111]">{categoryLabel}</p>
            </div>
          </div>

          {/* Premium High-End Instant Checkout Order Module Button Accent */}
          <div className="pt-2">
            <a
              href={whatsappHref(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-[#C5A880] py-4.5 font-sans text-[11px] font-medium tracking-[0.24em] uppercase text-white shadow-[0_16px_40px_rgba(197,168,128,0.2)] transition-all duration-300 hover:bg-[#a8845c] hover:shadow-[0_20px_50px_rgba(168,132,92,0.3)] active:scale-98"
            >
              💬 Commander via WhatsApp
            </a>
          </div>

          {/* Secure Trust Indicators Footnote Stack */}
          <div className="flex items-center gap-6 pt-4 text-[10px] text-neutral-400 font-light font-sans tracking-wide">
            <span className="flex items-center gap-1.5"><Truck size={12} className="text-[#c5a880]" /> Livraison rapide sur tout le Maroc</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#c5a880]" /> Écrin de luxe &amp; Certificat inclus</span>
          </div>

          {/* Editorial Brand Cursive Monologue Footnote Block */}
          <div className="border-t border-[#e3d9bf]/20 pt-8 mt-4">
            <h4 className="font-display text-lg italic font-light text-[#2E2724] mb-2">À propos de la Maison</h4>
            <p className="font-sans text-[11px] font-light leading-relaxed text-neutral-400 italic">
              Élégance Casa est une maison de haute joaillerie fine façonnant ses collections avec soin. Chaque pièce sélectionnée incarne un vocabulaire esthétique unique — une présence discrète, une sensation précieuse à porter au quotidien.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
