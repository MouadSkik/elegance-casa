import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Gem } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { buildProductPageMessage, formatMAD, whatsappHref } from '@/lib/whatsapp';

// Next.js 16 parameters must be typed as an asynchronous Promise network container
interface PageProps {
  params: Promise<{ id: string }>;
}

// Pre-render every one of the 129 catalogue items at build time.
export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

// Fixed metadata generator to safely unwrap parameters asynchronously
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.id);
  if (!product) return {};
  return {
    title: `${product.name} — Élégance Casa`,
    description: `${product.name} — ${formatMAD(product.price)}. Joaillerie fine façonnée à Casablanca.`,
  };
}

// Same deterministic swatch system as ProductCard, so a piece without a
// photo yet reads identically here and in the gallery grid.
function placeholderTone(id: string) {
  const tones = [
    ['#EFE4D3', '#C5A880'],
    ['#E8DFD3', '#A8845C'],
    ['#F3ECE1', '#C5A880'],
    ['#E4D9C9', '#8C6B45'],
  ];
  let hash = 0;
  for (const ch of id) hash = (hash + ch.charCodeAt(0)) % tones.length;
  return tones[hash];
}

// Fixed main view container component using "async" and "await params"
export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = products.find((p) => p.id === resolvedParams.id);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category);
  const categoryLabel = category?.label ?? product.category;
  const [gradFrom, gradTo] = placeholderTone(product.id);
  const hasImage = Boolean(product.image);

  // The real inventory only distinguishes plating (or/argent), not a
  // multi-colour line, so this reflects the actual `material` field rather
  // than an invented "Or, Noir" style colourway.
  const colourOption = product.material.toLowerCase().includes('argent') ? 'Argent' : 'Or';

  const whatsappMessage = buildProductPageMessage(product, categoryLabel);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Breadcrumbs */}
      <p className="tracked-caps mb-8 text-[11px] text-ink-soft/70">
        <Link href="/" className="transition-colors hover:text-gold-deep">
          Maison
        </Link>
        {' / '}
        <Link href="/#catalogue" className="transition-colors hover:text-gold-deep">
          {categoryLabel}
        </Link>
        {' / '}
        <span className="text-ink">{product.name}</span>
      </p>

      <div className="md:grid md:grid-cols-2 md:gap-16">
        {/* Left — showcase image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border rule bg-linen-deep shadow-[0_20px_60px_rgba(28,26,23,0.10)]">
          {hasImage ? (
            <Image
              src={product.image as string}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: `linear-gradient(150deg, ${gradFrom}, ${gradTo})` }}
            >
              <Gem size={40} strokeWidth={1} className="text-ink/30" />
            </div>
          )}
        </div>

        {/* Right — details */}
        <div className="mt-10 flex flex-col md:mt-0">
          <h1 className="font-display text-3xl italic text-[#2E2724]">{product.name}</h1>
          <p className="mt-3 text-xl text-gold-deep">
            {product.price} MAD
            {product.priceEstimated && (
              <span className="ml-1 align-top text-xs text-ink-soft/60">*</span>
            )}
          </p>

          {/* Couleur */}
          <div className="mt-8">
            <p className="tracked-caps mb-3 text-xs text-ink-soft">Couleur</p>
            <label className="inline-block cursor-pointer">
              <input
                type="radio"
                name="couleur"
                value={colourOption}
                defaultChecked
                className="peer sr-only"
              />
              <span className="tracked-caps flex h-10 items-center rounded-full border-[0.5px] border-neutral-200 px-5 text-xs text-ink-soft transition-colors peer-checked:border-gold-deep peer-checked:text-gold-deep">
                {colourOption}
              </span>
            </label>
          </div>

          {/* Taille */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="tracked-caps mb-3 text-xs text-ink-soft">Taille</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size, i) => (
                  <label key={size} className="cursor-pointer">
                    <input
                      type="radio"
                      name="taille"
                      value={size}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <span className="flex h-10 w-12 items-center justify-center rounded-full border-[0.5px] border-neutral-200 text-xs text-ink-soft transition-colors peer-checked:border-gold-deep peer-checked:text-gold-deep">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Matière / Style */}
          <div className="mt-8 grid grid-cols-2 divide-x divide-neutral-200 border-y-[0.5px] border-neutral-200 py-4">
            <div className="pr-4">
              <p className="tracked-caps text-xs text-ink-soft/60">Matière</p>
              <p className="mt-1 text-sm text-ink">{product.material}</p>
            </div>
            <div className="pl-4">
              <p className="tracked-caps text-xs text-ink-soft/60">Style</p>
              <p className="mt-1 text-sm text-ink">{categoryLabel}</p>
            </div>
          </div>

          {/* Instant checkout */}
          <a
            href={whatsappHref(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-gold tracked-caps mt-10 flex w-full items-center justify-center rounded-full py-4 text-xs"
          >
            💬 Commander via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
