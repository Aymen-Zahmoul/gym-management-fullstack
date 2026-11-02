package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.dto.BookingRequest;
import tn.enicarthage.gym.model.Booking;
import tn.enicarthage.gym.service.BookingService;

import java.util.List;

public class BookingController {
    private final BookingService bookingService = new BookingService();

    public List<Booking> lister() {
        return bookingService.getAllBookings();
    }

    public List<Booking> listerParSeance(int sessionId) {
        return bookingService.getBookingsBySession(sessionId);
    }

    public Booking reserver(BookingRequest req) {
        return bookingService.createBooking(req);
    }

    public void annuler(int id) {
        bookingService.cancelBooking(id);
    }
}
