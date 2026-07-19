'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';

const NAV_LINKS = ['MAISON', 'TOUS', 'COLLECTIONS', 'CASABLANCA'];

function scrollToCatalogue() {
  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
}

/* 1. Infinite moving header marquee, powered by framer-motion */
export function MarqueeBanner() {
  const MARQUEE_TEXT = " ✨ LIVRAISON DISPONIBLE SUR TOUT LE MAROC — COMMANDEZ DIRECTEMENT VIA WHATSAPP ✨ SOLDES D'ÉTÉ — JUSQU'À -30% SUR UNE SÉLECTION DE BIJOUX EXCLUSIFS ";

  return (
    <div className="overflow-hidden border-b border-[#D4A393]/20 py-2.5 w-full select-none relative z-50" style={{ backgroundColor: '#FAF6F0' }}>
      <motion.div
        className="flex w-max shrink-0 whitespace-nowrap text-[11px] font-light uppercase tracking-[0.24em] flex-nowrap"
        style={{ color: '#2E2724' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ ease: 'linear', duration: 35, repeat: Infinity }}
      >
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} className="inline-block shrink-0 px-6">
            {MARQUEE_TEXT}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* 2. Minimalist floating navbar matching your uploaded photo */
function FloatingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e3d9bf]/30 bg-[#fcfaf4]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/products/Logo.png"
            alt="Élégance Casa"
            width={40}
            height={40}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-sans text-xs tracking-[0.24em] uppercase text-[#111111]">
            Élégance <span className="text-[#c5a880] font-light">Casa</span>
          </span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-10 text-[10px] uppercase tracking-[0.26em] text-[#4a453e] md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#catalogue"
              className="font-light transition-colors hover:text-[#c5a880]"
            >
              {link}
            </a>
          ))}
        </nav>

        <button
          onClick={scrollToCatalogue}
          className="border-[0.5px] border-[#c5a880] rounded-full px-6 py-1.5 text-[10px] tracking-widest uppercase text-[#111111] transition-all hover:bg-[#c5a880] hover:text-white bg-transparent"
        >
          Découvrir
        </button>
      </div>
    </header>
  );
}

/* 3. Editorial hero canvas - MATCHES YOUR UPLOADED IMAGE COMPLETELY */
function EditorialHero() {
  return (
    <section
      id="top"
      className="relative flex flex-col items-center justify-center px-4 pt-16 pb-20 text-center bg-[#fcfaf4]"
    >
      {/* Scroll indicator eyebrow top anchor */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-[9px] tracking-[0.3em] text-neutral-400 uppercase mb-20 block cursor-pointer"
        onClick={scrollToCatalogue}
      >
        Scroll
      </motion.span>

      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[10px] tracking-[0.26em] text-[#a8845c] uppercase font-light"
      >
        La Maison
      </motion.p>

      {/* Replicating your beautiful degrading gold header title */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        className="font-display max-w-3xl text-4xl font-light leading-tight text-[#111111] mt-3 md:text-5xl lg:text-6xl"
      >
        Collections <span className="text-degrade-gold italic font-normal">choisies</span>
      </motion.h1>

      {/* Minimal luxury descriptive paragraph */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-5 text-xs font-light text-neutral-400 max-w-md mx-auto leading-relaxed tracking-wide"
      >
        Six familles de pièces, pensées comme un vocabulaire. À porter seules, ou à composer.
      </motion.p>

      {/* Rounded pill filter button link block */}
      <motion.button
        onClick={scrollToCatalogue}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-8 inline-flex items-center gap-3 rounded-full border border-neutral-200 px-6 py-2.5 text-[10px] tracking-widest uppercase text-[#111111] transition-all hover:border-[#c5a880] hover:text-[#c5a880] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.01)]"
      >
        Tous les produits
      </motion.button>
    </section>
  );
}

export function Storefront() {
  return (
    <>
      <MarqueeBanner />
      <FloatingNavbar />
      <EditorialHero />
      <WhatsAppButton />
    </>
  );
}
