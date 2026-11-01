import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, RefreshCw, FileText, ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react';

interface PoliciesPageProps {
  initialTab?: 'shipping' | 'returns' | 'privacy' | 'terms';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ initialTab = 'shipping' }) => {
  const { websiteContent, navigate } = useShop();
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const tabs = [
    { id: 'shipping', label: 'SHIPPING POLICY', icon: Truck },
    { id: 'returns', label: 'RETURNS & EXCHANGES', icon: RefreshCw },
    { id: 'privacy', label: 'PRIVACY POLICY', icon: ShieldCheck },
    { id: 'terms', label: 'TERMS & CONDITIONS', icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </button>

        {/* Header */}
        <div className="border-b border-neutral-800 pb-8 mb-8">
          <p className="text-[#D4AF37] text-xs font-mono uppercase tracking-[0.3em] mb-2">VOID WEAR // CLIENT SERVICES</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">Policies & Standards</h1>
          <p className="text-neutral-400 text-sm mt-3 max-w-xl">
            Transparency, precision, and luxury service. Here is everything you need to know about purchasing, shipping, and returns with VOID WEAR.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.history.pushState({}, '', `/${tab.id}`);
                }}
                className={`flex items-center justify-center gap-2 py-3 px-3 border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'border-neutral-800 bg-[#0d0d0d] text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                <span className="truncate">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="border border-neutral-800 bg-[#0a0a0a] p-6 sm:p-10 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent pointer-events-none" />

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold uppercase tracking-wider">Shipping & Delivery</h2>
              </div>
              <p className="text-neutral-300 leading-relaxed text-sm whitespace-pre-line">
                {websiteContent?.shippingPolicy ||
                  'All domestic orders across India are dispatched within 24 to 48 hours via premium express air couriers (Bluedart, Delhivery, Xpressbees). Delivery takes 3 to 5 business days.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-900">
                <div className="p-4 bg-[#111] border border-neutral-800/80">
                  <p className="text-[10px] uppercase font-mono text-[#D4AF37] tracking-wider mb-1">Standard Dispatch</p>
                  <p className="text-sm font-semibold text-white">24 - 48 Hours</p>
                  <p className="text-xs text-neutral-400 mt-1">Processed from Varanasi atelier</p>
                </div>
                <div className="p-4 bg-[#111] border border-neutral-800/80">
                  <p className="text-[10px] uppercase font-mono text-[#D4AF37] tracking-wider mb-1">Transit Time</p>
                  <p className="text-sm font-semibold text-white">3 - 5 Business Days</p>
                  <p className="text-xs text-neutral-400 mt-1">Express Air Courier nationwide</p>
                </div>
                <div className="p-4 bg-[#111] border border-neutral-800/80">
                  <p className="text-[10px] uppercase font-mono text-[#D4AF37] tracking-wider mb-1">Complimentary Tier</p>
                  <p className="text-sm font-semibold text-white">Free Over ₹1,999</p>
                  <p className="text-xs text-neutral-400 mt-1">₹99 flat rate for sub-tier orders</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold uppercase tracking-wider">7-Day Exchange & Returns</h2>
              </div>
              <p className="text-neutral-300 leading-relaxed text-sm whitespace-pre-line">
                {websiteContent?.returnsPolicy ||
                  'We offer a 7-day hassle-free exchange or return policy on unwashed, unworn garments with all original security tags and packaging intact.'}
              </p>

              <div className="space-y-3 pt-2 text-xs text-neutral-400">
                <div className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">1.</span>
                  <span>Items must be in original condition with intact woven VOID tags and branded dust packaging.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">2.</span>
                  <span>Size exchanges are accommodated promptly at zero reverse pickup fee.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">3.</span>
                  <span>Refunds are returned to the original payment source or provided as lifetime store credit.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold uppercase tracking-wider">Privacy & Data Security</h2>
              </div>
              <p className="text-neutral-300 leading-relaxed text-sm whitespace-pre-line">
                {websiteContent?.privacyPolicy ||
                  'VOID WEAR respects your privacy. We collect customer shipping details, email, and phone numbers solely for processing orders and real-time courier tracking updates.'}
              </p>
              <div className="bg-[#111] p-4 border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
                Payments are securely tokenized through 256-bit encrypted gateways (Razorpay, UPI, Cards, NetBanking). Your sensitive financial credentials never enter our servers.
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold uppercase tracking-wider">Terms & Conditions</h2>
              </div>
              <p className="text-neutral-300 leading-relaxed text-sm whitespace-pre-line">
                {websiteContent?.termsConditions ||
                  'All sales are subject to VOID WEAR terms of service. Products purchased during exclusive limited drop countdowns are subject to stock availability and verified payment confirmation.'}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                VOID WEAR is an independent luxury streetwear maison founded by Akash Goshwami, based in Pandeypur, Varanasi, Uttar Pradesh, India.
              </p>
            </div>
          )}
        </div>

        {/* Concierge Help Box */}
        <div className="mt-12 p-6 border border-neutral-800 bg-[#0d0d0d] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Need Personal Concierge Assistance?</h3>
            <p className="text-xs text-neutral-400 mt-1">Our Varanasi studio team is active 7 days a week for sizing, orders, and inquiries.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918114150537?text=Hi%20VOID%20WEAR,%20I%20have%20an%20inquiry%20regarding%20orders%20and%20policies."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a
              href="mailto:voidwear1010@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-white text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
