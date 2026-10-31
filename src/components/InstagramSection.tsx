import React from 'react';
import { Instagram, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/products';

export const InstagramSection: React.FC = () => {
  const posts = [
    {
      id: 'ig-1',
      caption: 'VOID CORE HOODIE in Onyx Black. 460 GSM structured drape.',
      likes: '1,420',
      comments: '88',
      tag: 'DROP 01'
    },
    {
      id: 'ig-2',
      caption: 'Distressed Enso Crest. Varanasi Atelier testing.',
      likes: '960',
      comments: '42',
      tag: 'ATELIER'
    },
    {
      id: 'ig-3',
      caption: 'DISTORTION GRAPHIC TEE with frequency waveform print.',
      likes: '2,150',
      comments: '134',
      tag: 'STREET'
    },
    {
      id: 'ig-4',
      caption: 'VOID ESSENTIALS PANTS stacked over chunky runners.',
      likes: '1,830',
      comments: '95',
      tag: 'FIT'
    },
    {
      id: 'ig-5',
      caption: 'Behind the lens with Akash Goshwami. 2026 Archive.',
      likes: '3,210',
      comments: '210',
      tag: 'EDITORIAL'
    },
    {
      id: 'ig-6',
      caption: 'Strictly 50 units. When it is gone, the void closes.',
      likes: '1,740',
      comments: '112',
      tag: 'VAULT'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#050505] text-white border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#1A1A1A] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>COMMUNITY & VISUAL ARCHIVE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-[0.16em] uppercase text-white">
              FOLLOW THE VOID
            </h2>
          </div>
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-mono tracking-widest text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>{BRAND_INFO.instagram}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 6-Image Stylish Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-12">
          {posts.map((post) => (
            <a
              key={post.id}
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#0C0C0C] border border-[#1C1C1C] hover:border-[#D4AF37] rounded-xs overflow-hidden transition-all duration-300 block"
            >
              {/* Graphic Streetwear Art Backdrop */}
              <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-[#141414] via-[#090909] to-[#040404]">
                <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
                
                {/* Central Emblem Watermark */}
                <div className="w-16 h-16 rounded-full border border-white/10 group-hover:border-[#D4AF37]/40 flex items-center justify-center transition-colors">
                  <span className="font-display font-extrabold text-xs tracking-[0.2em] text-[#555555] group-hover:text-[#D4AF37] transition-colors">
                    VOID
                  </span>
                </div>

                {/* Corner Tag */}
                <span className="absolute bottom-2 left-2 text-[8px] font-mono tracking-widest text-[#666666] uppercase">
                  {post.tag}
                </span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col items-center justify-center text-center">
                <Instagram className="w-6 h-6 text-[#D4AF37] mb-2 transform scale-75 group-hover:scale-100 transition-transform" />
                <div className="flex items-center gap-3 text-xs font-mono text-white mb-2">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-[#999999]" />
                    {post.comments}
                  </span>
                </div>
                <p className="text-[9px] text-[#A0A0A0] line-clamp-2 px-1 font-light">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Big CTA Button */}
        <div className="text-center">
          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[#333333] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 font-display font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-xs"
          >
            <Instagram className="w-4 h-4 text-[#D4AF37]" />
            <span>FOLLOW @VOID__WEAR__</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
