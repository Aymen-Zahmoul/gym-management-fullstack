import { DashboardStats, Member, MembershipPlan, FitnessClass, ClassSession, Booking, Payment, Coach, CoachCollaborationRequest, SchedulingRequest } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8081/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errMsg = `Erreur HTTP ${res.status}`;
    try {
      const errData = await res.json();
      if (errData && errData.erreur) {
        errMsg = errData.erreur;
      }
    } catch {
      // Ignorer si pas du JSON
    }
    throw new Error(errMsg);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  // 0. Auth
  login: (email: string, motDePasse: string) =>
    fetchJSON<Member>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, motDePasse }),
    }),

  // 1. Dashboard
  getStats: () => fetchJSON<DashboardStats>(`${API_BASE}/dashboard`),

  // 2. Members & Coaches
  getMembers: () => fetchJSON<Member[]>(`${API_BASE}/members`),
  getCoaches: () => fetchJSON<Coach[]>(`${API_BASE}/coaches`),
  createMember: (data: { nomComplet: string; email: string; telephone?: string; initialPlanId?: number }) =>
    fetchJSON<Member>(`${API_BASE}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMember: (id: number) =>
    fetchJSON<void>(`${API_BASE}/members/${id}`, {
      method: 'DELETE',
    }),

  // 3. Plans
  getPlans: () => fetchJSON<MembershipPlan[]>(`${API_BASE}/plans`),
  createPlan: (data: Partial<MembershipPlan>) =>
    fetchJSON<MembershipPlan>(`${API_BASE}/plans`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 4. Classes & Sessions
  getClasses: () => fetchJSON<FitnessClass[]>(`${API_BASE}/classes`),
  getSessions: () => fetchJSON<ClassSession[]>(`${API_BASE}/sessions`),
  createSession: (data: { classId: number; coachId: number; salle: string; dateHeureDebut: string; dateHeureFin: string }) =>
    fetchJSON<ClassSession>(`${API_BASE}/sessions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 5. Bookings
  getBookings: () => fetchJSON<Booking[]>(`${API_BASE}/bookings`),
  createBooking: (sessionId: number, memberId: number) =>
    fetchJSON<Booking>(`${API_BASE}/bookings`, {
      method: 'POST',
      body: JSON.stringify({ sessionId, memberId }),
    }),
  cancelBooking: (id: number) =>
    fetchJSON<void>(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
    }),

  // 6. Payments
  getPayments: () => fetchJSON<Payment[]>(`${API_BASE}/payments`),
  validatePayment: (id: number) =>
    fetchJSON<Payment>(`${API_BASE}/payments/${id}`, {
      method: 'PUT',
    }),
  createPayment: (data: Partial<Payment>) =>
    fetchJSON<Payment>(`${API_BASE}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 7. Memberships Subscription (Official Online Payment & Renewal)
  subscribeMembership: (userId: number, planId: number, modePaiement?: string) =>
    fetchJSON<{ id: number; userId: number; planId: number; dateDebut: string; dateFin: string; statut: string }>(`${API_BASE}/memberships`, {
      method: 'POST',
      body: JSON.stringify({ userId, planId, modePaiement: modePaiement || 'CARTE_BANCAIRE' }),
    }),

  // 8. Coach Collaboration Requests
  getCoachCollaborations: () => fetchJSON<CoachCollaborationRequest[]>(`${API_BASE}/coach-collaborations`),
  registerCoach: (data: {
    nomComplet: string;
    email: string;
    motDePasse: string;
    telephone?: string;
    specialites: string;
    bio?: string;
    anneesExperience?: number;
    gymId?: number;
  }) =>
    fetchJSON<CoachCollaborationRequest>(`${API_BASE}/coach-collaborations`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  approveCoachCollaboration: (id: number) =>
    fetchJSON<CoachCollaborationRequest>(`${API_BASE}/coach-collaborations/${id}/approve`, {
      method: 'PUT',
    }),
  rejectCoachCollaboration: (id: number, motif?: string) =>
    fetchJSON<CoachCollaborationRequest>(`${API_BASE}/coach-collaborations/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ motif }),
    }),

  // 9. Coach Scheduling Requests & Approvals
  getSchedulingRequests: () => fetchJSON<SchedulingRequest[]>(`${API_BASE}/scheduling-requests`),
  createSchedulingRequest: (data: Partial<SchedulingRequest>) =>
    fetchJSON<SchedulingRequest>(`${API_BASE}/scheduling-requests`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSchedulingRequestConflicts: (id: number) =>
    fetchJSON<ClassSession[]>(`${API_BASE}/scheduling-requests/${id}/conflicts`),
  approveSchedulingRequest: (id: number) =>
    fetchJSON<SchedulingRequest>(`${API_BASE}/scheduling-requests/${id}/approve`, {
      method: 'PUT',
    }),
  rejectSchedulingRequest: (id: number, motif?: string) =>
    fetchJSON<SchedulingRequest>(`${API_BASE}/scheduling-requests/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ motif }),
    }),
};
