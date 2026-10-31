import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_INFO } from '../data/products';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    openWhatsAppSupport,
    currentPath,
    websiteContent,
    navigate
  } = useShop();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '/', isRoute: true },
    { label: 'SHOP', href: '/shop', isRoute: true },
    { label: 'NEW DROP', href: '#new-drop' },
    { label: 'COLLECTIONS', href: '#collections' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CONTACT', href: '#contact' },
    { label: 'TRACK', href: '/track-order', isRoute: true },
    { label: 'ADMIN', href: '/admin', isRoute: true }
  ];

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setMobileMenuOpen(false);
    if (isRoute || href.startsWith('/')) {
      navigate(href);
      return;
    }
    if (currentPath !== '/' && currentPath !== '') {
      navigate(`/${href}`);
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="relative z-50 bg-[#080808] border-b border-[#222222] text-[11px] py-1.5 px-4 text-center tracking-[0.2em] uppercase text-[#9ca3af] flex items-center justify-between overflow-hidden">
        <span className="hidden sm:inline-block text-[#D4AF37] font-mono text-[10px]">
          VARANASI, IN
        </span>
        <div className="mx-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span>
            {websiteContent?.announcementText ||
              'FREE SHIPPING OVER ₹1,999 • 100% HEAVYWEIGHT LUXURY COTTON • 7 DAYS OPEN'}
          </span>
        </div>
        <button
          onClick={() => openWhatsAppSupport()}
          className="hidden sm:flex items-center gap-1 text-[#D4AF37] hover:text-white transition-colors cursor-pointer text-[10px]"
        >
          <MessageSquare className="w-3 h-3" />
          <span>WHATSAPP SUPPORT</span>
        </button>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#1c1c1c] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Identity */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#D4AF37]/40 bg-black transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <img
                  src="/void-logo.jpg"
                  alt="VOID WEAR"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-[0.25em] text-white uppercase group-hover:text-[#D4AF37] transition-colors leading-none">
                  VOID WEAR
                </span>
                <span className="font-luxury text-[8px] tracking-[0.35em] text-[#D4AF37] uppercase mt-0.5">
                  BEYOND ORDINARY
                </span>
              </div>
            </a>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href, link.isRoute);
                  }}
                  className={`text-xs font-semibold tracking-[0.22em] transition-colors relative py-1 group uppercase whitespace-nowrap ${
                    link.isRoute ? 'text-[#D4AF37] hover:text-white' : 'text-[#CCCCCC] hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#161616] rounded-full transition-colors cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Account */}
              <button
                onClick={() => setIsAccountOpen(true)}
                className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#161616] rounded-full transition-colors cursor-pointer"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#161616] rounded-full transition-colors relative cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-[#CCCCCC] hover:text-white hover:bg-[#161616] rounded-full transition-colors relative cursor-pointer group"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75] group-hover:text-[#D4AF37] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#CCCCCC] hover:text-white hover:bg-[#161616] rounded-full transition-colors cursor-pointer ml-1"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#050505] animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <img
                src="/void-logo.jpg"
                alt="VOID WEAR"
                className="w-8 h-8 rounded-full border border-[#D4AF37]/50"
              />
              <span className="font-display font-extrabold tracking-[0.25em] text-white">
                VOID WEAR
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#888888] hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href, link.isRoute);
                }}
                className={`flex items-center justify-between text-2xl font-display font-bold tracking-[0.2em] transition-colors uppercase border-b border-[#141414] pb-4 ${
                  link.isRoute ? 'text-[#D4AF37]' : 'text-[#E0E0E0] hover:text-[#D4AF37]'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-xs font-mono text-[#D4AF37]">0{idx + 1}</span>
              </a>
            ))}
          </div>

          {/* Mobile Footer Area */}
          <div className="p-6 border-t border-[#1A1A1A] bg-[#0A0A0A] space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsAppSupport();
              }}
              className="w-full py-3 px-4 bg-[#D4AF37] text-black font-semibold text-xs tracking-[0.2em] uppercase rounded-sm flex items-center justify-center gap-2 hover:bg-[#e5c158] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ORDER ON WHATSAPP (+91 8114150537)</span>
            </button>
            <div className="text-center text-[10px] tracking-[0.2em] text-[#777777] uppercase">
              Pandeypur, Varanasi, Uttar Pradesh, India
            </div>
          </div>
        </div>
      )}
    </>
  );
};
