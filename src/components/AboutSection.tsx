import React, { useState } from 'react';
import { BRAND_INFO } from '../data/products';
import { ArrowUpRight, MessageSquare, Instagram, MapPin, Edit3, Shield, Award, PhoneCall } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { LeaderProfile } from '../types';
import { getStoredLeadershipProfiles, saveStoredLeadershipProfiles } from '../data/leadership';
import { EditLeadershipModal } from './EditLeadershipModal';

export const AboutSection: React.FC = () => {
  const { openWhatsAppSupport, showToast } = useShop();

  // Load profiles from persistent storage or default
  const [leaders, setLeaders] = useState<LeaderProfile[]>(() => getStoredLeadershipProfiles());
  const [selectedLeaderToEdit, setSelectedLeaderToEdit] = useState<LeaderProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (leader: LeaderProfile) => {
    setSelectedLeaderToEdit(leader);
    setIsEditModalOpen(true);
  };

  const handleSaveLeader = (updatedLeader: LeaderProfile) => {
    const updatedList = leaders.map((l) => (l.id === updatedLeader.id ? updatedLeader : l));
    setLeaders(updatedList);
    saveStoredLeadershipProfiles(updatedList);
    showToast(`${updatedLeader.name}'s profile updated successfully`, 'gold');
  };

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#060606] text-white border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill Kicker */}
        <div className="flex items-center gap-2 mb-4 font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span>ORIGINS & MANIFESTO</span>
        </div>

        {/* Big Editorial Headline */}
        <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-[0.16em] uppercase text-white mb-12 sm:mb-16">
          THIS IS <span className="gold-gradient-text">VOID WEAR.</span>
        </h2>

        {/* 2-Column Split: Brand Story & Official Crest */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 sm:mb-28">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.05em] text-[#F0F0F0] leading-snug border-l-2 border-[#D4AF37] pl-6 py-2">
              “VOID WEAR is a premium streetwear brand built around individuality, confidence and self-expression. We believe clothing should not simply follow culture — it should help create it.”
            </blockquote>

            <p className="text-sm sm:text-base text-[#9E9E9E] leading-relaxed font-light">
              Rooted in the ancient, sacred energy of Varanasi and sculpted through the lens of modern international streetwear, VOID WEAR rejects disposable fast fashion. Every silhouette begins with heavy raw yarn, rigorous architectural pattern cutting, and unyielding discipline in execution.
            </p>

            <p className="text-sm sm:text-base text-[#9E9E9E] leading-relaxed font-light">
              We engineer garments with substantial heft—from our 280 GSM oversized tees to 480 GSM loopback French Terry hoodies—creating structured armor for the creative vanguard who navigate the city on their own terms.
            </p>

            {/* Micro Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1C1C1C] font-mono text-xs">
              <div>
                <span className="text-[#D4AF37] block text-lg font-bold">100%</span>
                <span className="text-[#666666] tracking-wider uppercase text-[10px]">Pure Dense Cotton</span>
              </div>
              <div>
                <span className="text-[#D4AF37] block text-lg font-bold">50 RUN</span>
                <span className="text-[#666666] tracking-wider uppercase text-[10px]">Per Silhouette</span>
              </div>
              <div>
                <span className="text-[#D4AF37] block text-lg font-bold">VNS</span>
                <span className="text-[#666666] tracking-wider uppercase text-[10px]">Varanasi Atelier</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-[#0E0E0E] border border-[#222222] p-6 rounded-sm shadow-2xl flex flex-col items-center justify-center text-center group hover:border-[#D4AF37]/50 transition-colors">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border border-[#D4AF37]/40 p-2 bg-black shadow-[0_0_40px_rgba(212,175,55,0.2)] mb-6">
                <img
                  src="/void-logo.jpg"
                  alt="VOID WEAR Crest"
                  className="w-full h-full object-cover rounded-full filter contrast-125 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-display font-bold text-lg tracking-[0.2em] uppercase text-white">
                VOID WEAR
              </h3>
              <p className="font-luxury text-xs tracking-[0.3em] text-[#D4AF37] uppercase mt-1">
                BEYOND ORDINARY
              </p>
              <div className="mt-4 text-[10px] font-mono tracking-widest text-[#666666] uppercase">
                ESTABLISHED 2026 // PANDEYPUR, VARANASI
              </div>
            </div>
          </div>

        </div>

        {/* Leadership Section Header */}
        <div className="pt-8 pb-10 border-t border-[#1C1C1C]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>HOUSE OF VOID // LEADERSHIP</span>
              </div>
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-[0.16em] uppercase text-white">
                DIRECTORS OF THE VOID
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#888888] font-mono uppercase tracking-wider max-w-md">
              THE VISION, CRAFT, AND ARCHITECTURE OF LUXURY STREETWEAR SCULPTED IN VARANASI.
            </p>
          </div>
        </div>

        {/* Leadership Grid: 2 Matching Luxury Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {leaders.map((leader) => {
            const isFounder = leader.id === 'akash-goshwami';

            return (
              <div
                key={leader.id}
                className="p-6 sm:p-8 md:p-10 bg-[#090909] border border-[#1A1A1A] hover:border-[#D4AF37]/50 rounded-sm relative overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-2xl"
              >
                {/* Subtle ambient gold aura */}
                <div className="absolute top-0 right-0 w-56 h-56 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors duration-500" />

                <div>
                  {/* Top Header Strip: Role Pill + Quick Edit Button */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#161616]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      <span className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
                        {isFounder ? 'FOUNDER & CREATIVE DIRECTOR' : 'CO-FOUNDER & MANAGING DIRECTOR'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleEditClick(leader)}
                      className="px-2.5 py-1 bg-[#121212] hover:bg-[#D4AF37] hover:text-black border border-[#222222] hover:border-[#D4AF37] text-[#888888] text-[10px] font-mono tracking-widest uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      title={`Edit ${leader.name}'s profile photo or title`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>EDIT PROFILE</span>
                    </button>
                  </div>

                  {/* Split Visual & Bio Container */}
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start mb-6">
                    
                    {/* Portrait Photo Frame with Dark Luxury Framing */}
                    <div className="relative w-full sm:w-48 md:w-52 aspect-[3/4] bg-[#0E0E0E] border border-[#262626] group-hover:border-[#D4AF37]/60 rounded-xs overflow-hidden shrink-0 shadow-2xl transition-colors">
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className={`w-full h-full object-cover ${
                          isFounder ? 'object-center' : 'object-[center_12%]'
                        } filter contrast-105 group-hover:scale-105 transition-transform duration-700`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/void-logo.jpg';
                        }}
                      />
                      
                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Sub-label overlay on image */}
                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <span className="font-mono text-[9px] tracking-[0.25em] text-[#D4AF37] uppercase block">
                          {isFounder ? 'CREATIVE VISION' : 'EXECUTIVE DIRECTION'}
                        </span>
                        <span className="font-display font-bold text-xs tracking-[0.15em] text-white uppercase truncate block">
                          {leader.name}
                        </span>
                      </div>
                    </div>

                    {/* Leader Information & Details */}
                    <div className="flex-1 space-y-3">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-[#888888] uppercase">
                        <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span>{leader.location || 'PANDEYPUR, VARANASI, UP, INDIA'}</span>
                      </div>

                      <div>
                        <h4 className="font-display font-black text-2xl sm:text-3xl tracking-[0.14em] uppercase text-white">
                          {leader.name}
                        </h4>
                        <p className="font-luxury text-xs sm:text-sm tracking-[0.25em] text-[#D4AF37] uppercase mt-1">
                          {leader.designation}
                        </p>
                      </div>

                      {/* Direct Phone Number Badge */}
                      {leader.phone && (
                        <div className="pt-1">
                          <span className="text-[9px] font-mono tracking-widest text-[#666666] uppercase block mb-1">
                            DIRECT CONTACT / PHONE:
                          </span>
                          <a
                            href={`tel:+91${leader.phone.replace(/\D/g, '').slice(-10)}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121212] hover:bg-[#D4AF37] hover:text-black border border-[#252525] hover:border-[#D4AF37] text-[#D4AF37] hover:text-black rounded-xs transition-colors font-mono text-xs group/phone font-bold"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37] group-hover/phone:text-black" />
                            <span>{leader.phoneDisplay || `+91 ${leader.phone}`}</span>
                          </a>
                        </div>
                      )}

                      {/* Content block: Authentic quote for Akash, or Executive Focus for Shivam */}
                      {isFounder && leader.bioQuote ? (
                        <blockquote className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed font-light pt-2 border-l border-[#D4AF37]/40 pl-3">
                          {leader.bioQuote}
                        </blockquote>
                      ) : (
                        <div className="pt-2 space-y-2">
                          <div className="text-[10px] font-mono uppercase tracking-widest text-[#777777]">
                            DIRECTOR PORTFOLIO & RESPONSIBILITIES:
                          </div>
                          <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                            <div className="p-2.5 bg-[#101010] border border-[#1E1E1E] rounded-xs flex items-center gap-2 text-[#CCCCCC]">
                              <Shield className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                              <span>Brand Management & Operational Governance</span>
                            </div>
                            <div className="p-2.5 bg-[#101010] border border-[#1E1E1E] rounded-xs flex items-center gap-2 text-[#CCCCCC]">
                              <Award className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                              <span>Varanasi Atelier Logistics & National Distribution</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Card Action Strip */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#161616]">
                  {(() => {
                    const phoneDigits = leader.phone ? leader.phone.replace(/\D/g, '') : (isFounder ? '8114150537' : '7985986280');
                    const targetWa = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
                    const waText = leader.whatsappMessage || `Hi ${leader.name}, I'd like to connect regarding VOID WEAR.`;
                    
                    return (
                      <>
                        <a
                          href={`https://wa.me/${targetWa}?text=${encodeURIComponent(waText)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.2em] uppercase rounded-xs hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>CONNECT WITH {leader.name.split(' ')[0].toUpperCase()}</span>
                        </a>

                        {leader.phone && (
                          <a
                            href={`tel:+91${targetWa.slice(-10)}`}
                            className="px-3.5 py-2.5 bg-[#141414] hover:bg-[#222222] border border-[#262626] text-white hover:text-[#D4AF37] hover:border-[#D4AF37] font-display font-semibold text-xs tracking-[0.15em] uppercase rounded-xs transition-colors flex items-center justify-center gap-1.5"
                            title={`Call ${leader.name} directly`}
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>CALL</span>
                          </a>
                        )}
                      </>
                    );
                  })()}

                  <a
                    href={BRAND_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#141414] border border-[#262626] text-white hover:text-[#D4AF37] hover:border-[#D4AF37] font-display font-semibold text-xs tracking-[0.2em] uppercase rounded-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@VOID__WEAR__</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Edit Leadership Modal */}
      <EditLeadershipModal
        leader={selectedLeaderToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLeaderToEdit(null);
        }}
        onSave={handleSaveLeader}
      />
    </section>
  );
};
