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
  onOpenLanding,
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
          { id: 'schedule', label: 'Mes Séances & Studios', icon: Calendar },
          { id: 'coaches', label: 'Annuaire Coachs', icon: Compass },
          { id: 'members', label: 'Sportifs', icon: Users },
        ];
      case 'MEMBER':
      default:
        return [
          { id: 'my-space', label: 'Mon Pass & Forfait', icon: UserCheck },
          { id: 'schedule', label: 'Planning des Studios', icon: Calendar },
          { id: 'coaches', label: 'Catalogue des Coachs', icon: Compass },
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
      <div className="w-full px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Main Brand with Borderless Hadid Logo in the Corner */}
          <div className="flex-shrink-0">
            <HadidLogo size="lg" onClick={handleBrandClick} />
          </div>

          {/* Navigation Links with Clean Sliding Pill & Generous Spacing */}
          <nav className="hidden md:flex items-center space-x-1.5 p-1.5 bg-neutral-100 dark:bg-white/[0.04] rounded-2xl border border-neutral-200/90 dark:border-white/[0.08]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
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
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3.5">
            {/* Quick check-in only for Staff (ADMIN or COACH) */}
            {onOpenQuickCheckIn && (role === 'ADMIN' || role === 'COACH') && (
              <button
                onClick={onOpenQuickCheckIn}
                className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-bronze bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-bronze" />
                <span>Pointage NFC</span>
              </button>
            )}

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              aria-label="Changer de thème"
              title={isDark ? 'Mode Clair' : 'Mode Sombre'}
              className="p-2.5 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#111215] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer hover:border-bronze"
            >
              {isDark ? <Sun className="w-4 h-4 text-bronze" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            {/* User Profile & Logout */}
            {currentUser && (
              <div className="flex items-center gap-3 pl-3 border-l border-neutral-200 dark:border-white/10">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase leading-tight">
                    {currentUser.nomComplet}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider uppercase text-bronze font-semibold">
                    {currentUser.role}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-mono font-bold text-xs flex items-center justify-center">
                  {currentUser.nomComplet.substring(0, 2).toUpperCase()}
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Se Déconnecter"
                    className="p-2 rounded-xl text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex overflow-x-auto border-t border-neutral-200/90 dark:border-white/[0.08] px-4 py-3 gap-2 bg-[#fbfbfa] dark:bg-[#0c0d10]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
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
      </div>
    </header>
  );
};
