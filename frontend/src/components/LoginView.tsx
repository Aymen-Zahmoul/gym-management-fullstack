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
} from 'lucide-react';
import { Member } from '../types';
import { api } from '../services/api';
import { ShinyButton } from './ui/ShinyButton';
import { SpotlightCard } from './ui/SpotlightCard';
import { useAnimeEntrance } from '../utils/animeAnimations';
import { HadidLogo } from './ui/HadidLogo';

interface LoginViewProps {
  onLoginSuccess: (user: Member) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onBackToLanding?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  isDark,
  onToggleTheme,
  onBackToLanding,
}) => {
  const containerRef = useAnimeEntrance<HTMLDivElement>('.anime-item', []);
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !motDePasse) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    try {
      setLoading(true);
      const user = await api.login(email, motDePasse);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects.');
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
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-[#FAF9F5] dark:bg-[#0B0C0E] transition-colors"
    >
      {/* Centered subtle ambient illumination */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c5a880]/30 via-transparent to-transparent" />

      {/* Top Header — Full Width Container (Corner Logo + Space, NOT Cramped) */}
      <header className="anime-item w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex-shrink-0">
          <HadidLogo size="md" onClick={onBackToLanding} />
        </div>

        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-4 py-2 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:text-neutral-900 dark:hover:text-white hover:border-bronze flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Site Vitrine</span>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            aria-label="Changer de thème"
            className="p-2.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 cursor-pointer transition-all hover:border-bronze active:scale-95 shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-bronze" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
        </div>
      </header>

      {/* Main Center Stage — Beautifully Centered Luxury Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 z-10 w-full my-auto">
        <div className="w-full max-w-md mx-auto">
          <SpotlightCard className="p-8 sm:p-10 shadow-2xl rounded-3xl border border-neutral-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#121316]/95 backdrop-blur-xl">
            {/* Centered Crest Icon */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-bronze/10 border border-bronze/30 flex items-center justify-center mx-auto text-bronze font-black tracking-widest text-sm shadow-inner">
                HD
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100/80 dark:bg-white/[0.04] text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-700 dark:text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
                <span>Portail Réservé</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight pt-1">
                Connexion
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                HADID Byrsa Sanctuary • Club Privé d'Élite
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields with Balanced Comfortable Padding */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Identifiant / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="nom@hadidfitness.tn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#1A1C20] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400">
                    Mot de Passe
                  </label>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                    256-bit
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-neutral-50 dark:bg-[#1A1C20] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/50 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <ShinyButton
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="w-full justify-center py-3.5 text-xs tracking-widest uppercase font-bold rounded-xl"
                >
                  {loading ? (
                    <span>Vérification...</span>
                  ) : (
                    <>
                      <span>Ouvrir Ma Session</span>
                      <ArrowRight className="w-4 h-4 ml-2 text-bronze" />
                    </>
                  )}
                </ShinyButton>
              </div>
            </form>

            {/* 1-Click Passports (Spacious, Clean, Zero Collision) */}
            <div className="mt-7 pt-5 border-t border-neutral-100 dark:border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <span>Démonstration (1 Clic)</span>
                <span className="font-mono text-bronze text-[9px]">Accès Direct</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@carthagefitness.tn', 'admin123')}
                  className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/90 dark:border-white/[0.08] hover:border-bronze text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
                >
                  <Crown className="w-3.5 h-3.5 mx-auto text-bronze mb-1" />
                  <div className="text-[11px] font-bold text-neutral-900 dark:text-white group-hover:text-bronze transition-colors">
                    ADMIN
                  </div>
                  <div className="text-[9px] text-neutral-400 font-mono">Directeur</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('karim.coach@carthagefitness.tn', 'coach123')}
                  className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/90 dark:border-white/[0.08] hover:border-sage text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
                >
                  <Dumbbell className="w-3.5 h-3.5 mx-auto text-sage mb-1" />
                  <div className="text-[11px] font-bold text-neutral-900 dark:text-white group-hover:text-sage transition-colors">
                    COACH
                  </div>
                  <div className="text-[9px] text-neutral-400 font-mono">Entraîneur</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('yassine.khemir@gmail.com', 'pass123')}
                  className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/90 dark:border-white/[0.08] hover:border-ochre text-center transition-all cursor-pointer group active:scale-95 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 mx-auto text-ochre mb-1" />
                  <div className="text-[11px] font-bold text-neutral-900 dark:text-white group-hover:text-ochre transition-colors">
                    MEMBER
                  </div>
                  <div className="text-[9px] text-neutral-400 font-mono">Adhérent</div>
                </button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </main>

      {/* Clean Full-Width Footer */}
      <footer className="anime-item w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 dark:text-neutral-500 font-light border-t border-neutral-200/60 dark:border-white/[0.06] shrink-0">
        <div className="font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
          HADID Byrsa Sanctuary • Club Privé d'Élite
        </div>
        <div className="text-[10px] font-mono">
          36.8528° N, 10.3233° E • Carthage Byrsa
        </div>
        <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
          © 2026 HADID GYM CLUB. TOUS DROITS RÉSERVÉS.
        </div>
      </footer>
    </div>
  );
};
