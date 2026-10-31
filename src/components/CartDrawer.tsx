import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { GarmentVisual } from './GarmentVisual';
import { BRAND_INFO } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingFee,
    cartTotal,
    cartCount,
    setIsCheckoutOpen
  } = useShop();

  const [couponCode, setCouponCode] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    const itemsList = cart
      .filter((item) => item?.product)
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product?.name || 'VOID Streetwear Piece'} (Size: ${item.selectedSize}, Color: ${item.selectedColor?.name || 'Black'}, Qty: ${item.quantity}) - ₹${((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}`
      )
      .join('\n');

    const message = encodeURIComponent(
      `Hi VOID WEAR, I would like to order the following items from my shopping bag:\n\n${itemsList}\n\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}${discountAmount > 0 ? `\nDiscount: -₹${discountAmount.toLocaleString('en-IN')}` : ''}\nShipping: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}\nTotal Amount: ₹${cartTotal.toLocaleString('en-IN')}\n\nPlease let me know how to proceed with payment and delivery.`
    );

    window.open(`https://wa.me/918114150537?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  // Free shipping calculation
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / BRAND_INFO.freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, BRAND_INFO.freeShippingThreshold - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#0A0A0A] border-l border-[#1F1F1F] text-white h-full flex flex-col justify-between shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display font-extrabold text-base tracking-[0.18em] uppercase text-white">
              SHOPPING BAG
            </h3>
            <span className="font-mono text-xs text-[#888888]">({cartCount})</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#111111] border-b border-[#1C1C1C]">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5">
            <span className="text-[#CCCCCC]">
              {amountNeeded > 0 ? (
                <>ADD <strong className="text-[#D4AF37]">₹{amountNeeded}</strong> FOR FREE SHIPPING</>
              ) : (
                <span className="text-[#D4AF37] font-bold">COMPLIMENTARY SHIPPING UNLOCKED</span>
              )}
            </span>
            <span className="text-[#888888]">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full h-1 bg-[#222222] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#181818]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <ShoppingBag className="w-12 h-12 text-[#333333] mb-4 stroke-[1]" />
              <h4 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-white mb-1">
                YOUR BAG IS EMPTY
              </h4>
              <p className="text-xs text-[#777777] max-w-xs mb-6">
                Explore the latest drop and add statement pieces to your rotation.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-widest uppercase rounded-xs hover:bg-white transition-colors cursor-pointer"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            cart.filter((item) => item?.product).map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-20 bg-[#121212] rounded-xs border border-[#222222] overflow-hidden shrink-0 flex items-center justify-center relative">
                  {item.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product?.name || 'VOID Streetwear'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GarmentVisual product={item.product} colorHex={item.selectedColor?.hex || '#0B0B0B'} className="w-full h-full" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white line-clamp-1">
                        {item.product?.name || 'VOID Streetwear Piece'}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#666666] hover:text-red-400 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#888888] mt-1">
                      <span>SIZE: {item.selectedSize}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.selectedColor?.hex || '#0B0B0B' }} />
                        {item.selectedColor?.name || 'Black'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Item Total */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#161616]">
                    <div className="flex items-center border border-[#262626] rounded-xs bg-[#121212]">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs text-[#888888] hover:text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-[11px] font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs text-[#888888] hover:text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-xs font-bold text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area: Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#1C1C1C] bg-[#0C0C0C] space-y-4">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-[#D4AF37]/40 rounded-xs text-xs font-mono text-[#D4AF37]">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>COUPON: <strong>{appliedCoupon}</strong> (-₹{discountAmount})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-[#888888] hover:text-white underline text-[10px] cursor-pointer">
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="PROMO CODE (e.g. VOID10)"
                    className="flex-1 bg-[#141414] border border-[#242424] px-3 py-2 text-xs font-mono text-white placeholder-[#555555] uppercase rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#222222] hover:bg-[#D4AF37] hover:text-black text-white text-xs font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#888888]">
                <span>SUBTOTAL</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#D4AF37]">
                  <span>DISCOUNT</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#888888]">
                <span>SHIPPING</span>
                <span>{shippingFee === 0 ? <strong className="text-[#D4AF37]">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1C1C1C]">
                <span>TOTAL</span>
                <span className="text-base text-[#D4AF37]">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors cursor-pointer rounded-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-2.5 bg-[#141414] border border-[#282828] hover:border-[#D4AF37] text-[#D4AF37] text-xs font-display font-semibold tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>CHECKOUT VIA WHATSAPP</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
