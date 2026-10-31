import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, Check, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#0E0E0E]/95 backdrop-blur-md border border-[#D4AF37]/50 text-white p-3.5 rounded-xs shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-fadeIn text-xs font-mono"
        >
          {toast.type === 'gold' ? (
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
          ) : toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#999999] shrink-0" />
          )}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
