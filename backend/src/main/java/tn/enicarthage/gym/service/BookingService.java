package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.BookingDAO;
import tn.enicarthage.gym.dao.FitnessClassDAO;
import tn.enicarthage.gym.dao.SessionDAO;
import tn.enicarthage.gym.dao.UserDAO;
import tn.enicarthage.gym.dto.BookingRequest;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.Booking;
import tn.enicarthage.gym.model.ClassSession;
import tn.enicarthage.gym.model.FitnessClass;
import tn.enicarthage.gym.model.User;

import java.time.LocalDateTime;
import java.util.List;

public class BookingService {
    private final BookingDAO bookingDAO = new BookingDAO();
    private final SessionDAO sessionDAO = new SessionDAO();
    private final FitnessClassDAO classDAO = new FitnessClassDAO();
    private final UserDAO userDAO = new UserDAO();

    public List<Booking> getAllBookings() {
        return bookingDAO.findAll();
    }

    public List<Booking> getBookingsBySession(int sessionId) {
        return bookingDAO.findBySessionId(sessionId);
    }

    public Booking createBooking(BookingRequest req) {
        ClassSession session = sessionDAO.findById(req.getSessionId());
        if (session == null) {
            throw new ResourceNotFoundException("Seance inexistante : " + req.getSessionId());
        }

        User member = userDAO.findById(req.getMemberId());
        if (member == null) {
            throw new ResourceNotFoundException("Adherent inexistant : " + req.getMemberId());
        }

        // Regle 1 : Verifier que l'adherent n'a pas deja reserve cette seance
        Booking existing = bookingDAO.findBySessionAndMember(req.getSessionId(), req.getMemberId());
        if (existing != null && !"ANNULEE".equals(existing.getStatut())) {
            throw new ValidationException("Vous etes deja inscrit a cette seance.");
        }

        // Regle 2 : Verifier la capacite maximale de la seance
        FitnessClass fc = classDAO.findById(session.getClassId());
        int currentCount = bookingDAO.countActiveBookingsForSession(req.getSessionId());
        if (fc != null && currentCount >= fc.getCapaciteMax()) {
            throw new ValidationException("La seance est complete (capacite maximale de " + fc.getCapaciteMax() + " places atteinte).");
        }

        Booking b = new Booking();
        b.setSessionId(req.getSessionId());
        b.setMemberId(req.getMemberId());
        b.setDateReservation(LocalDateTime.now());
        b.setStatut("CONFIRMEE");

        return bookingDAO.create(b);
    }

    public void cancelBooking(int id) {
        Booking b = bookingDAO.findById(id);
        if (b == null) {
            throw new ResourceNotFoundException("Reservation introuvable : " + id);
        }
        bookingDAO.delete(id);
    }
}
