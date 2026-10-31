import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Category } from '../types';

interface CollectionCard {
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  piecesCount: string;
  svgIcon: string;
}

export const CollectionsSection: React.FC = () => {
  const { setActiveCategory, navigate, allProducts } = useShop();

  const handleExplore = (cat: Category) => {
    setActiveCategory(cat);
    navigate('/shop');
  };

  const getCount = (cat: Category) => {
    const count = allProducts.filter((p) => p.category === cat && p.isPublished).length;
    return `${count.toString().padStart(2, '0')} PIECES`;
  };

  const collections: CollectionCard[] = [
    {
      category: 'T-SHIRTS',
      title: 'T-SHIRTS',
      subtitle: 'OVERSIZED SILHOUETTES',
      description: 'Oversized silhouettes and statement graphics milled from 280 GSM combed cotton.',
      piecesCount: getCount('T-SHIRTS'),
      svgIcon: 'M60 90 L20 130 L40 180 L70 170 L70 290 L170 290 L170 170 L200 180 L220 130 L180 90 Z'
    },
    {
      category: 'HOODIES',
      title: 'HOODIES',
      subtitle: 'HEAVYWEIGHT LUXURY',
      description: 'Heavyweight premium essentials constructed with 460 GSM French Terry loopback.',
      piecesCount: getCount('HOODIES'),
      svgIcon: 'M70 90 C70 50, 170 50, 170 90 L220 140 L190 280 L170 280 L170 290 L70 290 L70 280 L50 280 L20 140 Z'
    },
    {
      category: 'BOTTOMS',
      title: 'BOTTOMS',
      subtitle: 'CONTEMPORARY UTILITY',
      description: 'Relaxed and contemporary streetwear engineered for effortless sneaker stacking.',
      piecesCount: getCount('BOTTOMS'),
      svgIcon: 'M70 50 L170 50 L190 290 L140 290 L120 120 L100 290 L50 290 Z'
    },
    {
      category: 'ACCESSORIES',
      title: 'ACCESSORIES',
      subtitle: 'FUTURE EDITIONS',
      description: 'Future accessories, structured caps, and limited hardware statement pieces.',
      piecesCount: getCount('ACCESSORIES'),
      svgIcon: 'M50 160 C50 80, 190 80, 190 160 L220 190 C180 210, 60 210, 20 190 Z'
    }
  ];

  return (
    <section id="collections" className="py-24 sm:py-32 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 border-b border-[#1A1A1A] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>CURATED LINEAGE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-[0.16em] uppercase text-white">
              COLLECTIONS
            </h2>
          </div>
          <p className="mt-4 sm:mt-0 font-luxury text-xs sm:text-sm tracking-[0.25em] text-[#888888] uppercase max-w-sm">
            Architectural shapes engineered for modern urban life.
          </p>
        </div>

        {/* 4 Large Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {collections.map((col, index) => (
            <div
              key={col.category}
              onClick={() => handleExplore(col.category)}
              className="group relative bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#D4AF37]/60 transition-all duration-500 overflow-hidden rounded-sm flex flex-col justify-between p-6 sm:p-8 cursor-pointer min-h-[380px]"
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-2xl rounded-full transition-opacity group-hover:opacity-100 opacity-40 pointer-events-none" />

              {/* Background Silhouette Watermark Art */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none overflow-hidden">
                <svg viewBox="0 0 240 320" className="w-48 h-64 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={col.svgIcon} />
                </svg>
              </div>

              {/* Top Meta info */}
              <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-[#777777] uppercase">
                <span>0{index + 1} // ARCHIVE</span>
                <span className="text-[#D4AF37]">{col.piecesCount}</span>
              </div>

              {/* Center Details */}
              <div className="relative z-10 my-auto py-8">
                <span className="text-[10px] tracking-[0.3em] font-luxury text-[#D4AF37] uppercase block mb-1">
                  {col.subtitle}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors mb-3">
                  {col.title}
                </h3>
                <p className="text-xs text-[#999999] leading-relaxed font-light">
                  {col.description}
                </p>
              </div>

              {/* Bottom Action Button */}
              <div className="relative z-10 pt-4 border-t border-[#1C1C1C] flex items-center justify-between">
                <span className="font-display font-bold text-xs tracking-[0.2em] uppercase text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span>EXPLORE</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#D4AF37]" />
                </span>
                <div className="w-2 h-2 rounded-full border border-[#D4AF37]/50 group-hover:bg-[#D4AF37] transition-colors" />
              </div>

              {/* Hairline Gold Bottom Border Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
