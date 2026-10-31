import React, { useState, useEffect } from 'react';
import { Clock, Send, CheckCircle2, Settings } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LimitedDropCountdown: React.FC = () => {
  const { dropDate, setDropDate, showToast, setIsAdminEditOpen } = useShop();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(dropDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [dropDate]);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'info');
      return;
    }
    setIsSubscribed(true);
    showToast('You are on the VIP Waitlist. Private link will be sent prior to public release.', 'gold');
    setEmail('');
  };

  const handleUpdateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setDropDate(new Date(e.target.value).toISOString());
      setShowDatePicker(false);
      showToast('Next drop countdown date updated', 'gold');
    }
  };

  return (
    <section className="relative py-20 sm:py-28 bg-[#080808] text-white border-y border-[#181818] overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Section Pill Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121212] border border-[#D4AF37]/30 text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase rounded-full mb-6">
          <Clock className="w-3 h-3 text-[#D4AF37]" />
          <span>VAULT RELEASE // LIMITED ARCHIVE</span>
        </div>

        {/* Headline */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-[0.16em] uppercase text-white mb-4">
          THE NEXT DROP IS COMING.
        </h2>

        <p className="max-w-xl text-xs sm:text-sm tracking-[0.2em] text-[#888888] uppercase mb-12">
          Strictly limited to 50 pieces per silhouette. Never restocked.
        </p>

        {/* Live Countdown Display: DAYS : HOURS : MINUTES : SECONDS */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl w-full mb-12">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div
              key={item.label}
              className="bg-[#0D0D0D] border border-[#222222] p-4 sm:p-6 rounded-sm relative group hover:border-[#D4AF37]/50 transition-colors"
            >
              <div className="font-mono font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight mb-2 tabular-nums">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="font-mono text-[9px] sm:text-[11px] tracking-[0.3em] text-[#D4AF37] uppercase">
                {item.label}
              </div>
              {/* Corner gold accent */}
              <div className="absolute top-1 right-1 w-1 h-1 bg-[#D4AF37]/40" />
            </div>
          ))}
        </div>

        {/* JOIN THE WAITLIST Email Form */}
        <div className="w-full max-w-md">
          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-[#121212] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono tracking-[0.15em] uppercase rounded-sm">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>VIP ACCESS CONFIRMED. WATCH YOUR INBOX.</span>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS"
                required
                className="flex-1 bg-[#121212] border border-[#2A2A2A] focus:border-[#D4AF37] px-4 py-3 text-xs tracking-wider text-white placeholder-[#555555] uppercase rounded-sm outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors cursor-pointer rounded-sm whitespace-nowrap"
              >
                JOIN THE WAITLIST
              </button>
            </form>
          )}
        </div>

        {/* Editable Tool for Owner */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="text-[10px] tracking-[0.2em] text-[#555555] hover:text-[#D4AF37] transition-colors flex items-center gap-1 font-mono uppercase cursor-pointer"
          >
            <Settings className="w-3 h-3" />
            <span>EDIT DROP DATE (ADMIN)</span>
          </button>
        </div>

        {showDatePicker && (
          <div className="mt-4 p-4 bg-[#141414] border border-[#2E2E2E] rounded-sm max-w-xs animate-fadeIn">
            <label className="block text-[10px] text-[#888888] font-mono uppercase mb-2">
              Select Drop Target Date & Time:
            </label>
            <input
              type="datetime-local"
              onChange={handleUpdateDate}
              className="w-full bg-[#090909] border border-[#333333] text-white p-2 text-xs rounded-xs outline-none focus:border-[#D4AF37]"
            />
          </div>
        )}

      </div>
    </section>
  );
};
