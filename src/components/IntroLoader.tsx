import React, { useState, useEffect } from 'react';

export const IntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if seen in session
    const seen = sessionStorage.getItem('vw_intro_seen');
    if (seen) {
      setVisible(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setFading(true);
    }, 1800);

    const timer2 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('vw_intro_seen', 'true');
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] cursor-pointer transition-opacity duration-700 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient gold aura */}
      <div className="absolute w-96 h-96 bg-[#D4AF37]/10 blur-3xl rounded-full animate-pulse" />

      {/* Center Official VOID WEAR Logo */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 overflow-hidden rounded-full border border-[#D4AF37]/30 p-1 bg-black/60 shadow-[0_0_50px_rgba(212,175,55,0.25)]">
          <img
            src="/void-logo.jpg"
            alt="VOID WEAR - Beyond Ordinary"
            className="w-full h-full object-cover rounded-full filter contrast-125 brightness-110"
          />
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[0.35em] text-white uppercase mb-2">
          VOID WEAR
        </h1>
        <p className="font-luxury text-xs sm:text-sm tracking-[0.45em] text-[#D4AF37] uppercase mb-6">
          BEYOND ORDINARY
        </p>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-4" />
        <p className="text-[10px] tracking-[0.3em] text-[#888888] uppercase">
          VARANASI // GLOBAL • 2026
        </p>
      </div>

      <div className="absolute bottom-8 text-[10px] tracking-[0.25em] text-[#666666] uppercase animate-pulse">
        Click to enter
      </div>
    </div>
  );
};
