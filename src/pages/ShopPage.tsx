import React, { useState, useMemo } from 'react';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  Palette,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Category, Size, ProductColor } from '../types';
import { ProductCard } from '../components/ProductCard';
import { extractAvailableColors, productMatchesColor } from '../utils/colorUtils';

export const ShopPage: React.FC = () => {
  const {
    products,
    openProductModal,
    addToCart,
    activeCategory,
    setActiveCategory,
    selectedColorFilter,
    setSelectedColorFilter,
    clearAllFilters
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<Size | 'ALL'>('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [priceMax, setPriceMax] = useState<number>(6000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories: Category[] = ['ALL', 'T-SHIRTS', 'HOODIES', 'BOTTOMS', 'ACCESSORIES', 'OUTERWEAR'];
  const sizes: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Color options dynamically extracted from published products
  const colorOptions = useMemo(() => {
    return extractAvailableColors(products, activeCategory);
  }, [products, activeCategory]);

  // Combined real-time filtering
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.isPublished === false) return false;

        // Category filter
        if (activeCategory !== 'ALL' && p.category !== activeCategory) return false;

        // Color filter
        if (selectedColorFilter && selectedColorFilter !== 'All') {
          if (!productMatchesColor(p, selectedColorFilter)) return false;
        }

        // Size filter
        if (selectedSize !== 'ALL') {
          if (!p.sizes.includes(selectedSize)) return false;
        }

        // Stock availability
        if (inStockOnly && (!p.inStock || p.stockCount <= 0)) {
          return false;
        }

        // Price range
        if (p.price > priceMax) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTagline = p.tagline?.toLowerCase().includes(q);
          const matchSku = p.sku?.toLowerCase().includes(q);
          if (!matchName && !matchCategory && !matchTagline && !matchSku) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'popular') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return 0; // default newest
      });
  }, [products, activeCategory, selectedColorFilter, selectedSize, inStockOnly, priceMax, searchQuery, sortBy]);

  const activeFiltersCount =
    (activeCategory !== 'ALL' ? 1 : 0) +
    (selectedColorFilter && selectedColorFilter !== 'All' ? 1 : 0) +
    (selectedSize !== 'ALL' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="pt-24 pb-32 bg-[#050505] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="border-b border-[#1A1A1A] pb-8 mb-8">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#777777] uppercase mb-3">
            <span>VOID WEAR</span>
            <span>/</span>
            <span className="text-[#D4AF37]">CATALOGUE ARCHIVE</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-[0.14em] uppercase text-white mb-2">
                THE COMPLETE ARCHIVE
              </h1>
              <p className="font-luxury text-xs sm:text-sm tracking-[0.25em] text-[#888888] uppercase">
                ENGINEERED LUXURY STREETWEAR // 280-520 GSM CUSTOM TEXTILES
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#888888]">
                SHOWING <strong className="text-white">{filteredProducts.length}</strong> PIECES
              </span>

              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden px-3.5 py-2 bg-[#121212] border border-[#262626] rounded-xs text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>FILTERS {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters (desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left Sidebar Filter Column */}
          <aside
            className={`lg:block ${
              isMobileFilterOpen
                ? 'fixed inset-0 z-50 bg-black/95 p-6 overflow-y-auto block'
                : 'hidden'
            } lg:relative lg:bg-transparent lg:p-0 space-y-6`}
          >
            {/* Mobile close bar */}
            <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#222222] mb-6">
              <span className="font-mono text-sm font-bold tracking-widest text-[#D4AF37] uppercase">
                FILTER ARCHIVE
              </span>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 bg-[#161616] rounded-full text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-4 rounded-xs">
              <label className="block text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase mb-2">
                SEARCH ARCHIVE
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Piece, SKU, fabric..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#D4AF37] p-2 pl-8 text-xs text-white rounded-xs outline-hidden font-mono uppercase"
                />
                <Search className="w-3.5 h-3.5 text-[#666666] absolute left-2.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-4 rounded-xs">
              <label className="block text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase mb-3">
                CATEGORY
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-[#888888] hover:text-white hover:bg-[#161616]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-75">
                      {cat === 'ALL'
                        ? products.length
                        : products.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Palette Swatches */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-4 rounded-xs">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-1.5">
                  <Palette className="w-3 h-3 text-[#D4AF37]" />
                  <span>COLOUR PALETTE</span>
                </label>
                {selectedColorFilter && selectedColorFilter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setSelectedColorFilter('All')}
                    className="text-[9px] font-mono text-[#888888] hover:text-white underline cursor-pointer"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {colorOptions.map((opt) => {
                  const active =
                    (!selectedColorFilter && opt.family === 'All') ||
                    selectedColorFilter?.toLowerCase() === opt.family.toLowerCase();

                  return (
                    <button
                      key={opt.family}
                      type="button"
                      onClick={() => setSelectedColorFilter(opt.family === 'All' ? 'All' : opt.family)}
                      className={`flex items-center gap-2 p-2 rounded-xs border text-[10px] font-mono uppercase transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#181818] border-[#D4AF37] text-white shadow-sm'
                          : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white hover:border-[#383838]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-black/40"
                        style={{ backgroundColor: opt.hex }}
                      />
                      <span className="truncate">{opt.label}</span>
                      <span className="ml-auto text-[8px] text-[#666666]">({opt.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Filter */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-4 rounded-xs">
              <label className="block text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase mb-3">
                SIZE
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSize('ALL')}
                  className={`py-2 text-[10px] font-mono font-bold uppercase rounded-xs border transition-colors cursor-pointer ${
                    selectedSize === 'ALL'
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                      : 'bg-[#121212] text-[#888888] border-[#242424] hover:text-white'
                  }`}
                >
                  ALL
                </button>
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-[10px] font-mono font-bold uppercase rounded-xs border transition-colors cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#121212] text-[#888888] border-[#242424] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Filter */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-4 rounded-xs">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
                <span className="text-[#D4AF37]">MAX PRICE</span>
                <span className="text-white">₹{priceMax.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={7000}
                step={200}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-[#222222] h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#666666] mt-1">
                <span>₹1,000</span>
                <span>₹7,000</span>
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="bg-[#0C0C0C] border border-[#1E1E1E] p-4 rounded-xs flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-white">
                IN STOCK ONLY
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded-xs cursor-pointer"
              />
            </div>

            {/* Clear All Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setSelectedSize('ALL');
                  setInStockOnly(false);
                  setSearchQuery('');
                  setPriceMax(6000);
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-[#141414] hover:bg-[#D4AF37] hover:text-black border border-[#2B2B2B] text-xs font-mono font-bold uppercase tracking-wider text-white rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET ALL FILTERS</span>
              </button>
            )}

            {isMobileFilterOpen && (
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="lg:hidden w-full py-3 bg-[#D4AF37] text-black font-mono font-bold uppercase tracking-widest rounded-xs"
              >
                VIEW {filteredProducts.length} PIECES
              </button>
            )}
          </aside>

          {/* Right Product Grid Area (3 cols on lg) */}
          <main className="lg:col-span-3">
            {/* Top Sort & Active Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#181818]">
              {/* Active Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                <span className="text-[#666666] uppercase">FILTER:</span>
                {activeCategory !== 'ALL' && (
                  <span className="px-2 py-0.5 bg-[#151515] border border-[#2C2C2C] text-[#D4AF37] rounded-2xs">
                    {activeCategory}
                  </span>
                )}
                {selectedColorFilter && selectedColorFilter !== 'All' && (
                  <span className="px-2 py-0.5 bg-[#151515] border border-[#2C2C2C] text-[#D4AF37] rounded-2xs">
                    SHADE: {selectedColorFilter.toUpperCase()}
                  </span>
                )}
                {selectedSize !== 'ALL' && (
                  <span className="px-2 py-0.5 bg-[#151515] border border-[#2C2C2C] text-[#D4AF37] rounded-2xs">
                    SIZE: {selectedSize}
                  </span>
                )}
                {activeFiltersCount === 0 && (
                  <span className="text-[#777777]">SHOWING ALL PIECES</span>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#777777] uppercase hidden sm:inline">
                  SORT BY:
                </span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-[#121212] border border-[#282828] text-white font-mono text-xs p-2 rounded-xs outline-hidden focus:border-[#D4AF37] uppercase cursor-pointer"
                >
                  <option value="newest">NEWEST ARRIVALS</option>
                  <option value="popular">FEATURED & BESTSELLERS</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenModal={openProductModal}
                    onQuickAdd={(prod, size, color) => addToCart(prod, size, color, 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 px-6 text-center bg-[#0B0B0B] border border-[#1E1E1E] rounded-sm max-w-xl mx-auto my-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#D4AF37]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg tracking-widest uppercase text-white mb-2">
                  NO PIECES MATCH YOUR CRITERIA
                </h3>
                <p className="text-xs text-[#888888] mb-6 leading-relaxed">
                  We couldn't find any piece matching the current filter combination. Reset your filters or search terms to explore the full collection.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setSelectedSize('ALL');
                    setInStockOnly(false);
                    setSearchQuery('');
                    setPriceMax(6000);
                  }}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-white transition-colors cursor-pointer"
                >
                  SHOW ALL PIECES
                </button>
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
};
