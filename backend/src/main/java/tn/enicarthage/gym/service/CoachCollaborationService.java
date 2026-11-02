package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.CoachCollaborationRequestDAO;
import tn.enicarthage.gym.dao.UserDAO;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.CoachCollaborationRequest;
import tn.enicarthage.gym.model.User;

import java.util.List;

public class CoachCollaborationService {

    private final CoachCollaborationRequestDAO requestDAO = new CoachCollaborationRequestDAO();
    private final UserDAO userDAO = new UserDAO();

    public List<CoachCollaborationRequest> getAllRequests() {
        return requestDAO.findAll();
    }

    public List<CoachCollaborationRequest> getRequestsByCoach(int coachId) {
        return requestDAO.findByCoachId(coachId);
    }

    public CoachCollaborationRequest getById(int id) {
        CoachCollaborationRequest req = requestDAO.findById(id);
        if (req == null) {
            throw new ResourceNotFoundException("Demande de collaboration introuvable : " + id);
        }
        return req;
    }

    public CoachCollaborationRequest registerAndRequest(
            String nomComplet, String email, String motDePasse, String telephone,
            String specialites, String bio, int anneesExperience, int gymId) {

        if (nomComplet == null || nomComplet.trim().isEmpty()) {
            throw new ValidationException("Le nom complet du coach est obligatoire.");
        }
        if (email == null || !email.contains("@")) {
            throw new ValidationException("Adresse email invalide.");
        }
        if (userDAO.findByEmail(email.trim().toLowerCase()) != null) {
            throw new ValidationException("Un compte avec cette adresse email existe deja.");
        }

        // 1. Creer le compte Coach avec statut INACTIF (en attente d'approbation administrative)
        User u = new User();
        u.setGymId(gymId > 0 ? gymId : 1);
        u.setNomComplet(nomComplet.trim());
        u.setEmail(email.trim().toLowerCase());
        String rawPass = motDePasse != null && !motDePasse.isEmpty() ? motDePasse : "coach123";
        u.setMotDePasse(UserService.hashPassword(rawPass));
        u.setTelephone(telephone);
        u.setRole("COACH");
        u.setStatut("INACTIF"); // Bloque l'acces complet tant que non valide
        u.setSpecialite(specialites);
        u.setBio(bio);

        User savedUser = userDAO.create(u);

        // 2. Creer la demande formelle d'affiliation
        CoachCollaborationRequest req = new CoachCollaborationRequest();
        req.setCoachId(savedUser.getId());
        req.setGymId(gymId > 0 ? gymId : 1);
        req.setSpecialites(specialites != null ? specialites : "Coaching Sportif");
        req.setBio(bio);
        req.setAnneesExperience(anneesExperience > 0 ? anneesExperience : 1);
        req.setStatut("PENDING");

        return requestDAO.create(req);
    }

    public CoachCollaborationRequest submitCollaborationRequest(int coachId, int gymId, String specialites, String bio, int anneesExperience) {
        User coach = userDAO.findById(coachId);
        if (coach == null) {
            throw new ResourceNotFoundException("Coach introuvable avec l'identifiant : " + coachId);
        }

        CoachCollaborationRequest req = new CoachCollaborationRequest();
        req.setCoachId(coachId);
        req.setGymId(gymId > 0 ? gymId : 1);
        req.setSpecialites(specialites != null ? specialites : coach.getSpecialite());
        req.setBio(bio != null ? bio : coach.getBio());
        req.setAnneesExperience(anneesExperience > 0 ? anneesExperience : 1);
        req.setStatut("PENDING");

        return requestDAO.create(req);
    }

    public CoachCollaborationRequest approveCollaboration(int requestId) {
        CoachCollaborationRequest req = getById(requestId);
        if ("APPROVED".equalsIgnoreCase(req.getStatut())) {
            return req;
        }

        // Activer le compte du coach et l'associer a la salle
        User coach = userDAO.findById(req.getCoachId());
        if (coach != null) {
            coach.setStatut("ACTIF");
            coach.setGymId(req.getGymId());
            if (req.getSpecialites() != null && !req.getSpecialites().isEmpty()) {
                coach.setSpecialite(req.getSpecialites());
            }
            if (req.getBio() != null && !req.getBio().isEmpty()) {
                coach.setBio(req.getBio());
            }
            userDAO.update(coach);
        }

        requestDAO.updateStatus(requestId, "APPROVED", null);
        return getById(requestId);
    }

    public CoachCollaborationRequest rejectCollaboration(int requestId, String motifRejet) {
        getById(requestId);
        requestDAO.updateStatus(requestId, "REJECTED", motifRejet != null ? motifRejet : "Dossier non retenu par l'administration.");
        return getById(requestId);
    }
}
