import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  ShoppingBag,
  MessageSquare,
  Check,
  ChevronDown,
  ChevronUp,
  Ruler,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Camera,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Size, ProductColor, ProductVariant } from '../types';
import { ProductImageSlider } from '../components/ProductImageSlider';
import { ProductCard } from '../components/ProductCard';
import { BRAND_INFO } from '../data/products';
import { getProductSlug, generateProductVariants, getStockStatus, formatPriceINR } from '../utils/productUtils';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const {
    products,
    allProducts,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsSizeGuideOpen,
    openWhatsAppOrder,
    navigate,
    openProductModal
  } = useShop();

  // Find product by slug or id
  const targetProduct = useMemo(() => {
    const cleanSlug = slug.toLowerCase().trim();
    return (
      allProducts.find(
        (p) =>
          p.id.toLowerCase() === cleanSlug ||
          (p.slug && p.slug.toLowerCase() === cleanSlug) ||
          getProductSlug(p) === cleanSlug
      ) || allProducts[0]
    );
  }, [allProducts, slug]);

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    targetProduct?.colors?.[0] || { name: 'Pitch Black', hex: '#0B0B0B' }
  );
  const [selectedSize, setSelectedSize] = useState<Size>(targetProduct?.sizes?.[0] || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  // Sync when product changes
  useEffect(() => {
    if (targetProduct) {
      setSelectedColor(targetProduct.colors?.[0] || { name: 'Pitch Black', hex: '#0B0B0B' });
      setSelectedSize(targetProduct.sizes?.[0] || 'L');
      setQuantity(1);
      setActiveAngleIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [targetProduct?.id]);

  // Generate variants matrix and check selected variant (unconditionally at top-level)
  const variants = useMemo(() => {
    return targetProduct ? generateProductVariants(targetProduct) : [];
  }, [targetProduct]);

  const currentVariant = useMemo(() => {
    return (
      variants.find(
        (v) =>
          v.colorName.toLowerCase() === selectedColor.name.toLowerCase() &&
          v.size === selectedSize
      ) || null
    );
  }, [variants, selectedColor, selectedSize]);

  // Angles list for selected color (unconditionally at top-level)
  const currentAngles = useMemo(() => {
    if (!targetProduct) return [];
    if (selectedColor.images && selectedColor.images.length > 0) {
      return selectedColor.images.map((url, i) => ({
        url,
        label: i === 0 ? 'FRONT' : i === 1 ? 'BACK' : i === 2 ? 'SIDE' : 'DETAIL'
      }));
    }
    return (targetProduct.images || []).map((url, i) => ({
      url,
      label: i === 0 ? 'FRONT' : i === 1 ? 'BACK' : i === 2 ? 'SIDE' : 'DETAIL'
    }));
  }, [selectedColor, targetProduct]);

  if (!targetProduct) return null;

  const wishlisted = isInWishlist(targetProduct.id);

  // Stock status
  const stockInfo = getStockStatus(targetProduct, currentVariant);

  // Related products in same category
  const related = products
    .filter((p) => p.id !== targetProduct.id && (p.category === targetProduct.category || p.featured))
    .slice(0, 4);

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  const handleAddToCart = () => {
    if (!stockInfo.isPurchasable) return;
    addToCart(targetProduct, selectedSize, selectedColor, quantity, currentVariant?.sku);
  };

  const handleBuyNow = () => {
    if (!stockInfo.isPurchasable) return;
    addToCart(targetProduct, selectedSize, selectedColor, quantity, currentVariant?.sku);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${targetProduct.name} | VOID WEAR`,
        text: targetProduct.tagline,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard');
    }
  };

  return (
    <div className="pt-24 pb-32 bg-[#050505] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[#777777] uppercase mb-8">
          <button onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
            HOME
          </button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-white cursor-pointer">
            SHOP
          </button>
          <span>/</span>
          <span className="text-[#999999]">{targetProduct.category}</span>
          <span>/</span>
          <span className="text-[#D4AF37] truncate max-w-[200px]">{targetProduct.name}</span>
        </div>

        {/* Product Master Grid: 7 cols Visual Gallery + 5 cols Commerce Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
          
          {/* Left Column: Visual Showcase Studio (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Interactive Stage with Slider */}
            <div className="bg-[#090909] border border-[#1C1C1C] rounded-sm p-4 sm:p-8 flex flex-col justify-center min-h-[460px] sm:min-h-[580px] relative">
              <ProductImageSlider
                product={targetProduct}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                allowBlueprintToggle={true}
              />

              {/* Angle Pill Indicator */}
              <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[#777777] pt-3 border-t border-[#181818]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span>
                    SHADE: <strong className="text-white uppercase">{selectedColor.name}</strong>
                  </span>
                </div>
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase">
                  {currentAngles.length} STUDIO ANGLES LOADED
                </span>
              </div>
            </div>

            {/* Thumbnail Grid for Quick Angle Jump */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {currentAngles.map((angle, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveAngleIndex(idx)}
                  className={`relative aspect-[4/5] bg-[#0E0E0E] border rounded-xs overflow-hidden cursor-pointer transition-all ${
                    idx === activeAngleIndex
                      ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'border-[#222222] opacity-70 hover:opacity-100 hover:border-[#444444]'
                  }`}
                >
                  <img
                    src={angle.url}
                    alt={`${targetProduct.name} ${angle.label}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 inset-x-1 text-center bg-black/80 backdrop-blur-xs text-[8px] font-mono font-bold text-white uppercase rounded-2xs py-0.5">
                    {angle.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#080808] border border-[#1C1C1C] p-6 sm:p-8 rounded-sm shadow-2xl">
            <div>
              {/* Top Meta Line: Badge, Category, Wishlist */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
                    {targetProduct.category} // {targetProduct.gsm} GSM
                  </span>
                  {targetProduct.badge && (
                    <span className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-mono font-bold tracking-widest uppercase rounded-xs">
                      {targetProduct.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-full bg-[#141414] text-[#888888] hover:text-white transition-colors cursor-pointer"
                    title="Share piece"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(targetProduct.id)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      wishlisted
                        ? 'bg-[#D4AF37] text-black shadow-md'
                        : 'bg-[#141414] text-white hover:text-[#D4AF37]'
                    }`}
                    title="Save to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.14em] uppercase text-white mb-2 leading-tight">
                {targetProduct.name}
              </h1>
              <p className="text-xs text-[#888888] tracking-widest uppercase mb-5 font-light">
                {targetProduct.tagline}
              </p>

              {/* Price & Stock Status Bar */}
              <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-[#1A1A1A]">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {formatPriceINR(targetProduct.price)}
                  </span>
                  {targetProduct.originalPrice && (
                    <span className="font-mono text-sm text-[#666666] line-through">
                      {formatPriceINR(targetProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase border rounded-xs ${stockInfo.colorClass}`}
                  >
                    {stockInfo.status} {stockInfo.count > 0 && stockInfo.count <= 5 && `(${stockInfo.count} LEFT)`}
                  </span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#A8A8A8] font-light leading-relaxed mb-6">
                {targetProduct.description}
              </p>

              {/* Colorways Selection */}
              <div className="mb-6 p-4 bg-[#0F0F0F] border border-[#222222] rounded-xs">
                <div className="flex items-center justify-between text-xs font-mono uppercase mb-2">
                  <span className="text-[#888888]">
                    SHADE: <strong className="text-white font-bold">{selectedColor.name}</strong>
                  </span>
                  <span className="text-[10px] text-[#D4AF37]">
                    {targetProduct.colors.length} {targetProduct.colors.length === 1 ? 'SHADE' : 'SHADES'}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {targetProduct.colors.map((c) => {
                    const isSelected = selectedColor.name === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C1C1C] border-[#D4AF37] ring-1 ring-[#D4AF37] text-white shadow-sm'
                            : 'bg-[#121212] border-[#2B2B2B] text-[#888888] hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[10px] font-mono uppercase tracking-wider">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono uppercase mb-2">
                  <span className="text-[#888888]">SELECT SIZE:</span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>SIZE GUIDE</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {targetProduct.sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`py-3 text-xs font-mono font-bold tracking-widest uppercase rounded-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
                            : 'bg-[#121212] border-[#222222] text-[#888888] hover:text-white hover:border-[#383838]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* SKU readout */}
                <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-[#666666]">
                  <span>SKU: {currentVariant?.sku || targetProduct.sku}</span>
                  {currentVariant?.qikinkSku && (
                    <span className="text-[#D4AF37]/70">FULFILLMENT: {currentVariant.qikinkSku}</span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-mono text-[#888888] uppercase">QUANTITY:</span>
                <div className="flex items-center border border-[#2B2B2B] bg-[#121212] rounded-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!stockInfo.isPurchasable || quantity <= 1}
                    className="px-3 py-1.5 text-white hover:bg-[#222222] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-mono text-xs text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!stockInfo.isPurchasable || quantity >= stockInfo.count}
                    className="px-3 py-1.5 text-white hover:bg-[#222222] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Bag, Buy Now, WhatsApp */}
              <div className="space-y-2.5 mb-8">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!stockInfo.isPurchasable}
                    className="flex-1 py-3.5 bg-white text-black hover:bg-[#D4AF37] disabled:bg-[#1E1E1E] disabled:text-[#666666] disabled:cursor-not-allowed transition-all text-xs font-mono font-bold tracking-[0.2em] uppercase rounded-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{stockInfo.isPurchasable ? 'ADD TO BAG' : 'SOLD OUT'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!stockInfo.isPurchasable}
                    className="flex-1 py-3.5 bg-[#D4AF37] text-black hover:bg-white disabled:bg-[#1E1E1E] disabled:text-[#666666] disabled:cursor-not-allowed transition-all text-xs font-mono font-bold tracking-[0.2em] uppercase rounded-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>BUY NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* WhatsApp Concierge Order Button */}
                <button
                  type="button"
                  onClick={() => openWhatsAppOrder(targetProduct, selectedSize, selectedColor)}
                  className="w-full py-3 bg-[#111111] hover:bg-[#181818] border border-[#282828] hover:border-[#D4AF37] text-[#D4AF37] hover:text-white transition-all text-[11px] font-mono font-bold tracking-[0.2em] uppercase rounded-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>ORDER DIRECT ON WHATSAPP (+91 8114150537)</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-[#1A1A1A] text-center font-mono text-[9px] text-[#888888] uppercase mb-6">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>EXPRESS AIR // 3-5 DAYS</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>100% AUTHENTIC ATELIER</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>7-DAY HASSLE EXCHANGE</span>
                </div>
              </div>

              {/* Expandable Accordions */}
              <div className="space-y-1.5">
                {/* 1. Product Details */}
                <div className="border border-[#1A1A1A] rounded-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('details')}
                    className="w-full px-4 py-3 bg-[#0F0F0F] flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>PRODUCT DETAILS & FABRIC SPEC</span>
                    {activeAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'details' && (
                    <div className="p-4 bg-[#0A0A0A] space-y-2 text-xs text-[#A0A0A0] font-light">
                      <div className="flex justify-between py-1 border-b border-[#161616]">
                        <span className="text-[#666666]">GSM:</span>
                        <span className="text-white font-mono">{targetProduct.gsm} GSM High-Density</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#161616]">
                        <span className="text-[#666666]">FABRIC:</span>
                        <span className="text-white">{targetProduct.fabric}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#161616]">
                        <span className="text-[#666666]">FIT:</span>
                        <span className="text-white">{targetProduct.fit}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-[#666666] block mb-1">KEY FEATURES:</span>
                        <ul className="list-disc pl-4 space-y-1 text-[11px]">
                          {targetProduct.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Size Guide Table */}
                <div className="border border-[#1A1A1A] rounded-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('size')}
                    className="w-full px-4 py-3 bg-[#0F0F0F] flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>SIZE GUIDE MEASUREMENTS (INCHES)</span>
                    {activeAccordion === 'size' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'size' && (
                    <div className="p-4 bg-[#0A0A0A] overflow-x-auto text-xs font-mono">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#222222] text-[#D4AF37] text-[10px]">
                            <th className="py-2">SIZE</th>
                            <th className="py-2">CHEST</th>
                            <th className="py-2">LENGTH</th>
                            <th className="py-2">SHOULDER</th>
                            <th className="py-2">SLEEVE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#161616] text-[#AAAAAA] text-[11px]">
                          <tr><td className="py-2 text-white font-bold">S</td><td>42"</td><td>28"</td><td>21"</td><td>9"</td></tr>
                          <tr><td className="py-2 text-white font-bold">M</td><td>44"</td><td>29"</td><td>22"</td><td>9.5"</td></tr>
                          <tr><td className="py-2 text-white font-bold">L</td><td>46"</td><td>30"</td><td>23"</td><td>10"</td></tr>
                          <tr><td className="py-2 text-white font-bold">XL</td><td>48"</td><td>31"</td><td>24"</td><td>10.5"</td></tr>
                          <tr><td className="py-2 text-white font-bold">XXL</td><td>50"</td><td>32"</td><td>25"</td><td>11"</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 3. Material & Care */}
                <div className="border border-[#1A1A1A] rounded-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('care')}
                    className="w-full px-4 py-3 bg-[#0F0F0F] flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>MATERIAL & CARE INSTRUCTIONS</span>
                    {activeAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'care' && (
                    <div className="p-4 bg-[#0A0A0A] space-y-1 text-xs text-[#A0A0A0]">
                      <ul className="list-disc pl-4 space-y-1 text-[11px]">
                        {targetProduct.careInstructions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 4. Shipping & Returns */}
                <div className="border border-[#1A1A1A] rounded-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full px-4 py-3 bg-[#0F0F0F] flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-[#D4AF37] cursor-pointer"
                  >
                    <span>SHIPPING & 7-DAY RETURNS</span>
                    {activeAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'shipping' && (
                    <div className="p-4 bg-[#0A0A0A] text-xs text-[#A0A0A0] space-y-2 leading-relaxed">
                      <p>
                        Free delivery across India on orders above ₹1,999. Dispatched directly from our Varanasi atelier via express air.
                      </p>
                      <p>
                        Returns and size exchanges are accepted within 7 days of delivery. Tags must be intact.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Related Pieces Recommendation Section */}
        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#1C1C1C]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">
                  COMPLETE THE SILHOUETTE
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.14em] uppercase text-white">
                  RELATED PIECES
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="text-xs font-mono tracking-widest text-[#D4AF37] hover:text-white uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>VIEW ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenModal={openProductModal}
                  onQuickAdd={(prod, size, color) => addToCart(prod, size, color, 1)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
