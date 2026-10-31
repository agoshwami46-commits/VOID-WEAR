import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { IntroLoader } from './components/IntroLoader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandStatement } from './components/BrandStatement';
import { NewDropSection } from './components/NewDropSection';
import { LimitedDropCountdown } from './components/LimitedDropCountdown';
import { CollectionsSection } from './components/CollectionsSection';
import { EditorialCampaign } from './components/EditorialCampaign';
import { WhyVoidWear } from './components/WhyVoidWear';
import { AboutSection } from './components/AboutSection';
import { InstagramSection } from './components/InstagramSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { lazy, Suspense } from 'react';

// Lazy Loaded Full Pages for Optimal Initial Load Performance
const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const PoliciesPage = lazy(() => import('./pages/PoliciesPage').then((m) => ({ default: m.PoliciesPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Lazy Loaded Admin Dashboard
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
import { ProtectedRoute } from './components/ProtectedRoute';

// Sleek Luxury Fallback Loader
const PageSkeleton = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#050505]" role="status" aria-label="Loading VOID WEAR atelier">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-mono tracking-[0.3em] text-[#888888] uppercase">
        VOID WEAR &bull; LOADING ARCHIVE
      </span>
    </div>
  </div>
);

// Modals, Drawers & Overlays
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { AdminEditModal } from './components/AdminEditModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/ToastContainer';

function AppContent() {
  const { currentPath } = useShop();

  // Scroll to top whenever route changes (unless hash navigation)
  useEffect(() => {
    if (!currentPath.includes('#')) {
      window.scrollTo(0, 0);
    }
  }, [currentPath]);

  // Route 1: Admin Dashboard
  const isAdminRoute = currentPath === '/admin' || currentPath === '#admin' || currentPath.startsWith('/admin');
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F3F3F3] relative font-sans selection:bg-[#D4AF37]/30 selection:text-white">
        <ProtectedRoute>
          <Suspense fallback={<PageSkeleton />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
        <ToastContainer />
      </div>
    );
  }

  // Determine which page content to render
  const renderPage = () => {
    const cleanPath = currentPath.split('?')[0];

    // Shop Catalog
    if (cleanPath === '/shop') {
      return <ShopPage />;
    }

    // Dynamic Product Detail Page
    if (cleanPath.startsWith('/product/')) {
      const slug = cleanPath.replace(/^\/product\//, '').trim();
      return <ProductDetailPage slug={slug} />;
    }

    // Track Order Concierge
    if (cleanPath === '/track-order' || cleanPath === '/track') {
      return <OrderTrackingPage />;
    }

    // Customer Account & Order History
    if (cleanPath === '/account') {
      return <AccountPage />;
    }

    // Policies
    if (cleanPath === '/shipping') {
      return <PoliciesPage initialTab="shipping" />;
    }
    if (cleanPath === '/returns') {
      return <PoliciesPage initialTab="returns" />;
    }
    if (cleanPath === '/privacy') {
      return <PoliciesPage initialTab="privacy" />;
    }
    if (cleanPath === '/terms') {
      return <PoliciesPage initialTab="terms" />;
    }

    // Homepage
    if (
      cleanPath === '/' ||
      cleanPath === '' ||
      cleanPath === '/home' ||
      cleanPath.startsWith('/#') ||
      cleanPath.startsWith('#')
    ) {
      return (
        <main>
          {/* Hero Section */}
          <Hero />

          {/* Minimal Editorial Brand Statement */}
          <BrandStatement />

          {/* The New Drop Products Grid (Synced to Firestore) */}
          <NewDropSection />

          {/* Limited Release Countdown */}
          <LimitedDropCountdown />

          {/* 4 Large Collection Categories */}
          <CollectionsSection />

          {/* Full-width Luxury Editorial Campaign */}
          <EditorialCampaign />

          {/* 4 Pillars: Why VOID WEAR */}
          <WhyVoidWear />

          {/* Dedicated About & Founder Spotlight (Akash Goshwami) */}
          <AboutSection />

          {/* Instagram Community 6-Grid */}
          <InstagramSection />

          {/* Customer Reviews & Testimonials */}
          <CustomerReviewsSection />

          {/* Newsletter Signup */}
          <NewsletterSection />

          {/* Complete Contact & Studio Location Section */}
          <ContactSection />
        </main>
      );
    }

    // Unmatched 404
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F3F3] relative font-sans selection:bg-[#D4AF37]/30 selection:text-white flex flex-col justify-between">
      {/* Intro Cinematic Splash Screen (Only on root first load) */}
      <IntroLoader />

      {/* Global Navigation */}
      <Navbar />

      {/* Dynamic Page Content */}
      <div className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          {renderPage()}
        </Suspense>
      </div>

      {/* Large Luxury Footer */}
      <Footer />

      {/* Floating WhatsApp Concierge Button */}
      <FloatingWhatsApp />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Interactive Drawers & Modals */}
      <ProductDetailModal />
      <SizeGuideModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <SearchModal />
      <AccountModal />
      <AdminEditModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AuthProvider>
  );
}
