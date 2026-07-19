import type { Product } from '@/lib/types';

// Your brand's WhatsApp number, in international format without the leading
// "+". This is the one every "Commander via WhatsApp" link on the site uses.
export const WHATSAPP_NUMBER = '212661967998';

// Your second number — not wired into any button yet since the site only
// has one WhatsApp CTA slot. Swap WHATSAPP_NUMBER to this one instead, or
// tell me how you'd like the two used (e.g. one for orders, one for
// customer support) and I'll split them across the relevant buttons.
export const WHATSAPP_NUMBER_ALT = '212771011287';

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildProductMessage(product: Product): string {
  return `Bonjour, je suis intéressé(e) par la pièce "${product.name}" (${formatMAD(
    product.price
  )}). Est-elle disponible ?`;
}

// Used by the product detail page's "Commander via WhatsApp" pill. Kept
// deliberately literal (raw price + " MAD", no Intl formatting) to match
// the exact order-message template the storefront was specced to send.
export function buildProductPageMessage(product: Product, categoryLabel: string): string {
  return `Bonjour Élégance Casa, je souhaite commander l'article: ${product.name}, de la catégorie: ${categoryLabel}, au prix de: ${product.price} MAD.`;
}

export function buildCartMessage(lines: { product: Product; qty: number }[]): string {
  if (lines.length === 0) return 'Bonjour, je souhaite passer une commande.';
  const items = lines
    .map((l) => `• ${l.product.name} x${l.qty} — ${formatMAD(l.product.price * l.qty)}`)
    .join('\n');
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  return `Bonjour, je souhaite commander :\n${items}\n\nTotal : ${formatMAD(
    total
  )}\n\nMerci de me confirmer la disponibilité.`;
}

export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
