export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalCoaches: number;
  upcomingSessions: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface Member {
  id: number;
  gymId: number;
  nomComplet: string;
  email: string;
  telephone: string;
  role: string;
  statut: string;
  createdAt?: string;
  activePlanName?: string;
  paymentStatut?: 'PAYE' | 'EN_ATTENTE' | 'NON_PAYE' | 'AUCUN' | string;
  lastPaymentAmount?: number;
  specialite?: string;
  ville?: string;
  tarifHoraire?: number;
  bio?: string;
  disponibilite?: string;
}

export interface Coach {
  id: number;
  gymId: number;
  nomComplet: string;
  email: string;
  telephone?: string;
  role: string;
  statut: string;
  specialite?: string;
  ville?: string;
  tarifHoraire?: number;
  bio?: string;
  disponibilite?: string;
}

export interface MembershipPlan {
  id: number;
  gymId: number;
  nom: string;
  description: string;
  prix: number;
  dureeMois: number;
  accesCoursIllimite: boolean;
  estActif: boolean;
  createdAt?: string;
}

export interface FitnessClass {
  id: number;
  gymId: number;
  titre: string;
  description: string;
  capaciteMax: number;
  dureeMinutes: number;
  categorie: 'CARDIO' | 'FORCE' | 'ARTS_MARTIAUX' | 'BIEN_ETRE';
}

export interface ClassSession {
  id: number;
  classId: number;
  coachId: number;
  salle: string;
  dateHeureDebut: string;
  dateHeureFin: string;
  statut: string;
  classTitle?: string;
  coachName?: string;
  totalBookings?: number;
  capaciteMax?: number;
}

export interface Booking {
  id: number;
  sessionId: number;
  memberId: number;
  dateReservation?: string;
  statut: string;
  memberName?: string;
  memberEmail?: string;
  classTitle?: string;
  sessionStartTime?: string;
}

export interface Payment {
  id: number;
  userId: number;
  membershipId?: number;
  montant: number;
  modePaiement: string;
  datePaiement: string;
  statut: string;
  reference: string;
  userName?: string;
}
