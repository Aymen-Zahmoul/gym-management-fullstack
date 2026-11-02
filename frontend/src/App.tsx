import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { LandingPageView } from './components/LandingPageView';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { MembersView } from './components/MembersView';
import { ScheduleView } from './components/ScheduleView';
import { PlansView } from './components/PlansView';
import { LedgerView } from './components/LedgerView';
import { MemberSpaceView } from './components/MemberSpaceView';
import { CoachesCatalogueView } from './components/CoachesCatalogueView';
import { GridBackground } from './components/ui/GridBackground';
import { QuickCheckInModal } from './components/ui/QuickCheckInModal';
import { api } from './services/api';
import { DashboardStats, Member, MembershipPlan, FitnessClass, ClassSession, Payment, Coach } from './types';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { HadidLogo } from './components/ui/HadidLogo';

export function App() {
  // Theme Management (Light / Dark mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('gym_theme');
    if (saved) return saved === 'dark';
    return true; // Modern dark mode default
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gym_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gym_theme', 'light');
    }
  }, [isDark]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const saved = localStorage.getItem('gym_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // View mode: 'landing' (public showcase), 'login' (auth form), or 'app' (protected back-office)
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>(() => {
    const saved = localStorage.getItem('gym_auth_user');
    return saved ? 'app' : 'landing';
  });

  const getDefaultTabForRole = (user: Member | null): string => {
    if (!user) return 'dashboard';
    switch (user.role) {
      case 'ADMIN':
        return 'dashboard';
      case 'COACH':
        return 'schedule';
      case 'MEMBER':
      default:
        return 'my-space';
    }
  };

  const [activeTab, setActiveTab] = useState<string>(() => getDefaultTabForRole(currentUser));
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // App Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);

  // Modals state
  const [selectedSessionForBooking, setSelectedSessionForBooking] = useState<ClassSession | null>(null);
  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsData, membersData, plansData, classesData, sessionsData, paymentsData, coachesData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getMembers().catch(() => []),
        api.getPlans().catch(() => []),
        api.getClasses().catch(() => []),
        api.getSessions().catch(() => []),
        api.getPayments().catch(() => []),
        api.getCoaches().catch(() => []),
      ]);

      setStats(statsData);
      setMembers(membersData);
      setPlans(plansData);
      setClasses(classesData);
      setSessions(sessionsData);
      setPayments(paymentsData);
      setCoaches(coachesData);
    } catch (err: any) {
      showToast("Impossible de joindre le serveur Java : " + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always load plans and sessions to power the public landing page & app
    api.getPlans().then((data) => {
      if (data && data.length > 0) setPlans(data);
    }).catch(() => {});

    api.getSessions().then((data) => {
      if (data && data.length > 0) setSessions(data);
    }).catch(() => {});

    if (currentUser) {
      loadAllData();
      const defaultTab = getDefaultTabForRole(currentUser);
      if (
        currentUser.role === 'MEMBER' &&
        (activeTab === 'dashboard' || activeTab === 'ledger' || activeTab === 'plans' || activeTab === 'members')
      ) {
        setActiveTab('my-space');
      } else if (
        currentUser.role === 'COACH' &&
        (activeTab === 'dashboard' || activeTab === 'ledger' || activeTab === 'plans')
      ) {
        setActiveTab('schedule');
      }
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: Member) => {
    setCurrentUser(user);
    localStorage.setItem('gym_auth_user', JSON.stringify(user));
    setActiveTab(getDefaultTabForRole(user));
    setViewMode('app');
    showToast(`Bienvenue, ${user.nomComplet} (${user.role}) !`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gym_auth_user');
    setViewMode('landing');
    setActiveTab('dashboard');
    showToast('Vous avez été déconnecté avec succès.', 'success');
  };

  const handleCreateMember = async (data: { nomComplet: string; email: string; telephone?: string; initialPlanId?: number }) => {
    try {
      await api.createMember(data);
      showToast(`Adhérent ${data.nomComplet} inscrit avec succès !`, 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      await api.deleteMember(id);
      showToast('Adhérent supprimé.', 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleBookSession = async (sessionId: number, memberId: number) => {
    try {
      await api.createBooking(sessionId, memberId);
      showToast('Réservation validée et confirmée !', 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const handleCreateSession = async (data: { classId: number; coachId: number; salle: string; dateHeureDebut: string; dateHeureFin: string }) => {
    try {
      await api.createSession(data);
      showToast('Nouvelle séance ajoutée au planning !', 'success');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <GridBackground className="min-h-screen bg-[#fbfbfa] dark:bg-[#0c0d10] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-2xl text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-800 dark:border-neutral-200'
                : 'bg-neutral-900 text-amber-400 dark:bg-white dark:text-amber-600 border-amber-500/30'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400 dark:text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* VIEW 1: Public Responsive Landing Page */}
      {viewMode === 'landing' && (
        <LandingPageView
          onOpenLogin={() => {
            if (currentUser) {
              setViewMode('app');
            } else {
              setViewMode('login');
            }
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          plans={plans}
          sessions={sessions}
        />
      )}

      {/* VIEW 2: Dedicated Authentication View */}
      {viewMode === 'login' && !currentUser && (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onBackToLanding={() => setViewMode('landing')}
        />
      )}

      {/* VIEW 3: Protected 3-Tier Back-Office Application */}
      {viewMode === 'app' && currentUser && (
        <>
          {/* Navigation Bar with Role-Based Tabs & Theme Toggle */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenLanding={() => setViewMode('landing')}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading && !stats && currentUser.role === 'ADMIN' ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Chargement des données depuis l'API Java...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {/* ADMIN View: Dashboard */}
                  {activeTab === 'dashboard' && currentUser.role === 'ADMIN' && (
                    <DashboardView
                      stats={stats}
                      sessions={sessions}
                      members={members}
                      plans={plans}
                      onNavigate={setActiveTab}
                      onOpenBookingModal={(s) => setSelectedSessionForBooking(s)}
                      onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
                    />
                  )}

                  {/* ADMIN & COACH View: Members Directory */}
                  {activeTab === 'members' && (currentUser.role === 'ADMIN' || currentUser.role === 'COACH') && (
                    <MembersView
                      members={members}
                      plans={plans}
                      onCreateMember={handleCreateMember}
                      onDeleteMember={handleDeleteMember}
                      currentUser={currentUser}
                      onRefreshData={loadAllData}
                    />
                  )}

                  {/* ALL ROLES View: Schedule & Sessions */}
                  {activeTab === 'schedule' && (
                    <ScheduleView
                      sessions={sessions}
                      members={members}
                      classes={classes}
                      selectedSessionForBooking={selectedSessionForBooking}
                      onCloseBookingModal={() => setSelectedSessionForBooking(null)}
                      onOpenBookingModal={(s) => setSelectedSessionForBooking(s)}
                      onBookSession={handleBookSession}
                      onCreateSession={handleCreateSession}
                      currentUser={currentUser}
                    />
                  )}

                  {/* ADMIN View: Back-Office Plan Administration */}
                  {activeTab === 'plans' && currentUser.role === 'ADMIN' && (
                    <PlansView plans={plans} members={members} />
                  )}

                  {/* ADMIN View: Financial Ledger & Cashier */}
                  {activeTab === 'ledger' && currentUser.role === 'ADMIN' && (
                    <LedgerView payments={payments} />
                  )}

                  {/* ALL ROLES View: Coaches Directory by City & Sport */}
                  {activeTab === 'coaches' && (
                    <CoachesCatalogueView
                      coaches={coaches}
                      currentUser={currentUser}
                      onNavigateToSchedule={() => setActiveTab('schedule')}
                    />
                  )}

                  {/* MEMBER Dedicated View: Digital Card & Subscription Space */}
                  {activeTab === 'my-space' && currentUser.role === 'MEMBER' && (
                    <MemberSpaceView
                      currentUser={currentUser}
                      plans={plans}
                      sessions={sessions}
                      onNavigateToSchedule={() => setActiveTab('schedule')}
                      onNavigateToCoaches={() => setActiveTab('coaches')}
                      onRefreshData={loadAllData}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </main>

          {/* Quick Check-In / Badge Pointage Modal for Staff */}
          {(currentUser.role === 'ADMIN' || currentUser.role === 'COACH') && (
            <QuickCheckInModal
              isOpen={isQuickCheckInOpen}
              onClose={() => setIsQuickCheckInOpen(false)}
              members={members}
            />
          )}

          {/* Footer */}
          <footer className="border-t border-neutral-200/90 dark:border-white/[0.08] bg-[#fbfbfa]/90 dark:bg-[#0c0d10]/90 backdrop-blur-md py-6 text-center text-xs text-neutral-500 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <HadidLogo size="sm" />
              <div className="font-heading font-bold text-[11px] uppercase tracking-wider text-neutral-400">
                HADID Byrsa Sanctuary • Club Privé d'Élite • 36.8528° N, 10.3233° E
              </div>
              <div className="text-neutral-400 font-mono text-[10px]">
                © 2026 HADID GYM CLUB. TOUS DROITS RÉSERVÉS.
              </div>
            </div>
          </footer>
        </>
      )}
    </GridBackground>
  );
}

export default App;
