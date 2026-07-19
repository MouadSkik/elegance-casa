'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Header() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b rule bg-linen/90 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-6 py-5">
        <motion.a
          href="#top"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-1"
        >
          <Image
            src="/Logo.png"
            alt="Élégance Casa"
            width={160}
            height={56}
            priority
            className="h-10 w-auto object-contain"
          />
          <span className="tracked-caps text-[10px] text-ink-soft">
            Joaillerie fine — Casablanca
          </span>
        </motion.a>

        <button
          onClick={openCart}
          aria-label="Ouvrir le panier"
          className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-ink transition-colors hover:text-gold-deep"
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-medium text-linen">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
