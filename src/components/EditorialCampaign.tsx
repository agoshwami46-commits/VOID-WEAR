import React from 'react';
import { ArrowRight } from 'lucide-react';

export const EditorialCampaign: React.FC = () => {
  const handleDiscover = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-28 sm:py-36 bg-[#030303] text-white overflow-hidden border-y border-[#181818]">
      {/* Background Graphic & Noir Aesthetic */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black z-10" />
        <div className="absolute inset-0 bg-noise opacity-40 z-10 pointer-events-none" />
        
        {/* Ambient Gold Halo */}
        <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Noir Geometric Lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-[700px] h-[700px] border border-[#D4AF37] rounded-full" />
          <div className="absolute w-[500px] h-[500px] border border-white/40 rotate-45" />
        </div>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        
        {/* Campaign Label */}
        <div className="flex items-center gap-3 mb-6 font-mono text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase">
          <span className="w-8 h-[1px] bg-[#D4AF37]/50" />
          <span>EDITORIAL CAMPAIGN // 2026</span>
          <span className="w-8 h-[1px] bg-[#D4AF37]/50" />
        </div>

        {/* Headline */}
        <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[0.16em] uppercase text-white mb-6 drop-shadow-xl">
          WEAR THE <span className="gold-gradient-text">UNKNOWN.</span>
        </h2>

        {/* Text */}
        <blockquote className="max-w-2xl text-base sm:text-lg md:text-xl font-light tracking-[0.08em] text-[#B8B8B8] leading-relaxed mb-10 italic">
          “VOID WEAR exists in the space between darkness and expression. Every piece is designed to make a statement without saying a word.”
        </blockquote>

        {/* Button */}
        <button
          onClick={handleDiscover}
          className="px-9 py-4 bg-transparent border border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-display font-bold text-xs tracking-[0.25em] uppercase cursor-pointer rounded-xs flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.15)] group"
        >
          <span>DISCOVER VOID</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Editorial Footnote */}
        <div className="mt-14 flex items-center gap-6 text-[10px] tracking-[0.3em] text-[#666666] uppercase font-mono">
          <span>LIMITED EDITION</span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
          <span>BESPOKE CUTS</span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
          <span>NO COMPROMISE</span>
        </div>

      </div>
    </section>
  );
};
