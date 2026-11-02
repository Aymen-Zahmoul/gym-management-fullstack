package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.model.ClassSession;
import tn.enicarthage.gym.model.SchedulingRequest;
import tn.enicarthage.gym.service.SchedulingRequestService;

import java.util.List;

public class SchedulingRequestController {
    private final SchedulingRequestService service = new SchedulingRequestService();

    public List<SchedulingRequest> lister() {
        return service.getAllRequests();
    }

    public List<SchedulingRequest> listerParCoach(int coachId) {
        return service.getRequestsByCoach(coachId);
    }

    public SchedulingRequest obtenir(int id) {
        return service.getById(id);
    }

    public SchedulingRequest creer(SchedulingRequest req) {
        return service.createRequest(req);
    }

    public List<ClassSession> verifierConflits(int id) {
        return service.checkConflicts(id);
    }

    public SchedulingRequest approuver(int id) {
        return service.approveRequest(id);
    }

    public SchedulingRequest rejeter(int id, String motif) {
        return service.rejectRequest(id, motif);
    }
}
