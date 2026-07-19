'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';

const NAV_LINKS = ['MAISON', 'TOUS', 'COLLECTIONS', 'CASABLANCA'];

function scrollToCatalogue() {
  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
}

/* 1. RESTORED INFINITE MOVING MARQUEE BANNER */
export function MarqueeBanner() {
  const MARQUEE_TEXT = " ✨ LIVRAISON DISPONIBLE SUR TOUT LE MAROC — COMMANDEZ DIRECTEMENT VIA WHATSAPP ✨ SOLDES D'ÉTÉ — JUSQU'À -30% SUR UNE SÉLECTION DE BIJOUX EXCLUSIFS ";

  return (
    <div className="overflow-hidden border-b border-[#e3d9bf]/30 py-2.5 w-full select-none relative z-50 bg-[#FAF6F0]">
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

/* 2. MINIMALIST NAVIGATION HEADER */
function FloatingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e3d9bf]/20 bg-[#fcfaf4]/90 backdrop-blur-md">
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

/* 3. EDITORIAL HERO CANVAS WITH DEGRADING GOLD SCRIPT */
function EditorialHero() {
  return (
    <section
      id="top"
      className="relative flex flex-col items-center justify-center px-4 pt-16 pb-20 text-center bg-[#fcfaf4]"
    >
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[10px] tracking-[0.26em] text-[#a8845c] uppercase font-light"
      >
        La Maison
      </motion.p>

      {/* Perfectly Centered Logo Showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex h-48 w-48 items-center justify-center rounded-full border border-[#e3d9bf]/40 bg-white/6 p-3 shadow-[0_0_50px_rgba(197,168,128,0.15)] backdrop-blur-sm md:h-56 md:w-56 my-8"
      >
        <Image
          src="/products/Logo.png"
          alt="Élégance Casa Logo"
          width={200}
          height={200}
          priority
          className="h-full w-full rounded-full object-cover"
        />
      </motion.div>

      {/* Fixed: Luxury Degrading Gold Text Colors */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        className="font-display max-w-3xl text-4xl font-light leading-tight text-[#2E2724] md:text-5xl lg:text-6xl"
      >
        Une présence. <span className="text-degrade-gold italic font-normal block mt-2">Une sensation.</span>
      </motion.h1>

      <motion.button
        onClick={scrollToCatalogue}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-12 inline-flex items-center gap-3 rounded-full border border-[#c5a880] px-7 py-2.5 text-[10px] tracking-widest uppercase text-[#111111] transition-all hover:bg-[#c5a880] hover:text-white bg-transparent"
      >
        Découvrir
        <ArrowDown size={13} strokeWidth={1.5} className="animate-bounce" />
      </motion.button>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-4 text-[9px] tracking-[0.3em] text-neutral-400 uppercase cursor-pointer"
        onClick={scrollToCatalogue}
      >
        Scroll
      </motion.span>
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
