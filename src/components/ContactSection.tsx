import React, { useState } from 'react';
import { MessageSquare, Mail, Instagram, MapPin, Clock, Send, CheckCircle2, PhoneCall } from 'lucide-react';
import { BRAND_INFO } from '../data/products';
import { useShop } from '../context/ShopContext';

export const ContactSection: React.FC = () => {
  const { showToast, openWhatsAppSupport } = useShop();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please fill in required fields', 'info');
      return;
    }

    setSubmitted(true);
    showToast('Your message has reached VOID WEAR HQ. Akash will respond shortly.', 'gold');

    // Also offer option to send via WhatsApp
    const msg = `Hi Akash, my name is ${form.name} (Phone: ${form.phone || 'N/A'}, Email: ${form.email}). Message: ${form.message}`;
    setTimeout(() => {
      openWhatsAppSupport(msg);
    }, 1200);

    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#060606] text-white border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 border-b border-[#1C1C1C] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>DIRECT INQUIRIES & CONCIERGE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-[0.16em] uppercase text-white">
              CONTACT VOID WEAR
            </h2>
          </div>
          <p className="mt-4 sm:mt-0 font-luxury text-xs sm:text-sm tracking-[0.25em] text-[#888888] uppercase max-w-sm">
            Direct access to our Varanasi studio and customer support.
          </p>
        </div>

        {/* 2 Columns: Brand Information Details & Interactive Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-[#0B0B0B] border border-[#1C1C1C] rounded-sm space-y-6">
              
              {/* Brand Title */}
              <div>
                <h3 className="font-display font-extrabold text-2xl tracking-[0.2em] uppercase text-white mb-1">
                  VOID WEAR
                </h3>
                <p className="font-mono text-xs tracking-widest text-[#D4AF37] uppercase">
                  FOUNDER: {BRAND_INFO.founder.toUpperCase()}
                </p>
              </div>

              <div className="w-full h-[1px] bg-[#1C1C1C]" />

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#141414] border border-[#242424] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#666666] uppercase block">
                    LOCATION & ATELIER
                  </span>
                  <p className="text-xs sm:text-sm text-white font-medium mt-0.5">
                    {BRAND_INFO.location}
                  </p>
                </div>
              </div>

              {/* WhatsApp Support (Akash Goshwami) */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#141414] border border-[#242424] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#666666] uppercase block">
                    AKASH GOSHWAMI // FOUNDER & CREATIVE DIRECTOR
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <a
                      href={`https://wa.me/918114150537`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-[#D4AF37] hover:underline font-mono font-bold"
                    >
                      {BRAND_INFO.whatsappDisplay}
                    </a>
                    <a
                      href={`tel:+918114150537`}
                      className="text-[10px] text-[#999999] hover:text-white uppercase font-mono px-2 py-0.5 bg-[#161616] border border-[#262626] rounded-xs"
                    >
                      CALL
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Contact (Shivam Giri) */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#141414] border border-[#242424] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#666666] uppercase block">
                    SHIVAM GIRI // CO-FOUNDER & MANAGING DIRECTOR
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <a
                      href="tel:+917985986280"
                      className="text-xs sm:text-sm text-[#D4AF37] hover:underline font-mono font-bold"
                    >
                      +91 7985986280
                    </a>
                    <a
                      href="https://wa.me/917985986280?text=Hi%20Shivam,%20I'd%20like%20to%20connect%20regarding%20VOID%20WEAR."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#999999] hover:text-white uppercase font-mono px-2 py-0.5 bg-[#161616] border border-[#262626] rounded-xs"
                    >
                      WHATSAPP
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#141414] border border-[#242424] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#666666] uppercase block">
                    EMAIL INQUIRIES
                  </span>
                  <a
                    href={`mailto:${BRAND_INFO.email}`}
                    className="text-xs sm:text-sm text-white hover:text-[#D4AF37] transition-colors font-mono mt-0.5 block"
                  >
                    {BRAND_INFO.email}
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#141414] border border-[#242424] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#666666] uppercase block">
                    INSTAGRAM
                  </span>
                  <a
                    href={BRAND_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-[#D4AF37] hover:underline font-mono mt-0.5 block"
                  >
                    {BRAND_INFO.instagram}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#141414] border border-[#242424] flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#666666] uppercase block">
                    BUSINESS HOURS
                  </span>
                  <p className="text-xs sm:text-sm text-white font-medium mt-0.5">
                    {BRAND_INFO.businessHours} (24/7 Online Concierge)
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#0B0B0B] border border-[#1C1C1C] p-8 sm:p-10 rounded-sm flex flex-col justify-between">
            <div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-[0.15em] uppercase text-white mb-2">
                SEND A MESSAGE
              </h3>
              <p className="text-xs text-[#888888] font-light leading-relaxed mb-8">
                Inquire about custom sizing, bulk collaborative orders, or request specific drop archives.
              </p>

              {submitted ? (
                <div className="p-6 bg-[#121212] border border-[#D4AF37]/50 text-center rounded-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <h4 className="font-display font-bold text-base uppercase text-white mb-1">
                    MESSAGE TRANSMITTED
                  </h4>
                  <p className="text-xs text-[#888888] mb-4">
                    Your inquiry has been forwarded to Akash Goshwami and the VOID concierge team.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-[#222222] text-xs font-mono uppercase text-white hover:bg-white hover:text-black rounded-xs"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#888888] mb-1.5">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Siddharth"
                        className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] text-white p-3 text-xs uppercase rounded-xs outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-widest uppercase text-[#888888] mb-1.5">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. name@domain.com"
                        className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] text-white p-3 text-xs uppercase rounded-xs outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-[#888888] mb-1.5">
                      PHONE / WHATSAPP NUMBER
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] text-white p-3 text-xs uppercase rounded-xs outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase text-[#888888] mb-1.5">
                      MESSAGE *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Specify your inquiry, size requirements, or feedback..."
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] text-white p-3 text-xs uppercase rounded-xs outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors cursor-pointer rounded-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
