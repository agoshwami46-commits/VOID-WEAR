import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_INFO } from '../data/products';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsAppSupport } = useShop();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 animate-fadeIn select-none">
      {/* Floating Action Pill */}
      <div className="group relative flex items-center bg-[#0C0C0C]/90 backdrop-blur-md border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white py-2.5 px-4 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.8)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]">
        
        {/* Pulsing indicator */}
        <span className="relative flex h-2 w-2 mr-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
        </span>

        <button
          onClick={() => openWhatsAppSupport()}
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-display font-bold text-[11px] tracking-[0.2em] uppercase text-white group-hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            CHAT WITH VOID WEAR
          </span>
        </button>

        {/* Small dismiss X button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="ml-2 text-[#666666] hover:text-white transition-colors cursor-pointer p-0.5"
          title="Dismiss"
          aria-label="Dismiss chat widget"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
