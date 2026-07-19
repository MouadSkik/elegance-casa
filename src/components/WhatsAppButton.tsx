'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { whatsappHref } from '@/lib/whatsapp';

export function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappHref('Bonjour, je souhaite en savoir plus sur vos pièces Élégance Casa.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous contacter sur WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-linen shadow-[0_8px_28px_rgba(197,168,128,0.5)] md:bottom-8 md:right-8"
    >
      <MessageCircle size={26} strokeWidth={1.5} />
    </motion.a>
  );
}
