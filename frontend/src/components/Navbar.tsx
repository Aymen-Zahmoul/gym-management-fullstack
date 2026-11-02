import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Award,
  Receipt,
  LayoutDashboard,
  UserCheck,
  Sun,
  Moon,
  LogOut,
  Compass,
} from 'lucide-react';
import { Member } from '../types';
import { HadidLogo } from './ui/HadidLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickCheckIn?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentUser?: Member | null;
  onLogout?: () => void;
  onOpenLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickCheckIn,
  isDark,
  onToggleTheme,
  currentUser,
  onLogout,
}) => {
  const role = currentUser?.role || 'MEMBER';

  // Role-Based Navigation Architecture (RBAC)
  const getTabsForRole = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Supervision', icon: LayoutDashboard },
          { id: 'members', label: 'Adhérents', icon: Users },
          { id: 'schedule', label: 'Planning', icon: Calendar },
          { id: 'coaches', label: 'Coachs & Villes', icon: Compass },
          { id: 'plans', label: 'Formules', icon: Award },
          { id: 'ledger', label: 'Caisse', icon: Receipt },
        ];
      case 'COACH':
        return [
          { id: 'schedule', label: 'Mes Séances', icon: Calendar },
          { id: 'coaches', label: 'Annuaire Coachs', icon: Compass },
          { id: 'members', label: 'Sportifs', icon: Users },
        ];
      case 'MEMBER':
      default:
        return [
          { id: 'my-space', label: 'Mon Pass & Forfait', icon: UserCheck },
          { id: 'schedule', label: 'Planning Studios', icon: Calendar },
          { id: 'coaches', label: 'Catalogue Coachs', icon: Compass },
        ];
    }
  };

  const tabs = getTabsForRole();

  const handleBrandClick = () => {
    if (role === 'ADMIN') {
      setActiveTab('dashboard');
    } else if (role === 'COACH') {
      setActiveTab('schedule');
    } else {
      setActiveTab('my-space');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fbfbfa]/95 dark:bg-[#0c0d10]/95 backdrop-blur-xl border-b border-neutral-200/90 dark:border-white/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          {/* 1. Left: Main Brand Logo with Generous Air & Breathing Room */}
          <div className="flex items-center flex-shrink-0 z-10 pl-1 sm:pl-2">
            <HadidLogo size="md" onClick={handleBrandClick} />
          </div>

          {/* 2. Center: Mathematically Centered Navigation Tabs (Absolute Dead Center) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center pointer-events-auto">
            <nav className="flex items-center space-x-1 p-1 bg-neutral-100 dark:bg-white/[0.04] rounded-2xl border border-neutral-200/90 dark:border-white/[0.08] shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white dark:text-neutral-950 font-bold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 bg-neutral-900 dark:bg-white rounded-xl shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 3. Right: Action Tools & Prominent Unmissable Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 z-10">
            {/* Quick check-in NFC (only for Staff on large screens) */}
            {onOpenQuickCheckIn && (role === 'ADMIN' || role === 'COACH') && (
              <button
                onClick={onOpenQuickCheckIn}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-bronze bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-bronze" />
                <span>Pointage</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              aria-label="Changer de thème"
              title={isDark ? 'Mode Clair' : 'Mode Sombre'}
              className="p-2 sm:p-2.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#111215] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer hover:border-bronze flex-shrink-0"
            >
              {isDark ? <Sun className="w-4 h-4 text-bronze" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            {/* User Profile Badge */}
            {currentUser && (
              <div className="flex items-center gap-2 sm:gap-2.5 pl-2 border-l border-neutral-200 dark:border-white/10 flex-shrink-0">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase leading-tight truncate max-w-[120px]">
                    {currentUser.nomComplet}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider uppercase text-bronze font-semibold">
                    {currentUser.role}
                  </span>
                </div>

                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {currentUser.nomComplet.substring(0, 2).toUpperCase()}
                </div>

                {/* Highly Visible, Prominent Logout Button */}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Se Déconnecter de la session"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-500/30 transition-all cursor-pointer text-xs font-bold uppercase tracking-wider shadow-sm flex-shrink-0 active:scale-95"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 group-hover:text-white" />
                    <span>Déconnexion</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Nav for Mobile and Tablet (< 1024px) */}
      <div className="lg:hidden flex items-center overflow-x-auto border-t border-neutral-200/90 dark:border-white/[0.08] px-4 py-2 gap-2 bg-[#fbfbfa] dark:bg-[#0c0d10]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Se Déconnecter"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap text-white bg-rose-600 hover:bg-rose-700 cursor-pointer ml-auto flex-shrink-0 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 text-white" />
            <span>Déconnexion</span>
          </button>
        )}
      </div>
    </header>
  );
};
