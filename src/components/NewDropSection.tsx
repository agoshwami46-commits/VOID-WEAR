import React, { useState, useMemo } from 'react';
import {
  Heart,
  Plus,
  Eye,
  Check,
  MessageSquare,
  ArrowUpRight,
  Filter,
  X,
  Palette,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Size, ProductColor, Category } from '../types';
import { ProductCard } from './ProductCard';
import { BRAND_INFO } from '../data/products';
import { extractAvailableColors, productMatchesColor } from '../utils/colorUtils';

export const NewDropSection: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    openProductModal,
    addToCart,
    selectedColorFilter,
    setSelectedColorFilter,
    searchQuery,
    setSearchQuery,
    clearAllFilters
  } = useShop();

  const [quickAddModalProduct, setQuickAddModalProduct] = useState<Product | null>(null);
  const [quickAddSize, setQuickAddSize] = useState<Size>('L');
  const [quickAddColor, setQuickAddColor] = useState<ProductColor | null>(null);

  const categories: Category[] = ['ALL', 'T-SHIRTS', 'HOODIES', 'BOTTOMS', 'ACCESSORIES', 'OUTERWEAR'];

  // Dynamically extract available colors and product counts from current catalog
  const colorOptions = useMemo(() => {
    return extractAvailableColors(products, activeCategory);
  }, [products, activeCategory]);

  // Combined real-time filtering: Category + Color Palette + Search Query + Published state
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Only show published products to customers
      if (p.isPublished === false) return false;

      // 2. Category filter
      if (activeCategory !== 'ALL' && p.category !== activeCategory) return false;

      // 3. Color filter
      if (selectedColorFilter && selectedColorFilter !== 'All') {
        if (!productMatchesColor(p, selectedColorFilter)) return false;
      }

      // 4. Search query (if set)
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesTagline = p.tagline?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesTagline && !matchesDesc) return false;
      }

      return true;
    });
  }, [products, activeCategory, selectedColorFilter, searchQuery]);

  const confirmQuickAdd = () => {
    if (quickAddModalProduct) {
      const activeColor = quickAddColor || quickAddModalProduct.colors[0];
      addToCart(quickAddModalProduct, quickAddSize, activeColor, 1);
      setQuickAddModalProduct(null);
    }
  };

  const isColorActive = (family: string) => {
    if (!selectedColorFilter || selectedColorFilter === 'All') {
      return family === 'All';
    }
    return selectedColorFilter.toLowerCase() === family.toLowerCase();
  };

  const activeColorLabel = useMemo(() => {
    if (!selectedColorFilter || selectedColorFilter === 'All') return null;
    return selectedColorFilter.toUpperCase();
  }, [selectedColorFilter]);

  return (
    <section id="shop" className="relative py-20 sm:py-28 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div id="new-drop" className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6 border-b border-[#1A1A1A] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase">
                EDITION 2026 // DROP 01
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-[0.16em] uppercase text-white mb-2">
              THE NEW DROP
            </h2>
            <p className="font-luxury text-xs sm:text-sm tracking-[0.25em] text-[#888888] uppercase">
              LIMITED PIECES. DISTINCT IDENTITY.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'bg-[#111111] text-[#999999] hover:text-white hover:bg-[#1a1a1a] border border-[#222222]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* LUXURY COLOUR-BASED PRODUCT FILTERING BAR */}
        {/* ---------------------------------------------------- */}
        <div className="mb-10 bg-[#0A0A0A] border border-[#1C1C1C] rounded-sm p-4 sm:p-5 shadow-xl">
          {/* Top Bar: Title & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#161616]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#141414] rounded-xs border border-[#252525]">
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-white">
                FILTER BY COLOUR
              </span>
              {activeColorLabel && (
                <span className="px-2 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold uppercase rounded-xs">
                  {activeColorLabel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-wider text-[#777777]">
                SHOWING <strong className="text-white">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}
              </span>

              {/* Clear Filter button if color is selected */}
              {selectedColorFilter && selectedColorFilter !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedColorFilter('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase text-[#999999] hover:text-white bg-[#141414] hover:bg-[#1F1F1F] border border-[#2A2A2A] rounded-xs transition-colors cursor-pointer"
                  title="Clear color filter"
                >
                  <X className="w-3 h-3 text-[#D4AF37]" />
                  <span>CLEAR COLOUR</span>
                </button>
              )}
            </div>
          </div>

          {/* Clickable Colour Swatches (Horizontal Scrollable on Mobile, Wrap on Desktop) */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {colorOptions.map((opt) => {
              const active = isColorActive(opt.family);
              const isAll = opt.family === 'All';

              return (
                <button
                  key={opt.family}
                  type="button"
                  onClick={() => setSelectedColorFilter(isAll ? 'All' : opt.family)}
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-xs border transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                    active
                      ? 'bg-[#181818] border-[#D4AF37] text-white shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                      : 'bg-[#101010] border-[#222222] text-[#888888] hover:text-white hover:border-[#383838] hover:bg-[#141414]'
                  }`}
                  aria-pressed={active}
                  title={`Filter by ${opt.label} (${opt.count} pieces available)`}
                >
                  {/* Swatch circular preview dot */}
                  {isAll ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#111111] via-[#D4AF37] to-[#EDECE8] border border-white/20 shrink-0" />
                  ) : (
                    <span
                      className={`w-3.5 h-3.5 rounded-full shrink-0 border transition-transform duration-200 ${
                        active ? 'scale-110 border-white ring-1 ring-[#D4AF37]' : 'border-black/50 group-hover:scale-105'
                      }`}
                      style={{ backgroundColor: opt.hex }}
                    />
                  )}

                  {/* Colour Name Label */}
                  <span className={`text-[11px] font-mono uppercase tracking-wider ${active ? 'font-bold text-white' : ''}`}>
                    {opt.label}
                  </span>

                  {/* Matching Product Count */}
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-2xs transition-colors ${
                      active
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-[#1C1C1C] text-[#666666] group-hover:text-[#999999]'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Helper Strip (if category or color or search is applied) */}
          {(activeCategory !== 'ALL' || (selectedColorFilter && selectedColorFilter !== 'All') || searchQuery) && (
            <div className="mt-3 pt-3 border-t border-[#161616] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[#666666] uppercase">ACTIVE FILTERS:</span>
                {activeCategory !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161616] border border-[#2B2B2B] text-white rounded-xs">
                    CATEGORY: <strong className="text-[#D4AF37]">{activeCategory}</strong>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('ALL')}
                      className="hover:text-red-400 cursor-pointer ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {selectedColorFilter && selectedColorFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161616] border border-[#2B2B2B] text-white rounded-xs">
                    COLOUR: <strong className="text-[#D4AF37]">{selectedColorFilter.toUpperCase()}</strong>
                    <button
                      type="button"
                      onClick={() => setSelectedColorFilter('All')}
                      className="hover:text-red-400 cursor-pointer ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161616] border border-[#2B2B2B] text-white rounded-xs">
                    SEARCH: <strong className="text-[#D4AF37]">"{searchQuery}"</strong>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-red-400 cursor-pointer ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[#888888] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET ALL FILTERS</span>
              </button>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* PRODUCT GRID & EMPTY STATES */}
        {/* ---------------------------------------------------- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={openProductModal}
                onQuickAdd={(prod, size, color) => {
                  setQuickAddModalProduct(prod);
                  setQuickAddSize(size);
                  setQuickAddColor(color);
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State when no products match selected colour or combination */
          <div className="py-20 px-6 bg-[#0B0B0B] border border-[#202020] rounded-sm text-center max-w-2xl mx-auto my-6 shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#141414] border border-[#282828] flex items-center justify-center text-[#D4AF37]">
              <Palette className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-lg sm:text-xl tracking-[0.16em] uppercase text-white mb-2">
              NO PIECES FOUND FOR {selectedColorFilter?.toUpperCase() || 'THIS FILTER'}
            </h3>

            <p className="text-xs sm:text-sm text-[#888888] max-w-md mx-auto mb-6 leading-relaxed">
              We currently don't have pieces in{' '}
              <strong className="text-white">{selectedColorFilter?.toUpperCase()}</strong> under the{' '}
              <strong className="text-[#D4AF37]">{activeCategory}</strong> category. Explore our other
              colourways or browse all published pieces.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedColorFilter('All')}
                className="px-5 py-2.5 bg-[#D4AF37] text-black font-mono font-bold text-xs tracking-[0.15em] uppercase rounded-xs hover:bg-white transition-colors cursor-pointer shadow-lg"
              >
                SHOW ALL COLOURS
              </button>

              <button
                type="button"
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#161616] text-[#CCCCCC] hover:text-white border border-[#2D2D2D] font-mono text-xs tracking-[0.15em] uppercase rounded-xs transition-colors cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
            </div>
          </div>
        )}

        {/* Quick Add Size Picker Modal */}
        {quickAddModalProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn"
            onClick={() => setQuickAddModalProduct(null)}
          >
            <div
              className="bg-[#111111] border border-[#262626] p-6 max-w-sm w-full rounded-sm shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="font-display font-bold text-base tracking-[0.15em] uppercase text-white mb-1">
                SELECT SIZE
              </h4>
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-4">
                {quickAddModalProduct.name}
              </p>

              {/* Sizes Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {quickAddModalProduct.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuickAddSize(s)}
                    className={`py-2 text-xs font-mono font-bold rounded-xs transition-colors cursor-pointer ${
                      quickAddSize === s
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-[#1C1C1C] text-white hover:bg-[#2A2A2A]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setQuickAddModalProduct(null)}
                  className="w-1/2 py-2.5 text-xs font-semibold tracking-wider text-[#999999] hover:text-white bg-[#1A1A1A] rounded-xs cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmQuickAdd}
                  className="w-1/2 py-2.5 text-xs font-bold tracking-[0.2em] uppercase bg-[#D4AF37] text-black hover:bg-white transition-colors rounded-xs cursor-pointer"
                >
                  ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
