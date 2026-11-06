import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
  LogIn,
  Eye,
  EyeOff,
  Send,
  Sparkles,
} from 'lucide-react';
import { Member, MembershipPlan } from '../types';
import { api } from '../services/api';
import { SpotlightCard } from './ui/SpotlightCard';
import { HadidLogo } from './ui/HadidLogo';
import { AthleteVideoGridBackground } from './ui/AthleteVideoGridBackground';
import { getErrorMessage } from '../utils/errorUtils';

interface SignUpViewProps {
  onLoginSuccess: (user: Member) => void;
  onNavigateToLogin: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onBackToLanding?: () => void;
  plans?: MembershipPlan[];
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onLoginSuccess,
  onNavigateToLogin,
  isDark,
  onToggleTheme,
  onBackToLanding,
}) => {
  const [accountType, setAccountType] = useState<'member' | 'coach'>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Member Registration State
  const [memberForm, setMemberForm] = useState({
    nomComplet: '',
    email: '',
    telephone: '+216 ',
    motDePasse: '',
  });

  // Coach Registration State
  const [coachForm, setCoachForm] = useState({
    nomComplet: '',
    email: '',
    telephone: '+216 ',
    motDePasse: '',
    specialites: 'Musculation & Préparation Physique',
    anneesExperience: 3,
    bio: '',
    gymId: 1,
  });
  const [coachSubmitted, setCoachSubmitted] = useState(false);

  // Submit Member Sign Up
  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!memberForm.nomComplet.trim() || !memberForm.email.trim() || !memberForm.motDePasse) {
      setError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);
      const created = await api.createMember({
        nomComplet: memberForm.nomComplet.trim(),
        email: memberForm.email.trim(),
        telephone: memberForm.telephone.trim(),
        motDePasse: memberForm.motDePasse,
        role: 'MEMBER',
        statut: 'ACTIF',
      });

      // Immediate auto-login for a seamless VIP onboarding
      try {
        const loggedUser = await api.login(memberForm.email.trim(), memberForm.motDePasse);
        onLoginSuccess(loggedUser);
      } catch {
        onLoginSuccess(created);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Échec de l'inscription. L'email est peut-être déjà utilisé."));
    } finally {
      setLoading(false);
    }
  };

  // Submit Coach Candidacy
  const handleCoachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!coachForm.nomComplet.trim() || !coachForm.email.trim() || !coachForm.motDePasse) {
      setError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);
      await api.registerCoach({
        nomComplet: coachForm.nomComplet.trim(),
        email: coachForm.email.trim(),
        telephone: coachForm.telephone.trim(),
        motDePasse: coachForm.motDePasse,
        specialites: coachForm.specialites,
        anneesExperience: Number(coachForm.anneesExperience),
        bio: coachForm.bio,
        gymId: coachForm.gymId,
      });
      setCoachSubmitted(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erreur lors de la soumission de candidature.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-y-auto lg:overflow-hidden flex flex-col justify-between relative bg-transparent text-neutral-900 dark:text-neutral-100 transition-colors select-none font-sans">
      <AthleteVideoGridBackground />
      {/* Centered subtle ambient bronze illumination */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#B07845]/25 via-transparent to-transparent" />

      {/* 1. Header: Brand Wordmark + Back to Landing + Theme Toggle */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between z-10 shrink-0">
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
            className="p-2 sm:p-2 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/80 dark:bg-[#141518]/80 backdrop-blur-md text-neutral-700 dark:text-neutral-300 cursor-pointer transition-all hover:border-[#B07845] active:scale-95 shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#B07845]" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>
        </div>
      </header>

      {/* 2. Main Registration Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-1 sm:py-2 z-10 w-full min-h-0">
        <div className="w-full max-w-lg mx-auto">
          <SpotlightCard className="p-5 sm:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] rounded-3xl border border-white/40 dark:border-white/15 bg-white/65 dark:bg-[#121316]/65 backdrop-blur-md">
            {/* Header Badge & Title */}
            <div className="text-center space-y-1 mb-3">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#B07845]/30 bg-[#B07845]/10 text-[9px] font-space font-bold tracking-[0.2em] uppercase text-[#B07845]">
                <Sparkles className="w-3 h-3 text-[#B07845]" />
                <span>Rejoindre l'Écosystème</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-space font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                Créer un Compte
              </h1>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light max-w-sm mx-auto">
                {accountType === 'member'
                  ? 'Activez votre pass adhérent et accédez à tous les studios HADID.'
                  : 'Candidatez pour rejoindre le corps des entraîneurs professionnels HADID.'}
              </p>
            </div>

            {/* Direct 2-Option Account Selector */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm border border-neutral-200/90 dark:border-white/[0.08] mb-3">
              <button
                type="button"
                onClick={() => {
                  setAccountType('member');
                  setError(null);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'member'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#B07845]" />
                <span>Adhérent</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountType('coach');
                  setError(null);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-space font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'coach'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5 text-[#B07845]" />
                <span>Coach</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* OPTION A: Formulaire Adhérent */}
            {accountType === 'member' && (
              <form onSubmit={handleMemberSubmit} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                    Nom & Prénom <span className="text-[#B07845]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Yassine Khemir"
                      value={memberForm.nomComplet}
                      onChange={(e) => setMemberForm({ ...memberForm, nomComplet: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B07845] focus:ring-1 focus:ring-[#B07845]/50 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                      Email <span className="text-[#B07845]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        required
                        placeholder="nom@exemple.tn"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B07845] focus:ring-1 focus:ring-[#B07845]/50 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+216 98 000 000"
                        value={memberForm.telephone}
                        onChange={(e) => setMemberForm({ ...memberForm, telephone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B07845] focus:ring-1 focus:ring-[#B07845]/50 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                    Mot de Passe <span className="text-[#B07845]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 caractères"
                      value={memberForm.motDePasse}
                      onChange={(e) => setMemberForm({ ...memberForm, motDePasse: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-[#B07845] focus:ring-1 focus:ring-[#B07845]/50 transition-all shadow-inner"
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

                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#B07845] hover:bg-[#966436] text-white font-space font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-[#B07845]/20 hover:shadow-[#B07845]/35 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Création du compte...</span>
                    ) : (
                      <>
                        <span>Finaliser mon Inscription</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* OPTION B: Candidature Coach */}
            {accountType === 'coach' && (
              <>
                {coachSubmitted ? (
                  <div className="py-6 text-center space-y-2.5">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                    <h3 className="font-space font-black text-lg text-neutral-950 dark:text-white uppercase tracking-tight">
                      Candidature Transmise !
                    </h3>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-sm mx-auto">
                      Votre dossier d'affiliation coach a bien été envoyé au directeur du club HADID. Votre compte sera activé dès validation officielle par notre équipe technique.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onNavigateToLogin}
                        className="px-5 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-space font-bold uppercase tracking-wider text-xs shadow-md cursor-pointer hover:opacity-90"
                      >
                        Aller à la Connexion
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCoachSubmit} className="space-y-2.5 text-xs max-h-[52vh] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                        Nom & Prénom <span className="text-[#B07845]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Hassen Trabelsi"
                        value={coachForm.nomComplet}
                        onChange={(e) => setCoachForm({ ...coachForm, nomComplet: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#B07845]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                          Email Pro <span className="text-[#B07845]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="coach@exemple.tn"
                          value={coachForm.email}
                          onChange={(e) => setCoachForm({ ...coachForm, email: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#B07845]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          required
                          value={coachForm.telephone}
                          onChange={(e) => setCoachForm({ ...coachForm, telephone: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:border-[#B07845]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                          Mot de Passe <span className="text-[#B07845]">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={coachForm.motDePasse}
                          onChange={(e) => setCoachForm({ ...coachForm, motDePasse: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:border-[#B07845]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                          Expérience (années)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={coachForm.anneesExperience}
                          onChange={(e) => setCoachForm({ ...coachForm, anneesExperience: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:border-[#B07845]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                        Spécialités Sportives
                      </label>
                      <input
                        type="text"
                        value={coachForm.specialites}
                        onChange={(e) => setCoachForm({ ...coachForm, specialites: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:border-[#B07845]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600 dark:text-neutral-400 mb-0.5">
                        Bio & Références
                      </label>
                      <input
                        type="text"
                        placeholder="Certifications internationales, palmarès..."
                        value={coachForm.bio}
                        onChange={(e) => setCoachForm({ ...coachForm, bio: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white/75 dark:bg-[#1A1C20]/75 backdrop-blur-sm border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:outline-none focus:border-[#B07845]"
                      />
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-[#B07845] hover:bg-[#966436] text-white font-space font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-[#B07845]/20 hover:shadow-[#B07845]/35 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-white" />
                        <span>{loading ? 'Transmission...' : 'Déposer ma Candidature'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* 3. Direct Toggle Button: Switch to Login (Simple et Direct) */}
            <div className="pt-3 mt-3 border-t border-neutral-200/80 dark:border-white/10 text-center">
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-1.5 font-light">
                Vous possédez déjà un compte ?
              </p>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="w-full py-2 px-3 rounded-xl border border-neutral-300 dark:border-white/15 hover:border-[#B07845] bg-neutral-100/70 dark:bg-white/[0.03] hover:bg-[#B07845]/10 text-neutral-800 dark:text-neutral-200 hover:text-[#B07845] text-xs font-space font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-[0.99]"
              >
                <LogIn className="w-3.5 h-3.5 text-[#B07845] group-hover:scale-110 transition-transform" />
                <span>Se connecter à mon compte</span>
              </button>
            </div>
          </SpotlightCard>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 font-light border-t border-neutral-200/60 dark:border-white/[0.06] shrink-0">
        <div className="font-medium tracking-wide text-neutral-300 dark:text-neutral-400 font-space">
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
