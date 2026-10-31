import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Layers,
  Sparkles,
  Camera,
  ZoomIn
} from 'lucide-react';
import { Product, ProductColor, ProductAngle } from '../types';
import { GarmentVisual } from './GarmentVisual';

interface ProductImageSliderProps {
  product: Product;
  selectedColor?: ProductColor;
  onColorChange?: (color: ProductColor) => void;
  className?: string;
  allowBlueprintToggle?: boolean;
}

export interface AngleSlide {
  url: string;
  angle: string;
  label: string;
  colorName?: string;
}

export const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  product,
  selectedColor,
  onColorChange,
  className = '',
  allowBlueprintToggle = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'photos' | 'blueprint'>('photos');
  const [isHovered, setIsHovered] = useState(false);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Compute available slides/angles for the chosen color
  const slides: AngleSlide[] = React.useMemo(() => {
    // 1. If the selected color has specific images array (all angles of this color)
    if (selectedColor?.images && selectedColor.images.length > 0) {
      return selectedColor.images.map((imgUrl, idx) => {
        const angle = idx === 0 ? 'FRONT' : idx === 1 ? 'BACK' : idx === 2 ? 'SIDE' : 'DETAIL';
        const label =
          idx === 0
            ? `${selectedColor.name.toUpperCase()} • FRONT VIEW`
            : idx === 1
            ? `${selectedColor.name.toUpperCase()} • REAR PROFILE`
            : idx === 2
            ? `${selectedColor.name.toUpperCase()} • SIDE ANGLE`
            : `${selectedColor.name.toUpperCase()} • FABRIC & DETAILS`;
        return { url: imgUrl, angle, label, colorName: selectedColor.name };
      });
    }

    // 2. If explicit angles are tagged with the selected color name
    if (product.angles && product.angles.length > 0 && selectedColor) {
      const taggedColorAngles = product.angles.filter(
        (a) => a.colorName && a.colorName.toLowerCase() === selectedColor.name.toLowerCase()
      );
      if (taggedColorAngles.length > 0) {
        return taggedColorAngles.map((a, idx) => ({
          url: a.url,
          angle: a.angle || (idx === 0 ? 'FRONT' : idx === 1 ? 'BACK' : idx === 2 ? 'SIDE' : 'DETAIL'),
          label: a.label || `${a.angle || 'ANGLE'} VIEW`,
          colorName: a.colorName || selectedColor.name
        }));
      }
    }

    // 3. If selected color has a single hero image
    if (selectedColor?.image) {
      return [
        {
          url: selectedColor.image,
          angle: 'FRONT',
          label: `${selectedColor.name} - FRONT`,
          colorName: selectedColor.name
        }
      ];
    }

    // 4. Fallback: collect product-level angles
    if (product.angles && product.angles.length > 0) {
      return product.angles.map((a, idx) => ({
        url: a.url,
        angle: a.angle || (idx === 0 ? 'FRONT' : idx === 1 ? 'BACK' : idx === 2 ? 'SIDE' : 'DETAIL'),
        label: a.label || `${a.angle || 'ANGLE'} VIEW`,
        colorName: a.colorName || selectedColor?.name
      }));
    }

    // 5. Fallback: collect product images, backImage, sideImage, detailImage
    const collected: AngleSlide[] = [];
    const usedUrls = new Set<string>();

    const addSlide = (url: string | undefined, angle: string, label: string) => {
      if (url && !usedUrls.has(url)) {
        usedUrls.add(url);
        collected.push({ url, angle, label, colorName: selectedColor?.name });
      }
    };

    if (product.images?.[0]) addSlide(product.images[0], 'FRONT', 'FRONT ANGLE');
    if (product.backImage) addSlide(product.backImage, 'BACK', 'REAR PROFILE');
    else if (product.images?.[1]) addSlide(product.images[1], 'BACK', 'REAR PROFILE');
    if (product.sideImage) addSlide(product.sideImage, 'SIDE', 'SIDE SILHOUETTE');
    else if (product.images?.[2]) addSlide(product.images[2], 'SIDE', 'SIDE SILHOUETTE');
    if (product.detailImage) addSlide(product.detailImage, 'DETAIL', 'FABRIC & DETAILS');
    else if (product.images?.[3]) addSlide(product.images[3], 'DETAIL', 'FABRIC & DETAILS');

    if (product.images && product.images.length > 4) {
      product.images.slice(4).forEach((img, idx) => {
        addSlide(img, `ANGLE ${idx + 5}`, `VIEW 0${idx + 5}`);
      });
    }

    if (collected.length === 0) {
      collected.push({
        url: '/void-logo.jpg',
        angle: 'FRONT',
        label: 'FRONT ANGLE',
        colorName: selectedColor?.name
      });
    }

    return collected;
  }, [product, selectedColor]);

  // Reset to first slide whenever the user selects a different color
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedColor?.name]);

  // Ensure index stays in bounds if slides length changes
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape' && isZoomOpen) setIsZoomOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isZoomOpen]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // pixels
    if (diffX > minSwipeDistance) {
      nextSlide();
    } else if (diffX < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      className={`relative flex flex-col select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Angle Bar & View Mode Toggle */}
      <div className="flex items-center justify-between mb-3 text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#181818] border border-[#2A2A2A] text-[#D4AF37] rounded-xs font-bold uppercase flex items-center gap-1.5">
            <Camera className="w-3 h-3 text-[#D4AF37]" />
            <span>
              ANGLE {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}: {currentSlide.label}
            </span>
          </span>
          {currentSlide.colorName && (
            <span className="hidden sm:inline-block px-2 py-0.5 bg-black/60 border border-[#222222] text-[#999999] rounded-xs text-[10px] uppercase">
              {currentSlide.colorName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {product.colors && product.colors.length > 1 && onColorChange && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-[#121212] border border-[#242424] rounded-xs">
              <span className="text-[9px] text-[#777777] uppercase font-mono mr-0.5">COLOR:</span>
              {product.colors.map((c) => {
                const isSelected = selectedColor?.name === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => onColorChange(c)}
                    title={`View all photos for ${c.name}`}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#D4AF37] border-white scale-110 shadow-sm'
                        : 'border-[#333333] hover:border-white opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          )}

          {allowBlueprintToggle && (
            <div className="flex items-center gap-1 bg-[#121212] border border-[#242424] p-0.5 rounded-xs">
              <button
                type="button"
                onClick={() => setViewMode('photos')}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'photos'
                    ? 'bg-[#D4AF37] text-black font-extrabold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <span>STUDIO SHOT</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('blueprint')}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  viewMode === 'blueprint'
                    ? 'bg-[#D4AF37] text-black font-extrabold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Layers className="w-2.5 h-2.5" />
                <span>BLUEPRINT</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div
        className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-[#0A0A0A] border border-[#1F1F1F] rounded-sm overflow-hidden flex items-center justify-center group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {viewMode === 'blueprint' ? (
          /* Technical Vector Silhouette Blueprint */
          <div className="w-full h-full p-4 flex items-center justify-center bg-gradient-to-b from-[#111] via-[#090909] to-[#040404]">
            <GarmentVisual
              product={product}
              colorHex={selectedColor?.hex}
              className="w-full h-full"
            />
          </div>
        ) : (
          /* High-Resolution Angle Photography Carousel */
          <div className="relative w-full h-full flex items-center justify-center bg-[#070707] overflow-hidden">
            <img
              key={currentSlide.url}
              src={currentSlide.url}
              alt={`${product.name} - ${currentSlide.label}`}
              className="w-full h-full object-cover sm:object-contain object-center transition-all duration-500 ease-out animate-fadeIn"
              onError={(e) => {
                // If remote photo fails to load, fallback to vector blueprint
                (e.currentTarget as HTMLElement).style.display = 'none';
                setViewMode('blueprint');
              }}
            />

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Micro Watermark & Specifications */}
            <div className="absolute top-3 left-3 pointer-events-none z-10 flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.25em] text-white/50 uppercase">
                VOID WEAR // ATELIER
              </span>
              <span className="font-mono text-[8px] tracking-[0.2em] text-[#D4AF37]/80 uppercase">
                {product.gsm} GSM • {product.category}
              </span>
            </div>

            {/* Zoom / Fullscreen Trigger */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-3 right-3 z-20 p-2 bg-black/70 hover:bg-[#D4AF37] hover:text-black text-white/80 rounded-full backdrop-blur-md transition-all cursor-pointer opacity-80 hover:opacity-100"
              title="Inspect high-resolution photo"
              aria-label="Inspect high resolution photo"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Left Slider Arrow (Shows when > 1 slide) */}
            {slides.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-black/75 hover:bg-[#D4AF37] hover:text-black text-white rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer border border-white/10 hover:border-[#D4AF37] ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-80 sm:opacity-40'
                }`}
                aria-label="Previous angle"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Right Slider Arrow (Shows when > 1 slide) */}
            {slides.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-black/75 hover:bg-[#D4AF37] hover:text-black text-white rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer border border-white/10 hover:border-[#D4AF37] ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-80 sm:opacity-40'
                }`}
                aria-label="Next angle"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Bottom Angle Name Overlay */}
            <div className="absolute bottom-3 inset-x-3 pointer-events-none z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-white font-mono text-[10px] tracking-widest uppercase border border-white/10 rounded-2xs">
                {currentSlide.label}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase bg-black/80 px-2 py-0.5 rounded-2xs border border-[#D4AF37]/30">
                SWIPE / CLICK &bull; {currentIndex + 1}/{slides.length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Angle Thumbnails Strip */}
      {viewMode === 'photos' && slides.length > 1 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {slides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={`${slide.url}-${idx}`}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex-shrink-0 w-16 sm:w-20 rounded-xs overflow-hidden border transition-all cursor-pointer text-left ${
                    isActive
                      ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] bg-[#141414]'
                      : 'border-[#222222] hover:border-[#555555] opacity-60 hover:opacity-100 bg-[#0E0E0E]'
                  }`}
                >
                  {/* Miniature Image */}
                  <div className="aspect-[4/5] w-full bg-black overflow-hidden relative">
                    <img
                      src={slide.url}
                      alt={slide.label}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {isActive && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    )}
                  </div>

                  {/* Micro Angle Label */}
                  <div className="p-1 text-center bg-[#0C0C0C] border-t border-[#1C1C1C]">
                    <span
                      className={`block font-mono text-[8px] sm:text-[9px] tracking-wider uppercase truncate ${
                        isActive ? 'text-[#D4AF37] font-bold' : 'text-[#888888]'
                      }`}
                    >
                      {slide.angle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* High-Resolution Fullscreen Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full h-[90vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222222] font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold uppercase tracking-widest">
                  {product.name}
                </span>
                <span className="text-[#666666]">
                  // {currentSlide.label} ({currentIndex + 1}/{slides.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-2 bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-black text-white rounded-full transition-colors cursor-pointer"
                aria-label="Close high resolution view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Central High-Resolution Zoom Stage */}
            <div className="flex-1 flex items-center justify-center overflow-hidden py-4 relative">
              <img
                src={currentSlide.url}
                alt={currentSlide.label}
                className="max-h-full max-w-full object-contain rounded-sm shadow-2xl"
              />

              {/* Navigation Arrows in Zoom View */}
              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 hover:bg-[#D4AF37] hover:text-black text-white rounded-full transition-colors cursor-pointer border border-[#333]"
                    aria-label="Previous angle"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/80 hover:bg-[#D4AF37] hover:text-black text-white rounded-full transition-colors cursor-pointer border border-[#333]"
                    aria-label="Next angle"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Angle Rail in Zoom View */}
            <div className="pt-3 border-t border-[#222222] flex items-center justify-center gap-2 overflow-x-auto">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase rounded-xs transition-colors cursor-pointer border ${
                    idx === currentIndex
                      ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                      : 'bg-[#141414] text-[#888888] hover:text-white border-[#2A2A2A]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
