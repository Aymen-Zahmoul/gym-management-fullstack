import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Dumbbell,
  Users,
  UserCheck,
  CreditCard,
  Receipt,
  Handshake,
  Compass,
  LayoutDashboard,
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  X,
  Globe,
  Share2,
  Mail,
} from 'lucide-react';
import type { MembershipPlan, ClassSession, Member } from '../types';

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
  currentUser,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track scroll position for sticky navbar background transition and scrollspy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'features', 'for-gyms', 'for-coaches', 'for-members', 'how-it-works', 'why-hadid'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Features', id: 'features' },
    { label: 'For Gyms', id: 'for-gyms' },
    { label: 'For Coaches', id: 'for-coaches' },
    { label: 'For Members', id: 'for-members' },
    { label: 'About', id: 'about' },
  ];

  return (
    <div className="min-h-screen bg-[#101010] text-white font-inter selection:bg-[#B07845] selection:text-white antialiased overflow-x-hidden">
      {/* ============================================================ */}
      {/* 3. NAVBAR                                                    */}
      {/* ============================================================ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#101010]/95 backdrop-blur-md border-b border-[#191919] py-3.5 shadow-2xl'
            : 'bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: HADID Wordmark */}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <span className="font-space font-bold text-2xl tracking-[0.2em] text-white group-hover:text-[#B07845] transition-colors">
                HADID
              </span>
              <span className="text-[10px] font-space tracking-[0.3em] text-[#A8A9AD] uppercase pl-2 border-l border-[#262626] hidden sm:inline-block">
                Ecosystem
              </span>
            </button>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-xs font-space font-semibold uppercase tracking-[0.15em] transition-all relative py-1 cursor-pointer focus:outline-none ${
                      isActive ? 'text-[#B07845]' : 'text-[#A8A9AD] hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B07845]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenLogin}
                    className="text-xs font-space font-semibold uppercase tracking-[0.15em] text-[#A8A9AD] hover:text-white transition-colors cursor-pointer"
                  >
                    Espace {currentUser.role}
                  </button>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="px-3.5 py-2 text-xs font-space font-semibold uppercase tracking-wider text-[#A8A9AD] hover:text-white border border-[#262626] hover:border-[#A8A9AD] rounded-lg transition-all cursor-pointer"
                    >
                      Déconnexion
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={onOpenLogin}
                    className="text-xs font-space font-semibold uppercase tracking-[0.15em] text-[#A8A9AD] hover:text-white transition-colors px-3 py-2 cursor-pointer focus:outline-none"
                  >
                    Login
                  </button>
                  <button
                    onClick={onOpenLogin}
                    className="px-5 py-2.5 bg-[#B07845] hover:bg-[#966436] text-white text-xs font-space font-bold uppercase tracking-[0.15em] rounded-lg transition-all duration-200 shadow-lg shadow-[#B07845]/15 hover:shadow-[#B07845]/30 cursor-pointer active:scale-95"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile navigation"
                className="p-2 text-[#A8A9AD] hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden bg-[#101010] border-b border-[#191919] px-6 py-6 overflow-hidden"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left font-space text-sm font-semibold uppercase tracking-wider text-[#A8A9AD] hover:text-[#B07845] py-2 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-[#191919] flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full text-center py-2.5 font-space text-xs font-semibold uppercase tracking-wider text-white border border-[#262626] rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full text-center py-2.5 bg-[#B07845] hover:bg-[#966436] font-space text-xs font-bold uppercase tracking-wider text-white rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================ */}
      {/* 4. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background Photograph with Dramatic Lighting & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Modern Gym Interior"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.15]"
          />
          {/* Multi-layer Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/80 to-[#101010]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(176,120,69,0.08)_0%,_transparent_70%)]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191919]/90 border border-[#262626] mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B07845] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-space font-medium tracking-[0.25em] text-[#A8A9AD] uppercase">
              THE NEXT GENERATION OF GYM MANAGEMENT
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-space font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white uppercase max-w-4xl mb-6"
          >
            BUILT ON <span className="text-[#B07845]">STRENGTH</span>.<br />
            POWERED BY <span className="text-[#B07845]">CONNECTION</span>.
          </motion.h1>

          {/* Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-inter text-base sm:text-lg text-[#A8A9AD] max-w-2xl leading-relaxed mb-10 text-center"
          >
            Manage your gym, connect with professional coaches and give your members a better fitness
            experience. Everything comes together with HADID.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 bg-[#B07845] hover:bg-[#966436] text-white font-space font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-200 shadow-xl shadow-[#B07845]/20 hover:shadow-[#B07845]/40 cursor-pointer active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/[0.04] text-white font-space font-bold text-xs uppercase tracking-[0.2em] rounded-lg border border-[#A8A9AD] hover:border-white transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              Discover HADID
            </button>
          </motion.div>

          {/* Subtle Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 sm:mt-20 flex flex-col items-center gap-2 text-[#A8A9AD] hover:text-white cursor-pointer transition-colors"
            onClick={() => scrollToSection('about')}
          >
            <span className="text-[10px] font-space tracking-[0.25em] uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4 text-[#B07845] animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. INTRODUCTION SECTION — THE HADID ECOSYSTEM                */}
      {/* ============================================================ */}
      <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#101010]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
          >
            <h2 className="font-space font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tight uppercase text-white mb-5">
              ONE PLATFORM. THREE ESSENTIAL CONNECTIONS.
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#A8A9AD] leading-relaxed">
              HADID brings together the people who make the fitness industry work. From gym owners to
              professional coaches and members, everything starts with a stronger connection.
            </p>
          </motion.div>

          {/* 3 Distinct Ecosystem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Gym Owners */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#191919] border border-[#262626] hover:border-[#B07845]/70 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101010] border border-[#262626] flex items-center justify-center text-[#B07845] mb-6 group-hover:border-[#B07845]/50 transition-colors">
                  <Building2 className="w-6 h-6 text-[#B07845]" />
                </div>
                <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white mb-3">
                  GYM OWNERS
                </h3>
                <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed mb-6">
                  Take control of your gym operations, manage your members and memberships, oversee
                  payments and build professional coaching partnerships.
                </p>
              </div>
              <button
                onClick={() => scrollToSection('for-gyms')}
                className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase tracking-[0.15em] text-[#B07845] group-hover:text-white transition-colors cursor-pointer pt-2"
              >
                <span>Discover More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 2: Coaches */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#191919] border border-[#262626] hover:border-[#B07845]/70 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101010] border border-[#262626] flex items-center justify-center text-[#B07845] mb-6 group-hover:border-[#B07845]/50 transition-colors">
                  <Dumbbell className="w-6 h-6 text-[#B07845]" />
                </div>
                <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white mb-3">
                  COACHES
                </h3>
                <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed mb-6">
                  Discover gyms, establish professional collaborations and connect your expertise with the
                  right fitness environments.
                </p>
              </div>
              <button
                onClick={() => scrollToSection('for-coaches')}
                className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase tracking-[0.15em] text-[#B07845] group-hover:text-white transition-colors cursor-pointer pt-2"
              >
                <span>Discover More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 3: Members */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#191919] border border-[#262626] hover:border-[#B07845]/70 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group shadow-xl"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#101010] border border-[#262626] flex items-center justify-center text-[#B07845] mb-6 group-hover:border-[#B07845]/50 transition-colors">
                  <Users className="w-6 h-6 text-[#B07845]" />
                </div>
                <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white mb-3">
                  MEMBERS
                </h3>
                <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed mb-6">
                  Find your gym, explore available memberships and enjoy a simpler way to manage your
                  fitness experience.
                </p>
              </div>
              <button
                onClick={() => scrollToSection('for-members')}
                className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase tracking-[0.15em] text-[#B07845] group-hover:text-white transition-colors cursor-pointer pt-2"
              >
                <span>Discover More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FEATURES SECTION                                          */}
      {/* ============================================================ */}
      <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#191919] border-y border-[#262626]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
          >
            <h2 className="font-space font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tight uppercase text-white mb-5">
              EVERYTHING YOUR GYM NEEDS. NOTHING IT DOESN’T.
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#A8A9AD] leading-relaxed">
              A smarter approach to gym management, built around the needs of modern fitness businesses.
            </p>
          </motion.div>

          {/* Features Grid: 6 Modern SaaS Cards with subtle layout variations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="bg-[#101010] border border-[#262626] hover:border-[#B07845]/50 rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#B07845] mb-5">
                <UserCheck className="w-5 h-5 text-[#B07845]" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-2 uppercase tracking-wide">
                Client Management
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Keep member information organized and accessible.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#101010] border border-[#262626] hover:border-[#B07845]/50 rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#B07845] mb-5">
                <CreditCard className="w-5 h-5 text-[#B07845]" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-2 uppercase tracking-wide">
                Membership Management
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Create, organize and manage gym membership offers.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-[#101010] border border-[#262626] hover:border-[#B07845]/50 rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#B07845] mb-5">
                <Receipt className="w-5 h-5 text-[#B07845]" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-2 uppercase tracking-wide">
                Payment Management
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Keep track of membership payments and payment statuses.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#101010] border border-[#262626] hover:border-[#B07845]/50 rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#B07845] mb-5">
                <Handshake className="w-5 h-5 text-[#B07845]" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-2 uppercase tracking-wide">
                Coach Collaboration
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Connect gym owners and professional coaches through collaboration opportunities.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-[#101010] border border-[#262626] hover:border-[#B07845]/50 rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#B07845] mb-5">
                <Compass className="w-5 h-5 text-[#B07845]" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-2 uppercase tracking-wide">
                Gym Discovery
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Make it easier for coaches and members to discover participating gyms.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#101010] border border-[#262626] hover:border-[#B07845]/50 rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#B07845] mb-5">
                <LayoutDashboard className="w-5 h-5 text-[#B07845]" />
              </div>
              <h3 className="font-space font-bold text-lg text-white mb-2 uppercase tracking-wide">
                Centralized Management
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Bring essential gym operations together in one organized platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FOR GYM OWNERS SECTION (Split-screen)                     */}
      {/* ============================================================ */}
      <section id="for-gyms" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#101010]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-[11px] font-space font-bold tracking-[0.25em] text-[#B07845] uppercase mb-4">
                FOR GYM OWNERS
              </div>
              <h2 className="font-space font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-6 leading-[1.12]">
                YOUR GYM. YOUR BUSINESS. YOUR CONTROL.
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#A8A9AD] leading-relaxed mb-8">
                Running a gym requires more than managing equipment and memberships. HADID gives gym
                owners a centralized platform to organize their operations and build stronger professional
                relationships.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-10">
                {[
                  'Organize gym members.',
                  'Manage membership offers.',
                  'Monitor payments.',
                  'Connect with professional coaches.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#191919] border border-[#B07845]/50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#B07845]" />
                    </div>
                    <span className="font-inter text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenLogin}
                className="px-8 py-4 bg-[#B07845] hover:bg-[#966436] text-white font-space font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-200 shadow-xl shadow-[#B07845]/20 hover:shadow-[#B07845]/40 cursor-pointer active:scale-95"
              >
                Explore HADID for Gyms
              </button>
            </motion.div>

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#262626] bg-[#191919] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=85"
                  alt="Luxury Gym Facility Management"
                  className="w-full h-[400px] sm:h-[480px] object-cover filter brightness-[0.75] contrast-[1.1] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#101010]/90 backdrop-blur-md border border-[#262626]">
                  <div className="text-[10px] font-space uppercase tracking-[0.2em] text-[#B07845] mb-1">
                    Centralized Operations
                  </div>
                  <div className="font-space text-sm text-white font-bold">
                    Designed for Elite Gym Operations & Longevity
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FOR COACHES SECTION (Split Layout: Image Left, Text Right) */}
      {/* ============================================================ */}
      <section id="for-coaches" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#191919] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="relative group order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#262626] bg-[#101010] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=85"
                  alt="Professional Personal Trainer in Luxury Gym"
                  className="w-full h-[400px] sm:h-[480px] object-cover filter brightness-[0.75] contrast-[1.1] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#101010]/90 backdrop-blur-md border border-[#262626]">
                  <div className="text-[10px] font-space uppercase tracking-[0.2em] text-[#B07845] mb-1">
                    Professional Network
                  </div>
                  <div className="font-space text-sm text-white font-bold">
                    Verified Partnerships with Premium Venues
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Side (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <div className="text-[11px] font-space font-bold tracking-[0.25em] text-[#B07845] uppercase mb-4">
                FOR COACHES
              </div>
              <h2 className="font-space font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-6 leading-[1.12]">
                YOUR EXPERTISE DESERVES THE RIGHT ENVIRONMENT.
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#A8A9AD] leading-relaxed mb-8">
                Find the right gym, establish professional collaborations and take your coaching career
                further with HADID.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-10">
                {[
                  'Discover participating gyms.',
                  'Send collaboration requests.',
                  'Connect with gym owners.',
                  'Manage professional collaborations.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#101010] border border-[#B07845]/50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#B07845]" />
                    </div>
                    <span className="font-inter text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenLogin}
                className="px-8 py-4 bg-[#B07845] hover:bg-[#966436] text-white font-space font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-200 shadow-xl shadow-[#B07845]/20 hover:shadow-[#B07845]/40 cursor-pointer active:scale-95"
              >
                Join as a Coach
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FOR MEMBERS SECTION (Split Layout: Text Left, Image Right) */}
      {/* ============================================================ */}
      <section id="for-members" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#101010] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-[11px] font-space font-bold tracking-[0.25em] text-[#B07845] uppercase mb-4">
                FOR MEMBERS
              </div>
              <h2 className="font-space font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-6 leading-[1.12]">
                YOUR FITNESS JOURNEY STARTS HERE.
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#A8A9AD] leading-relaxed mb-8">
                Discover gyms, explore membership options and enjoy a more convenient fitness experience
                with HADID.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-10">
                {[
                  'Explore available gyms.',
                  'Discover membership offers.',
                  'Access membership information.',
                  'Enjoy a simpler membership experience.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#191919] border border-[#B07845]/50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#B07845]" />
                    </div>
                    <span className="font-inter text-sm text-white">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenLogin}
                className="px-8 py-4 bg-[#B07845] hover:bg-[#966436] text-white font-space font-bold text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-200 shadow-xl shadow-[#B07845]/20 hover:shadow-[#B07845]/40 cursor-pointer active:scale-95"
              >
                Discover HADID
              </button>
            </motion.div>

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[#262626] bg-[#191919] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85"
                  alt="Member Working Out in Premium Gym"
                  className="w-full h-[400px] sm:h-[480px] object-cover filter brightness-[0.75] contrast-[1.1] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#101010]/90 backdrop-blur-md border border-[#262626]">
                  <div className="text-[10px] font-space uppercase tracking-[0.2em] text-[#B07845] mb-1">
                    Frictionless Access
                  </div>
                  <div className="font-space text-sm text-white font-bold">
                    Seamless Digital Pass & Studio Schedules
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. HOW IT WORKS SECTION                                     */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#191919] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="font-space font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tight uppercase text-white mb-5">
              SIMPLE CONNECTIONS. SMARTER MANAGEMENT.
            </h2>
          </motion.div>

          {/* 3 Steps: Horizontal on Desktop with Connecting Line, Vertical Timeline on Mobile */}
          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-[#262626] z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {/* Step 01 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-start md:items-center text-left md:text-center"
              >
                <div className="font-space font-bold text-4xl sm:text-5xl text-[#B07845] mb-4 bg-[#191919] px-3">
                  01
                </div>
                <h3 className="font-space font-bold text-lg uppercase tracking-wider text-white mb-3">
                  Establish Your Gym
                </h3>
                <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed max-w-xs">
                  Gym owners create their presence on HADID and organize their gym information and
                  membership offers.
                </p>
              </motion.div>

              {/* Step 02 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-start md:items-center text-left md:text-center"
              >
                <div className="font-space font-bold text-4xl sm:text-5xl text-[#B07845] mb-4 bg-[#191919] px-3">
                  02
                </div>
                <h3 className="font-space font-bold text-lg uppercase tracking-wider text-white mb-3">
                  Connect with Coaches
                </h3>
                <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed max-w-xs">
                  Professional coaches discover gyms and establish collaborations with gym owners.
                </p>
              </motion.div>

              {/* Step 03 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-start md:items-center text-left md:text-center"
              >
                <div className="font-space font-bold text-4xl sm:text-5xl text-[#B07845] mb-4 bg-[#191919] px-3">
                  03
                </div>
                <h3 className="font-space font-bold text-lg uppercase tracking-wider text-white mb-3">
                  Welcome Members
                </h3>
                <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed max-w-xs">
                  Members join gyms and access available membership opportunities.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. WHY HADID SECTION                                        */}
      {/* ============================================================ */}
      <section id="why-hadid" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#101010] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
          >
            <h2 className="font-space font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tight uppercase text-white mb-5">
              MORE THAN MANAGEMENT. A CONNECTED FITNESS ECOSYSTEM.
            </h2>
          </motion.div>

          {/* 3 Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Prop 1: Centralization */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-2xl bg-[#191919] border border-[#262626] hover:border-[#B07845]/50 transition-all duration-300"
            >
              <div className="w-1.5 h-8 bg-[#B07845] mb-6 rounded-full" />
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white mb-3">
                Centralization
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Bring essential gym operations together through one organized platform.
              </p>
            </motion.div>

            {/* Prop 2: Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 rounded-2xl bg-[#191919] border border-[#262626] hover:border-[#B07845]/50 transition-all duration-300"
            >
              <div className="w-1.5 h-8 bg-[#B07845] mb-6 rounded-full" />
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white mb-3">
                Collaboration
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Build stronger professional connections between gym owners and coaches.
              </p>
            </motion.div>

            {/* Prop 3: Simplicity */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-2xl bg-[#191919] border border-[#262626] hover:border-[#B07845]/50 transition-all duration-300"
            >
              <div className="w-1.5 h-8 bg-[#B07845] mb-6 rounded-full" />
              <h3 className="font-space font-bold text-xl uppercase tracking-wider text-white mb-3">
                Simplicity
              </h3>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed">
                Create a smoother experience for gym owners, coaches and members.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. FINAL CALL TO ACTION                                     */}
      {/* ============================================================ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#101010] border-t border-[#262626]">
        {/* Background Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=85"
            alt="Cinematic Modern Gym Background"
            className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/85 to-[#101010]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(176,120,69,0.12)_0%,_transparent_65%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-space font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-6 leading-[1.1]"
          >
            READY TO BUILD SOMETHING STRONGER?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-inter text-base sm:text-lg text-[#A8A9AD] max-w-xl mb-10 leading-relaxed"
          >
            Bring your gym operations, coaches and members together with HADID.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            onClick={onOpenLogin}
            className="px-10 py-5 bg-[#B07845] hover:bg-[#966436] text-white font-space font-bold text-xs sm:text-sm uppercase tracking-[0.25em] rounded-lg transition-all duration-200 shadow-2xl shadow-[#B07845]/30 hover:shadow-[#B07845]/50 cursor-pointer active:scale-95"
          >
            JOIN THE HADID ECOSYSTEM
          </motion.button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. FOOTER                                                   */}
      {/* ============================================================ */}
      <footer className="bg-[#101010] border-t border-[#1F1F1F] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Brand */}
            <div>
              <div className="font-space font-bold text-2xl tracking-[0.2em] text-white mb-4">
                HADID
              </div>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed max-w-xs">
                Strengthening the connection between gyms, coaches and members.
              </p>
            </div>

            {/* Column 2: Platform */}
            <div>
              <div className="font-space font-bold text-xs uppercase tracking-[0.2em] text-white mb-4">
                Platform
              </div>
              <ul className="space-y-3 font-inter text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-[#A8A9AD] hover:text-[#B07845] transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('for-gyms')}
                    className="text-[#A8A9AD] hover:text-[#B07845] transition-colors cursor-pointer"
                  >
                    For Gyms
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('for-coaches')}
                    className="text-[#A8A9AD] hover:text-[#B07845] transition-colors cursor-pointer"
                  >
                    For Coaches
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('for-members')}
                    className="text-[#A8A9AD] hover:text-[#B07845] transition-colors cursor-pointer"
                  >
                    For Members
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Account */}
            <div>
              <div className="font-space font-bold text-xs uppercase tracking-[0.2em] text-white mb-4">
                Account
              </div>
              <ul className="space-y-3 font-inter text-sm">
                <li>
                  <button
                    onClick={onOpenLogin}
                    className="text-[#A8A9AD] hover:text-[#B07845] transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenLogin}
                    className="text-[#A8A9AD] hover:text-[#B07845] transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <div className="font-space font-bold text-xs uppercase tracking-[0.2em] text-white mb-4">
                Contact
              </div>
              <p className="font-inter text-sm text-[#A8A9AD] leading-relaxed mb-4">
                Avenue Habib Bourguiba, Carthage, Tunis<br />
                contact@hadid.fitness
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#hero"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#A8A9AD] hover:text-white hover:border-[#B07845] transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="#hero"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#A8A9AD] hover:text-white hover:border-[#B07845] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@hadid.fitness"
                  aria-label="Contact Email"
                  className="w-9 h-9 rounded-lg bg-[#191919] border border-[#262626] flex items-center justify-center text-[#A8A9AD] hover:text-white hover:border-[#B07845] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4 font-inter text-xs text-[#A8A9AD]">
            <div>© 2026 HADID. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-space tracking-wider uppercase">Built on Strength. Powered by Connection.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
