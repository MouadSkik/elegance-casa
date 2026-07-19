'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, MessageCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatMAD, buildProductMessage, whatsappHref } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

const LENS_SIZE = 128;
const ZOOM = 2.2;

// Deterministic placeholder tone derived from the product id, so the
// gallery reads as an intentional swatch system rather than random noise.
// Swap `product.image` for real photography and this path is skipped.
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

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const [broken, setBroken] = useState(!product.image);
  const [hovering, setHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [gradFrom, gradTo] = placeholderTone(product.id);
  const hasImage = Boolean(product.image) && !broken;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({
      x,
      y,
      bgX: (x / rect.width) * 100,
      bgY: (y / rect.height) * 100,
    });
  };

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: 'easeOut' }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block">
      <div
        ref={frameRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={onMove}
        className="relative aspect-[4/5] cursor-crosshair overflow-hidden rounded-sm border rule bg-linen-deep"
      >
        {hasImage ? (
          <Image
            src={product.image as string}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            onError={() => setBroken(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ background: `linear-gradient(150deg, ${gradFrom}, ${gradTo})` }}
          >
            <Gem size={28} strokeWidth={1} className="text-ink/30" />
          </div>
        )}

        {product.isNew && (
          <span className="tracked-caps absolute left-3 top-3 bg-ink px-2 py-1 text-[9px] text-linen">
            Nouveau
          </span>
        )}
        {onSale && (
          <span className="tracked-caps absolute right-3 top-3 bg-gold px-2 py-1 text-[9px] text-linen">
            Promo
          </span>
        )}

        {/* Signature interaction: a jeweler's-loupe lens that follows the
            cursor, magnifying the piece the way you'd inspect it in a
            showroom vitrine. */}
        <AnimatePresence>
          {hovering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="pointer-events-none absolute z-10 hidden rounded-full border-2 border-gold shadow-[0_6px_24px_rgba(28,26,23,0.25)] md:block"
              style={{
                width: LENS_SIZE,
                height: LENS_SIZE,
                left: lensPos.x - LENS_SIZE / 2,
                top: lensPos.y - LENS_SIZE / 2,
                backgroundColor: !hasImage ? gradTo : undefined,
                backgroundImage: hasImage ? `url(${product.image})` : undefined,
                backgroundSize: `${ZOOM * 100}%`,
                backgroundPosition: `${lensPos.bgX}% ${lensPos.bgY}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
          <p className="text-xs text-ink-soft">{product.material}</p>
          {product.sizes && product.sizes.length > 0 && (
            <p className="mt-1 text-[11px] tracking-wide text-ink-soft/70">
              Tailles {product.sizes.join(' · ')}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-medium text-gold-deep">
            {formatMAD(product.price)}
            {product.priceEstimated && (
              <span className="ml-1 align-top text-[10px] text-ink-soft/60">*</span>
            )}
          </p>
          {onSale && (
            <p className="text-xs text-ink-soft/60 line-through">
              {formatMAD(product.compareAtPrice!)}
            </p>
          )}
        </div>
      </div>
      </Link>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => addItem(product)}
          className="flex-1 border rule py-2 text-xs tracked-caps text-ink transition-colors hover:border-gold-deep hover:text-gold-deep"
        >
          Ajouter au panier
        </button>
        <a
          href={whatsappHref(buildProductMessage(product))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Commander ${product.name} via WhatsApp`}
          className="flex shrink-0 items-center justify-center border rule px-3 text-ink-soft transition-colors hover:border-gold-deep hover:text-gold-deep"
        >
          <MessageCircle size={16} strokeWidth={1.5} />
        </a>
      </div>
    </motion.article>
  );
}
