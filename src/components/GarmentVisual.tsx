import React from 'react';
import { Product } from '../types';

interface GarmentVisualProps {
  product: Product;
  colorHex?: string;
  className?: string;
  viewAngle?: 'front' | 'back' | 'macro' | 'logo';
  showBadge?: boolean;
}

export const GarmentVisual: React.FC<GarmentVisualProps> = ({
  product,
  colorHex,
  className = '',
  viewAngle = 'front',
  showBadge = true
}) => {
  const activeColor = colorHex || (product.colors[0]?.hex ?? '#0e0e0e');
  const isLight = activeColor === '#EDECE8' || activeColor === '#FFFFFF';
  const textColor = isLight ? '#111111' : '#E5C158';
  const strokeColor = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.08)';

  // Choose garment silhouette based on category
  const renderSilhouettes = () => {
    switch (product.category) {
      case 'HOODIES':
        return (
          <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]" fill="none">
            <defs>
              <linearGradient id={`grad-hoodie-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
                <stop offset="50%" stopColor={isLight ? '#dedcd5' : '#141416'} stopOpacity="0.9" />
                <stop offset="100%" stopColor={isLight ? '#c8c6be' : '#08080a'} stopOpacity="1" />
              </linearGradient>
              <filter id="fabric-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.08 0" />
                <feComposite in2="SourceGraphic" in="glitch" operator="in" />
              </filter>
            </defs>
            {/* Hood Base */}
            <path
              d="M140 110 C140 50, 170 30, 200 30 C230 30, 260 50, 260 110 C250 120, 230 130, 200 130 C170 130, 150 120, 140 110 Z"
              fill={activeColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Hood Interior Depth */}
            <path
              d="M155 105 C155 65, 175 48, 200 48 C225 48, 245 65, 245 105 C235 118, 215 124, 200 124 C185 124, 165 118, 155 105 Z"
              fill="#050505"
              opacity="0.85"
            />
            {/* Torso & Dropped Shoulders */}
            <path
              d="M135 115 L50 160 L75 270 L115 250 L115 420 L285 420 L285 250 L325 270 L350 160 L265 115 C240 125, 160 125, 135 115 Z"
              fill={`url(#grad-hoodie-${product.id})`}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Kangaroo Pocket */}
            <path
              d="M135 310 L160 300 L240 300 L265 310 L255 390 L145 390 Z"
              fill={activeColor}
              stroke="rgba(212,175,55,0.3)"
              strokeWidth="1.5"
              opacity="0.9"
            />
            {/* Center Brand Emblem */}
            <g transform="translate(160, 180) scale(0.4)">
              <circle cx="100" cy="100" r="75" stroke={textColor} strokeWidth="6" strokeDasharray="18 8" opacity="0.8" />
              <text x="100" y="98" fill={textColor} textAnchor="middle" fontSize="30" fontWeight="900" letterSpacing="6" fontFamily="sans-serif">VOID</text>
              <text x="100" y="125" fill="#888888" textAnchor="middle" fontSize="11" letterSpacing="4" fontFamily="sans-serif">BEYOND ORDINARY</text>
              <path d="M70 145 L100 195 L130 145 L118 145 L100 178 L82 145 Z" fill={textColor} />
            </g>
            {/* Ribbed Hem and Cuffs */}
            <line x1="115" y1="420" x2="285" y2="420" stroke="rgba(212,175,55,0.4)" strokeWidth="8" />
            <line x1="75" y1="270" x2="115" y2="250" stroke="rgba(212,175,55,0.3)" strokeWidth="6" />
            <line x1="285" y1="250" x2="325" y2="270" stroke="rgba(212,175,55,0.3)" strokeWidth="6" />
          </svg>
        );

      case 'BOTTOMS':
        return (
          <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]" fill="none">
            <defs>
              <linearGradient id={`grad-pants-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
                <stop offset="60%" stopColor={isLight ? '#dedcd5' : '#161719'} stopOpacity="0.9" />
                <stop offset="100%" stopColor={isLight ? '#c8c6be' : '#08080a'} stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Waistband */}
            <rect x="120" y="50" width="160" height="24" rx="4" fill={activeColor} stroke="rgba(212,175,55,0.4)" strokeWidth="2" />
            {/* Pants Legs */}
            <path
              d="M120 74 L95 410 L155 410 L195 190 L205 190 L245 410 L305 410 L280 74 Z"
              fill={`url(#grad-pants-${product.id})`}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Cargo Side Pockets */}
            <rect x="85" y="180" width="35" height="55" rx="3" fill={activeColor} stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />
            <rect x="280" y="180" width="35" height="55" rx="3" fill={activeColor} stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" />
            {/* Drawstrings with Gold Tips */}
            <path d="M190 74 Q190 130 180 150" stroke="#f3f3f3" strokeWidth="2.5" />
            <circle cx="180" cy="152" r="3.5" fill="#D4AF37" />
            <path d="M210 74 Q210 120 220 145" stroke="#f3f3f3" strokeWidth="2.5" />
            <circle cx="220" cy="147" r="3.5" fill="#D4AF37" />
            {/* Articulated Knee Pleats */}
            <line x1="110" y1="280" x2="160" y2="280" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <line x1="240" y1="280" x2="290" y2="280" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          </svg>
        );

      case 'OUTERWEAR':
        return (
          <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]" fill="none">
            <defs>
              <linearGradient id={`grad-bomber-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14171d" stopOpacity="1" />
                <stop offset="50%" stopColor={activeColor} stopOpacity="1" />
                <stop offset="100%" stopColor="#08090b" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Flight Bomber Silhouette */}
            <path
              d="M150 70 L60 120 L80 280 L125 260 L125 390 L275 390 L275 260 L320 280 L340 120 L250 70 C220 80, 180 80, 150 70 Z"
              fill={`url(#grad-bomber-${product.id})`}
              stroke="rgba(212,175,55,0.35)"
              strokeWidth="2.5"
            />
            {/* Ribbed Mandarin Collar */}
            <path d="M150 70 C170 85, 230 85, 250 70" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" />
            {/* Industrial Heavy Center Zipper */}
            <line x1="200" y1="78" x2="200" y2="390" stroke="#D4AF37" strokeWidth="3" strokeDasharray="6 3" />
            <rect x="196" y="160" width="8" height="18" fill="#FFF2B2" rx="1" />
            {/* Arm Utility Pocket & Red/Gold Flight Tag */}
            <rect x="65" y="160" width="22" height="36" rx="2" fill="#050505" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            <rect x="74" y="196" width="4" height="24" fill="#D4AF37" rx="1" />
            {/* Quilted lines */}
            <line x1="130" y1="200" x2="190" y2="230" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            <line x1="210" y1="230" x2="270" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          </svg>
        );

      case 'ACCESSORIES':
        return (
          <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]" fill="none">
            {/* Structured Streetwear Cap */}
            <path
              d="M100 240 C100 130, 300 130, 300 240 L340 260 C260 275, 140 275, 60 260 Z"
              fill={activeColor}
              stroke="rgba(212,175,55,0.4)"
              strokeWidth="2"
            />
            {/* Cap Brim Visor */}
            <path
              d="M60 260 C130 295, 270 295, 340 260 C280 320, 120 320, 60 260 Z"
              fill="#060606"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            {/* 3D Embroidered Front Emblem */}
            <circle cx="200" cy="190" r="30" stroke="#D4AF37" strokeWidth="3" strokeDasharray="8 4" />
            <path d="M190 185 L200 205 L210 185 L205 185 L200 197 L195 185 Z" fill="#D4AF37" />
          </svg>
        );

      case 'T-SHIRTS':
      default:
        return (
          <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]" fill="none">
            <defs>
              <linearGradient id={`grad-tee-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
                <stop offset="50%" stopColor={isLight ? '#e6e4dc' : '#141416'} stopOpacity="0.95" />
                <stop offset="100%" stopColor={isLight ? '#c8c6be' : '#08080a'} stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Oversized Boxy Tee Silhouette */}
            <path
              d="M150 90 L60 135 L85 240 L125 220 L125 410 L275 410 L275 220 L315 240 L340 135 L250 90 C225 110, 175 110, 150 90 Z"
              fill={`url(#grad-tee-${product.id})`}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Thick Ribbed Crewneck Collar */}
            <path
              d="M150 90 C175 110, 225 110, 250 90 C235 78, 165 78, 150 90 Z"
              fill={isLight ? '#dedcd5' : '#0a0a0c'}
              stroke="rgba(212,175,55,0.4)"
              strokeWidth="2"
            />
            {/* Center Front Graphic: Distressed Enso & VOID WEAR Mark */}
            <g transform="translate(140, 160) scale(0.6)">
              <circle cx="100" cy="100" r="70" stroke={textColor} strokeWidth="7" strokeDasharray="22 10" opacity="0.85" />
              <text x="100" y="98" fill={textColor} textAnchor="middle" fontSize="32" fontWeight="900" letterSpacing="8" fontFamily="sans-serif">VOID</text>
              <text x="100" y="125" fill="#888888" textAnchor="middle" fontSize="12" letterSpacing="4" fontFamily="sans-serif">BEYOND ORDINARY</text>
              <path d="M72 145 L100 196 L128 145 L116 145 L100 178 L84 145 Z" fill={textColor} />
            </g>
            {/* Streetwear Hem Tag in Gold */}
            <rect x="255" y="398" width="18" height="12" fill="#D4AF37" rx="1" />
            {/* Shoulder Drop Seam Lines */}
            <line x1="150" y1="90" x2="110" y2="155" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <line x1="250" y1="90" x2="290" y2="155" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#111111] via-[#090909] to-[#040404] p-4 select-none ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

      {/* Luxury Metallic Hairline Grid Accent */}
      <div className="absolute top-3 left-3 text-[10px] tracking-[0.25em] text-[#888888]/50 uppercase font-mono">
        VW//{product.category.slice(0, 3)}
      </div>
      <div className="absolute bottom-3 right-3 text-[9px] tracking-[0.2em] text-[#D4AF37]/60 font-mono uppercase">
        {product.gsm} GSM
      </div>

      {/* Main Garment Vector Silhouette with Dynamic Textures */}
      <div className="w-full max-w-[320px] max-h-[380px] flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
        {renderSilhouettes()}
      </div>

      {/* Corner Metallic Gold Rivet Accents */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border border-[#D4AF37]/40 rounded-full" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border border-[#D4AF37]/40 rounded-full" />
    </div>
  );
};
