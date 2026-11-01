export type Category = 'ALL' | 'T-SHIRTS' | 'HOODIES' | 'BOTTOMS' | 'ACCESSORIES' | 'OUTERWEAR';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
  family?: string;
  image?: string;
  images?: string[];
}

export type ProductAngleType = 'FRONT' | 'BACK' | 'SIDE' | 'DETAIL' | 'FIT' | 'LIFESTYLE' | string;

export interface ProductAngle {
  url: string;
  angle: ProductAngleType;
  label?: string;
  colorName?: string;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  size: Size;
  sku: string;
  qikinkSku?: string;
  stock: number;
  price?: number;
  compareAtPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: Category;
  tagline: string;
  price: number;
  originalPrice?: number;
  badge?: 'NEW DROP' | 'LIMITED' | 'BESTSELLER' | 'ARCHIVE' | 'NONE';
  sizes: Size[];
  colors: ProductColor[];
  variants?: ProductVariant[];
  description: string;
  gsm: number;
  fabric: string;
  fit: string;
  details: string[];
  careInstructions: string[];
  images: string[];
  backImage?: string;
  sideImage?: string;
  detailImage?: string;
  angles?: ProductAngle[];
  inStock: boolean;
  stockCount: number;
  isPublished: boolean;
  sku: string;
  tags?: string[];
  featured?: boolean;
  isNewDrop?: boolean;
  isLimited?: boolean;
  createdAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: Size;
  selectedColor: ProductColor;
  quantity: number;
  variantSku?: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  productName: string;
  productId?: string;
  comment: string;
  verified: boolean;
  isApproved?: boolean;
  imageUrl?: string;
}

export type OrderStatus =
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SENT_TO_QIKINK'
  | 'PRINTING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'FAILED'
  | 'QIKINK_FAILED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'DISPATCHED';

export interface CustomerShippingDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description?: string;
}

export interface OrderDetails {
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  customer: CustomerShippingDetails;
  paymentMethod: 'COD' | 'UPI' | 'CARD' | 'RAZORPAY';
  paymentStatus?: 'PENDING' | 'VERIFIED' | 'FAILED' | 'REFUNDED';
  paymentId?: string;
  paymentSignature?: string;
  razorpayOrderId?: string;
  status: OrderStatus;
  userId?: string;
  // Qikink Fulfillment Fields
  qikinkOrderId?: string;
  qikinkStatus?: string;
  qikinkSkuList?: string[];
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
  qikinkError?: string;
  qikinkRawResponse?: any;
  timeline?: OrderTimelineEvent[];
}

export interface QikinkSkuMapping {
  id: string;
  productSlug: string;
  productName: string;
  colorName: string;
  size: Size;
  voidSku: string;
  qikinkSku: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue?: number;
  maxUsage?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface WebsiteContent {
  announcementText: string;
  announcementSub: string;
  heroHeadline: string;
  heroTagline: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  heroBackgroundUrl?: string;
  brandStatementHeadline: string;
  brandStatementBody: string;
  campaignHeadline: string;
  campaignSub: string;
  campaignImageUrl: string;
  instagramHandle: string;
  instagramImages: string[];
  shippingPolicy: string;
  returnsPolicy: string;
  privacyPolicy: string;
  termsConditions: string;
}

export interface LeaderProfile {
  id: string;
  name: string;
  designation: string;
  roleTag: string;
  photoUrl: string;
  location?: string;
  bioQuote?: string;
  whatsappMessage?: string;
  phone?: string;
  phoneDisplay?: string;
}

export interface CustomerProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  addresses?: CustomerShippingDetails[];
  ordersCount: number;
  totalSpend: number;
  createdAt: string;
  lastOrderAt?: string;
}
