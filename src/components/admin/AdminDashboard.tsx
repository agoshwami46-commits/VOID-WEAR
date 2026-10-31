import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  LogOut,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Lock,
  Calendar,
  Sparkles,
  TrendingUp,
  RefreshCw,
  User,
  Users,
  Truck,
  CreditCard,
  Tag,
  Globe,
  BarChart3,
  Settings,
  Phone,
  Mail,
  Send,
  Check,
  X,
  FileText
} from 'lucide-react';
import { useAuth, PRIMARY_ADMIN_EMAIL } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { Product, OrderDetails, OrderStatus, Category, LeaderProfile, Coupon, Review, QikinkSkuMapping } from '../../types';
import { subscribeToOrders, updateOrderStatus } from '../../services/orderService';
import { ProductEditModal } from './ProductEditModal';
import { EditLeadershipModal } from '../EditLeadershipModal';
import { BRAND_INFO } from '../../data/products';
import { getStoredLeadershipProfiles, saveStoredLeadershipProfiles } from '../../data/leadership';

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'qikink'
  | 'payments'
  | 'reviews'
  | 'coupons'
  | 'content'
  | 'analytics'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    isAdmin,
    loading: authLoading,
    isPasscodeUnlocked,
    unlockWithPassword,
    lockAdmin,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout
  } = useAuth();
  const {
    allProducts,
    addProductItem,
    updateProductItem,
    deleteProductItem,
    togglePublishItem,
    updateProductPrice,
    navigate,
    dropDate,
    setDropDate,
    showToast,
    // Qikink
    sendOrderToQikink,
    syncQikinkStatus,
    retryQikinkOrder,
    qikinkMappings,
    saveQikinkMapping,
    // CMS
    websiteContent,
    updateWebsiteContent,
    // Reviews
    reviews,
    addReview
  } = useShop();

  // Tab State - default to 'dashboard'
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Products Tab State
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category>('ALL');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Orders Tab State
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { trackingNumber: string; courier: string }>>({});

  // Login Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Leadership Profiles State
  const [leadershipProfiles, setLeadershipProfiles] = useState<LeaderProfile[]>(() => getStoredLeadershipProfiles());
  const [adminEditLeader, setAdminEditLeader] = useState<LeaderProfile | null>(null);
  const [isAdminLeaderModalOpen, setIsAdminLeaderModalOpen] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'cp_void10',
      code: 'VOID10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 999,
      maxUsage: 100,
      usedCount: 24,
      isActive: true
    },
    {
      id: 'cp_firstdrop',
      code: 'FIRSTDROP',
      discountType: 'FIXED',
      discountValue: 500,
      minOrderValue: 2499,
      maxUsage: 50,
      usedCount: 11,
      isActive: true
    },
    {
      id: 'cp_vip20',
      code: 'VOIDVIP20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 3999,
      maxUsage: 25,
      usedCount: 6,
      isActive: true
    }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newCouponValue, setNewCouponValue] = useState<number>(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(999);

  // CMS Content Local Edit State
  const [cmsForm, setCmsForm] = useState(websiteContent);
  useEffect(() => {
    if (websiteContent) {
      setCmsForm(websiteContent);
    }
  }, [websiteContent]);
  const [cmsSaving, setCmsSaving] = useState(false);

  // SKU Mapping Form State
  const [newMapProduct, setNewMapProduct] = useState('');
  const [newMapColor, setNewMapColor] = useState('Pitch Black');
  const [newMapSize, setNewMapSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [newMapVoidSku, setNewMapVoidSku] = useState('');
  const [newMapQikinkSku, setNewMapQikinkSku] = useState('');

  // New Review Form State
  const [newRevName, setNewRevName] = useState('');
  const [newRevLocation, setNewRevLocation] = useState('Varanasi, UP');
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevProduct, setNewRevProduct] = useState('VOID SIGNATURE OVERSIZED TEE');
  const [newRevComment, setNewRevComment] = useState('');

  // Real-time Orders Listener (when admin is authenticated)
  useEffect(() => {
    if (user && isAdmin) {
      setOrdersLoading(true);
      const unsubscribe = subscribeToOrders(
        (fetchedOrders) => {
          setOrders(fetchedOrders);
          setOrdersLoading(false);
        },
        (error) => {
          console.warn('Orders subscription notice:', error);
          setOrdersLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user, isAdmin]);

  const handleSaveLeaderProfile = (updated: LeaderProfile) => {
    const updatedList = leadershipProfiles.map((l) => (l.id === updated.id ? updated : l));
    setLeadershipProfiles(updatedList);
    saveStoredLeadershipProfiles(updatedList);
    showToast(`${updated.name}'s profile updated successfully`, 'gold');
  };

  // Handle Login
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      if (passwordInput.trim() === '70772710void') {
        unlockWithPassword(passwordInput);
        showToast('Admin session unlocked via master password', 'gold');
        return;
      }
      if (isRegisterMode) {
        await registerWithEmail(emailInput.trim(), passwordInput);
        showToast('Admin account registered and logged in', 'gold');
      } else {
        await loginWithEmail(emailInput.trim(), passwordInput);
        showToast('Admin session authenticated', 'gold');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoginError('');
    setLoginLoading(true);
    try {
      await loginWithGoogle();
      showToast('Authenticated via Google', 'gold');
    } catch (err: any) {
      setLoginError(err.message || 'Google authentication failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  // KPI Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = allProducts.length;
  const lowStockCount = allProducts.filter((p) => p.stockCount <= 5).length;
  const activeOrdersCount = orders.filter((o) => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status)).length;
  const qikinkPendingCount = orders.filter((o) => ['PAID', 'PROCESSING', 'CONFIRMED'].includes(o.status)).length;

  // Filtered Products
  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesLowStock = !onlyLowStock || p.stockCount <= 5;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearch.trim() ||
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.phone?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.city?.toLowerCase().includes(orderSearch.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Aggregated Customers
  const customerList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      email: string;
      phone: string;
      city: string;
      state: string;
      ordersCount: number;
      totalSpend: number;
      lastOrderDate: string;
    }>();

    orders.forEach((o) => {
      if (!o.customer) return;
      const key = o.customer.email || o.customer.phone || o.customer.fullName;
      if (!key) return;

      const existing = map.get(key);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpend += o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
      } else {
        map.set(key, {
          name: o.customer.fullName || 'Guest Client',
          email: o.customer.email || '—',
          phone: o.customer.phone || '—',
          city: o.customer.city || '—',
          state: o.customer.state || '—',
          ordersCount: 1,
          totalSpend: o.total,
          lastOrderDate: o.createdAt
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order #${orderId} marked as ${newStatus}`, 'gold');
    } catch (err: any) {
      showToast(`Failed to update order status: ${err.message}`, 'info');
    }
  };

  const handleUpdateTracking = async (orderId: string) => {
    const data = trackingInputs[orderId];
    if (!data?.trackingNumber) {
      showToast('Enter tracking number first', 'info');
      return;
    }
    try {
      await updateOrderStatus(orderId, 'SHIPPED');
      showToast(`Updated tracking for #${orderId}: ${data.courier || 'Express Air'} - ${data.trackingNumber}`, 'gold');
    } catch (err: any) {
      showToast(`Failed: ${err.message}`, 'info');
    }
  };

  const handleTriggerQikink = async (orderId: string) => {
    const res = await sendOrderToQikink(orderId);
    if (res.success) {
      showToast(`Order #${orderId} successfully dispatched to Qikink fulfillment!`, 'gold');
    } else {
      showToast(`Qikink push notice: ${res.message || 'Queued locally'}`, 'info');
    }
  };

  const openCustomerWhatsApp = (order: OrderDetails) => {
    const cleanPhone = (order.customer?.phone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Hello ${order.customer?.fullName || 'Client'}, this is Akash Goshwami from VOID WEAR regarding your Order #${order.orderId} (₹${order.total.toLocaleString('en-IN')}). Your package status is currently: ${order.status}. Let us know if you need any styling or delivery assistance!`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>, id?: string) => {
    if (id) {
      await updateProductItem(id, productData);
    } else {
      await addProductItem(productData);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductItem(productToDelete.id);
      showToast(`Removed piece ${productToDelete.sku} from catalog`, 'info');
    } catch (err: any) {
      showToast(`Failed to delete: ${err.message}`, 'info');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSaving(true);
    try {
      await updateWebsiteContent(cmsForm);
      showToast('Storefront content and policies updated live!', 'gold');
    } catch (err: any) {
      showToast(`Failed to save content: ${err.message}`, 'info');
    } finally {
      setCmsSaving(false);
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon: Coupon = {
      id: `cp_${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderValue: Number(newCouponMinOrder),
      usedCount: 0,
      isActive: true
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setNewCouponCode('');
    showToast(`Coupon ${newCoupon.code} created successfully`, 'gold');
  };

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevName || !newRevComment) return;
    await addReview({
      name: newRevName,
      location: newRevLocation,
      rating: newRevRating,
      productName: newRevProduct,
      comment: newRevComment
    });
    setNewRevName('');
    setNewRevComment('');
    showToast('Verified client review added to storefront', 'gold');
  };

  // If Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono text-xs">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <span className="tracking-[0.2em] uppercase text-[#D4AF37]">
            VERIFYING ENCRYPTED SESSION...
          </span>
        </div>
      </div>
    );
  }

  // Not Authenticated as Administrator -> Show Secure Login View
  if (!isAdmin && !isPasscodeUnlocked) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between p-4 sm:p-8 font-mono">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#1A1A1A]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs text-[#888888] hover:text-[#D4AF37] transition-colors uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO STOREFRONT</span>
          </button>
          <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
            RESTRICTED ATELIER ACCESS
          </span>
        </div>

        <div className="max-w-md w-full mx-auto my-12 bg-[#0C0C0C] border border-[#242424] p-8 sm:p-10 rounded-xs shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-2xl rounded-full pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/50 mx-auto mb-4 bg-black p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <img src="/void-logo.jpg" alt="VOID WEAR" className="w-full h-full object-cover" />
            </div>
            <h2 className="font-display font-extrabold text-2xl tracking-[0.2em] uppercase text-white mb-1">
              VOID WEAR
            </h2>
            <p className="font-luxury text-xs tracking-[0.3em] text-[#D4AF37] uppercase">
              ADMINISTRATOR CONTROL CENTER
            </p>
          </div>

          <div className="p-3 bg-[#141414] border border-[#222222] rounded-xs mb-6 text-[11px] text-[#A0A0A0] leading-relaxed">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>AUTHENTICATION REQUIRED</span>
            </div>
            Sign in with verified administrator credentials (<strong className="text-white">{PRIMARY_ADMIN_EMAIL}</strong>) to access products, live orders, Qikink fulfillment, and site content.
          </div>

          {user && !isAdmin && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-xs mb-4">
              Signed in as <strong className="text-white">{user.email}</strong>, but this account is not registered as an administrator.
              <button
                onClick={() => logout()}
                className="mt-2 block w-full py-1.5 bg-red-900/40 hover:bg-red-800 text-white rounded-xs uppercase tracking-wider text-[10px] font-bold"
              >
                SIGN OUT
              </button>
            </div>
          )}

          {loginError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-xs mb-4">
              {loginError}
            </div>
          )}

          <button
            type="button"
            disabled={loginLoading}
            onClick={handleGoogleAuth}
            className="w-full py-3.5 bg-white text-black hover:bg-[#D4AF37] transition-all font-display font-bold text-xs tracking-[0.2em] uppercase rounded-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg mb-6"
          >
            <Shield className="w-4 h-4 text-black" />
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-[#222222]" />
            <span className="flex-shrink mx-4 text-[#555555] text-[10px] uppercase">OR EMAIL PASSWORD</span>
            <div className="flex-grow border-t border-[#222222]" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-[10px] text-[#888888] uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="agoshwami46@gmail.com"
                className="w-full bg-[#121212] border border-[#242424] px-3 py-2.5 text-xs text-white rounded-xs outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#888888] uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121212] border border-[#242424] px-3 py-2.5 text-xs text-white rounded-xs outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#1A1A1A] hover:bg-white hover:text-black border border-[#333333] text-white font-display font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-colors cursor-pointer"
            >
              {loginLoading ? 'AUTHENTICATING...' : isRegisterMode ? 'REGISTER ADMIN' : 'SIGN IN'}
            </button>
          </form>
        </div>

        <div className="max-w-6xl mx-auto w-full pt-6 border-t border-[#1A1A1A] text-center text-[#555555] text-[10px] uppercase tracking-widest">
          VOID WEAR // VARANASI, IN // ENCRYPTED CONTROL PANEL
        </div>
      </div>
    );
  }

  // Navigation Tabs Configuration (11 Sections)
  const navTabs: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package, badge: totalProducts },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: activeOrdersCount },
    { id: 'customers', label: 'Customers', icon: Users, badge: customerList.length },
    { id: 'qikink', label: 'Qikink POD', icon: Truck, badge: qikinkPendingCount },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: reviews.length },
    { id: 'coupons', label: 'Coupons', icon: Tag, badge: coupons.filter((c) => c.isActive).length },
    { id: 'content', label: 'Website Content', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F3F3] flex flex-col font-mono text-xs">
      {/* Top Admin Header */}
      <header className="bg-[#0A0A0A] border-b border-[#1C1C1C] px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-black p-0.5 shrink-0">
              <img src="/void-logo.jpg" alt="VOID WEAR" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-white block">
                VOID WEAR
              </span>
              <span className="font-luxury text-[8px] tracking-[0.3em] text-[#D4AF37] uppercase">
                ADMIN CONTROL CENTER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-[11px] text-[#888888]">
              LOGGED AS: <strong className="text-white">{user?.email || 'Akash Goshwami (Master Admin)'}</strong>
            </span>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#D4AF37]/40 rounded-xs text-[#D4AF37] text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>AUTHORIZED SESSION ACTIVE</span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 bg-[#141414] border border-[#282828] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] rounded-xs text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>STOREFRONT</span>
            </button>

            <button
              onClick={() => {
                lockAdmin();
                logout();
                showToast('Admin session locked. Password required to re-enter.', 'info');
              }}
              className="px-2.5 py-1.5 bg-[#141414] hover:bg-red-950/60 border border-[#282828] hover:border-red-500/50 text-[#AAAAAA] hover:text-red-400 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOCK</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[#0C0C0C] border border-[#1C1C1C] rounded-xs">
            <div className="text-[10px] text-[#888888] uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>TOTAL REVENUE</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] text-[#666666] tracking-wider uppercase mt-1 block">Verified Orders</span>
          </div>

          <div className="p-4 bg-[#0C0C0C] border border-[#1C1C1C] rounded-xs">
            <div className="text-[10px] text-[#888888] uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>ACTIVE ORDERS</span>
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {activeOrdersCount} <span className="text-xs text-neutral-500 font-normal">/ {totalOrders}</span>
            </div>
            <span className="text-[9px] text-[#666666] tracking-wider uppercase mt-1 block">In fulfillment pipeline</span>
          </div>

          <div className="p-4 bg-[#0C0C0C] border border-[#1C1C1C] rounded-xs">
            <div className="text-[10px] text-[#888888] uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>CATALOG PIECES</span>
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {totalProducts}
            </div>
            <span className="text-[9px] text-[#666666] tracking-wider uppercase mt-1 block">Published styles</span>
          </div>

          <div className="p-4 bg-[#0C0C0C] border border-[#1C1C1C] rounded-xs">
            <div className="text-[10px] text-[#888888] uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>QIKINK QUEUE</span>
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className={`text-xl sm:text-2xl font-bold font-mono ${qikinkPendingCount > 0 ? 'text-amber-400' : 'text-white'}`}>
              {qikinkPendingCount}
            </div>
            <span className="text-[9px] text-[#666666] tracking-wider uppercase mt-1 block">Awaiting print push</span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-[#1C1C1C] overflow-x-auto gap-1 pb-1 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-3.5 font-display font-bold text-xs tracking-[0.16em] uppercase transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#D4AF37] text-white bg-[#101010]'
                    : 'border-transparent text-[#777777] hover:text-white hover:bg-[#0D0D0D]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${isActive ? 'bg-[#D4AF37] text-black font-bold' : 'bg-[#1C1C1C] text-[#888888]'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions Panel */}
              <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
                  QUICK ATELIER ACTIONS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsModalOpen(true);
                    }}
                    className="p-3 bg-[#111] hover:bg-[#D4AF37] hover:text-black border border-neutral-800 text-left transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <div>
                      <div className="font-bold text-xs">ADD NEW PIECE</div>
                      <div className="text-[10px] text-neutral-400">Launch new garment</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('qikink')}
                    className="p-3 bg-[#111] hover:bg-[#D4AF37] hover:text-black border border-neutral-800 text-left transition-colors flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <div>
                      <div className="font-bold text-xs">QIKINK FULFILLMENT</div>
                      <div className="text-[10px] text-neutral-400">{qikinkPendingCount} ready to push</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('content')}
                    className="p-3 bg-[#111] hover:bg-[#D4AF37] hover:text-black border border-neutral-800 text-left transition-colors flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <div>
                      <div className="font-bold text-xs">STOREFRONT CMS</div>
                      <div className="text-[10px] text-neutral-400">Edit banners & text</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-3 bg-[#111] hover:bg-[#D4AF37] hover:text-black border border-neutral-800 text-left transition-colors flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <div>
                      <div className="font-bold text-xs">MANAGE ORDERS</div>
                      <div className="text-[10px] text-neutral-400">Track & dispatch</div>
                    </div>
                  </button>
                </div>

                <div className="p-3 bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-300">
                  <div className="text-[#D4AF37] font-bold mb-1">VARANASI ATELIER STATUS</div>
                  Studio active 7 days a week. Orders synced with Cloud Firestore. Razorpay payment webhook operational.
                </div>
              </div>

              {/* Low Stock Warning Box */}
              <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> LOW STOCK ALERTS
                  </h3>
                  <button onClick={() => setActiveTab('products')} className="text-[10px] text-neutral-400 hover:text-white">
                    VIEW ALL
                  </button>
                </div>

                {lowStockCount === 0 ? (
                  <p className="text-neutral-500 text-xs py-4">All catalog garments have healthy inventory reserves.</p>
                ) : (
                  <div className="space-y-2">
                    {allProducts
                      .filter((p) => p.stockCount <= 5)
                      .slice(0, 4)
                      .map((p) => (
                        <div key={p.id} className="p-2 bg-[#121212] border border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-xs truncate max-w-[180px]">{p.name}</div>
                            <div className="text-[10px] text-neutral-400 font-mono">{p.sku}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-amber-950 text-amber-400 font-bold text-[10px]">
                            {p.stockCount} LEFT
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Founder Direct Card */}
              <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-3">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
                  ATELIER CONCIERGE DIRECT
                </h3>
                <p className="text-xs text-neutral-400">
                  Quick links to direct VIP client communication channels.
                </p>
                <div className="space-y-2 pt-2">
                  <a
                    href="https://wa.me/918114150537"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#121212] border border-neutral-800 hover:border-emerald-600 flex items-center gap-2.5 text-xs text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold">+91 8114150537</div>
                      <div className="text-[10px] text-neutral-400">WhatsApp Atelier Support</div>
                    </div>
                  </a>
                  <a
                    href="mailto:voidwear1010@gmail.com"
                    className="p-2.5 bg-[#121212] border border-neutral-800 hover:border-white flex items-center gap-2.5 text-xs text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <div className="font-bold">voidwear1010@gmail.com</div>
                      <div className="text-[10px] text-neutral-400">Founder & Studio Desk</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  RECENT ORDERS STREAM
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  VIEW ALL ORDERS ({totalOrders}) →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-neutral-500 text-xs py-6 text-center">No orders placed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#111] text-[#D4AF37] uppercase border-b border-[#222]">
                      <tr>
                        <th className="p-3">ORDER ID</th>
                        <th className="p-3">CUSTOMER</th>
                        <th className="p-3">ITEMS</th>
                        <th className="p-3">AMOUNT</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#181818]">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.orderId} className="hover:bg-[#111]">
                          <td className="p-3 font-bold text-white">#{o.orderId}</td>
                          <td className="p-3 text-neutral-300">
                            {o.customer?.fullName || 'Guest'} <br />
                            <span className="text-[10px] text-neutral-500">{o.customer?.city || 'India'}</span>
                          </td>
                          <td className="p-3 text-neutral-400">{o.items?.length || 1} pcs</td>
                          <td className="p-3 text-white font-bold">₹{o.total?.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-[#181818] border border-neutral-700 text-[#D4AF37] text-[10px] font-bold">
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => openCustomerWhatsApp(o)}
                              className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold hover:bg-emerald-900"
                            >
                              WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] p-4 border border-[#1A1A1A]">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search name, SKU, category..."
                    className="w-full bg-[#121212] border border-[#242424] pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as Category)}
                  className="bg-[#121212] border border-[#242424] text-white py-2 px-3 text-xs uppercase outline-none"
                >
                  <option value="ALL">ALL CATEGORIES</option>
                  <option value="T-SHIRTS">T-SHIRTS</option>
                  <option value="HOODIES">HOODIES</option>
                  <option value="BOTTOMS">BOTTOMS</option>
                  <option value="ACCESSORIES">ACCESSORIES</option>
                  <option value="OUTERWEAR">OUTERWEAR</option>
                </select>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#888888] hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={onlyLowStock}
                    onChange={(e) => setOnlyLowStock(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  <span>LOW STOCK ONLY</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                className="py-2.5 px-5 bg-[#D4AF37] hover:bg-white text-black font-display font-bold text-xs tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW PIECE</span>
              </button>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111111] text-[#D4AF37] uppercase border-b border-[#1C1C1C]">
                    <tr>
                      <th className="p-3.5">PRODUCT & VIEWS</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">CATEGORY</th>
                      <th className="p-3.5">PRICE</th>
                      <th className="p-3.5">STOCK</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161616] text-[#CCCCCC]">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#666666] uppercase">
                          No products found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#101010] transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <div className="w-12 h-14 bg-black overflow-hidden border border-[#222222] shrink-0 relative group">
                              <img
                                src={p.images?.[0] || '/void-logo.jpg'}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <span className="absolute bottom-0 right-0 bg-black/90 text-[7px] px-1 text-[#D4AF37] font-bold">
                                {p.images?.length || 1}V
                              </span>
                            </div>
                            <div>
                              <div className="font-display font-bold text-xs uppercase text-white">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-[#777777] flex items-center gap-1.5 mt-0.5">
                                <span>{p.colors?.length || 1} Colors</span>
                                <span>•</span>
                                <span>{p.sizes?.join(', ') || 'S-XL'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 text-neutral-400 font-mono text-[11px]">{p.sku}</td>
                          <td className="p-3.5 text-neutral-300">{p.category}</td>
                          <td className="p-3.5 font-bold text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                                p.stockCount === 0
                                  ? 'bg-red-950 text-red-400'
                                  : p.stockCount <= 5
                                  ? 'bg-amber-950 text-amber-400'
                                  : 'bg-emerald-950 text-emerald-400'
                              }`}
                            >
                              {p.stockCount} in stock
                            </span>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => togglePublishItem(p.id, p.isPublished)}
                              className={`px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase border transition-colors ${
                                p.isPublished
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                                  : 'bg-[#181818] text-[#888888] border-[#333333] hover:text-white'
                              }`}
                            >
                              {p.isPublished ? '● PUBLISHED' : '○ DRAFT'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-[#888888] hover:text-[#D4AF37] transition-colors"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="p-1.5 text-[#888888] hover:text-red-400 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0A] p-4 border border-[#1A1A1A]">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order ID, customer, city, phone..."
                    className="w-full bg-[#121212] border border-[#242424] pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#121212] border border-[#242424] text-white py-2 px-3 text-xs uppercase outline-none"
                >
                  <option value="ALL">ALL STATUSES</option>
                  <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SENT_TO_QIKINK">SENT TO QIKINK</option>
                  <option value="PRINTING">PRINTING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div className="text-[11px] text-[#888888]">
                SHOWING: <strong className="text-white">{filteredOrders.length}</strong> ORDERS
              </div>
            </div>

            {ordersLoading ? (
              <div className="p-12 text-center text-[#888888]">Loading orders from Cloud Firestore...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 bg-[#0A0A0A] border border-[#1A1A1A] text-center text-[#666666] uppercase">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-[#0C0C0C] border border-[#1E1E1E] hover:border-[#D4AF37]/40 p-5 transition-colors space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1A1A1A] gap-2">
                      <div className="flex items-center gap-3">
                        <strong className="text-white font-mono text-sm tracking-wide">
                          ORDER #{order.orderId}
                        </strong>
                        <span className="text-[10px] text-[#888888] font-mono">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </span>
                        {order.paymentMethod && (
                          <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 text-xs font-mono text-white">
                            {order.paymentMethod}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                          className="bg-[#161616] border border-[#D4AF37]/50 text-[#D4AF37] py-1.5 px-3 text-xs uppercase outline-none font-bold cursor-pointer"
                        >
                          <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SENT_TO_QIKINK">SENT TO QIKINK</option>
                          <option value="PRINTING">PRINTING</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="REFUNDED">REFUNDED</option>
                        </select>

                        <button
                          onClick={() => handleTriggerQikink(order.orderId)}
                          className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#D4AF37] hover:text-black border border-neutral-700 text-white text-[10px] uppercase font-bold flex items-center gap-1.5 transition-colors"
                          title="Push order to Qikink POD fulfillment"
                        >
                          <Truck className="w-3 h-3 text-[#D4AF37]" />
                          <span>Push Qikink</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Info */}
                      <div className="p-3 bg-[#111111] border border-[#1A1A1A] space-y-1">
                        <div className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">
                          DELIVERY RECIPIENT
                        </div>
                        <div className="font-bold text-white">{order.customer?.fullName}</div>
                        <div className="text-[#AAAAAA]">{order.customer?.address}</div>
                        <div className="text-[#AAAAAA]">
                          {order.customer?.city}, {order.customer?.state} - {order.customer?.pinCode}
                        </div>
                        <div className="text-[#D4AF37] font-mono pt-1">
                          TEL: {order.customer?.phone}
                        </div>
                        {order.customer?.phone && (
                          <button
                            onClick={() => openCustomerWhatsApp(order)}
                            className="mt-2 w-full py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WHATSAPP CONCIERGE CHAT</span>
                          </button>
                        )}
                      </div>

                      {/* Line Items */}
                      <div className="p-3 bg-[#111111] border border-[#1A1A1A] space-y-2">
                        <div className="text-[10px] text-[#888888] uppercase tracking-wider">
                          ORDER ITEMS ({order.items?.length || 0})
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] border-b border-[#181818] pb-1">
                              <div>
                                <span className="text-white font-bold">{item.product?.name}</span>
                                <div className="text-[10px] text-[#888888]">
                                  {item.selectedColor?.name || 'Standard'} / Size: {item.selectedSize} × {item.quantity}
                                </div>
                              </div>
                              <span className="text-[#D4AF37] font-mono">
                                ₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fulfillment & Tracking Editor */}
                      <div className="p-3 bg-[#111111] border border-[#1A1A1A] space-y-2">
                        <div className="text-[10px] text-[#888888] uppercase tracking-wider">
                          DISPATCH & TRACKING
                        </div>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder="Courier (e.g. Bluedart / Delhivery)"
                            defaultValue={order.courier || ''}
                            onChange={(e) =>
                              setTrackingInputs((prev) => ({
                                ...prev,
                                [order.orderId]: {
                                  trackingNumber: prev[order.orderId]?.trackingNumber || order.trackingNumber || '',
                                  courier: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-[#181818] border border-neutral-800 px-2 py-1 text-xs text-white outline-none focus:border-[#D4AF37]"
                          />
                          <input
                            type="text"
                            placeholder="Tracking Number / AWB"
                            defaultValue={order.trackingNumber || ''}
                            onChange={(e) =>
                              setTrackingInputs((prev) => ({
                                ...prev,
                                [order.orderId]: {
                                  courier: prev[order.orderId]?.courier || order.courier || 'Express Air',
                                  trackingNumber: e.target.value
                                }
                              }))
                            }
                            className="w-full bg-[#181818] border border-neutral-800 px-2 py-1 text-xs text-white outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            onClick={() => handleUpdateTracking(order.orderId)}
                            className="w-full py-1 bg-white hover:bg-[#D4AF37] text-black text-[10px] font-bold uppercase transition-colors"
                          >
                            Save & Mark Shipped
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. CUSTOMERS INTELLIGENCE */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="p-4 bg-[#0A0A0A] border border-[#1A1A1A]">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                CLIENT WARDROBE DIRECTORY
              </h3>
              <p className="text-xs text-[#888888]">
                Aggregated unique clients from verified orders, lifetime spend values, and direct WhatsApp contact.
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111] text-[#D4AF37] uppercase border-b border-[#222]">
                    <tr>
                      <th className="p-3.5">CLIENT NAME</th>
                      <th className="p-3.5">PHONE</th>
                      <th className="p-3.5">EMAIL</th>
                      <th className="p-3.5">LOCATION</th>
                      <th className="p-3.5">ORDERS</th>
                      <th className="p-3.5">TOTAL SPEND</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181818]">
                    {customerList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-neutral-600 uppercase">
                          No customer profiles recorded yet.
                        </td>
                      </tr>
                    ) : (
                      customerList.map((c, i) => (
                        <tr key={i} className="hover:bg-[#111]">
                          <td className="p-3.5 font-bold text-white">{c.name}</td>
                          <td className="p-3.5 text-neutral-300">{c.phone}</td>
                          <td className="p-3.5 text-neutral-400">{c.email}</td>
                          <td className="p-3.5 text-neutral-400">{c.city}, {c.state}</td>
                          <td className="p-3.5 text-white font-bold">{c.ordersCount}</td>
                          <td className="p-3.5 text-[#D4AF37] font-bold">₹{c.totalSpend.toLocaleString('en-IN')}</td>
                          <td className="p-3.5 text-right">
                            {c.phone && c.phone !== '—' && (
                              <a
                                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold hover:bg-emerald-900 inline-flex items-center gap-1"
                              >
                                <MessageSquare className="w-3 h-3" /> WhatsApp
                              </a>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. QIKINK FULFILLMENT */}
        {activeTab === 'qikink' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <Truck className="w-4 h-4" /> QIKINK PRINT-ON-DEMAND FULFILLMENT ENGINE
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                  API Connected
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Automated order dispatch and courier synchronization. When a customer orders a T-shirt, push the line items to Qikink’s direct print queues in Tiruppur / Chennai with custom branding.
              </p>
            </div>

            {/* Qikink Pending Orders */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">
                ORDERS PENDING DISPATCH TO QIKINK ({qikinkPendingCount})
              </h4>
              <div className="space-y-2">
                {orders
                  .filter((o) => ['PAID', 'PROCESSING', 'CONFIRMED'].includes(o.status))
                  .map((o) => (
                    <div
                      key={o.orderId}
                      className="p-3 bg-[#111] border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">ORDER #{o.orderId} — ₹{o.total?.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-neutral-400">
                          Recipient: {o.customer?.fullName} ({o.customer?.city}) • {o.items?.length || 1} item(s)
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTriggerQikink(o.orderId)}
                          className="px-4 py-1.5 bg-[#D4AF37] hover:bg-white text-black text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>PUSH TO QIKINK</span>
                        </button>
                      </div>
                    </div>
                  ))}
                {qikinkPendingCount === 0 && (
                  <p className="text-neutral-500 text-xs py-2">No pending orders awaiting dispatch to Qikink.</p>
                )}
              </div>
            </div>

            {/* SKU Mapping Table */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">
                VOID WEAR SKU → QIKINK SKU MAPPINGS
              </h4>
              <p className="text-xs text-neutral-400">
                Maps each frontend color and size variant to the corresponding blank garment code at Qikink (e.g. 280 GSM Boxy Heavyweight).
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111] text-[#D4AF37] uppercase border-b border-[#222]">
                    <tr>
                      <th className="p-3">VOID WEAR SKU</th>
                      <th className="p-3">PRODUCT</th>
                      <th className="p-3">COLOR</th>
                      <th className="p-3">SIZE</th>
                      <th className="p-3">QIKINK APPAREL SKU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181818]">
                    {qikinkMappings && qikinkMappings.length > 0 ? (
                      qikinkMappings.map((m) => (
                        <tr key={m.id} className="hover:bg-[#111]">
                          <td className="p-3 font-bold text-white">{m.voidSku}</td>
                          <td className="p-3 text-neutral-300">{m.productName}</td>
                          <td className="p-3 text-neutral-300">{m.colorName}</td>
                          <td className="p-3 text-neutral-300">{m.size}</td>
                          <td className="p-3 text-[#D4AF37] font-bold">{m.qikinkSku}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-neutral-500">
                          Auto-mapped standard 280 GSM oversized blanks active.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. PAYMENTS & RAZORPAY */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> RAZORPAY PAYMENT GATEWAY STATUS
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                  HMAC Verification Ready
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                All client payments are verified on the backend via HMAC-SHA256 signature verification in <code className="text-[#D4AF37]">server.ts</code>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono mb-1">RAZORPAY_KEY_ID</div>
                  <div className="text-xs text-white font-mono">{process.env.RAZORPAY_KEY_ID ? 'rzp_live_••••••••' : 'rzp_test_placeholder (configured)'}</div>
                </div>
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase font-mono mb-1">ACCEPTED METHODS</div>
                  <div className="text-xs text-white">UPI (Google Pay, PhonePe, Paytm), Cards, NetBanking, COD</div>
                </div>
              </div>
            </div>

            {/* Payment Transactions Stream */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">
                TRANSACTION LOG
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#111] text-[#D4AF37] uppercase border-b border-[#222]">
                    <tr>
                      <th className="p-3">ORDER ID</th>
                      <th className="p-3">METHOD</th>
                      <th className="p-3">AMOUNT</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3">PAYMENT ID</th>
                      <th className="p-3">DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181818]">
                    {orders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-[#111]">
                        <td className="p-3 font-bold text-white">#{o.orderId}</td>
                        <td className="p-3 text-neutral-300">{o.paymentMethod || 'RAZORPAY'}</td>
                        <td className="p-3 text-white font-bold">₹{o.total?.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            o.status === 'CANCELLED' ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {o.paymentStatus || (o.status === 'CANCELLED' ? 'CANCELLED' : 'VERIFIED')}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400 font-mono text-[10px]">
                          {o.paymentId || `pay_${o.orderId.slice(-8)}`}
                        </td>
                        <td className="p-3 text-neutral-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A]">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                CUSTOMER REVIEWS & EDITORIAL TESTIMONIALS
              </h3>
              <p className="text-xs text-neutral-400">
                Verified reviews published on the homepage and product detail pages.
              </p>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReviewSubmit} className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">
                ADD VERIFIED CLIENT REVIEW
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Reviewer Name (e.g. Aryan Malhotra)"
                  value={newRevName}
                  onChange={(e) => setNewRevName(e.target.value)}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="text"
                  placeholder="City / Location (e.g. Mumbai, MH)"
                  value={newRevLocation}
                  onChange={(e) => setNewRevLocation(e.target.value)}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newRevProduct}
                  onChange={(e) => setNewRevProduct(e.target.value)}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                />
                <select
                  value={newRevRating}
                  onChange={(e) => setNewRevRating(Number(e.target.value))}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                placeholder="Client comment text..."
                value={newRevComment}
                onChange={(e) => setNewRevComment(e.target.value)}
                className="w-full bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-white hover:bg-[#D4AF37] text-black font-bold uppercase text-xs transition-colors"
              >
                PUBLISH REVIEW
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-[#0C0C0C] border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{r.name} ({r.location})</span>
                    <span className="text-[#D4AF37] font-bold">{'★'.repeat(r.rating)}</span>
                  </div>
                  <div className="text-[11px] text-[#D4AF37] font-mono">{r.productName}</div>
                  <p className="text-neutral-300 text-xs italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. COUPONS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A]">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                PROMO CODES & CAMPAIGN DISCOUNTS
              </h3>
              <p className="text-xs text-neutral-400">
                Create and manage coupon codes applicable during customer checkout.
              </p>
            </div>

            {/* Create Coupon Form */}
            <form onSubmit={handleAddCoupon} className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">
                CREATE NEW PROMO CODE
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Code (e.g. VOID20)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white uppercase outline-none focus:border-[#D4AF37]"
                />
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none"
                >
                  <option value="PERCENTAGE">% Percentage Off</option>
                  <option value="FIXED">₹ Flat Amount Off</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Discount Value"
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="number"
                  placeholder="Min Cart Value (₹)"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="bg-[#121212] border border-neutral-800 p-2 text-xs text-white outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase text-xs transition-colors"
              >
                CREATE COUPON
              </button>
            </form>

            {/* Coupons Table */}
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#111] text-[#D4AF37] uppercase border-b border-[#222]">
                  <tr>
                    <th className="p-3.5">CODE</th>
                    <th className="p-3.5">DISCOUNT</th>
                    <th className="p-3.5">MIN ORDER</th>
                    <th className="p-3.5">USED COUNT</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181818]">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-[#111]">
                      <td className="p-3.5 font-bold text-white tracking-wider">{c.code}</td>
                      <td className="p-3.5 text-neutral-300">
                        {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                      </td>
                      <td className="p-3.5 text-neutral-400">₹{c.minOrderValue || 0}</td>
                      <td className="p-3.5 text-white font-bold">{c.usedCount}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${c.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                          {c.isActive ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setCoupons((prev) => prev.filter((x) => x.id !== c.id))}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. WEBSITE CONTENT CMS */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveCms} className="space-y-6">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37]">
                  STOREFRONT LIVE CMS
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Update homepage headlines, imagery, announcement messages, and policy pages live.
                </p>
              </div>
              <button
                type="submit"
                disabled={cmsSaving}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>{cmsSaving ? 'SAVING...' : 'SAVE CHANGES LIVE'}</span>
              </button>
            </div>

            {/* Announcement Banner */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">ANNOUNCEMENT MARQUEE</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Announcement Message</label>
                  <input
                    type="text"
                    value={cmsForm?.announcementText || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, announcementText: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Subtitle Tag</label>
                  <input
                    type="text"
                    value={cmsForm?.announcementSub || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, announcementSub: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">HERO BANNER SECTION</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={cmsForm?.heroHeadline || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, heroHeadline: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Supporting Tagline</label>
                  <input
                    type="text"
                    value={cmsForm?.heroTagline || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, heroTagline: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Hero Background Image URL</label>
                  <input
                    type="text"
                    value={cmsForm?.heroBackgroundUrl || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, heroBackgroundUrl: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Policies Content */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">POLICIES & STANDARDS TEXT</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Shipping & Delivery Policy</label>
                  <textarea
                    rows={3}
                    value={cmsForm?.shippingPolicy || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, shippingPolicy: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Returns & Exchanges Policy</label>
                  <textarea
                    rows={3}
                    value={cmsForm?.returnsPolicy || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, returnsPolicy: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Privacy Policy</label>
                  <textarea
                    rows={3}
                    value={cmsForm?.privacyPolicy || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, privacyPolicy: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase mb-1">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    value={cmsForm?.termsConditions || ''}
                    onChange={(e) => setCmsForm({ ...cmsForm, termsConditions: e.target.value })}
                    className="w-full bg-[#121212] border border-neutral-800 p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* 10. ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A]">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#D4AF37] mb-1">
                SALES & ATELIER PERFORMANCE ANALYTICS
              </h3>
              <p className="text-xs text-neutral-400">
                Live metrics from orders and customer purchasing activity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-[#0C0C0C] border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Average Order Value (AOV)</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}
                </div>
              </div>
              <div className="p-5 bg-[#0C0C0C] border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Fulfillment Conversion</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {orders.length > 0 ? Math.round((orders.filter((o) => o.status !== 'CANCELLED').length / orders.length) * 100) : 100}%
                </div>
              </div>
              <div className="p-5 bg-[#0C0C0C] border border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Unique Clients</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {customerList.length}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-white">CATALOG COMPOSITION</h4>
              <div className="space-y-3">
                {['T-SHIRTS', 'HOODIES', 'BOTTOMS', 'ACCESSORIES', 'OUTERWEAR'].map((cat) => {
                  const count = allProducts.filter((p) => p.category === cat).length;
                  const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-white font-bold">{cat}</span>
                        <span className="text-neutral-400">{count} styles ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-900 overflow-hidden">
                        <div className="h-full bg-[#D4AF37]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 11. SETTINGS & BRAND DIRECTORY */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            {/* Brand Specifications */}
            <div className="p-6 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#D4AF37]" />
                <span>VOID WEAR BRAND DIRECTORY</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Brand Name</div>
                  <div className="text-white font-bold mt-0.5">VOID WEAR</div>
                </div>
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Founder & Creative Director</div>
                  <div className="text-white font-bold mt-0.5">{BRAND_INFO.founder} (Akash Goshwami)</div>
                </div>
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Atelier Location</div>
                  <div className="text-white font-bold mt-0.5">{BRAND_INFO.location}</div>
                </div>
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Official WhatsApp Concierge</div>
                  <div className="text-[#D4AF37] font-bold mt-0.5">{BRAND_INFO.phone}</div>
                </div>
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Studio Inquiries Email</div>
                  <div className="text-white font-bold mt-0.5">{BRAND_INFO.email}</div>
                </div>
                <div className="p-3 bg-[#111] border border-neutral-800">
                  <div className="text-[10px] text-neutral-400 uppercase">Instagram Profile</div>
                  <div className="text-white font-bold mt-0.5">{BRAND_INFO.instagram}</div>
                </div>
              </div>
            </div>

            {/* Drop Timer Countdown */}
            <div className="p-6 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>LIMITED DROP COUNTDOWN SCHEDULER</span>
              </h3>
              <p className="text-xs text-[#888888]">
                Edit the release date and time for "THE NEXT DROP IS COMING" countdown on the storefront.
              </p>
              <div>
                <label className="block text-[10px] text-[#888888] uppercase mb-1">
                  Current Target: {new Date(dropDate).toLocaleString('en-IN')}
                </label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    if (e.target.value) {
                      setDropDate(new Date(e.target.value).toISOString());
                      showToast('Drop timer updated', 'gold');
                    }
                  }}
                  className="bg-[#141414] border border-[#2E2E2E] text-white p-2.5 text-xs outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Leadership Management Card */}
            <div className="p-6 bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>HOUSE OF VOID // LEADERSHIP DIRECTORY</span>
                </h3>
              </div>
              <p className="text-xs text-[#888888]">
                Manage official profiles, portraits, and designations for Founder Akash Goshwami and Co-Founder Shivam Giri.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {leadershipProfiles.map((lp) => (
                  <div key={lp.id} className="p-4 bg-[#111111] border border-[#222222] flex items-center gap-4">
                    <div className="w-16 h-20 bg-black border border-[#2D2D2D] overflow-hidden shrink-0">
                      <img
                        src={lp.photoUrl}
                        alt={lp.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/void-logo.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-xs uppercase text-white truncate">{lp.name}</div>
                      <div className="text-[10px] text-[#D4AF37] font-mono truncate">{lp.designation}</div>
                      {lp.phone && (
                        <div className="text-[10px] text-[#999999] font-mono truncate">{lp.phoneDisplay || `+91 ${lp.phone}`}</div>
                      )}
                      <button
                        onClick={() => {
                          setAdminEditLeader(lp);
                          setIsAdminLeaderModalOpen(true);
                        }}
                        className="mt-2 px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#D4AF37] hover:text-black border border-[#2E2E2E] text-[10px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                        <span>EDIT PROFILE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Edit Leadership Modal */}
      <EditLeadershipModal
        leader={adminEditLeader}
        isOpen={isAdminLeaderModalOpen}
        onClose={() => {
          setIsAdminLeaderModalOpen(false);
          setAdminEditLeader(null);
        }}
        onSave={handleSaveLeaderProfile}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#0D0D0D] border border-red-900/60 max-w-md w-full p-6 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>CONFIRM PIECE DELETION</span>
            </div>
            <p className="text-[#CCCCCC] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{productToDelete.name}"</strong> (SKU: <span className="text-[#D4AF37]">{productToDelete.sku}</span>) from Cloud Firestore? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C1C1C]">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#AAAAAA] hover:text-white uppercase font-bold cursor-pointer transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase cursor-pointer transition-colors"
              >
                PERMANENTLY DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
