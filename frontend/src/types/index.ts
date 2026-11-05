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


export interface CoachCollaborationRequest {
  id: number;
  coachId: number;
  gymId: number;
  specialites: string;
  bio?: string;
  anneesExperience: number;
  statut: 'PENDING' | 'APPROVED' | 'REJECTED';
  motifRejet?: string;
  createdAt?: string;
  updatedAt?: string;
  coachNomComplet?: string;
  coachEmail?: string;
  coachTelephone?: string;
  coachVille?: string;
  gymNom?: string;
}

export interface SchedulingRequest {
  id: number;
  coachId: number;
  gymId: number;
  activite: string;
  classId?: number;
  joursSemaine: string;
  heureDebut: string;
  heureFin: string;
  dateDebut: string;
  dateFin: string;
  salle?: string;
  remarques?: string;
  statut: 'PENDING' | 'APPROVED' | 'REJECTED';
  motifRejet?: string;
  createdAt?: string;
  updatedAt?: string;
  coachNomComplet?: string;
  coachEmail?: string;
  coachTelephone?: string;
  gymNom?: string;
}
