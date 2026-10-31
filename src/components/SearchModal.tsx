import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { GarmentVisual } from './GarmentVisual';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, openProductModal } = useShop();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filtered = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q)
    );
  });

  const popularSearches = ['HOODIE', 'OVERSIZED TEE', 'CARGO', '460 GSM', 'LIMITED DROP'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 pt-16 sm:pt-24 animate-fadeIn"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="bg-[#0D0D0D] border border-[#242424] max-w-2xl w-full rounded-sm overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#1E1E1E] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PIECES, FABRICS, SILHOUETTES..."
            className="w-full bg-transparent text-sm sm:text-base font-display tracking-widest text-white placeholder-[#555555] uppercase outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#666666] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#888888] hover:text-white cursor-pointer border-l border-[#222222] pl-3 ml-2"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-3 bg-[#111111] border-b border-[#1A1A1A] flex items-center gap-2 overflow-x-auto text-[10px] font-mono scrollbar-none">
          <span className="text-[#666666] uppercase shrink-0">TRENDING:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-black text-[#CCCCCC] uppercase rounded-xs transition-colors shrink-0 cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-[#161616]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#666666] font-mono text-xs uppercase">
              NO PIECES MATCHED "{query}". TRY ANOTHER SEARCH.
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setIsSearchOpen(false);
                  openProductModal(product);
                }}
                className="py-3 flex items-center gap-4 hover:bg-[#141414] px-3 rounded-xs cursor-pointer group transition-colors"
              >
                <div className="w-12 h-14 bg-black rounded-xs overflow-hidden shrink-0 flex items-center justify-center border border-[#1F1F1F] relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <GarmentVisual product={product} className="w-full h-full" />
                  )}
                  {product.images && product.images.length > 1 && (
                    <span className="absolute bottom-0 right-0 bg-black/80 text-[7px] font-mono text-[#D4AF37] px-1 font-bold">
                      {product.images.length}V
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase">
                      {product.category}
                    </span>
                    <span className="text-[9px] font-mono text-[#555555]">
                      {product.gsm} GSM
                    </span>
                    <span className="text-[9px] font-mono text-[#888888]">
                      • {product.colors.length} {product.colors.length === 1 ? 'COLOR' : 'COLORS'}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-xs uppercase text-white group-hover:text-[#D4AF37] transition-colors truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    {product.colors.map((c) => (
                      <span
                        key={c.name}
                        className="w-2 h-2 rounded-full border border-white/20 inline-block"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#D4AF37] transition-colors ml-auto mt-1" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
