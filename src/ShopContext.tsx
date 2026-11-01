import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Size,
  ProductColor,
  Review,
  OrderDetails,
  Category,
  WebsiteContent,
  QikinkSkuMapping,
  OrderStatus
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, BRAND_INFO } from '../data/products';
import { INITIAL_WEBSITE_CONTENT } from '../data/websiteContent';
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/productService';
import { placeFirestoreOrder } from '../services/orderService';
import { getProductSlug } from '../utils/productUtils';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'gold';
}

interface ShopContextType {
  products: Product[];
  allProducts: Product[]; // includes drafts for admin
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedColorFilter: string | null;
  setSelectedColorFilter: (color: string | null) => void;
  clearAllFilters: () => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: Size, color: ProductColor, quantity?: number, variantSku?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  discountAmount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  shippingFee: number;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Modals & Drawers
  selectedProduct: Product | null;
  selectedColorway: ProductColor | null;
  setSelectedColorway: (color: ProductColor | null) => void;
  openProductModal: (product: Product, initialColor?: ProductColor) => void;
  closeProductModal: () => void;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;

  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;

  isAdminEditOpen: boolean;
  setIsAdminEditOpen: (open: boolean) => void;

  // Navigation / Route
  currentPath: string;
  navigate: (path: string) => void;
  navigateToProduct: (slugOrId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => Promise<void>;

  // Orders
  orders: OrderDetails[];
  createOrder: (order: Omit<OrderDetails, 'orderId' | 'createdAt' | 'status'>) => Promise<OrderDetails>;
  trackOrder: (orderIdOrPhone: string) => Promise<any>;

  // Qikink Fulfillment Actions
  sendOrderToQikink: (orderId: string) => Promise<{ success: boolean; message?: string }>;
  syncQikinkStatus: (orderId: string) => Promise<{ success: boolean; data?: any }>;
  retryQikinkOrder: (orderId: string) => Promise<{ success: boolean; message?: string }>;
  qikinkMappings: QikinkSkuMapping[];
  saveQikinkMapping: (mapping: Partial<QikinkSkuMapping>) => Promise<void>;

  // Website Content CMS
  websiteContent: WebsiteContent;
  updateWebsiteContent: (updates: Partial<WebsiteContent>) => Promise<void>;

  // Newsletter
  subscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;

  // Drop countdown
  dropDate: string;
  setDropDate: (date: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'gold') => void;

  // WhatsApp Helper
  openWhatsAppOrder: (product: Product, size?: Size, color?: ProductColor) => void;
  openWhatsAppSupport: (customMessage?: string) => void;

  // Product CRUD (Cloud Firestore + Local Persistent fallback)
  addProductItem: (prod: Omit<Product, 'id'>, customId?: string) => Promise<string>;
  updateProductItem: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProductItem: (id: string) => Promise<void>;
  togglePublishItem: (id: string, currentState: boolean) => Promise<void>;
  updateProductPrice: (productId: string, newPrice: number) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const REMOVED_AI_PRODUCT_IDS = new Set([
  'void-sig-tee',
  'distortion-graphic-tee',
  'void-monolith-box-tee',
  'void-core-hoodie',
  'void-essentials-pants',
  'void-eclipse-bomber',
  'void-acid-wash-hoodie',
  'void-metal-buckle-cap',
  'void-tactical-cargo',
  'vw-prod-1792747689787',
  'acidela'
]);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products from Firestore or backend with instant local cache hydration
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('vw_all_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id));
          if (filtered.length > 0) return filtered;
        }
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });

  // Sync route
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (slugOrId: string) => {
    navigate(`/product/${slugOrId}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save allProducts cache whenever catalog updates
  useEffect(() => {
    try {
      if (allProducts && allProducts.length > 0) {
        const cleaned = allProducts.filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id));
        localStorage.setItem('vw_all_products', JSON.stringify(cleaned));
      }
    } catch {}
  }, [allProducts]);

  // Subscribe to real-time products from Firestore (or fallback to REST API)
  useEffect(() => {
    // Purge any old cache of AI template products from localStorage
    try {
      const cached = localStorage.getItem('vw_all_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.some((p) => REMOVED_AI_PRODUCT_IDS.has(p?.id))) {
          const cleaned = parsed.filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id));
          localStorage.setItem('vw_all_products', JSON.stringify(cleaned));
        }
      }
      const customSaved = localStorage.getItem('vw_custom_products');
      if (customSaved) {
        const customItems: Product[] = JSON.parse(customSaved);
        if (Array.isArray(customItems) && customItems.some((p) => REMOVED_AI_PRODUCT_IDS.has(p?.id))) {
          const cleaned = customItems.filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id));
          localStorage.setItem('vw_custom_products', JSON.stringify(cleaned));
        }
      }
    } catch {}

    const unsubscribe = subscribeToProducts(
      (items) => {
        if (items && items.length > 0) {
          const filtered = items.filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id));
          if (filtered.length > 0) {
            setAllProducts(filtered);
          }
        }
      },
      (error) => {
        console.warn('Realtime subscription notice, using store catalog:', error);
      }
    );

    // Initial fetch from /api/products
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data.filter((p) => p && !REMOVED_AI_PRODUCT_IDS.has(p.id));
          if (filtered.length > 0) {
            setAllProducts(filtered);
          }
        }
      })
      .catch(() => {});

    // Check if browser has any unpublished drafts or custom products that need syncing to Firestore
    try {
      const customSaved = localStorage.getItem('vw_custom_products');
      if (customSaved) {
        const customItems: Product[] = JSON.parse(customSaved);
        if (Array.isArray(customItems) && customItems.length > 0) {
          customItems.forEach((item) => {
            if (item && item.id && !REMOVED_AI_PRODUCT_IDS.has(item.id) && !allProducts.some((p) => p.id === item.id)) {
              createProduct(item, item.id);
            }
          });
        }
      }
    } catch {}

    return () => unsubscribe();
  }, []);

  // Filter published products for the general storefront
  const products = allProducts.filter((p) => p.isPublished !== false);

  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);

  const clearAllFilters = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setSelectedColorFilter(null);
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vw_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item?.product?.id && !REMOVED_AI_PRODUCT_IDS.has(item.product.id)
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vw_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => typeof id === 'string' && !REMOVED_AI_PRODUCT_IDS.has(id));
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Website Content CMS
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(INITIAL_WEBSITE_CONTENT);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.heroHeadline) {
          setWebsiteContent(data);
        }
      })
      .catch(() => {});
  }, []);

  const updateWebsiteContent = async (updates: Partial<WebsiteContent>) => {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setWebsiteContent(updated);
        showToast('Website content updated live', 'gold');
      }
    } catch {
      setWebsiteContent((prev) => ({ ...prev, ...updates }));
      showToast('Website content updated', 'gold');
    }
  };

  // Qikink SKU Mappings
  const [qikinkMappings, setQikinkMappings] = useState<QikinkSkuMapping[]>([]);

  useEffect(() => {
    fetch('/api/qikink/mappings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setQikinkMappings(data);
      })
      .catch(() => {});
  }, []);

  const saveQikinkMapping = async (mapping: Partial<QikinkSkuMapping>) => {
    try {
      const res = await fetch('/api/qikink/mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping)
      });
      if (res.ok) {
        const saved = await res.json();
        setQikinkMappings((prev) => {
          const idx = prev.findIndex((m) => m.id === saved.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return [...prev, saved];
        });
        showToast('Qikink SKU mapping saved', 'gold');
      }
    } catch (err: any) {
      showToast('Failed to save mapping', 'info');
    }
  };

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColorway, setSelectedColorway] = useState<ProductColor | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => INITIAL_REVIEWS);

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => {});
  }, []);

  // Orders
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {});
  }, []);

  // Drop date
  const [dropDate, setDropDate] = useState<string>(() => {
    const target = new Date();
    target.setDate(target.getDate() + 4);
    target.setHours(20, 0, 0, 0);
    return target.toISOString();
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'gold' = 'gold') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vw_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vw_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [wishlist]);

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from VOID archive wishlist', 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Saved to VOID archive wishlist', 'gold');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const wishlistCount = wishlist.length;

  // Cart operations
  const addToCart = (
    product: Product,
    size: Size,
    color: ProductColor,
    quantity: number = 1,
    variantSku?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        const newItemId = `${product.id}-${size}-${color.name}-${Date.now()}`;
        const sku = variantSku || `${product.sku || 'VW'}-${color.name.toUpperCase().slice(0, 3)}-${size}`;
        return [
          ...prev,
          {
            id: newItemId,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
            variantSku: sku
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${color.name} / ${size}) to bag`, 'gold');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    showToast('Piece removed from bag', 'info');
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= BRAND_INFO.freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const discountAmount = couponDiscount;
  const cartTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Coupons
  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal: subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.code);
        setCouponDiscount(data.discount);
        showToast(data.message, 'gold');
        return true;
      } else {
        showToast(data.error || 'Invalid or expired coupon', 'info');
        return false;
      }
    } catch {
      // Offline fallback check
      const upper = code.trim().toUpperCase();
      if (upper === 'VOID10') {
        const disc = Math.round(subtotal * 0.1);
        setAppliedCoupon('VOID10');
        setCouponDiscount(disc);
        showToast('VOID10 applied: 10% discount', 'gold');
        return true;
      }
      showToast('Coupon could not be applied', 'info');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  // Modals
  const openProductModal = (product: Product, initialColor?: ProductColor) => {
    setSelectedProduct(product);
    if (initialColor) {
      setSelectedColorway(initialColor);
    } else {
      setSelectedColorway(product.colors[0] || null);
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedColorway(null);
  };

  // Reviews
  const addReview = async (review: Omit<Review, 'id' | 'date' | 'verified'>) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        const newRev = await res.json();
        setReviews((prev) => [newRev, ...prev]);
        showToast('Review submitted for verification', 'gold');
      }
    } catch {
      const newRev: Review = {
        ...review,
        id: `rev-${Date.now()}`,
        date: 'Just now',
        verified: true
      };
      setReviews((prev) => [newRev, ...prev]);
      showToast('Review submitted for verification', 'gold');
    }
  };

  // Orders
  const createOrder = async (
    orderData: Omit<OrderDetails, 'orderId' | 'createdAt' | 'status'>
  ): Promise<OrderDetails> => {
    try {
      // 1. Post to backend persistent order log
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        return newOrder;
      }
    } catch (e) {
      console.warn('Backend order creation notice:', e);
    }

    // 2. Firestore fallback
    const fallbackId = `VW-${Date.now().toString().slice(-6)}`;
    const now = new Date().toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const localOrder: OrderDetails = {
      ...orderData,
      orderId: fallbackId,
      createdAt: now,
      status: 'PAID',
      timeline: [
        {
          status: 'PAID',
          timestamp: new Date().toISOString(),
          title: 'Order Confirmed',
          description: 'Payment verified and order confirmed'
        }
      ]
    };

    setOrders((prev) => [localOrder, ...prev]);
    clearCart();

    try {
      await placeFirestoreOrder(localOrder);
    } catch {}

    return localOrder;
  };

  // Order Tracking
  const trackOrder = async (orderIdOrPhone: string): Promise<any> => {
    const res = await fetch(`/api/track/${encodeURIComponent(orderIdOrPhone)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Order not found');
    }
    return res.json();
  };

  // Qikink Fulfillment Actions
  const sendOrderToQikink = async (orderId: string) => {
    const res = await fetch('/api/qikink/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Failed to dispatch to Qikink', 'info');
      return { success: false, message: data.error };
    }
    showToast(`Order sent to Qikink. ID: ${data.qikinkOrderId}`, 'gold');
    // Refresh orders
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d))
      .catch(() => {});
    return { success: true, message: data.message };
  };

  const syncQikinkStatus = async (orderId: string) => {
    const res = await fetch(`/api/qikink/status/${orderId}`);
    const data = await res.json();
    if (res.ok) {
      showToast(`Fulfillment status synced: ${data.status}`, 'gold');
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, ...data } : o)));
      return { success: true, data };
    }
    return { success: false };
  };

  const retryQikinkOrder = async (orderId: string) => {
    const res = await fetch(`/api/qikink/retry/${orderId}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message, 'gold');
      return { success: true, message: data.message };
    }
    return { success: false, message: data.error };
  };

  // Newsletter
  const subscribeNewsletter = async (email: string) => {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      showToast('You are now on the VOID VIP guest list', 'gold');
      return { success: true, message: data.message };
    }
    showToast(data.error || 'Could not subscribe', 'info');
    return { success: false, message: data.error };
  };

  // WhatsApp Helpers
  const openWhatsAppOrder = (product: Product, size?: Size, color?: ProductColor) => {
    const targetSize = size || product.sizes[0] || 'L';
    const targetColor = color || product.colors[0];
    const message = encodeURIComponent(
      `Hello VOID WEAR concierge,\n\nI would like to order this piece:\n\n• PRODUCT: ${product.name}\n• SIZE: ${targetSize}\n• SHADE: ${targetColor.name}\n• PRICE: ₹${product.price.toLocaleString('en-IN')}\n• SKU: ${product.sku}\n\nPlease share delivery confirmation and checkout link for Varanasi studio.`
    );
    window.open(`https://wa.me/${BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const openWhatsAppSupport = (customMessage?: string) => {
    const defaultMsg = 'Hello VOID WEAR concierge, I have an inquiry regarding collections, custom sizing, or orders.';
    const text = encodeURIComponent(customMessage || defaultMsg);
    window.open(`https://wa.me/${BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Product CRUD
  const addProductItem = async (prod: Omit<Product, 'id'>, customId?: string): Promise<string> => {
    const id = customId || `void-${Date.now().toString(36)}`;
    const slug = getProductSlug({ name: prod.name, id });
    const newProduct: Product = { ...prod, id, slug, isPublished: prod.isPublished !== false };

    // Update in-memory state immediately
    setAllProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== id)]);

    // Push to Cloud Firestore and local server storage
    try {
      await createProduct(newProduct, id);
    } catch (err: any) {
      console.warn('Save product error notice:', err.message);
    }

    showToast(`Piece "${prod.name}" published & saved to database`, 'gold');
    return id;
  };

  const updateProductItem = async (id: string, updates: Partial<Product>): Promise<void> => {
    setAllProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    try {
      await updateProduct(id, updates);
    } catch (err: any) {
      console.warn('Update product error notice:', err.message);
    }

    showToast(`Piece updated & saved to database`, 'gold');
  };

  const deleteProductItem = async (id: string): Promise<void> => {
    setAllProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProduct(id);
    } catch (err: any) {
      console.warn('Delete product error notice:', err.message);
    }

    showToast(`Piece removed from catalog`, 'info');
  };

  const togglePublishItem = async (id: string, currentState: boolean): Promise<void> => {
    const nextState = !currentState;
    await updateProductItem(id, { isPublished: nextState });
    showToast(nextState ? 'Piece published live to storefront!' : 'Piece hidden from storefront (draft)', 'gold');
  };

  const updateProductPrice = async (productId: string, newPrice: number): Promise<void> => {
    await updateProductItem(productId, { price: newPrice });
    showToast(`Price updated to ₹${newPrice}`, 'gold');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        allProducts,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedColorFilter,
        setSelectedColorFilter,
        clearAllFilters,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingFee,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        selectedProduct,
        selectedColorway,
        setSelectedColorway,
        openProductModal,
        closeProductModal,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAccountOpen,
        setIsAccountOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isAdminEditOpen,
        setIsAdminEditOpen,
        currentPath,
        navigate,
        navigateToProduct,
        reviews,
        addReview,
        orders,
        createOrder,
        trackOrder,
        sendOrderToQikink,
        syncQikinkStatus,
        retryQikinkOrder,
        qikinkMappings,
        saveQikinkMapping,
        websiteContent,
        updateWebsiteContent,
        subscribeNewsletter,
        dropDate,
        setDropDate,
        toasts,
        showToast,
        openWhatsAppOrder,
        openWhatsAppSupport,
        addProductItem,
        updateProductItem,
        deleteProductItem,
        togglePublishItem,
        updateProductPrice
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
