import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useShop();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email', 'info');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the VOID INNER CIRCLE. Secret drop codes dispatched shortly.', 'gold');
    setEmail('');
  };

  return (
    <section className="py-20 sm:py-28 bg-[#040404] text-white border-b border-[#181818] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E0E0E] border border-[#222222] rounded-full text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-4">
          <Mail className="w-3 h-3 text-[#D4AF37]" />
          <span>INNER CIRCLE DISPATCH</span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-[0.16em] uppercase text-white mb-4">
          ENTER THE <span className="gold-gradient-text">VOID.</span>
        </h2>

        {/* Supporting text */}
        <p className="text-xs sm:text-sm tracking-[0.18em] text-[#888888] uppercase mb-10 max-w-lg">
          Be the first to know about new drops, limited releases and exclusive access.
        </p>

        {/* Form */}
        {subscribed ? (
          <div className="p-4 bg-[#0E0E0E] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono tracking-widest uppercase rounded-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-[#D4AF37]" />
            <span>YOU HAVE ENTERED THE VOID. WELCOME.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 bg-[#0D0D0D] border border-[#262626] focus:border-[#D4AF37] text-white px-5 py-3.5 text-xs tracking-wider uppercase rounded-xs outline-none transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors cursor-pointer rounded-xs whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>JOIN THE LIST</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Zero-spam guarantee */}
        <p className="mt-4 text-[10px] font-mono tracking-widest text-[#555555] uppercase">
          STRICTLY ZERO SPAM • PRIVILEGED EARLY LINKS ONLY
        </p>

      </div>
    </section>
  );
};
