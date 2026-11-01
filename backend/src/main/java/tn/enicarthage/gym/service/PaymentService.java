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
}
