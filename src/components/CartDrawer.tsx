'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatMAD, buildCartMessage, whatsappHref } from '@/lib/whatsapp';

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, setQty, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-linen shadow-2xl"
            role="dialog"
            aria-label="Panier"
          >
            <div className="flex items-center justify-between border-b rule px-6 py-5">
              <h2 className="font-display text-2xl text-ink">Votre panier</h2>
              <button
                onClick={closeCart}
                aria-label="Fermer le panier"
                className="text-ink-soft transition-colors hover:text-ink"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="mt-12 text-center text-sm text-ink-soft">
                  Votre panier est vide pour le moment.
                </p>
              ) : (
                <ul className="divide-y divide-hairline">
                  {lines.map((line) => (
                    <motion.li
                      key={line.product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 py-5"
                    >
                      <div className="h-20 w-16 shrink-0 rounded-sm bg-linen-deep" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-lg leading-tight text-ink">
                              {line.product.name}
                            </p>
                            <p className="text-xs text-ink-soft">{line.product.material}</p>
                          </div>
                          <button
                            onClick={() => removeItem(line.product.id)}
                            aria-label={`Retirer ${line.product.name}`}
                            className="text-ink-soft/60 transition-colors hover:text-ink"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border rule px-2 py-1">
                            <button
                              onClick={() => setQty(line.product.id, line.qty - 1)}
                              aria-label="Diminuer la quantité"
                              className="text-ink-soft hover:text-ink"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-sm">{line.qty}</span>
                            <button
                              onClick={() => setQty(line.product.id, line.qty + 1)}
                              aria-label="Augmenter la quantité"
                              className="text-ink-soft hover:text-ink"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-gold-deep">
                            {formatMAD(line.product.price * line.qty)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t rule px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="tracked-caps text-xs text-ink-soft">Sous-total</span>
                  <span className="font-display text-2xl text-ink">{formatMAD(subtotal)}</span>
                </div>
                <a
                  href={whatsappHref(buildCartMessage(lines))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-ink py-3 text-center text-sm tracked-caps text-linen transition-colors hover:bg-gold-deep"
                >
                  Commander via WhatsApp
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
