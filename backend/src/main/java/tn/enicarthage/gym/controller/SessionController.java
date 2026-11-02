package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.dto.SessionRequest;
import tn.enicarthage.gym.model.ClassSession;
import tn.enicarthage.gym.service.SessionService;

import java.util.List;

public class SessionController {
    private final SessionService sessionService = new SessionService();

    public List<ClassSession> lister() {
        return sessionService.getAllSessions();
    }

    public ClassSession obtenir(int id) {
        return sessionService.getSessionById(id);
    }

    public ClassSession creer(SessionRequest req) {
        return sessionService.createSession(req);
    }

    public void supprimer(int id) {
        sessionService.deleteSession(id);
    }
}
