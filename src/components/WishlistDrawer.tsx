import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { GarmentVisual } from './GarmentVisual';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    products,
    openProductModal,
    addToCart,
    wishlistCount
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#0A0A0A] border-l border-[#1F1F1F] text-white h-full flex flex-col justify-between shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
            <h3 className="font-display font-extrabold text-base tracking-[0.18em] uppercase text-white">
              SAVED PIECES
            </h3>
            <span className="font-mono text-xs text-[#888888]">({wishlistCount})</span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#181818]">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <Heart className="w-12 h-12 text-[#333333] mb-4 stroke-[1]" />
              <h4 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-white mb-1">
                WISHLIST IS EMPTY
              </h4>
              <p className="text-xs text-[#777777] max-w-xs mb-6">
                Save your favorite luxury streetwear pieces to keep track of limited availability.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="px-6 py-2.5 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-widest uppercase rounded-xs hover:bg-white transition-colors cursor-pointer"
              >
                EXPLORE NEW DROP
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div key={product.id} className="py-4 flex gap-4">
                {/* Thumbnail */}
                <div
                  onClick={() => {
                    setIsWishlistOpen(false);
                    openProductModal(product);
                  }}
                  className="w-16 h-20 bg-[#121212] rounded-xs border border-[#222222] overflow-hidden shrink-0 flex items-center justify-center cursor-pointer relative"
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GarmentVisual product={product} className="w-full h-full" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          setIsWishlistOpen(false);
                          openProductModal(product);
                        }}
                        className="font-display font-bold text-xs uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-[#666666] hover:text-red-400 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono text-xs font-bold text-[#D4AF37] mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Move to bag button */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        addToCart(product, product.sizes[0], product.colors[0], 1);
                        toggleWishlist(product.id);
                      }}
                      className="flex-1 py-1.5 px-3 bg-[#1C1C1C] hover:bg-[#D4AF37] hover:text-black text-white text-[10px] font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>MOVE TO BAG</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-5 border-t border-[#1C1C1C] bg-[#0C0C0C]">
            <button
              onClick={() => {
                wishlistedProducts.forEach((p) => {
                  addToCart(p, p.sizes[0], p.colors[0], 1);
                });
                setIsWishlistOpen(false);
              }}
              className="w-full py-3 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors cursor-pointer rounded-xs flex items-center justify-center gap-2"
            >
              <span>MOVE ALL TO SHOPPING BAG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
