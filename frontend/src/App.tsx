import React, { useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { QuickCheckInModal } from './components/ui/QuickCheckInModal';
import { api } from './services/api';
import { DashboardStats, Member, MembershipPlan, FitnessClass, ClassSession, Payment, Coach, SchedulingRequest, CoachCollaborationRequest } from './types';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { HadidLogo } from './components/ui/HadidLogo';
import { getErrorMessage } from './utils/errorUtils';

// Core public views directly imported for instant zero-flash render
import { LandingPageView } from './components/LandingPageView';
import { LoginView } from './components/LoginView';
import { SignUpView } from './components/SignUpView';

// Back-office views code-split with React.lazy
const DashboardView = lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const MembersView = lazy(() => import('./components/MembersView').then(m => ({ default: m.MembersView })));
const ScheduleView = lazy(() => import('./components/ScheduleView').then(m => ({ default: m.ScheduleView })));
const PlansView = lazy(() => import('./components/PlansView').then(m => ({ default: m.PlansView })));
const LedgerView = lazy(() => import('./components/LedgerView').then(m => ({ default: m.LedgerView })));
const MemberSpaceView = lazy(() => import('./components/MemberSpaceView').then(m => ({ default: m.MemberSpaceView })));
const CoachesCatalogueView = lazy(() => import('./components/CoachesCatalogueView').then(m => ({ default: m.CoachesCatalogueView })));
const RequestsManagementView = lazy(() => import('./components/RequestsManagementView').then(m => ({ default: m.RequestsManagementView })));

const ViewLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 py-16 animate-pulse select-none">
    <div className="w-12 h-12 rounded-2xl bg-bronze/10 border border-bronze/30 flex items-center justify-center text-bronze font-black text-sm shadow-inner">
      HD
    </div>
    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
      <RefreshCw className="w-3.5 h-3.5 animate-spin text-bronze" />
      <span>Sanctuaire HADID • Chargement...</span>
    </div>
  </div>
);

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

  // View mode: ALWAYS starts on 'landing' when opening the site
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'signup' | 'app'>('landing');

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
  const [schedulingRequests, setSchedulingRequests] = useState<SchedulingRequest[]>([]);
  const [coachRequests, setCoachRequests] = useState<CoachCollaborationRequest[]>([]);

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
      const [statsData, membersData, plansData, classesData, sessionsData, paymentsData, coachesData, schedData, coachReqData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getMembers().catch(() => []),
        api.getPlans().catch(() => []),
        api.getClasses().catch(() => []),
        api.getSessions().catch(() => []),
        api.getPayments().catch(() => []),
        api.getCoaches().catch(() => []),
        api.getSchedulingRequests().catch(() => []),
        api.getCoachCollaborations().catch(() => []),
      ]);

      setStats(statsData);
      setMembers(membersData);
      setPlans(plansData);
      setClasses(classesData);
      setSessions(sessionsData);
      setPayments(paymentsData);
      setCoaches(coachesData);
      setSchedulingRequests(schedData);
      setCoachRequests(coachReqData);
    } catch (err: unknown) {
      showToast("Impossible de joindre le serveur Java : " + getErrorMessage(err), 'error');
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
      queueMicrotask(() => {
        loadAllData();
        setActiveTab((prev) => {
        if (
          currentUser.role === 'MEMBER' &&
          (prev === 'dashboard' || prev === 'ledger' || prev === 'plans' || prev === 'members')
        ) {
          return 'my-space';
        }
        if (
          currentUser.role === 'COACH' &&
          (prev === 'dashboard' || prev === 'ledger' || prev === 'plans')
        ) {
          return 'schedule';
        }
        return prev;
        });
      });
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
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      await api.deleteMember(id);
      showToast('Adhérent supprimé.', 'success');
      loadAllData();
    } catch (err: unknown) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleBookSession = async (sessionId: number, memberId: number) => {
    try {
      await api.createBooking(sessionId, memberId);
      showToast('Réservation validée et confirmée !', 'success');
      loadAllData();
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleCreateSession = async (data: { classId: number; coachId: number; salle: string; dateHeureDebut: string; dateHeureFin: string }) => {
    try {
      await api.createSession(data);
      showToast('Nouvelle séance ajoutée au planning !', 'success');
      loadAllData();
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleRequestSchedule = async (data: Partial<SchedulingRequest>) => {
    try {
      await api.createSchedulingRequest(data);
      showToast('Demande de créneau transmise à l\'administration !', 'success');
      loadAllData();
    } catch (err: unknown) {
      showToast(getErrorMessage(err), 'error');
      throw err;
    }
  };

  const handleApproveScheduling = async (id: number) => {
    try {
      await api.approveSchedulingRequest(id);
      showToast('Demande approuvée : séances ajoutées au calendrier !', 'success');
      loadAllData();
    } catch (err: unknown) {
      showToast(getErrorMessage(err), 'error');
      throw err;
    }
  };

  const handleRejectScheduling = async (id: number, motif?: string) => {
    try {
      await api.rejectSchedulingRequest(id, motif);
      showToast('Demande de créneau refusée.', 'success');
      loadAllData();
    } catch (err: unknown) {
      showToast(getErrorMessage(err), 'error');
      throw err;
    }
  };

  const handleApproveCoach = async (id: number) => {
    try {
      await api.approveCoachCollaboration(id);
      showToast('Collaboration acceptée : coach affilié au club HADID !', 'success');
      loadAllData();
    } catch (err: unknown) {
      showToast(getErrorMessage(err), 'error');
      throw err;
    }
  };

  const handleRejectCoach = async (id: number, motif?: string) => {
    try {
      await api.rejectCoachCollaboration(id, motif);
      showToast('Dossier de candidature coach décliné.', 'success');
      loadAllData();
    } catch (err: unknown) {
      showToast(getErrorMessage(err), 'error');
      throw err;
    }
  };

  const handleCheckConflicts = async (id: number) => {
    return await api.getSchedulingRequestConflicts(id);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#0c0d10] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-300">
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
            onOpenSignUp={() => {
              if (currentUser) {
                setViewMode('app');
              } else {
                setViewMode('signup');
              }
            }}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            plans={plans}
            sessions={sessions}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
      )}

      {/* VIEW 2: Dedicated Login View (Simple & Direct) */}
      {viewMode === 'login' && !currentUser && (
        <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignUp={() => setViewMode('signup')}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            onBackToLanding={() => setViewMode('landing')}
          />
      )}

      {/* VIEW 2b: Dedicated Sign Up View (Simple & Direct) */}
      {viewMode === 'signup' && !currentUser && (
        <SignUpView
            onLoginSuccess={handleLoginSuccess}
            onNavigateToLogin={() => setViewMode('login')}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            onBackToLanding={() => setViewMode('landing')}
            plans={plans}
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
            pendingRequestsCount={
              schedulingRequests.filter((r) => r.statut === 'PENDING').length +
              coachRequests.filter((r) => r.statut === 'PENDING').length
            }
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading && !stats && currentUser.role === 'ADMIN' ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Chargement des données depuis l'API Java...</p>
              </div>
            ) : (
              <Suspense fallback={<ViewLoadingFallback />}>
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
                        onRequestSchedule={handleRequestSchedule}
                        schedulingRequests={
                          currentUser.role === 'COACH'
                            ? schedulingRequests.filter((r) => r.coachId === currentUser.id)
                            : schedulingRequests
                        }
                        currentUser={currentUser}
                      />
                    )}

                    {/* ADMIN Dedicated View: Coach Collaborations & Scheduling Requests Approval */}
                    {activeTab === 'requests' && currentUser.role === 'ADMIN' && (
                      <RequestsManagementView
                        schedulingRequests={schedulingRequests}
                        coachRequests={coachRequests}
                        onApproveScheduling={handleApproveScheduling}
                        onRejectScheduling={handleRejectScheduling}
                        onApproveCoach={handleApproveCoach}
                        onRejectCoach={handleRejectCoach}
                        onCheckConflicts={handleCheckConflicts}
                        onRefreshData={loadAllData}
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
              </Suspense>
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
    </div>
  );
}

export default App;
