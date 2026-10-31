import React from 'react';
import { ArrowDown, Sparkles, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../data/products';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { websiteContent, navigate } = useShop();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headline = websiteContent?.heroHeadline || 'ENTER THE VOID.';
  const tagline = websiteContent?.heroTagline || 'PREMIUM STREETWEAR FOR THOSE WHO CREATE THEIR OWN PATH.';
  const btnPrimary = websiteContent?.heroButtonPrimary || 'SHOP NEW DROP';
  const btnSecondary = websiteContent?.heroButtonSecondary || 'EXPLORE COLLECTION';

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#050505] text-white">
      {/* Background Graphic & Atmospheric Overlays */}
      <div className="absolute inset-0 z-0">
        {/* Optional Editorial Hero Background image from CMS */}
        {websiteContent?.heroBackgroundUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
            style={{ backgroundImage: `url(${websiteContent.heroBackgroundUrl})` }}
          />
        )}

        {/* Deep Dark Gradients & Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/90 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10" />

        {/* Ambient Golden Core Radiance */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />

        {/* Cinematic Backdrop Visual */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <svg className="absolute w-[800px] h-[800px] opacity-10 animate-spin" style={{ animationDuration: '60s' }} viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="220" stroke="#D4AF37" strokeWidth="1" strokeDasharray="6 14" fill="none" />
            <circle cx="250" cy="250" r="180" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 8" fill="none" />
            <circle cx="250" cy="250" r="120" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 20" fill="none" />
          </svg>
          {/* Streetwear Silhouettes in Noir Lighting */}
          <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none px-12">
            <div className="w-1/3 h-4/5 border border-white/10 rounded-sm transform -rotate-3 scale-95" />
            <div className="w-1/3 h-4/5 border border-[#D4AF37]/20 rounded-sm transform rotate-2 scale-100" />
          </div>
        </div>

        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 bg-noise opacity-50 z-10 pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16 flex flex-col items-center">
        
        {/* Brand Kicker with Distressed Official Crest */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#D4AF37]/25 bg-[#0D0D0D]/80 backdrop-blur-md mb-8 group hover:border-[#D4AF37]/50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          <span className="font-luxury text-[11px] sm:text-xs tracking-[0.35em] text-[#D4AF37] uppercase">
            BEYOND ORDINARY • COLLECTION 2026
          </span>
        </div>

        {/* Giant Main Headline */}
        <h1 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-[0.18em] text-white uppercase mb-6 drop-shadow-2xl select-none">
          {headline.includes('.') ? (
            <>
              {headline.replace(/\.$/, '')}
              <span className="gold-gradient-text">.</span>
            </>
          ) : (
            headline
          )}
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light tracking-[0.2em] text-[#B0B0B0] uppercase mb-10 leading-relaxed">
          {tagline}
        </p>

        {/* Call-to-Action Buttons with Gold Hover States */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Primary Action: SHOP NEW DROP */}
          <button
            onClick={() => scrollToSection('new-drop')}
            className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] cursor-pointer group flex items-center justify-center gap-3"
          >
            <span>{btnPrimary}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary Action: EXPLORE COLLECTION */}
          <button
            onClick={() => scrollToSection('collections')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#333333] text-white font-display font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 cursor-pointer"
          >
            {btnSecondary}
          </button>
        </div>

        {/* Micro Origin Stamp */}
        <div className="mt-14 flex items-center gap-6 text-[11px] tracking-[0.3em] text-[#666666] uppercase font-mono">
          <span>ORIGIN: VARANASI, IN</span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
          <span>EST. 2026</span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
          <span>WORLDWIDE DISPATCH</span>
        </div>

      </div>

      {/* Down Scroll Indicator */}
      <button
        onClick={() => scrollToSection('brand-statement')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[#777777] hover:text-[#D4AF37] transition-colors cursor-pointer group"
        aria-label="Scroll to next section"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase font-mono">DISCOVER</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>

      {/* Subtle Hairline Border at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent z-20" />
    </section>
  );
};
