import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { formatPriceINR } from '../utils/productUtils';
import { ProductCard } from '../components/ProductCard';

export const AccountPage: React.FC = () => {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();
  const { orders, wishlist, products, openProductModal, addToCart, navigate, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>('orders');

  // Auth Form State for logged out users
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<any[]>([
    {
      id: 'addr-1',
      fullName: user?.displayName || 'Akash Goshwami',
      phone: '+91 8114150537',
      address: 'Pandeypur, Varanasi Studio',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pinCode: '221002',
      isDefault: true
    }
  ]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
        showToast('Welcome to VOID WEAR account', 'gold');
      } else {
        await loginWithEmail(email, password);
        showToast('Logged in successfully', 'gold');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      showToast('Logged in with Google', 'gold');
    } catch (err: any) {
      setAuthError(err.message || 'Google authentication failed.');
    }
  };

  // User-specific orders (or demo/local orders for this session)
  const userOrders = orders.filter((o) => !user || !o.userId || o.userId === user.uid || o.customer.email === user.email);

  // Wishlist products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // If not logged in, render login / register card
  if (!user) {
    return (
      <div className="pt-28 pb-32 bg-[#050505] text-white min-h-screen">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <span className="font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase block mb-2">
              VOID ATELIER ACCESS
            </span>
            <h1 className="font-display font-extrabold text-3xl tracking-[0.14em] uppercase text-white mb-2">
              CLIENT PORTAL
            </h1>
            <p className="text-xs text-[#888888] font-light">
              Sign in to manage your orders, live tracking, and saved wardrobe.
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#222222] p-8 rounded-sm shadow-2xl">
            <form onSubmit={handleAuth} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-[#888888] uppercase mb-1.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@voidwear.in"
                  className="w-full bg-[#121212] border border-[#2B2B2B] focus:border-[#D4AF37] p-2.5 text-xs font-mono text-white rounded-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-[#888888] uppercase mb-1.5">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121212] border border-[#2B2B2B] focus:border-[#D4AF37] p-2.5 text-xs font-mono text-white rounded-xs outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-white transition-colors cursor-pointer mt-2 disabled:opacity-50"
              >
                {authLoading ? 'VERIFYING...' : isRegister ? 'CREATE ACCOUNT' : 'ENTER PORTAL'}
              </button>
            </form>

            <div className="my-5 relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1E1E1E]"></div>
              </div>
              <span className="relative bg-[#0A0A0A] px-3 text-[10px] font-mono text-[#666666] uppercase">
                OR CONTINUE WITH
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>GOOGLE SECURE LOGIN</span>
            </button>

            <div className="mt-6 text-center text-xs font-mono text-[#888888]">
              {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-[#D4AF37] hover:underline uppercase ml-1 cursor-pointer font-bold"
              >
                {isRegister ? 'Sign In' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 bg-[#050505] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[#777777] uppercase mb-4">
          <button onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
            HOME
          </button>
          <span>/</span>
          <span className="text-[#D4AF37]">CLIENT PORTAL</span>
        </div>

        {/* Profile Card Header */}
        <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-6 sm:p-8 rounded-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#181818] border border-[#333333] flex items-center justify-center text-[#D4AF37] font-display font-bold text-xl">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white">
                  {user.displayName || 'VIP CLIENT'}
                </h1>
                <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] font-mono font-bold uppercase rounded-2xs">
                  VOID MEMBER
                </span>
              </div>
              <p className="text-xs font-mono text-[#777777]">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-[#141414] hover:bg-red-950/60 hover:border-red-700 border border-[#2B2B2B] text-xs font-mono font-bold uppercase tracking-wider text-[#A0A0A0] hover:text-white rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>DISCONNECT</span>
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[#1C1C1C] gap-6 mb-8 overflow-x-auto scrollbar-none font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>ORDERS ({userOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'wishlist'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>SAVED WARDROBE ({wishlist.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'addresses'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>SHIPPING ADDRESSES</span>
          </button>
        </div>

        {/* Tab 1: Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-sm p-6 space-y-4 hover:border-[#2E2E2E] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#181818]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white tracking-wider">
                          {order.orderId}
                        </span>
                        <span className="px-2 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] font-bold uppercase rounded-2xs">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#777777]">
                        Date: {order.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-white">
                        {formatPriceINR(order.total)}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('/track-order')}
                        className="px-3 py-1.5 bg-[#141414] hover:bg-[#D4AF37] hover:text-black border border-[#2B2B2B] text-xs font-mono font-bold uppercase tracking-wider text-white rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>TRACK PIECE</span>
                      </button>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="divide-y divide-[#141414]">
                    {order.items.map((item, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {item.product.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-10 h-12 object-cover rounded-2xs border border-[#222222]"
                            />
                          )}
                          <div>
                            <h4 className="font-display font-bold uppercase text-white">
                              {item.product.name}
                            </h4>
                            <span className="text-[10px] font-mono text-[#888888] uppercase">
                              {item.selectedColor.name} // SIZE {item.selectedSize} // QTY: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-white">
                          {formatPriceINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-[#0A0A0A] border border-[#1E1E1E] rounded-sm p-6">
                <Package className="w-10 h-10 text-[#444444] mx-auto mb-3" />
                <h3 className="font-display font-bold text-base uppercase text-white mb-2">
                  NO ORDERS PLACED YET
                </h3>
                <p className="text-xs text-[#888888] mb-6 font-light">
                  Explore our limited drops and signature oversized pieces.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-white transition-colors cursor-pointer"
                >
                  BROWSE SHOP ARCHIVE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenModal={openProductModal}
                    onQuickAdd={(prod, size, color) => addToCart(prod, size, color, 1)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0A0A0A] border border-[#1E1E1E] rounded-sm p-6">
                <Heart className="w-10 h-10 text-[#444444] mx-auto mb-3" />
                <h3 className="font-display font-bold text-base uppercase text-white mb-2">
                  YOUR WARDROBE IS EMPTY
                </h3>
                <p className="text-xs text-[#888888] mb-6 font-light">
                  Save pieces to your personal wishlist by clicking the heart icon on any product.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-white transition-colors cursor-pointer"
                >
                  EXPLORE ARCHIVE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-[#0A0A0A] border border-[#222222] p-6 rounded-sm space-y-3 relative"
              >
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] font-mono font-bold uppercase rounded-2xs">
                    DEFAULT SHIPPING
                  </span>
                )}
                <h3 className="font-display font-bold uppercase text-white">{addr.fullName}</h3>
                <p className="text-xs text-[#999999] leading-relaxed">
                  {addr.address}<br />
                  {addr.city}, {addr.state} — {addr.pinCode}<br />
                  India
                </p>
                <p className="font-mono text-xs text-[#777777]">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
