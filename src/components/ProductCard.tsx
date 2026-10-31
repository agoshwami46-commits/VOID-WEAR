import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Heart,
  Plus,
  Eye,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Camera,
  AlertCircle
} from 'lucide-react';
import { Product, ProductColor, Size } from '../types';
import { GarmentVisual } from './GarmentVisual';
import { useShop } from '../context/ShopContext';
import { getMatchingColorVariant } from '../utils/colorUtils';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product, initialColor?: ProductColor) => void;
  onQuickAdd: (product: Product, size: Size, color: ProductColor) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  onOpenModal,
  onQuickAdd
}) => {
  const { toggleWishlist, isInWishlist, openWhatsAppOrder, selectedColorFilter } = useShop();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    if (selectedColorFilter && selectedColorFilter !== 'All') {
      return getMatchingColorVariant(product, selectedColorFilter);
    }
    return product.colors?.[0] || { name: 'Pitch Black', hex: '#0B0B0B' };
  });
  const [angleIndex, setAngleIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Automatically switch card colorway and angle photos when user selects a color filter
  useEffect(() => {
    if (selectedColorFilter && selectedColorFilter !== 'All') {
      const match = getMatchingColorVariant(product, selectedColorFilter);
      setSelectedColor(match);
      setAngleIndex(0);
      setImageError(false);
    }
  }, [selectedColorFilter, product]);

  const isOutOfStock = !product.inStock || (product.stockCount !== undefined && product.stockCount <= 0);
  const wishlisted = isInWishlist(product.id);

  // Compute angle photos for this product & selected color
  const angles = useMemo(() => {
    // 1. If selected color has its own images array (all angles for this color)
    if (selectedColor.images && selectedColor.images.length > 0) {
      return selectedColor.images.map((url, idx) => ({
        url,
        label: idx === 0 ? 'FRONT' : idx === 1 ? 'BACK' : idx === 2 ? 'SIDE' : 'DETAIL'
      }));
    }

    // 2. If explicit angles are tagged with this color name
    if (product.angles && product.angles.length > 0) {
      const colorAngles = product.angles.filter(
        (a) => a.colorName && a.colorName.toLowerCase() === selectedColor.name.toLowerCase()
      );
      if (colorAngles.length > 0) {
        return colorAngles.map((a, idx) => ({
          url: a.url,
          label: a.label || a.angle || (idx === 0 ? 'FRONT' : idx === 1 ? 'BACK' : idx === 2 ? 'SIDE' : 'DETAIL')
        }));
      }
    }

    // 3. If selected color has a single hero image
    if (selectedColor.image) {
      return [{ url: selectedColor.image, label: `${selectedColor.name} - FRONT` }];
    }

    // 4. Fallback: product-level angles
    if (product.angles && product.angles.length > 0) {
      return product.angles.map((a, idx) => ({
        url: a.url,
        label: a.label || a.angle || (idx === 0 ? 'FRONT' : idx === 1 ? 'BACK' : idx === 2 ? 'SIDE' : 'DETAIL')
      }));
    }

    // 5. Fallback: gather product images
    const list: { url: string; label: string }[] = [];
    const used = new Set<string>();

    const add = (url: string | undefined, label: string) => {
      if (url && !used.has(url)) {
        used.add(url);
        list.push({ url, label });
      }
    };

    if (product.images?.[0]) add(product.images[0], 'FRONT');
    if (product.backImage) add(product.backImage, 'BACK');
    else if (product.images?.[1]) add(product.images[1], 'BACK');

    if (product.sideImage) add(product.sideImage, 'SIDE');
    else if (product.images?.[2]) add(product.images[2], 'SIDE');

    if (product.detailImage) add(product.detailImage, 'DETAIL');
    else if (product.images?.[3]) add(product.images[3], 'DETAIL');

    if (product.images && product.images.length > 4) {
      product.images.slice(4).forEach((u, i) => add(u, `VIEW 0${i + 5}`));
    }

    return list;
  }, [product, selectedColor]);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      e.stopPropagation();
      setAngleIndex((prev) => (prev + 1) % Math.max(1, angles.length));
    } else if (diff < -40) {
      e.stopPropagation();
      setAngleIndex((prev) => (prev - 1 + angles.length) % Math.max(1, angles.length));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handlePrevAngle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAngleIndex((prev) => (prev - 1 + angles.length) % angles.length);
  };

  const handleNextAngle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAngleIndex((prev) => (prev + 1) % angles.length);
  };

  const handleColorClick = (color: ProductColor, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColor(color);
    setAngleIndex(0);
    setImageError(false);
  };

  const currentAngle = angles[angleIndex] || angles[0];
  const hasMultipleAngles = angles.length > 1;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(product, selectedColor)}
      className="group relative bg-[#0C0C0C] border border-[#1A1A1A] hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden rounded-sm"
    >
      {/* Visual Header / Badges / Image Angle Canvas */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A0A0A] select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Category & Badge */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-[0.2em] uppercase bg-[#181818]/95 text-[#E0E0E0] border border-[#444444] rounded-xs shadow-md">
              OUT OF STOCK
            </span>
          ) : product.badge && product.badge !== 'NONE' ? (
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold tracking-[0.2em] uppercase bg-[#D4AF37] text-black rounded-xs shadow-md">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Current Angle Pill Badge */}
        {hasMultipleAngles && currentAngle && (
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-[#2A2A2A] text-[#D4AF37] text-[8px] font-mono font-bold uppercase rounded-2xs flex items-center gap-1">
              <Camera className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>{currentAngle.label}</span>
              <span className="text-white/60">({angleIndex + 1}/{angles.length})</span>
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-200 cursor-pointer ${
            wishlisted
              ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
              : 'bg-black/60 text-white hover:text-[#D4AF37] backdrop-blur-sm'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Slider Chevron Left Arrow */}
        {hasMultipleAngles && (
          <button
            type="button"
            onClick={handlePrevAngle}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-25 p-1.5 sm:p-2 bg-black/80 hover:bg-[#D4AF37] hover:text-black text-white rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer border border-white/10 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Previous angle"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Slider Chevron Right Arrow */}
        {hasMultipleAngles && (
          <button
            type="button"
            onClick={handleNextAngle}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-25 p-1.5 sm:p-2 bg-black/80 hover:bg-[#D4AF37] hover:text-black text-white rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer border border-white/10 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Next angle"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Main Image Display (or Vector Silhouette Fallback) */}
        <div className="w-full h-full relative flex items-center justify-center">
          {currentAngle?.url && !imageError ? (
            <img
              src={currentAngle.url}
              alt={`${product.name} - ${currentAngle.label}`}
              loading="lazy"
              decoding="async"
              width={400}
              height={500}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
              <GarmentVisual product={product} colorHex={selectedColor.hex} />
            </div>
          )}
        </div>

        {/* Multi-Angle Indicator Dots on bottom center */}
        {hasMultipleAngles && (
          <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
            {angles.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAngleIndex(idx);
                }}
                className={`transition-all duration-200 cursor-pointer rounded-full ${
                  idx === angleIndex
                    ? 'w-4 h-1.5 bg-[#D4AF37]'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`View angle ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Quick Action Overlay on Card Hover */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex items-center justify-between gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0 pointer-events-none sm:pointer-events-none'
          }`}
        >
          {isOutOfStock ? (
            <div className="flex-1 py-2 px-3 bg-[#1C1C1C] text-[#888888] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 rounded-xs border border-[#333333] cursor-not-allowed select-none">
              <span>SOLD OUT</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product, product.sizes[0] || 'L', selectedColor);
              }}
              className="flex-1 py-2 px-3 bg-white text-black hover:bg-[#D4AF37] transition-colors text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 rounded-xs shadow-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>QUICK ADD</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(product, selectedColor);
            }}
            className="p-2 bg-[#1A1A1A] text-white hover:text-[#D4AF37] hover:bg-[#252525] transition-colors rounded-xs cursor-pointer"
            aria-label="View product details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Metadata Area */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#0B0B0B]">
        <div>
          {/* Category & GSM */}
          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#777777] uppercase font-mono mb-1.5">
            <span>{product.category}</span>
            <span className="text-[#D4AF37]/80">{product.gsm} GSM</span>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-bold text-sm sm:text-base tracking-[0.14em] uppercase text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Short Tagline */}
          <p className="text-xs text-[#888888] line-clamp-1 mb-3 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Colors, Sizes & Price */}
        <div>
          {/* All Uploaded Color Options Display */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="text-[#777777] uppercase truncate max-w-[140px]">
                SHADE: <strong className="text-white">{selectedColor.name}</strong>
              </span>
              <span className="text-[#D4AF37]/90 text-[9px] uppercase">
                {product.colors.length} {product.colors.length === 1 ? 'COLOR' : 'COLORS'}
              </span>
            </div>

            {/* Color Swatches Row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.map((c) => {
                const isSelected = selectedColor.name === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={(e) => handleColorClick(c, e)}
                    title={`${c.name} (Click to view)`}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'ring-2 ring-[#D4AF37] border-white scale-110 shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                        : 'border-[#333333] hover:border-white/80'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Sizes Row */}
          <div className="flex items-center justify-between mb-3 pt-2 border-t border-[#181818]">
            <span className="text-[9px] font-mono text-[#666666] uppercase">SIZES:</span>
            <div className="flex items-center gap-1 text-[9px] font-mono text-[#888888]">
              {product.sizes.slice(0, 4).map((s) => (
                <span key={s} className="px-1.5 py-0.5 bg-[#161616] border border-[#242424] rounded-xs text-white">
                  {s}
                </span>
              ))}
              {product.sizes.length > 4 && <span>+{product.sizes.length - 4}</span>}
            </div>
          </div>

          {/* Price and WhatsApp Action */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold font-mono tracking-tight text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#666666] line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openWhatsAppOrder(product, product.sizes[0] || 'L', selectedColor);
              }}
              className="text-[#D4AF37] hover:text-white p-1 transition-colors flex items-center gap-1 text-[10px] font-mono tracking-wider cursor-pointer"
              title="Order via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ORDER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Metallic Gold Accent Line on Bottom */}
      <div className="h-[1.5px] w-0 group-hover:w-full bg-[#D4AF37] transition-all duration-500 ease-out" />
    </div>
  );
});
