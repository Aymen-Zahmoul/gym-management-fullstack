package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.PaymentDAO;
import tn.enicarthage.gym.model.Payment;

import java.util.List;

public class PaymentService {
    private final PaymentDAO paymentDAO = new PaymentDAO();

    public List<Payment> getAllPayments() {
        return paymentDAO.findAll();
    }

    public Payment getPaymentById(int id) {
        return paymentDAO.findById(id);
    }

    public Payment validatePayment(int id) {
        Payment p = getPaymentById(id);
        if (p == null) {
            throw new tn.enicarthage.gym.exception.ResourceNotFoundException("Paiement introuvable : " + id);
        }
        paymentDAO.updateStatus(id, "PAYE");
        return paymentDAO.findById(id);
    }

    public Payment createPayment(Payment p) {
        return paymentDAO.create(p);
    }
}
