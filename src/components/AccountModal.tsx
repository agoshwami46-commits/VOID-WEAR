import React from 'react';
import { X, User, Package, Shield, MapPin, MessageSquare, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_INFO } from '../data/products';

export const AccountModal: React.FC = () => {
  const { isAccountOpen, setIsAccountOpen, orders, openWhatsAppSupport } = useShop();

  if (!isAccountOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
      onClick={() => setIsAccountOpen(false)}
    >
      <div
        className="bg-[#0D0D0D] border border-[#242424] max-w-xl w-full rounded-sm overflow-hidden shadow-2xl relative max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-display font-extrabold text-sm tracking-[0.2em] uppercase text-white">
              CLIENT PORTAL // VOID INNER CIRCLE
            </h3>
          </div>
          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Member Card */}
          <div className="p-6 bg-gradient-to-br from-[#181818] via-[#0E0E0E] to-[#080808] border border-[#D4AF37]/30 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-2xl rounded-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase">
                TIER: VIP PRIVILEGED ACCESS
              </span>
              <Shield className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h4 className="font-display font-extrabold text-xl tracking-[0.15em] uppercase text-white mb-1">
              VOID MEMBER
            </h4>
            <p className="text-[11px] font-mono text-[#888888] uppercase">
              VARANASI // GLOBAL DISPATCH
            </p>
            <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between text-[10px] font-mono text-[#777777]">
              <span>PRIORITY ACCESS TO ALL DROPS</span>
              <span>COMPLIMENTARY CONCIERGE</span>
            </div>
          </div>

          {/* Orders History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase text-white flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>ORDER ARCHIVE</span>
              </h4>
              <span className="font-mono text-xs text-[#777777]">{orders.length} ORDERS</span>
            </div>

            {orders.length === 0 ? (
              <div className="p-6 bg-[#111111] border border-[#1F1F1F] text-center rounded-xs text-xs font-mono text-[#666666] uppercase">
                NO ORDERS PLACED YET IN THIS SESSION.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-4 bg-[#111111] border border-[#202020] rounded-xs font-mono text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white">ORDER #{order.orderId}</strong>
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] uppercase font-bold rounded-xs">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#888888]">
                      {order.createdAt} • {order.items.length} items • ₹{order.total.toLocaleString('en-IN')} ({order.paymentMethod})
                    </div>
                    <div className="text-[10px] text-[#666666] truncate">
                      Deliver to: {order.customer.fullName}, {order.customer.city}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Direct Concierge Action */}
          <div className="pt-4 border-t border-[#1C1C1C]">
            <button
              onClick={() => {
                setIsAccountOpen(false);
                openWhatsAppSupport("Hi Akash, I'm contacting customer support regarding my VOID WEAR account.");
              }}
              className="w-full py-3 bg-[#161616] border border-[#262626] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>TALK TO ATELIER CONCIERGE (+91 8114150537)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
