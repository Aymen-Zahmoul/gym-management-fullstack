package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.dto.CoachRegisterRequest;
import tn.enicarthage.gym.model.CoachCollaborationRequest;
import tn.enicarthage.gym.service.CoachCollaborationService;

import java.util.List;

public class CoachCollaborationController {
    private final CoachCollaborationService service = new CoachCollaborationService();

    public List<CoachCollaborationRequest> lister() {
        return service.getAllRequests();
    }

    public List<CoachCollaborationRequest> listerParCoach(int coachId) {
        return service.getRequestsByCoach(coachId);
    }

    public CoachCollaborationRequest obtenir(int id) {
        return service.getById(id);
    }

    public CoachCollaborationRequest inscrireCoach(CoachRegisterRequest req) {
        return service.registerAndRequest(
            req.getNomComplet(),
            req.getEmail(),
            req.getMotDePasse(),
            req.getTelephone(),
            req.getSpecialites(),
            req.getBio(),
            req.getAnneesExperience(),
            req.getGymId()
        );
    }

    public CoachCollaborationRequest approuver(int id) {
        return service.approveCollaboration(id);
    }

    public CoachCollaborationRequest rejeter(int id, String motif) {
        return service.rejectCollaboration(id, motif);
    }
}
