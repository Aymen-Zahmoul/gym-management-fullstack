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

import tn.enicarthage.gym.config.DatabaseConnection;

import java.math.BigDecimal;
import java.sql.*;
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

        // Transaction atomique : adhesion + paiement (rollback si l'un echoue)
        try (Connection conn = DatabaseConnection.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // 1. Creer l'adhesion
                String sqlMembership = "INSERT INTO membership (user_id, plan_id, date_debut, date_fin, statut) VALUES (?, ?, ?, ?, ?)";
                int membershipId;
                try (PreparedStatement stmt = conn.prepareStatement(sqlMembership, Statement.RETURN_GENERATED_KEYS)) {
                    stmt.setInt(1, userId);
                    stmt.setInt(2, planId);
                    stmt.setDate(3, Date.valueOf(debut));
                    stmt.setDate(4, Date.valueOf(fin));
                    stmt.setString(5, "ACTIVE");
                    stmt.executeUpdate();
                    try (ResultSet gk = stmt.getGeneratedKeys()) {
                        if (gk.next()) {
                            membershipId = gk.getInt(1);
                        } else {
                            throw new SQLException("Echec de creation de l'adhesion, aucune cle generee.");
                        }
                    }
                }

                // 2. Creer le paiement comptable
                String reference = "SUB-" + membershipId + "-" + System.currentTimeMillis() % 10000;
                String mode = modePaiement != null ? modePaiement : "CARTE_BANCAIRE";
                String sqlPayment = "INSERT INTO payment (user_id, membership_id, montant, mode_paiement, date_paiement, statut, reference) VALUES (?, ?, ?, ?, NOW(), ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sqlPayment)) {
                    stmt.setInt(1, userId);
                    stmt.setInt(2, membershipId);
                    stmt.setBigDecimal(3, plan.getPrix());
                    stmt.setString(4, mode);
                    stmt.setString(5, "PAYE");
                    stmt.setString(6, reference);
                    stmt.executeUpdate();
                }

                conn.commit();
                return membershipDAO.findById(membershipId);
            } catch (Exception e) {
                conn.rollback();
                throw new RuntimeException("Echec de la souscription (rollback effectue) : " + e.getMessage(), e);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur de connexion lors de la souscription : " + e.getMessage(), e);
        }
    }

    public void cancelMembership(int id) {
        getMembershipById(id);
        membershipDAO.updateStatus(id, "RESILIEE");
    }
}
