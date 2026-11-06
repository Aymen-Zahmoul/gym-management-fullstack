import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
  UserCheck,
  Dumbbell,
  Crown,
  UserPlus,
} from 'lucide-react';
import { Member } from '../types';
import { api } from '../services/api';
import { SpotlightCard } from './ui/SpotlightCard';
import { HadidLogo } from './ui/HadidLogo';
import { AthleteVideoGridBackground } from './ui/AthleteVideoGridBackground';
import { getErrorMessage } from '../utils/errorUtils';

interface LoginViewProps {
  onLoginSuccess: (user: Member) => void;
  onNavigateToSignUp?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onBackToLanding?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
  isDark,
  onToggleTheme,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !motDePasse) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    try {
      setLoading(true);
      const user = await api.login(email.trim(), motDePasse);
      onLoginSuccess(user);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Identifiants incorrects.'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setMotDePasse(testPass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-transparent text-neutral-900 dark:text-neutral-100 transition-colors select-none font-sans">
      <AthleteVideoGridBackground />
      {/* Centered subtle ambient bronze illumination */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#B07845]/25 via-transparent to-transparent" />

      {/* 1. Header: Brand Wordmark + Back to Landing + Theme Toggle */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center flex-shrink-0">
          <HadidLogo size="md" onClick={onBackToLanding} />
        </div>

        <div className="flex items-center gap-2.5">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-3.5 py-1.5 sm:py-2 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/70 dark:bg-black/50 backdrop-blur-md border-white/30 dark:border-white/15 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:text-neutral-900 dark:hover:text-white hover:border-[#B07845] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B07845]" />
              <span className="hidden sm:inline">Site Vitrine</span>
              <span className="sm:hidden">Retour</span>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            aria-label="Changer de thème"
            className="p-2 sm:p-2.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-[#141518]/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 cursor-pointer transition-all hover:border-[#B07845] active:scale-95 shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#B07845]" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
        </div>
      </header>

      {/* 2. Main Login Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 z-10 w-full min-h-0">
        <div className="w-full max-w-md mx-auto">
          <SpotlightCard className="p-6 sm:p-8 shadow-2xl rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white/65 dark:bg-[#121316]/65 backdrop-blur-md border-white/40 dark:border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            {/* Identity Badge & Title */}
            <div className="text-center space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B07845]/30 bg-[#B07845]/10 text-[10px] font-space font-bold tracking-[0.2em] uppercase text-[#B07845]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B07845]" />
                <span>Portail Sécurisé</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-space font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                Connexion
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                HADID GYM CLUB • Club Privé d'Élite
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Identifiant / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="nom@hadidfitness.tn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#B07845] focus:ring-1 focus:ring-[#B07845]/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400">
                    Mot de Passe
                  </label>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                    Chiffré SHA-256
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#B07845] focus:ring-1 focus:ring-[#B07845]/50 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#B07845] hover:bg-[#966436] text-white font-space font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-[#B07845]/20 hover:shadow-[#B07845]/35 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authentification...</span>
                  ) : (
                    <>
                      <span>Se Connecter</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Direct Toggle Button: Switch to Sign Up (Simple et Direct) */}
            {onNavigateToSignUp && (
              <div className="pt-5 mt-5 border-t border-neutral-200/80 dark:border-white/10 text-center">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2.5 font-light">
                  Pas encore membre de notre club ?
                </p>
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#B07845]/40 hover:border-[#B07845] bg-[#B07845]/5 hover:bg-[#B07845]/15 text-[#B07845] hover:text-[#966436] dark:hover:text-white text-xs font-space font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <UserPlus className="w-4 h-4 text-[#B07845] group-hover:scale-110 transition-transform" />
                  <span>Créer un compte / S'inscrire</span>
                </button>
              </div>
            )}

            {/* 1-Click Fast Passports (Instant Demo for Defense) */}
            <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-space">
                <span>Démonstration (1 Clic)</span>
                <span className="font-mono text-[#B07845] text-[9px]">Accès Rapide</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@carthagefitness.tn', 'admin123')}
                  className="p-2 rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm border border-neutral-200/90 dark:border-white/[0.08] hover:border-[#B07845] text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
                >
                  <Crown className="w-3.5 h-3.5 mx-auto text-[#B07845] mb-0.5" />
                  <div className="text-[10px] font-bold text-neutral-900 dark:text-white group-hover:text-[#B07845] transition-colors font-space">
                    ADMIN
                  </div>
                  <div className="text-[8px] text-neutral-400 font-mono">Directeur</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('karim.coach@carthagefitness.tn', 'coach123')}
                  className="p-2 rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm border border-neutral-200/90 dark:border-white/[0.08] hover:border-[#758a7b] text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
                >
                  <Dumbbell className="w-3.5 h-3.5 mx-auto text-[#758a7b] mb-0.5" />
                  <div className="text-[10px] font-bold text-neutral-900 dark:text-white group-hover:text-[#758a7b] transition-colors font-space">
                    COACH
                  </div>
                  <div className="text-[8px] text-neutral-400 font-mono">Entraîneur</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('yassine.khemir@gmail.com', 'pass123')}
                  className="p-2 rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm border border-neutral-200/90 dark:border-white/[0.08] hover:border-[#c87a32] text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 mx-auto text-[#c87a32] mb-0.5" />
                  <div className="text-[10px] font-bold text-neutral-900 dark:text-white group-hover:text-[#c87a32] transition-colors font-space">
                    MEMBER
                  </div>
                  <div className="text-[8px] text-neutral-400 font-mono">Adhérent</div>
                </button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-light border-t border-neutral-200/60 dark:border-white/[0.06] shrink-0">
        <div className="font-medium tracking-wide text-neutral-600 dark:text-neutral-400 font-space">
          HADID GYM CLUB
        </div>
        <div className="hidden sm:block text-[9px] font-mono">
          36.8528° N, 10.3233° E • Carthage
        </div>
        <div className="text-[9px] text-neutral-400 font-mono uppercase tracking-widest">
          © 2026 HADID GYM CLUB
        </div>
      </footer>
    </div>
  );
};
