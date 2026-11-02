package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.model.Payment;
import tn.enicarthage.gym.service.PaymentService;

import java.util.List;

public class PaymentController {
    private final PaymentService paymentService = new PaymentService();

    public List<Payment> lister() {
        return paymentService.getAllPayments();
    }

    public Payment obtenir(int id) {
        return paymentService.getPaymentById(id);
    }

    public Payment valider(int id) {
        return paymentService.validatePayment(id);
    }

    public Payment creer(Payment p) {
        return paymentService.createPayment(p);
    }
}
