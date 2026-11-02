package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.FitnessClassDAO;
import tn.enicarthage.gym.dao.SessionDAO;
import tn.enicarthage.gym.dao.UserDAO;
import tn.enicarthage.gym.dto.SessionRequest;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.ClassSession;
import tn.enicarthage.gym.model.FitnessClass;
import tn.enicarthage.gym.model.User;

import java.util.List;

public class SessionService {
    private final SessionDAO sessionDAO = new SessionDAO();
    private final FitnessClassDAO classDAO = new FitnessClassDAO();
    private final UserDAO userDAO = new UserDAO();

    public List<ClassSession> getAllSessions() {
        return sessionDAO.findAll();
    }

    public ClassSession getSessionById(int id) {
        ClassSession s = sessionDAO.findById(id);
        if (s == null) {
            throw new ResourceNotFoundException("Seance introuvable : " + id);
        }
        return s;
    }

    public ClassSession createSession(SessionRequest req) {
        FitnessClass fc = classDAO.findById(req.getClassId());
        if (fc == null) {
            throw new ResourceNotFoundException("Cours inexistant : " + req.getClassId());
        }
        User coach = userDAO.findById(req.getCoachId());
        if (coach == null) {
            throw new ResourceNotFoundException("Coach inexistant : " + req.getCoachId());
        }
        if (req.getDateHeureDebut() == null || req.getDateHeureFin() == null) {
            throw new ValidationException("Les dates de debut et de fin sont requises.");
        }
        if (!req.getDateHeureFin().isAfter(req.getDateHeureDebut())) {
            throw new ValidationException("L'heure de fin doit etre posterieure a l'heure de debut.");
        }

        String nomSalle = req.getSalle() != null ? req.getSalle().trim() : "Salle Principale";

        // Verification de disponibilite de la salle
        if (sessionDAO.isRoomOccupied(nomSalle, req.getDateHeureDebut(), req.getDateHeureFin(), 0)) {
            throw new ValidationException("Le studio '" + nomSalle + "' est deja reserve sur ce creneau horaire.");
        }

        // Verification de disponibilite du coach
        if (sessionDAO.isCoachOccupied(req.getCoachId(), req.getDateHeureDebut(), req.getDateHeureFin(), 0)) {
            throw new ValidationException("Le coach " + coach.getNomComplet() + " a deja une seance planifiee sur ce creneau.");
        }

        ClassSession s = new ClassSession();
        s.setClassId(req.getClassId());
        s.setCoachId(req.getCoachId());
        s.setSalle(nomSalle);
        s.setDateHeureDebut(req.getDateHeureDebut());
        s.setDateHeureFin(req.getDateHeureFin());
        s.setStatut("PROGRAMMEE");

        return sessionDAO.create(s);
    }

    public void deleteSession(int id) {
        getSessionById(id);
        sessionDAO.delete(id);
    }
}
