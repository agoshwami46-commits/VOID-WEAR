import React from 'react';
import { ArrowUp, Instagram, MessageSquare, Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_INFO } from '../data/products';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setIsSizeGuideOpen, openWhatsAppSupport, setIsAdminEditOpen, navigate } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#030303] text-white border-t border-[#161616] pt-20 pb-12 relative overflow-hidden">
      {/* Background ambient gold aura */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Footer Tier: Brand Lockup & Scroll to Top */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1A1A1A] pb-12 mb-12 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/40 bg-black p-0.5 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <img
                src="/void-logo.jpg"
                alt="VOID WEAR"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-[0.25em] uppercase text-white block">
                VOID WEAR
              </span>
              <span className="font-luxury text-xs tracking-[0.35em] text-[#D4AF37] uppercase">
                “ENTER THE VOID.” • BEYOND ORDINARY
              </span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="self-start md:self-auto px-4 py-2 border border-[#242424] hover:border-[#D4AF37] text-[#999999] hover:text-[#D4AF37] text-xs font-mono tracking-widest uppercase transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          
          {/* Column 1: Navigation */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
              DISCOVER
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888] font-mono uppercase">
              <li>
                <button
                  onClick={() => scrollToSection('#home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  HOME
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shop')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  SHOP ALL ARCHIVE
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#new-drop')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  NEW DROP
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#collections')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  COLLECTIONS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Brand & Story */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
              HOUSE OF VOID
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888] font-mono uppercase">
              <li>
                <button
                  onClick={() => scrollToSection('#about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  ABOUT VOID WEAR
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#brand-statement')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  PHILOSOPHY
                </button>
              </li>
              <li>
                <span className="text-[#666666]">FOUNDER: AKASH GOSHWAMI</span>
              </li>
              <li>
                <span className="text-[#666666]">CO-FOUNDER: SHIVAM GIRI</span>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  VARANASI ATELIER
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888] font-mono uppercase">
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  SIZE GUIDE
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/track-order')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  TRACK ORDER
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  SHIPPING & DELIVERY
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/returns')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  RETURNS & EXCHANGES
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  PRIVACY POLICY
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  TERMS & CONDITIONS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-4">
              CONCIERGE
            </h4>
            <ul className="space-y-2.5 text-xs text-[#888888] font-mono">
              <li>
                <button
                  onClick={() => openWhatsAppSupport()}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{BRAND_INFO.whatsappDisplay} (Akash)</span>
                </button>
              </li>
              <li>
                <a
                  href="tel:+917985986280"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>+91 7985986280 (Shivam)</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND_INFO.email}`}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{BRAND_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{BRAND_INFO.instagram}</span>
                </a>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-[#666666] tracking-widest block uppercase">
                  {BRAND_INFO.businessHours}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Accepted Payment Standards Bar */}
        <div className="py-6 border-y border-[#181818] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#666666]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-widest uppercase">ACCEPTED PAYMENTS:</span>
            <span className="px-2 py-1 bg-[#101010] border border-[#222222] rounded-xs text-[#CCCCCC] text-[10px]">UPI / QR</span>
            <span className="px-2 py-1 bg-[#101010] border border-[#222222] rounded-xs text-[#CCCCCC] text-[10px]">RUPAY</span>
            <span className="px-2 py-1 bg-[#101010] border border-[#222222] rounded-xs text-[#CCCCCC] text-[10px]">VISA / MASTERCARD</span>
            <span className="px-2 py-1 bg-[#101010] border border-[#222222] rounded-xs text-[#CCCCCC] text-[10px]">CASH ON DELIVERY</span>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="text-[10px] text-[#888888] hover:text-[#D4AF37] transition-colors font-mono uppercase cursor-pointer flex items-center gap-1 border border-[#222222] px-2 py-1 rounded-xs"
          >
            <span>ADMIN DASHBOARD (/admin)</span>
          </button>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#555555] gap-4 text-center sm:text-left">
          <div>
            © 2026 VOID WEAR. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ENGINEERED IN VARANASI, UP, INDIA</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            <span className="text-[#D4AF37]">BEYOND ORDINARY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
