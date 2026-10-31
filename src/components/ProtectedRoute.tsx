import React, { useState } from 'react';
import {
  Shield,
  Lock,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  Mail,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth, ADMIN_MASTER_PASSWORD } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Enforces security for the VOID WEAR admin section.
 * Requires the master admin password: 70772710void to enter.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { navigate, showToast } = useShop();
  const {
    user,
    isAdmin,
    loading: authLoading,
    isPasscodeUnlocked,
    unlockWithPassword,
    loginWithGoogle,
    loginWithEmail,
    logout
  } = useAuth();

  // Master Passcode Form State
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Secondary Firebase Auth State
  const [showFirebaseOptions, setShowFirebaseOptions] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailPassword, setEmailPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [submittingEmail, setSubmittingEmail] = useState<boolean>(false);

  // Handle Master Passcode Verification
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');

    if (!passcodeInput.trim()) {
      setPasscodeError('Please enter the administrator password.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const success = unlockWithPassword(passcodeInput.trim());
      setIsVerifying(false);

      if (success) {
        showToast('Atelier master access unlocked. Welcome Akash Goshwami.', 'gold');
      } else {
        setPasscodeError('Access Denied: Incorrect administrator password. Please check your passcode.');
      }
    }, 300);
  };

  // Handle Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    setEmailError('');
    try {
      await loginWithGoogle();
      showToast('Authenticated via Google administrator account', 'gold');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in could not be completed';
      setEmailError(msg);
    }
  };

  // Handle Firebase Email/Password Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim() || !emailPassword) {
      setEmailError('Please enter both email and password.');
      return;
    }

    setSubmittingEmail(true);
    try {
      await loginWithEmail(email.trim(), emailPassword);
      showToast('Authenticated administrator session', 'gold');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setEmailError(msg);
    } finally {
      setSubmittingEmail(false);
    }
  };

  // 1. Loading State - Luxury Dark & Gold pulsing loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-[#D4AF37] animate-spin" />
            <Lock className="w-6 h-6 text-[#D4AF37] animate-pulse" />
          </div>
          <p className="font-display font-bold text-sm tracking-[0.3em] uppercase text-white mb-2">
            VOID WEAR
          </p>
          <p className="font-mono text-xs text-[#D4AF37] tracking-[0.25em] uppercase">
            VERIFYING ENCRYPTED SESSION...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated or Unauthorized State - Render Passcode Protected Gateway
  if (!isPasscodeUnlocked && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#D4AF37]/30 selection:text-white">
        {/* Top Minimal Bar */}
        <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#1A1A1A]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-mono text-[#888888] hover:text-[#D4AF37] transition-colors uppercase tracking-widest cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO STOREFRONT</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase">
              RESTRICTED ATELIER ACCESS
            </span>
          </div>
        </header>

        {/* Central Passcode Gate */}
        <main className="max-w-md w-full mx-auto my-10 bg-[#0C0C0C] border border-[#242424] p-8 sm:p-10 rounded-sm shadow-2xl relative overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4AF37]/8 blur-3xl rounded-full pointer-events-none" />

          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/70 mx-auto mb-4 bg-black p-0.5 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <img
                src="/void-logo.jpg"
                alt="VOID WEAR"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-display font-extrabold text-2xl tracking-[0.25em] uppercase text-white mb-1">
              VOID WEAR
            </h1>
            <p className="text-[11px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase">
              ADMINISTRATOR CONTROL ATELIER
            </p>
          </div>

          {/* Clearance Notice */}
          <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-xs mb-6 text-xs text-[#A0A0A0] leading-relaxed">
            <div className="flex items-center gap-2 text-[#D4AF37] font-mono font-bold text-[11px] uppercase mb-1">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>SUPERADMIN ACCESS ONLY</span>
            </div>
            This section is password-restricted to VOID WEAR administrator (<strong className="text-white">Akash Goshwami</strong>). Enter your administrator passcode below to unlock.
          </div>

          {/* Passcode Error Alert */}
          {passcodeError && (
            <div className="p-3 bg-red-950/70 border border-red-500/60 text-red-300 text-xs rounded-xs mb-5 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{passcodeError}</span>
            </div>
          )}

          {/* PRIMARY ACCESS: Master Admin Password Form */}
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                  ADMIN PASSWORD
                </span>
                <span className="text-[9px] text-[#777777] font-mono tracking-normal">
                  SECRET ACCESS CODE
                </span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (passcodeError) setPasscodeError('');
                  }}
                  autoFocus
                  placeholder="Enter secret admin access code"
                  className="w-full bg-[#121212] border border-[#2D2D2D] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white px-3.5 py-3 pr-10 rounded-xs text-xs font-mono outline-hidden transition-all shadow-inner placeholder:text-[#555555]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-display font-extrabold text-xs tracking-[0.25em] uppercase rounded-xs transition-all cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50 mt-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>VERIFYING PASSCODE...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                  <span>ENTER ADMIN ATELIER</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Hint for Authorized Admin */}
          <div className="mt-4 pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-[10px] font-mono text-[#666666]">
            <span>AUTHORIZED KEYHOLDER</span>
            <span className="text-[#D4AF37] font-semibold">AKASH GOSHWAMI</span>
          </div>

          {/* Secondary Collapsible Options: Google / Email Login */}
          <div className="mt-6 pt-4 border-t border-[#181818]">
            <button
              type="button"
              onClick={() => setShowFirebaseOptions(!showFirebaseOptions)}
              className="w-full text-center text-[10px] font-mono text-[#777777] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>ADDITIONAL AUTHENTICATION METHODS</span>
              {showFirebaseOptions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showFirebaseOptions && (
              <div className="mt-4 space-y-3 pt-2">
                {emailError && (
                  <div className="p-2.5 bg-red-950/60 border border-red-500/50 text-red-300 text-[11px] rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 bg-[#161616] hover:bg-white hover:text-black border border-[#282828] text-white transition-all font-mono font-bold text-[11px] tracking-wider uppercase rounded-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>SIGN IN WITH GOOGLE</span>
                </button>

                <form onSubmit={handleEmailAuth} className="space-y-2.5 pt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Admin Email (e.g. voidwear1010@gmail.com)"
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] text-white px-3 py-2 rounded-xs text-[11px] font-mono outline-hidden"
                  />
                  <input
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#111111] border border-[#252525] focus:border-[#D4AF37] text-white px-3 py-2 rounded-xs text-[11px] font-mono outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={submittingEmail}
                    className="w-full py-2 bg-[#222222] hover:bg-[#333333] text-white font-mono text-[10px] tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                  >
                    {submittingEmail ? 'AUTHENTICATING...' : 'SUBMIT CREDENTIALS'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Security Footer */}
        <footer className="max-w-5xl mx-auto w-full text-center pt-6 border-t border-[#141414] text-[10px] font-mono text-[#555555] tracking-widest uppercase flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VOID WEAR ATELIER &bull; VARANASI, UP</span>
          <span>SECURE ATELIER PROTOCOL ENFORCED</span>
        </footer>
      </div>
    );
  }

  // 3. User is authenticated and confirmed as authorized administrator -> Render protected children
  return <>{children}</>;
};
