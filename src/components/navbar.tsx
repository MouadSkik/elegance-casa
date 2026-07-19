'use client';

import Link from 'next/link';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { showroomTabs, type ShowroomTab } from '@/data/products';

type NavbarProps = {
  activeTab: ShowroomTab['label'];
  cartQuantity: number;
  mobileOpen: boolean;
  onTabChange: (tab: ShowroomTab['label']) => void;
  onCartOpen: () => void;
  onMobileToggle: () => void;
};

function FilterTabs({ activeTab, onTabChange, mobile = false }: Pick<NavbarProps, 'activeTab' | 'onTabChange'> & { mobile?: boolean }) {
  return (
    <nav
      className={`flex ${mobile ? 'flex-col gap-2' : 'flex-wrap items-center justify-center gap-3'}`}
      aria-label="Collections"
      role="tablist"
    >
      {showroomTabs.map((tab) => {
        const active = activeTab === tab.label;

        return (
          <button
            key={tab.label}
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.label)}
            className={`group relative overflow-hidden rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors sm:text-xs ${
              active
                ? 'border-gold/70 bg-charcoal text-cream'
                : 'border-charcoal/10 bg-cream/70 text-charcoal/58 hover:border-charcoal/20 hover:text-charcoal'
            }`}
          >
            <span className="relative z-10">{tab.label}</span>
            {active && (
              <motion.span
                layoutId="active-filter"
                className="absolute inset-x-0 bottom-0 h-[2px] bg-gold"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(197,168,128,0.18),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        );
      })}
    </nav>
  );
}

export function Navbar({ activeTab, cartQuantity, mobileOpen, onTabChange, onCartOpen, onMobileToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/82 backdrop-blur-2xl">
      <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 py-4 md:px-10">
        <button className="justify-self-start rounded-full p-2 lg:hidden" onClick={onMobileToggle} aria-label="Ouvrir la navigation">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="mx-auto flex justify-self-center">
          <Image
            src="/products/Logo.png"
            alt="Élégance Casa"
            width={320}
            height={120}
            priority
            className="mx-auto block h-12 w-auto object-contain sm:h-14 md:h-16"
          />
        </Link>

        <button
          onClick={onCartOpen}
          className="relative justify-self-end rounded-full border border-charcoal/10 bg-cream/80 p-2.5 text-charcoal transition hover:border-gold/70 hover:bg-charcoal hover:text-cream"
          aria-label="Ouvrir le panier"
        >
          <ShoppingBag size={19} strokeWidth={1.45} />
          {cartQuantity > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[9px] font-medium text-charcoal shadow-md shadow-charcoal/10">
              {cartQuantity}
            </span>
          )}
        </button>
      </div>

      <div className="hidden border-t border-charcoal/10 px-5 py-4 lg:block md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <FilterTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="border-t border-charcoal/10 bg-cream/95 px-5 py-5 lg:hidden"
          >
            <FilterTabs activeTab={activeTab} onTabChange={onTabChange} mobile />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
