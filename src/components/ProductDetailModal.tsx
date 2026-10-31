import React, { useState, useEffect } from 'react';
import {
  X,
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
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Size, ProductColor, Product } from '../types';
import { GarmentVisual } from './GarmentVisual';
import { ProductImageSlider } from './ProductImageSlider';
import { BRAND_INFO } from '../data/products';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    selectedColorway,
    setSelectedColorway,
    closeProductModal,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setIsCartOpen,
    setIsCheckoutOpen,
    setIsSizeGuideOpen,
    openWhatsAppOrder,
    openProductModal,
    navigateToProduct,
    products
  } = useShop();

  const [selectedSize, setSelectedSize] = useState<Size>(() => selectedProduct?.sizes?.[0] || 'L');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    if (!selectedProduct) return { name: 'Pitch Black', hex: '#0B0B0B' };
    return (
      (selectedColorway && selectedProduct.colors?.find((c) => c.name === selectedColorway.name)) ||
      selectedProduct.colors?.[0] || { name: 'Pitch Black', hex: '#0B0B0B' }
    );
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [activeVisualAngle, setActiveVisualAngle] = useState<'front' | 'macro'>('front');

  // Keep selected color synced if opened with a specific colorway or if product changes
  useEffect(() => {
    if (selectedProduct) {
      const targetColor =
        (selectedColorway && selectedProduct.colors?.find((c) => c.name === selectedColorway.name)) ||
        selectedProduct.colors?.[0] || { name: 'Pitch Black', hex: '#0B0B0B' };
      if (targetColor) {
        setSelectedColor(targetColor);
      }
      setSelectedSize(selectedProduct.sizes?.[0] || 'L');
      setQuantity(1);
    }
  }, [selectedProduct?.id, selectedColorway]);

  if (!selectedProduct) return null;

  const wishlisted = isInWishlist(selectedProduct.id);

  // Recommendations
  const relatedProducts = products
    .filter((p) => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.featured))
    .slice(0, 3);

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    closeProductModal();
    setIsCheckoutOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      onClick={closeProductModal}
    >
      <div
        className="bg-[#0A0A0A] border border-[#222222] max-w-6xl w-full rounded-sm overflow-hidden my-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Action Buttons */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => {
              navigateToProduct(selectedProduct.id);
              closeProductModal();
            }}
            className="p-2 sm:px-3 bg-[#141414]/90 hover:bg-[#D4AF37] hover:text-black text-white rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase border border-neutral-700"
            title="Open dedicated product page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FULL PAGE</span>
          </button>
          <button
            onClick={closeProductModal}
            className="p-2 sm:p-2.5 bg-[#141414]/90 hover:bg-[#D4AF37] hover:text-black text-white rounded-full transition-colors cursor-pointer border border-neutral-700"
            aria-label="Close product view"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Interactive Visual Showcase Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 bg-[#070707] p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1C1C1C] relative">
            {/* Top badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase">
                {selectedProduct.category} // {selectedProduct.gsm} GSM
              </span>
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`p-2 rounded-full cursor-pointer transition-colors ${
                  wishlisted ? 'bg-[#D4AF37] text-black' : 'bg-[#141414] text-white hover:text-[#D4AF37]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Central Multi-Angle Visual Showcase Slider */}
            <div className="w-full flex-1 flex flex-col justify-center min-h-[360px] sm:min-h-[460px]">
              <ProductImageSlider
                product={selectedProduct}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                allowBlueprintToggle={true}
              />
            </div>

            {/* View angle & color indicator */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-[#161616] pt-3 font-mono text-[11px] text-[#777777] gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: selectedColor.hex }} />
                <span>ALL PHOTOS LOADED: <strong className="text-white uppercase font-bold tracking-wider">{selectedColor.name}</strong></span>
              </div>
              <span className="text-[#D4AF37] text-[10px] tracking-widest bg-[#151208] border border-[#D4AF37]/30 px-2 py-0.5 rounded-2xs font-bold">
                {selectedColor.images?.length || 4} MULTI-ANGLE STUDIO VIEWS
              </span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (5 cols on lg) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#0A0A0A]">
            <div>
              {/* Brand line */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase">
                  VOID WEAR // VARANASI
                </span>
                {selectedProduct.badge && (
                  <span className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-mono font-bold tracking-widest uppercase rounded-xs">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.14em] uppercase text-white mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-[#888888] tracking-wider uppercase mb-4">
                {selectedProduct.tagline}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-[#1A1A1A]">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="font-mono text-sm text-[#666666] line-through">
                    ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase ml-auto">
                  TAX INCLUDED • FREE SHIPPING OVER ₹1,999
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#A8A8A8] font-light leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              {/* Color Selector - Show All Available Uploaded Colorways */}
              <div className="mb-6 p-4 bg-[#0F0F0F] border border-[#222222] rounded-xs">
                <div className="flex items-center justify-between text-xs font-mono uppercase mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#888888]">SELECT COLOR:</span>
                    <span className="text-white font-bold tracking-wider">{selectedColor.name}</span>
                  </div>
                  <span className="text-[10px] text-[#D4AF37] font-mono font-bold">
                    {selectedProduct.colors?.length || 0} {(selectedProduct.colors?.length || 0) === 1 ? 'COLOR' : 'COLORS AVAILABLE'}
                  </span>
                </div>
                <p className="text-[10px] text-[#777777] font-mono mb-3">
                  Click any color below to instantly display all angle photos of that selected piece:
                </p>

                {/* All Uploaded Colors Swatches with Names & Previews */}
                <div className="flex flex-wrap gap-2.5">
                  {(selectedProduct.colors || []).map((c) => {
                    const isSelected = selectedColor.name === c.name;
                    const photoCount = c.images?.length || 4;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setSelectedColor(c);
                          if (setSelectedColorway) setSelectedColorway(c);
                        }}
                        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#1C1808] text-white ring-2 ring-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                            : 'border-[#262626] bg-[#141414] text-[#999999] hover:border-[#555555] hover:text-white hover:bg-[#181818]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/30 shrink-0 flex items-center justify-center shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && (
                            <Check className={`w-2.5 h-2.5 ${c.hex === '#EDECE8' || c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                          )}
                        </span>
                        <div className="flex flex-col text-left">
                          <span className={`text-[11px] font-mono tracking-wider uppercase font-bold leading-tight ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                            {c.name}
                          </span>
                          <span className="text-[8px] font-mono tracking-widest text-[#777777] uppercase">
                            {photoCount} ANGLES
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector + Size Guide Link */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono uppercase mb-2">
                  <span className="text-[#888888]">SELECT SIZE:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>SIZE GUIDE</span>
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 text-xs font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer border ${
                        selectedSize === s
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-[#121212] text-white border-[#242424] hover:border-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-mono uppercase text-[#888888]">QTY:</span>
                <div className="flex items-center border border-[#262626] rounded-xs bg-[#121212]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-white hover:text-[#D4AF37] font-mono cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-white hover:text-[#D4AF37] font-mono cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add To Cart, Buy Now, WhatsApp Order */}
              <div className="space-y-3 mb-8">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-white text-black hover:bg-[#D4AF37] transition-all font-display font-bold text-xs tracking-[0.22em] uppercase rounded-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#D4AF37] text-black hover:bg-white transition-all font-display font-bold text-xs tracking-[0.22em] uppercase rounded-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>BUY NOW (INSTANT CHECKOUT)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* WhatsApp Order Button */}
                <button
                  onClick={() => openWhatsAppOrder(selectedProduct, selectedSize, selectedColor)}
                  className="w-full py-3 bg-[#111111] border border-[#2B2B2B] hover:border-[#D4AF37] text-[#D4AF37] hover:text-white transition-colors font-display font-semibold text-xs tracking-[0.18em] uppercase rounded-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ORDER ON WHATSAPP (+91 8114150537)</span>
                </button>
              </div>

              {/* Expandable Accordions: Size Guide, Details, Shipping, Care */}
              <div className="border-t border-[#1C1C1C] divide-y divide-[#1C1C1C]">
                {/* Product Details */}
                <div>
                  <button
                    onClick={() => toggleAccordion('details')}
                    className="w-full py-3 flex items-center justify-between text-xs font-display font-bold tracking-[0.15em] uppercase text-white hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                  >
                    <span>PRODUCT DETAILS & FABRIC SPEC</span>
                    {activeAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'details' && (
                    <div className="pb-4 text-xs text-[#999999] space-y-1.5 font-light animate-fadeIn">
                      <p><strong className="text-white">Fabric:</strong> {selectedProduct.fabric}</p>
                      <p><strong className="text-white">Weight:</strong> {selectedProduct.gsm} GSM</p>
                      <p><strong className="text-white">Silhouette:</strong> {selectedProduct.fit}</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-[#888888]">
                        {selectedProduct.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Shipping & Returns */}
                <div>
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full py-3 flex items-center justify-between text-xs font-display font-bold tracking-[0.15em] uppercase text-white hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                  >
                    <span>SHIPPING & EASY RETURNS</span>
                    {activeAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'shipping' && (
                    <div className="pb-4 text-xs text-[#999999] space-y-2 font-light animate-fadeIn">
                      <p>• Complimentary express shipping across India on orders over ₹1,999.</p>
                      <p>• Dispatched from Pandeypur, Varanasi within 24-48 business hours.</p>
                      <p>• Easy 7-day exchange policy for size adjustments.</p>
                      <p>• Real-time dispatch tracking notifications provided via SMS and WhatsApp.</p>
                    </div>
                  )}
                </div>

                {/* Care Instructions */}
                <div>
                  <button
                    onClick={() => toggleAccordion('care')}
                    className="w-full py-3 flex items-center justify-between text-xs font-display font-bold tracking-[0.15em] uppercase text-white hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                  >
                    <span>CARE INSTRUCTIONS</span>
                    {activeAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {activeAccordion === 'care' && (
                    <div className="pb-4 text-xs text-[#999999] space-y-1 font-light animate-fadeIn">
                      {selectedProduct.careInstructions.map((c, i) => (
                        <p key={i}>• {c}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom "You May Also Like" Recommendation Section */}
        {relatedProducts.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#070707] border-t border-[#1C1C1C]">
            <h4 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-white mb-4">
              COMPLETE THE LOOK // YOU MAY ALSO LIKE
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => openProductModal(rel)}
                  className="flex items-center gap-3 p-2 bg-[#0E0E0E] border border-[#1A1A1A] hover:border-[#D4AF37]/50 rounded-xs cursor-pointer group transition-colors"
                >
                  <div className="w-14 h-16 bg-black rounded-xs overflow-hidden shrink-0 flex items-center justify-center border border-[#1F1F1F] relative">
                    {rel.images?.[0] ? (
                      <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <GarmentVisual product={rel} className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-display font-bold text-xs uppercase text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      {rel.name}
                    </h5>
                    <p className="font-mono text-xs text-[#D4AF37] mt-0.5">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
