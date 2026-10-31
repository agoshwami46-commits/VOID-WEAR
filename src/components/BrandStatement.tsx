import React from 'react';
import { useShop } from '../context/ShopContext';

export const BrandStatement: React.FC = () => {
  const { websiteContent } = useShop();

  const headline = websiteContent?.brandStatementHeadline || '“NOT MADE FOR EVERYONE.”';
  const body =
    websiteContent?.brandStatementBody ||
    'VOID WEAR is a premium streetwear label built around individuality, confidence and self-expression. Designed for those who refuse to blend in.';

  return (
    <section id="brand-statement" className="relative py-24 sm:py-32 bg-[#090909] text-white overflow-hidden border-b border-[#1A1A1A]">
      {/* Background ambient noise and light */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        
        {/* Subtle Category Kicker */}
        <span className="font-mono text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase mb-4">
          PHILOSOPHY // 01
        </span>

        {/* Large Editorial Manifesto Title */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-[0.16em] text-white uppercase mb-8 leading-tight">
          {headline.startsWith('“') ? headline : `“${headline}”`}
        </h2>

        {/* Supporting Copy */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl font-light tracking-[0.1em] text-[#A0A0A0] leading-relaxed mb-10">
          {body}
        </p>

        {/* Small Gold Detail Underneath */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <div className="w-2 h-2 rotate-45 border border-[#D4AF37] bg-black" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        {/* Badge of Authenticity */}
        <div className="mt-8 text-[10px] tracking-[0.3em] text-[#666666] font-mono uppercase">
          VARANASI CRAFTED • AVANT-GARDE SILHOUETTES
        </div>

      </div>
    </section>
  );
};
