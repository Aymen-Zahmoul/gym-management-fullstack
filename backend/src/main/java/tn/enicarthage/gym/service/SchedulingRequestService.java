package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.FitnessClassDAO;
import tn.enicarthage.gym.dao.SchedulingRequestDAO;
import tn.enicarthage.gym.dao.SessionDAO;
import tn.enicarthage.gym.dao.UserDAO;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.ClassSession;
import tn.enicarthage.gym.model.FitnessClass;
import tn.enicarthage.gym.model.SchedulingRequest;
import tn.enicarthage.gym.model.User;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

public class SchedulingRequestService {

    private final SchedulingRequestDAO requestDAO = new SchedulingRequestDAO();
    private final SessionDAO sessionDAO = new SessionDAO();
    private final FitnessClassDAO classDAO = new FitnessClassDAO();
    private final UserDAO userDAO = new UserDAO();

    public List<SchedulingRequest> getAllRequests() {
        return requestDAO.findAll();
    }

    public List<SchedulingRequest> getRequestsByCoach(int coachId) {
        return requestDAO.findByCoachId(coachId);
    }

    public SchedulingRequest getById(int id) {
        SchedulingRequest req = requestDAO.findById(id);
        if (req == null) {
            throw new ResourceNotFoundException("Demande de creneau introuvable : " + id);
        }
        return req;
    }

    public SchedulingRequest createRequest(SchedulingRequest req) {
        if (req.getCoachId() <= 0) {
            throw new ValidationException("L'identifiant du coach est obligatoire.");
        }
        User coach = userDAO.findById(req.getCoachId());
        if (coach == null) {
            throw new ResourceNotFoundException("Coach introuvable : " + req.getCoachId());
        }
        if (req.getActivite() == null || req.getActivite().trim().isEmpty()) {
            throw new ValidationException("L'activite sportive demandee est obligatoire.");
        }
        if (req.getDateDebut() == null || req.getDateFin() == null) {
            throw new ValidationException("La periode demandee (date debut et fin) est obligatoire.");
        }
        if (req.getDateFin().isBefore(req.getDateDebut())) {
            throw new ValidationException("La date de fin ne peut pas etre anterieure a la date de debut.");
        }
        if (req.getHeureDebut() == null || req.getHeureFin() == null) {
            throw new ValidationException("Les horaires de debut et de fin sont obligatoires.");
        }
        if (req.getJoursSemaine() == null || req.getJoursSemaine().trim().isEmpty()) {
            throw new ValidationException("Au moins un jour de la semaine doit etre specifie.");
        }

        req.setStatut("PENDING");
        return requestDAO.create(req);
    }

    public List<ClassSession> checkConflicts(int requestId) {
        SchedulingRequest req = getById(requestId);
        return findConflictsForRequest(req);
    }

    public List<ClassSession> findConflictsForRequest(SchedulingRequest req) {
        List<ClassSession> conflicts = new ArrayList<>();
        Set<DayOfWeek> targetDays = parseDaysOfWeek(req.getJoursSemaine());
        LocalTime startTime = parseTime(req.getHeureDebut());
        LocalTime endTime = parseTime(req.getHeureFin());
        String targetRoom = req.getSalle() != null ? req.getSalle().trim() : "Salle Principale";

        List<ClassSession> allSessions = sessionDAO.findAll();

        LocalDate cur = req.getDateDebut();
        while (!cur.isAfter(req.getDateFin())) {
            if (targetDays.contains(cur.getDayOfWeek())) {
                LocalDateTime slotStart = cur.atTime(startTime);
                LocalDateTime slotEnd = cur.atTime(endTime);

                for (ClassSession s : allSessions) {
                    if ("ANNULEE".equalsIgnoreCase(s.getStatut())) continue;
                    if (s.getDateHeureDebut() == null || s.getDateHeureFin() == null) continue;

                    boolean sameRoom = targetRoom.equalsIgnoreCase(s.getSalle());
                    boolean sameCoach = req.getCoachId() == s.getCoachId();

                    if (sameRoom || sameCoach) {
                        boolean overlaps = s.getDateHeureDebut().isBefore(slotEnd) && s.getDateHeureFin().isAfter(slotStart);
                        if (overlaps && !conflicts.contains(s)) {
                            conflicts.add(s);
                        }
                    }
                }
            }
            cur = cur.plusDays(1);
        }
        return conflicts;
    }

    public SchedulingRequest approveRequest(int requestId) {
        SchedulingRequest req = getById(requestId);
        if ("APPROVED".equalsIgnoreCase(req.getStatut())) {
            return req;
        }

        // 1. Verifier et lier a une FitnessClass
        int classId;
        if (req.getClassId() != null && req.getClassId() > 0) {
            classId = req.getClassId();
        } else {
            FitnessClass existing = null;
            for (FitnessClass fc : classDAO.findAll()) {
                if (fc.getTitre().equalsIgnoreCase(req.getActivite())) {
                    existing = fc;
                    break;
                }
            }
            if (existing != null) {
                classId = existing.getId();
            } else {
                FitnessClass fc = new FitnessClass();
                fc.setGymId(req.getGymId() > 0 ? req.getGymId() : 1);
                fc.setTitre(req.getActivite().trim());
                fc.setDescription("Seances collectives animees par " + req.getCoachNomComplet());
                fc.setCapaciteMax(20);
                fc.setCategorie("FORCE");
                FitnessClass saved = classDAO.create(fc);
                classId = saved.getId();
            }
        }

        // 2. Generer les seances recurrentes effectives
        Set<DayOfWeek> targetDays = parseDaysOfWeek(req.getJoursSemaine());
        LocalTime startTime = parseTime(req.getHeureDebut());
        LocalTime endTime = parseTime(req.getHeureFin());
        String salle = req.getSalle() != null ? req.getSalle() : "Salle Principale";

        LocalDate cur = req.getDateDebut();
        while (!cur.isAfter(req.getDateFin())) {
            if (targetDays.contains(cur.getDayOfWeek())) {
                LocalDateTime startDt = cur.atTime(startTime);
                LocalDateTime endDt = cur.atTime(endTime);

                ClassSession s = new ClassSession();
                s.setClassId(classId);
                s.setCoachId(req.getCoachId());
                s.setSalle(salle);
                s.setDateHeureDebut(startDt);
                s.setDateHeureFin(endDt);
                s.setStatut("PROGRAMMEE");
                sessionDAO.create(s);
            }
            cur = cur.plusDays(1);
        }

        // 3. Valider la demande
        requestDAO.updateStatus(requestId, "APPROVED", null);
        return getById(requestId);
    }

    public SchedulingRequest rejectRequest(int requestId, String motifRejet) {
        getById(requestId);
        requestDAO.updateStatus(requestId, "REJECTED", motifRejet != null ? motifRejet : "Creneau non disponible ou en conflit d'occupation.");
        return getById(requestId);
    }

    private Set<DayOfWeek> parseDaysOfWeek(String jours) {
        Set<DayOfWeek> set = new HashSet<>();
        if (jours == null) return set;
        String[] parts = jours.split("[,;\\s]+");
        for (String p : parts) {
            String norm = p.trim().toUpperCase();
            switch (norm) {
                case "LUNDI", "LUN", "MON", "MONDAY" -> set.add(DayOfWeek.MONDAY);
                case "MARDI", "MAR", "TUE", "TUESDAY" -> set.add(DayOfWeek.TUESDAY);
                case "MERCREDI", "MER", "WED", "WEDNESDAY" -> set.add(DayOfWeek.WEDNESDAY);
                case "JEUDI", "JEU", "THU", "THURSDAY" -> set.add(DayOfWeek.THURSDAY);
                case "VENDREDI", "VEN", "FRI", "FRIDAY" -> set.add(DayOfWeek.FRIDAY);
                case "SAMEDI", "SAM", "SAT", "SATURDAY" -> set.add(DayOfWeek.SATURDAY);
                case "DIMANCHE", "DIM", "SUN", "SUNDAY" -> set.add(DayOfWeek.SUNDAY);
            }
        }
        return set;
    }

    private LocalTime parseTime(String timeStr) {
        if (timeStr == null || timeStr.trim().isEmpty()) {
            return LocalTime.of(18, 0);
        }
        timeStr = timeStr.trim();
        if (timeStr.length() == 5) {
            return LocalTime.parse(timeStr);
        }
        if (timeStr.length() == 8) {
            return LocalTime.parse(timeStr);
        }
        return LocalTime.parse(timeStr.substring(0, 5));
    }
}
