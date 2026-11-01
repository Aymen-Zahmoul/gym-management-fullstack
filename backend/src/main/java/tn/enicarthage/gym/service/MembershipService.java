package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.MembershipDAO;
import tn.enicarthage.gym.dao.MembershipPlanDAO;
import tn.enicarthage.gym.dao.PaymentDAO;
import tn.enicarthage.gym.dao.UserDAO;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.Membership;
import tn.enicarthage.gym.model.MembershipPlan;
import tn.enicarthage.gym.model.Payment;
import tn.enicarthage.gym.model.User;

import java.time.LocalDate;
import java.util.List;

public class MembershipService {
    private final MembershipDAO membershipDAO = new MembershipDAO();
    private final MembershipPlanDAO planDAO = new MembershipPlanDAO();
    private final UserDAO userDAO = new UserDAO();
    private final PaymentDAO paymentDAO = new PaymentDAO();

    public List<Membership> getAllMemberships() {
        return membershipDAO.findAll();
    }

    public Membership getMembershipById(int id) {
        Membership m = membershipDAO.findById(id);
        if (m == null) {
            throw new ResourceNotFoundException("Souscription introuvable : " + id);
        }
        return m;
    }

    public Membership subscribe(int userId, int planId, String modePaiement) {
        User user = userDAO.findById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("Adherent introuvable : " + userId);
        }
        MembershipPlan plan = planDAO.findById(planId);
        if (plan == null) {
            throw new ResourceNotFoundException("Forfait introuvable : " + planId);
        }
        if (!plan.isEstActif()) {
            throw new ValidationException("Ce forfait n'est plus actif.");
        }

        LocalDate debut = LocalDate.now();
        LocalDate fin = debut.plusMonths(plan.getDureeMois());

        Membership m = new Membership();
        m.setUserId(userId);
        m.setPlanId(planId);
        m.setDateDebut(debut);
        m.setDateFin(fin);
        m.setStatut("ACTIVE");

        Membership created = membershipDAO.create(m);

        // Enregistrement automatique du reglement comptable
        Payment p = new Payment();
        p.setUserId(userId);
        p.setMembershipId(created.getId());
        p.setMontant(plan.getPrix());
        p.setModePaiement(modePaiement != null ? modePaiement : "CARTE_BANCAIRE");
        p.setStatut("PAYE");
        p.setReference("SUB-" + created.getId() + "-" + System.currentTimeMillis() % 10000);
        paymentDAO.create(p);

        return created;
    }

    public void cancelMembership(int id) {
        getMembershipById(id);
        membershipDAO.updateStatus(id, "RESILIEE");
    }
}
