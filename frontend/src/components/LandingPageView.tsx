import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  Calendar,
  Award,
  Users,
  Check,
  ChevronDown,
  Activity,
  Heart,
  Scale,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User,
  QrCode,
  X,
  Sparkles,
  Sliders,
  Wind,
  Droplets,
  Layers,
} from 'lucide-react';
import type { MembershipPlan, ClassSession, Member } from '../types';
import { SpotlightCard } from './ui/SpotlightCard';
import { ShinyButton } from './ui/ShinyButton';
import { HadidLogo } from './ui/HadidLogo';
import { GridBackground } from './ui/GridBackground';

interface LandingPageViewProps {
  onOpenLogin: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  plans: MembershipPlan[];
  sessions: ClassSession[];
  currentUser?: Member | null;
  onLogout?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenLogin,
  isDark,
  onToggleTheme,
  plans,
  sessions,
  currentUser,
  onLogout,
}) => {
  // Interactive BMI Calculator State (Clinical Wellness Style)
  const [weight, setWeight] = useState<number>(76);
  const [height, setHeight] = useState<number>(180);

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  const getBmiAssessment = (val: number) => {
    if (val < 18.5) {
      return {
        category: 'Indice Faible • Prise de Masse',
        tag: 'Hypertrophie & Force',
        desc: 'Mouvements composés poly-articulaires avec surcharge progressive et suivi nutritionnel hyper-calorique.',
        planName: 'Pass Trimestriel Fitness Total',
      };
    } else if (val < 25) {
      return {
        category: 'Condition Optimale • Athlète',
        tag: 'Conditionnement & Puissance',
        desc: 'Capacité aérobie idéale. Alternance WOD / Cross Training haute intensité et travail de mobilité articulaire.',
        planName: 'Pass VIP Annuel Illimité',
      };
    } else if (val < 30) {
      return {
        category: 'Surcharge Métabolique • Recomposition',
        tag: 'Dépense Métabolique & HIIT',
        desc: 'Renforcement musculaire lourd couplé à des séances de Spinning RPM / Boxe pour préserver la masse maigre.',
        planName: 'Pass Trimestriel Fitness Total',
      };
    } else {
      return {
        category: 'Réathlétisation & Santé Cardio',
        tag: 'Accompagnement Sur-Mesure',
        desc: 'Reprise progressive sous supervision individuelle : réadaptation cardio, mobilité douce et nutrition adaptée.',
        planName: 'Pass Mensuel Cardio & Musculation',
      };
    }
  };

  const assessment = getBmiAssessment(bmi);

  // Facility Spaces Selector
  const [activeSpace, setActiveSpace] = useState<number>(0);
  const clubSpaces = [
    {
      id: 'strength',
      number: '01',
      title: 'Plateau Force & Haltérophilie',
      subtitle: 'Barres Olympiques Eleiko & Cages Rogue',
      desc: 'Plateformes de tirage en chêne massif insonorisées, barres d’haltérophilie certifiées IWF, disques calibrés et haltères taillés dans la masse jusqu’à 50 kg.',
      specs: [
        '4 Plateformes de tirage Eleiko compétition',
        'Cages à squat Rogue Monster Lite',
        'Machines à charge libre Hammer Strength',
        'Magnésie liquide et ceintures de force fournies',
      ],
      leadTrainer: 'Karim Ben Ali • Préparateur Fédéral',
    },
    {
      id: 'combat',
      number: '02',
      title: 'Le Dojo & Ring Officiel',
      subtitle: 'Boxe Anglaise & Muay Thai Authentique',
      desc: 'Ring de boxe aux dimensions de championnat, tatamis haute densité de 5 cm pour la lutte et 12 sacs Aqua Bag hydro-dynamiques absorbant les chocs articulaires.',
      specs: [
        'Ring de boxe surélevé 5x5 mètres',
        '12 Sacs hydro-dynamiques Aqua Bag',
        'Tatamis amortissants normes internationales',
        'Gants et protections Venum Pro à disposition',
      ],
      leadTrainer: 'Yassine Dridi • Champion Méditerranéen',
    },
    {
      id: 'recovery',
      number: '03',
      title: 'Sanctuaire Yoga & Récupération',
      subtitle: 'Sauna Sel de l’Himalaya & Bain Froid',
      desc: 'Studio insonorisé avec sol en bambou naturel pour les disciplines posturales (Vinyasa, Pilates). Espace thermal avec sauna en briques de sel gemme et cryo immersion.',
      specs: [
        'Studio insonorisé et tempéré à 24°C',
        'Sauna sec aux briques de sel de l’Himalaya',
        'Bain froid de récupération cryo immersion',
        'Tapis de yoga Manduka haute densité',
      ],
      leadTrainer: 'Nour Mehrez • Praticienne Certifiée Alliance',
    },
    {
      id: 'cardio',
      number: '04',
      title: 'Suite Cardio Haute Précision',
      subtitle: 'Vélos Connectés RPM & Tapis Skillmill',
      desc: 'Vélos indoor connectés mesurant la puissance réelle en watts, tapis incurvés sans moteur Technogym Skillmill et rameurs Concept2 ventilés synchronisés.',
      specs: [
        'Vélos connectés avec wattmètre de laboratoire',
        'Tapis Skillmill incurvés à résistance magnétique',
        'Rameurs et SkiErg Concept2 synchronisés',
        'Affichage des zones de fréquence cardiaque live',
      ],
      leadTrainer: 'Sami Karray • Master Trainer Cardio',
    },
  ];

  // Guest Pass / Private Tour Modal State
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [preferredSpace, setPreferredSpace] = useState('Plateau Force & Haltérophilie');
  const [tourBooked, setTourBooked] = useState(false);

  useEffect(() => {
    if (!isTourModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTourModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourModalOpen]);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: 'Quelles sont les conditions d’accès et d’horaires du club à Carthage ?',
      a: 'Le club est accessible 7 jours sur 7 de 06h00 à 23h00 en semaine, et de 07h00 à 21h00 le week-end. L’accès est sécurisé par badge RFID biométrique ou pass numérique sur smartphone.',
    },
    {
      q: 'Comment s’effectue la réservation des cours collectifs ?',
      a: 'Toutes les séances collectives sont gérées en direct par notre plateforme logicielle. Afin d’assurer un confort d’espace optimal, chaque cours dispose d’une capacité maximale stricte sans surpopulation.',
    },
    {
      q: 'Le bilan de condition physique et impédance est-il inclus ?',
      a: 'Oui. Chaque nouvel adhérent bénéficie à l’inscription d’une consultation avec l’un de nos préparateurs physiques comprenant une pesée médicale par impédancemétrie et une analyse posturale.',
    },
    {
      q: 'Existe-t-il un service de serviettes et casiers sécurisés ?',
      a: 'Absolument. Les vestiaires disposent de casiers à code individuel, de douches privatives en pierre naturelle, de sèche-cheveux haute puissance et d’un service de serviettes d’entraînement propre.',
    },
  ];

  return (
    <GridBackground className="min-h-screen bg-[#fbfbfa] dark:bg-[#0c0d10] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-[#c5a880]/30 selection:text-[#c5a880]">
      {/* 1. Header Navigation: Compact Height (80px), Borderless Corner Logo, No Link Collision */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 dark:border-white/[0.08] bg-[#fbfbfa]/90 dark:bg-[#0c0d10]/90 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Hadid Official Borderless Brand in the Corner */}
          <div className="flex-shrink-0">
            <HadidLogo size="md" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          </div>

          {/* Clean Navigation Links with Balanced Spacing (No Collisions) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-[11px] font-heading font-bold uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">
            <a href="#spaces" className="hover:text-[#c5a880] transition-colors">Studios</a>
            <a href="#assessment" className="hover:text-[#c5a880] transition-colors">Bilan Santé</a>
            <a href="#schedule" className="hover:text-[#c5a880] transition-colors">Planning</a>
            <a href="#memberships" className="hover:text-[#c5a880] transition-colors">Formules</a>
            <a href="#standards" className="hover:text-[#c5a880] transition-colors">Standards</a>
          </nav>

          {/* Actions: Theme Toggle + Member Portal Access / Logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={onToggleTheme}
              aria-label="Changer de thème"
              title={isDark ? 'Mode Clair' : 'Mode Sombre'}
              className="p-2 sm:p-2.5 rounded-full border border-neutral-300 dark:border-white/10 hover:border-[#c5a880] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#c5a880]" /> : <Moon className="w-4 h-4 text-neutral-900" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider hover:bg-[#c5a880] dark:hover:bg-[#c5a880] dark:hover:text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <User className="w-3.5 h-3.5 text-[#c5a880] dark:text-neutral-950" />
                  <span className="hidden sm:inline">{currentUser.nomComplet.split(' ')[0]} ({currentUser.role})</span>
                  <span className="sm:hidden">Espace</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Se Déconnecter"
                    className="p-2 sm:p-2.5 rounded-full border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer active:scale-95 flex items-center gap-1 text-[10px] font-bold uppercase"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Quitter</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 sm:px-5 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider hover:bg-[#c5a880] dark:hover:bg-[#c5a880] dark:hover:text-black transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-[#c5a880] dark:text-inherit" />
                <span>Espace Membre</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Architectural Monumental Typography, Viewport-Fit, No Overflow */}
      <section className="relative pt-10 pb-16 sm:pt-14 sm:pb-24 border-b border-neutral-200/80 dark:border-white/[0.08] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6 max-w-4xl">
            {/* Subtle Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-bronze bg-bronze-subtle text-[10px] font-heading font-extrabold uppercase tracking-[0.25em] text-neutral-900 dark:text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-ping" />
              Sanctuaire Athlétique • Colline de Byrsa
            </div>

            {/* Architectural Monumental Headline with HADID Branding */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black uppercase tracking-tight leading-[0.96] text-neutral-950 dark:text-white">
              HADID <span className="text-bronze font-light font-sans tracking-normal text-3xl sm:text-5xl lg:text-7xl">حديد</span> <br />
              <span className="text-neutral-400 dark:text-neutral-500">Pure Performance.</span>
            </h1>

            {/* Concise Subtext (18 words, compliant with anti-slop guidelines) */}
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl font-sans font-normal leading-relaxed">
              Sanctuaire athlétique de 1 200 m² à Byrsa. Ingénierie de la fonte, plateaux Eleiko insonorisés et encadrement biomécanique d'élite.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
            <ShinyButton
              variant="primary"
              onClick={() => setIsTourModalOpen(true)}
              className="text-xs px-8 py-3.5 justify-center"
            >
              <span>Demander une Visite & Essai</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </ShinyButton>

            <a href="#memberships">
              <ShinyButton
                variant="secondary"
                className="text-xs px-8 py-3.5 justify-center w-full sm:w-auto"
              >
                <span>Consulter les Tarifs</span>
              </ShinyButton>
            </a>
          </div>

          {/* Architectural Metric Strip (Hairline Separators, Anti-Collision Grid) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-neutral-200/80 dark:border-white/[0.08]">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-neutral-950 dark:text-white tracking-tight">
                1 200 M²
              </p>
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-[#c5a880]">
                Installations Byrsa
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-neutral-950 dark:text-white tracking-tight">
                06H — 23H
              </p>
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-[#758a7b] dark:text-[#a3b8a9]">
                Accès Libre 7J/7
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-neutral-950 dark:text-white tracking-tight">
                ELEIKO IWF
              </p>
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-[#c87a32]">
                Matériel Compétition
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-neutral-950 dark:text-white tracking-tight">
                RECOVERY
              </p>
              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-neutral-400">
                Sauna Sel & Cryo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Specialized Spaces / Studios */}
      <section id="spaces" className="py-16 sm:py-20 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              Quatre Studios Dédiés. Zéro Compromis.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans font-light leading-relaxed">
              Chaque discipline dispose de son propre volume insonorisé, calibré selon des exigences biomécaniques rigoureuses.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar border-b border-neutral-200/80 dark:border-white/[0.08]">
            {clubSpaces.map((space, idx) => (
              <button
                key={space.id}
                onClick={() => setActiveSpace(idx)}
                className={`pb-3.5 px-3 text-xs font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeSpace === idx
                    ? 'border-[#c5a880] text-neutral-950 dark:text-white'
                    : 'border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <span className="font-mono text-[10px] mr-2 text-[#c5a880]">{space.number}</span>
                <span>{space.title}</span>
              </button>
            ))}
          </div>

          {/* Active Space Featured Layout: Balanced Grid Without Collisions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-widest">
                    Zone {clubSpaces[activeSpace].number} • Byrsa
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                    {clubSpaces[activeSpace].title}
                  </h3>
                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#758a7b] dark:text-[#a3b8a9]">
                    {clubSpaces[activeSpace].subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
                  {clubSpaces[activeSpace].desc}
                </p>

                <div className="space-y-2.5 pt-3">
                  <p className="text-[10px] font-heading font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                    Spécifications & Équipements :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {clubSpaces[activeSpace].specs.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-[#c5a880] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4 border-t border-neutral-200/80 dark:border-white/[0.08]">
                <div className="w-10 h-10 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center font-heading font-black text-xs text-[#c5a880]">
                  HD
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-neutral-950 dark:text-white uppercase tracking-wider">
                    Coach Titulaire du Studio
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">{clubSpaces[activeSpace].leadTrainer}</p>
                </div>
              </div>
            </div>

            {/* Right Card: Experience summary & Booking */}
            <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white/80 dark:bg-[#121316]/90 backdrop-blur-md space-y-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#c5a880]">
                  Pass Découverte
                </span>
                <h4 className="text-lg sm:text-xl font-heading font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                  Tester ce studio en conditions réelles
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                  Bénéficiez d'une visite privée guidée par un coach et d'un entraînement d'essai gratuit.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-white/[0.05] space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-600 dark:text-neutral-400">Localisation Club</span>
                  <span className="font-heading font-bold text-neutral-900 dark:text-white uppercase">Byrsa, Niveau 1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-600 dark:text-neutral-400">Accès Inclus</span>
                  <span className="font-heading font-bold text-[#c5a880] uppercase">Formules Trimestriel & VIP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-600 dark:text-neutral-400">Jauge Maximum</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">16 athlètes / séance</span>
                </div>
              </div>

              <ShinyButton
                variant="primary"
                onClick={() => {
                  setPreferredSpace(clubSpaces[activeSpace].title);
                  setIsTourModalOpen(true);
                }}
                className="w-full text-xs justify-center py-3.5"
              >
                <span>Réserver un Essai dans ce Studio</span>
              </ShinyButton>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Clinical Metabolic & Performance Assessment (No Layout Collisions) */}
      <section id="assessment" className="py-16 sm:py-20 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-5xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              Évaluez Votre Indice & Objectif Sportif
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              Ajustez vos paramètres morphologiques pour obtenir instantanément une prescription d'entraînement adaptée.
            </p>
          </div>

          <div className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#111215]/80 backdrop-blur-md shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Sliders Controls */}
              <div className="lg:col-span-7 space-y-7 flex flex-col justify-between">
                {/* Weight Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-heading font-bold uppercase tracking-wider">
                    <span className="text-neutral-600 dark:text-neutral-400">Poids Corporel</span>
                    <span className="font-heading font-black text-xl text-[#c5a880]">{weight} KG</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="140"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#c5a880]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400 uppercase">
                    <span>45 kg</span>
                    <span>Poids Moyen 85 kg</span>
                    <span>140 kg</span>
                  </div>
                </div>

                {/* Height Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-heading font-bold uppercase tracking-wider">
                    <span className="text-neutral-600 dark:text-neutral-400">Stature / Taille</span>
                    <span className="font-heading font-black text-xl text-[#c5a880]">{height} CM</span>
                  </div>
                  <input
                    type="range"
                    min="145"
                    max="215"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#c5a880]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400 uppercase">
                    <span>145 cm</span>
                    <span>Stature Moyenne 180 cm</span>
                    <span>215 cm</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/[0.05] text-xs text-neutral-500 leading-relaxed font-light">
                  Formulation conforme aux standards biomédicaux de l'OMS. Bilan complété en club par une impédancemétrie médicale à 8 électrodes (InBody).
                </div>
              </div>

              {/* Assessment Card Output (No Text Collision) */}
              <div className="lg:col-span-5 p-7 rounded-3xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-white/[0.08] flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#c5a880]">
                    Indice Physiologique
                  </span>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-heading font-black tracking-tight text-neutral-950 dark:text-white">
                      {bmi.toFixed(1)}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase text-neutral-400">KG / M²</span>
                  </div>

                  <p className="text-xs font-heading font-bold uppercase tracking-wider text-[#758a7b] dark:text-[#a3b8a9]">
                    {assessment.category}
                  </p>

                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                      {assessment.desc}
                    </p>
                    <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-white/10 text-xs font-heading font-bold text-neutral-950 dark:text-white">
                      💡 Formule suggérée : <span className="text-[#c5a880]">{assessment.planName}</span>
                    </div>
                  </div>
                </div>

                <a href="#memberships">
                  <button className="w-full py-3.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-heading font-bold uppercase tracking-wider hover:bg-[#c5a880] dark:hover:bg-[#c5a880] dark:hover:text-black transition-colors cursor-pointer">
                    Consulter cette formule →
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Class Schedule Sneak-Peek */}
      <section id="schedule" className="py-16 sm:py-20 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Prochains Créneaux au Planning
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-light">
                Disponibilités en direct synchronisées avec le serveur Java pur.
              </p>
            </div>

            <button
              onClick={onOpenLogin}
              className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-950 dark:text-white hover:text-[#c5a880] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Accéder au planning complet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Schedule Cards: Minimum Height, Symmetrical Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessions.slice(0, 3).map((s) => {
              const booked = s.totalBookings ?? 0;
              const max = s.capaciteMax ?? 20;
              const remaining = max - booked;

              return (
                <div
                  key={s.id}
                  className="p-7 rounded-3xl border border-neutral-200/90 dark:border-white/[0.08] bg-white/80 dark:bg-[#111215]/80 backdrop-blur-md flex flex-col justify-between space-y-6 luxury-card shadow-sm min-h-[260px]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#c5a880] uppercase tracking-wider">
                        {s.salle || 'Studio Principal'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/[0.05] text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        {s.dateHeureDebut
                          ? new Date(s.dateHeureDebut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '18:00'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white line-clamp-1">
                        {s.classTitle || 'Séance Athlétique'}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Coach : <strong className="text-neutral-800 dark:text-neutral-200">{s.coachName || 'Staff HADID'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-white/[0.06]">
                    <div className="flex justify-between items-center text-[11px] font-heading font-bold uppercase tracking-wider">
                      <span className="text-neutral-500">Disponibilité</span>
                      <span className="text-neutral-950 dark:text-white font-mono">{remaining} places</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#c5a880] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (booked / max) * 100)}%` }}
                      />
                    </div>

                    <button
                      onClick={onOpenLogin}
                      className="w-full mt-2 py-2.5 rounded-full border border-neutral-300 dark:border-white/10 hover:border-[#c5a880] text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Réserver ma place →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Membership Tiers & Official Investment (Pricing, No Collision) */}
      <section id="memberships" className="py-16 sm:py-20 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              Investissez Dans Vos Standards.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-light">
              Des formules claires, sans frais cachés ni engagement forcé. Tarifs en Dinars Tunisiens (TND).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((p, idx) => {
              const isRecommended = idx === 1 || p.nom.toLowerCase().includes('trimestriel') || p.nom.toLowerCase().includes('vip');

              return (
                <div
                  key={p.id}
                  className={`p-8 sm:p-9 rounded-3xl border flex flex-col justify-between transition-all duration-300 luxury-card ${
                    isRecommended
                      ? 'border-[#c5a880] bg-white dark:bg-[#14151a] shadow-[0_0_35px_-8px_rgba(197,168,128,0.25)]'
                      : 'border-neutral-200/90 dark:border-white/[0.08] bg-white/70 dark:bg-[#101114]/80'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      {isRecommended && (
                        <span className="px-3 py-1 rounded-full bg-[#c5a880] text-neutral-950 text-[9px] font-heading font-black uppercase tracking-widest inline-block mb-1">
                          Formule Privilège Recommandée
                        </span>
                      )}
                      <h3 className="text-2xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                        {p.nom}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-neutral-950 dark:text-white">
                        {p.prix}
                      </span>
                      <span className="text-sm font-heading font-bold uppercase text-[#c5a880]">TND</span>
                      <span className="text-xs text-neutral-400 font-light ml-1">/ {p.dureeMois} mois</span>
                    </div>

                    <div className="space-y-3 pt-5 border-t border-neutral-100 dark:border-white/[0.08] text-xs">
                      <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                        <span>Accès illimité force & cardio 7j/7</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                        <span>Vestiaires individuels & casiers RFID</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                        <Check className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                        <span>Bilan corporel InBody à 8 électrodes</span>
                      </div>
                      {p.accesCoursIllimite && (
                        <div className="flex items-center gap-2.5 font-bold text-neutral-950 dark:text-white">
                          <Check className="w-4 h-4 text-[#758a7b] dark:text-[#a3b8a9] flex-shrink-0" />
                          <span>Tous cours collectifs illimités</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={onOpenLogin}
                      className={`w-full py-3.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                        isRecommended
                          ? 'bg-[#c5a880] text-neutral-950 hover:bg-[#b0936b]'
                          : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white'
                      }`}
                    >
                      Souscrire à cette formule
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. The Carthage Standards (Pure Air, Acoustic, Recovery) */}
      <section id="standards" className="py-16 sm:py-20 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              Une Attention Inégalée aux Détails.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-light">
              L'environnement physique conditionne directement la qualité de votre entraînement et de votre récupération.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#111215]/80 backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Renouvellement d’Air Continu
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Centrale de traitement d’air avec filtres HEPA H14. Renouvellement intégral du volume toutes les 8 minutes pour maintenir un taux d’oxygène optimal.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#111215]/80 backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#758a7b]/15 border border-[#758a7b]/30 flex items-center justify-center text-[#758a7b]">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Eau Purifiée & Serviettes
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Fontaines d’eau filtrée par osmose inverse en libre accès. Service de grandes serviettes d'entraînement et de douche en coton biologique.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-[#111215]/80 backdrop-blur-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#c87a32]/15 border border-[#c87a32]/30 flex items-center justify-center text-[#c87a32]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Insonorisation Phonique
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Planchers désolidarisés absorbant les vibrations du dropping des barres lourdes, assurant le calme absolu dans le sanctuaire de yoga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion (No Icon Collisions) */}
      <section className="py-16 sm:py-20 border-b border-neutral-200/80 dark:border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#111215]/80 backdrop-blur-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-neutral-950 dark:text-white cursor-pointer"
                >
                  <span className="flex-1 pr-2">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c5a880] flex-shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light border-t border-neutral-100 dark:border-white/[0.05] pt-3.5"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Minimal Luxury Footer */}
      <footer className="py-16 bg-white/90 dark:bg-[#08090b]/90 text-neutral-500 text-xs border-t border-neutral-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200/80 dark:border-white/[0.08]">
            <HadidLogo size="md" />

            <button
              onClick={() => setIsTourModalOpen(true)}
              className="px-7 py-3 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-heading font-bold uppercase tracking-widest hover:bg-[#c5a880] dark:hover:bg-[#c5a880] dark:hover:text-black transition-all cursor-pointer"
            >
              Réserver ma visite privée
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
            <div>
              © 2026 HADID BYRSA • SANCTUAIRE ATHLÉTIQUE PRIVÉ
            </div>
            <div>
              BYRSA : <span className="text-neutral-900 dark:text-white font-bold">36.8528° N, 10.3233° E</span>
            </div>
            <div>
              ÉQUIPEMENTS CERTIFIÉS IWF • OUVERT 7J/7
            </div>
          </div>
        </div>
      </footer>

      {/* 10. Guest Pass / Private Tour Modal (Responsive, Anti-Collision, A11y) */}
      <AnimatePresence>
        {isTourModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-tour-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsTourModalOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#121317] border border-neutral-200 dark:border-white/[0.1] p-7 sm:p-9 shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setIsTourModalOpen(false)}
                aria-label="Fermer la visite privée"
                className="absolute top-6 right-6 p-2 rounded-xl text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!tourBooked ? (
                <>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c5a880]">
                      Pass Découverte 24H • Byrsa
                    </span>
                    <h3 id="modal-tour-title" className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                      Visite Privée du Club
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                      Découvrez nos 4 studios et bénéficiez d'une séance d'orientation sportive offerte.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setTourBooked(true);
                    }}
                    className="space-y-4 pt-1"
                  >
                    <div>
                      <label className="block text-xs font-heading font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Nom & Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Selim Trabelsi"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-[#c5a880]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Téléphone Portable *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+216 98 000 000"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-[#c5a880]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-heading font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Studio d'Intérêt
                        </label>
                        <select
                          value={preferredSpace}
                          onChange={(e) => setPreferredSpace(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-[#c5a880]"
                        >
                          <option value="Plateau Force & Haltérophilie">Plateau Force & Haltérophilie</option>
                          <option value="Dojo & Ring de Boxe">Dojo & Ring de Boxe</option>
                          <option value="Yoga & Récupération">Yoga & Récupération</option>
                          <option value="Suite Cardio RPM">Suite Cardio RPM</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3">
                      <ShinyButton
                        type="submit"
                        variant="primary"
                        className="w-full py-3.5 text-xs justify-center"
                      >
                        <span>Générer Mon Pass Découverte</span>
                      </ShinyButton>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-6 py-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center mx-auto text-[#c5a880]">
                    <Check className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-heading font-black uppercase text-neutral-950 dark:text-white">
                      Pass Découverte Confirmé
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                      Bienvenue <strong>{guestName || 'Athlète'}</strong>. Votre accès exclusif pour <strong>{preferredSpace}</strong> est actif.
                    </p>
                  </div>

                  {/* Clean Digital Pass Mockup with HADID Logo */}
                  <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-left space-y-4 font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 uppercase">
                      <div className="flex items-center gap-2">
                        <HadidLogo size="sm" showSubtitle={false} />
                      </div>
                      <span className="text-[#c5a880] font-bold">PASS 24H ACTIF</span>
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-neutral-200 dark:border-white/[0.08]">
                      <QrCode className="w-12 h-12 text-neutral-950 dark:text-white flex-shrink-0" />
                      <div>
                        <p className="font-bold text-neutral-950 dark:text-white text-sm">RÉF : HADID-BYRSA-2026</p>
                        <p className="text-[10px] text-neutral-400">Présentez ce QR code aux bornes d'accueil</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsTourModalOpen(false)}
                    className="w-full py-3.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-heading font-bold text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Fermer la fenêtre
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </GridBackground>
  );
};
