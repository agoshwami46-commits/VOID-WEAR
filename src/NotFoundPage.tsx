import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, Compass, ShoppingBag } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useShop();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Background ambient gold aura */}
      <div className="absolute w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#D4AF37] mb-3">ERROR 404</p>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase mb-4 text-white">
          LOST IN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-500 to-[#D4AF37]">
            THE VOID
          </span>
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          The coordinate you are looking for has been archived, relocated, or consumed by the dark.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black font-black text-xs uppercase tracking-[0.25em] hover:bg-[#D4AF37] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-neutral-700 hover:border-white text-white font-black text-xs uppercase tracking-[0.25em] hover:bg-white/5 transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" /> Explore Shop
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-900 text-[11px] font-mono uppercase tracking-widest text-neutral-600">
          VOID WEAR // VARANASI, IN // NOT MADE FOR EVERYONE
        </div>
      </div>
    </div>
  );
};
