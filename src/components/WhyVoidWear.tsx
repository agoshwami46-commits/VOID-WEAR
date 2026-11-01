import React from 'react';
import { ShieldCheck, Maximize2, Sparkles, Compass } from 'lucide-react';

export const WhyVoidWear: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      number: '01',
      title: 'PREMIUM QUALITY',
      description: 'Carefully selected materials and obsessive attention to detail. 280 to 480 GSM French Terry and dense combed cottons that stand the test of time.'
    },
    {
      icon: Maximize2,
      number: '02',
      title: 'OVERSIZED FIT',
      description: 'Contemporary silhouettes designed specifically for modern streetwear. Exaggerated drop-shoulders, wide chests, and balanced drapes.'
    },
    {
      icon: Sparkles,
      number: '03',
      title: 'LIMITED DROPS',
      description: 'Exclusive collections designed to feel rare. Each edition is produced in strictly limited quantities with zero commercial mass-restocks.'
    },
    {
      icon: Compass,
      number: '04',
      title: 'MADE TO STAND OUT',
      description: 'For people who create their own identity. Bold minimalist aesthetics that make a definitive statement without shouting.'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#060606] text-white border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase block mb-3">
            THE ARCHITECTURE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-[0.16em] uppercase text-white mb-4">
            WHY VOID WEAR
          </h2>
          <div className="w-16 h-[1.5px] bg-[#D4AF37] mx-auto" />
        </div>

        {/* 4-Column Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group p-8 bg-[#0B0B0B] border border-[#1C1C1C] hover:border-[#D4AF37]/50 transition-all duration-300 rounded-sm relative flex flex-col justify-between"
              >
                {/* Top Corner Index */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-sm bg-[#121212] border border-[#222222] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:border-[#D4AF37]/40 transition-all">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <span className="font-mono text-xs text-[#555555] tracking-widest">
                    {pillar.number}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg tracking-[0.15em] uppercase text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#888888] leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Hairline */}
                <div className="mt-8 pt-4 border-t border-[#161616] flex items-center justify-between text-[10px] font-mono text-[#555555] tracking-wider uppercase">
                  <span>VERIFIED SPEC</span>
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
