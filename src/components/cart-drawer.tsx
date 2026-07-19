'use client';

import { Minus, Plus, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import type { Product } from '@/data/products';

export type CartLine = { product: Product; quantity: number };
type CartDrawerProps = { open: boolean; lines: CartLine[]; phone: string; onClose: () => void; onQuantityChange: (id: string, quantity: number) => void; onRemove: (id: string) => void; onCheckout: () => void };

export function CartDrawer({ open, lines, phone, onClose, onQuantityChange, onRemove, onCheckout }: CartDrawerProps) {
  const total = lines.reduce((sum, line) => sum + line.product.priceMad * line.quantity, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-charcoal/38 backdrop-blur-md"
          />

          <motion.aside
            initial={{ x: '102%' }}
            animate={{ x: 0 }}
            exit={{ x: '102%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
            aria-label="Panier"
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[30rem] flex-col border-l border-charcoal/10 bg-[rgba(250,246,240,0.9)] p-6 shadow-[-32px_0_90px_rgba(28,26,23,0.18)] backdrop-blur-2xl md:p-8"
          >
            <div className="flex items-start justify-between border-b border-charcoal/10 pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-gold">Sélection privée</p>
                <h2 className="mt-2 font-display text-3xl text-charcoal">Votre écrin</h2>
              </div>

              <button onClick={onClose} className="rounded-full border border-charcoal/10 p-2 text-charcoal transition hover:border-gold/70 hover:bg-charcoal hover:text-cream" aria-label="Fermer le panier">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              {lines.length === 0 ? (
                <div className="mt-16 rounded-[1.75rem] border border-charcoal/10 bg-cream/70 px-5 py-8 text-center">
                  <p className="text-sm text-charcoal/60">Votre sélection est encore vide.</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-charcoal/40">Ajoutez une pièce pour lancer la commande</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {lines.map(({ product, quantity }) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 rounded-[1.5rem] border border-charcoal/8 bg-cream/70 p-3"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[1.15rem] bg-[#eee9e0]">
                        <Image src={product.imageSrc} alt={product.name} fill sizes="80px" className="object-cover" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex gap-3">
                          <h3 className="flex-1 font-display text-lg leading-tight text-charcoal">{product.name}</h3>
                          <button onClick={() => onRemove(product.id)} aria-label={`Retirer ${product.name}`} className="text-charcoal/45 transition hover:text-charcoal">
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p className="mt-1 text-sm text-gold">{product.priceMad} MAD</p>

                        <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-charcoal/12 px-3 py-1.5">
                          <button onClick={() => onQuantityChange(product.id, quantity - 1)} aria-label="Réduire la quantité" className="text-charcoal/70 transition hover:text-charcoal">
                            <Minus size={13} />
                          </button>
                          <span className="w-4 text-center text-xs font-medium text-charcoal">{quantity}</span>
                          <button onClick={() => onQuantityChange(product.id, quantity + 1)} aria-label="Augmenter la quantité" className="text-charcoal/70 transition hover:text-charcoal">
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-charcoal/10 pt-5">
                <div className="mb-5 flex items-center justify-between font-display text-xl text-charcoal">
                  <span>Total</span>
                  <span>{total} MAD</span>
                </div>

                <button onClick={onCheckout} className="w-full rounded-full bg-charcoal px-5 py-4 text-xs tracking-[0.18em] text-cream transition hover:bg-gold hover:text-charcoal">
                  COMMANDER VIA WHATSAPP
                </button>

                <p className="mt-3 text-center text-[11px] text-charcoal/52">
                  Commande envoyée au {phone.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4')}.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
