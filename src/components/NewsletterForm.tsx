'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // No newsletter backend is wired up yet — this only confirms receipt
    // in the UI. Connect an email provider (Mailchimp, Klaviyo, Brevo...)
    // and swap this handler for a real request when you're ready to go live.
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-sm text-gold-deep">Merci, à bientôt ✨</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        aria-label="Adresse e-mail"
        className="w-full border-b-[0.5px] border-neutral-300 bg-transparent py-1 text-sm focus:outline-none"
      />
      <button
        type="submit"
        className="rose-gold-btn tracked-caps shrink-0 px-3 py-1.5 text-[10px]"
      >
        Envoyer
      </button>
    </form>
  );
}
