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
      className="min-h-screen flex flex-col relative overflow-hidden bg-[#FAF9F5] dark:bg-[#0B0C0E] transition-colors"
    >
      {/* Subtle architectural ambient radial glow centered */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-300 via-transparent to-transparent dark:from-[#24262c] dark:via-transparent dark:to-transparent" />

      {/* Top Header — Clean Navigation bar aligned with Main */}
      <header className="anime-item w-full max-w-xl mx-auto px-6 pt-6 sm:pt-8 flex items-center justify-between z-10 shrink-0">
        <div>
          {onBackToLanding ? (
            <button
              onClick={onBackToLanding}
              className="px-4 py-2 rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:text-neutral-900 dark:hover:text-white hover:border-bronze flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour Sanctuaire</span>
            </button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label="Changer de thème"
            className="p-2.5 rounded-2xl border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 cursor-pointer transition-all hover:border-bronze active:scale-95 shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-bronze" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
        </div>
      </header>

      {/* Main Centered Login Section — Perfectly Vertically & Horizontally Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 z-10 w-full">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">
          {/* Centered Logo Emblem */}
          <div
            className="anime-item mb-7 flex flex-col items-center justify-center text-center cursor-pointer select-none"
            onClick={onBackToLanding}
          >
            <HadidLogo size="xl" layout="emblem-only" className="mx-auto" />
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-bronze/40 bg-bronze-subtle text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-800 dark:text-neutral-200 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-bronze animate-ping" />
              Byrsa Sanctuary • Club Privé
            </div>
          </div>

          {/* Centered Luxury Card */}
          <div className="anime-item w-full">
            <SpotlightCard className="p-7 sm:p-10 shadow-2xl rounded-3xl border border-neutral-200/90 dark:border-white/[0.1] bg-white/95 dark:bg-[#121316]/95 backdrop-blur-xl">
              {/* Header info */}
              <div className="text-center space-y-2 mb-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100/80 dark:bg-white/[0.04] text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-700 dark:text-neutral-300 mx-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
                  <span>Portail Sécurisé Membres & Staff</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight pt-1">
                  Accès À Votre Espace
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
                  Identifiez-vous pour gérer vos réservations privées, vos abonnements et vos séances de coaching.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400">
                    Identifiant / Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      required
                      placeholder="votre.email@hadidfitness.tn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-neutral-50 dark:bg-[#1A1C20] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400">
                      Mot de Passe
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Protocole 256-bit
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
                      className="w-full pl-11 pr-11 py-3.5 sm:py-4 rounded-2xl bg-neutral-50 dark:bg-[#1A1C20] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/50 transition-all shadow-inner"
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
                    className="w-full justify-center py-4 text-xs tracking-widest uppercase font-bold rounded-2xl"
                  >
                    {loading ? (
                      <span>Vérification des accès...</span>
                    ) : (
                      <>
                        <span>Ouvrir Ma Session HADID</span>
                        <ArrowRight className="w-4 h-4 ml-2 text-bronze" />
                      </>
                    )}
                  </ShinyButton>
                </div>
              </form>

              {/* Fast 1-Click Passports for Quick Access */}
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span>Passports Démonstration Immédiate</span>
                  <span className="font-mono text-bronze">1 Clic</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Admin */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@carthagefitness.tn', 'admin123')}
                    className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/90 dark:border-white/[0.08] hover:border-bronze text-left transition-all cursor-pointer group active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-bronze">
                      <Crown className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Directeur</span>
                    </div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-bronze transition-colors">
                      ADMIN
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">Supervision Club</div>
                  </button>

                  {/* Coach */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('karim.coach@carthagefitness.tn', 'coach123')}
                    className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/90 dark:border-white/[0.08] hover:border-sage text-left transition-all cursor-pointer group active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-sage">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Entraîneur</span>
                    </div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-sage transition-colors">
                      COACH
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">Planning & Studios</div>
                  </button>

                  {/* Member */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('yassine.khemir@gmail.com', 'pass123')}
                    className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/90 dark:border-white/[0.08] hover:border-ochre text-left transition-all cursor-pointer group active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-ochre">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase">Membre</span>
                    </div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-ochre transition-colors">
                      MEMBER
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">Pass & Réservations</div>
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </main>

      {/* Clean Luxury Footer aligned with Main container */}
      <footer className="anime-item w-full max-w-xl mx-auto px-6 py-5 text-center text-xs text-neutral-400 dark:text-neutral-500 font-light flex flex-col sm:flex-row items-center justify-between gap-3 z-10 border-t border-neutral-200/60 dark:border-white/[0.06] shrink-0">
        <div className="font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
          HADID Byrsa • Club Privé
        </div>
        <div className="text-[10px] font-mono">
          36.8528° N, 10.3233° E
        </div>
        <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
          © 2026 HADID GYM CLUB
        </div>
      </footer>
    </div>
  );
};
