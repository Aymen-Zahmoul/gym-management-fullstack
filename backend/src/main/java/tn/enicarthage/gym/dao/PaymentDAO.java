package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.Payment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PaymentDAO {

    public List<Payment> findAll() {
        List<Payment> list = new ArrayList<>();
        String sql = "SELECT p.*, u.nom_complet AS user_name "
                   + "FROM payment p "
                   + "JOIN user u ON p.user_id = u.id "
                   + "ORDER BY p.date_paiement DESC";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Payment findById(int id) {
        String sql = "SELECT p.*, u.nom_complet AS user_name "
                   + "FROM payment p "
                   + "JOIN user u ON p.user_id = u.id "
                   + "WHERE p.id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Payment create(Payment p) {
        String sql = "INSERT INTO payment (user_id, membership_id, montant, mode_paiement, date_paiement, statut, reference) "
                   + "VALUES (?, ?, ?, ?, NOW(), ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, p.getUserId());
            if (p.getMembershipId() != null) {
                stmt.setInt(2, p.getMembershipId());
            } else {
                stmt.setNull(2, Types.INTEGER);
            }
            stmt.setBigDecimal(3, p.getMontant());
            stmt.setString(4, p.getModePaiement() != null ? p.getModePaiement() : "CARTE_BANCAIRE");
            stmt.setString(5, p.getStatut() != null ? p.getStatut() : "PAYE");
            stmt.setString(6, p.getReference() != null ? p.getReference() : "PAY-" + System.currentTimeMillis());

            stmt.executeUpdate();
            try (ResultSet gk = stmt.getGeneratedKeys()) {
                if (gk.next()) {
                    p.setId(gk.getInt(1));
                }
            }
            return findById(p.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Payment.create : " + e.getMessage(), e);
        }
    }

    public void updateStatus(int id, String status) {
        String sql = "UPDATE payment SET statut = ?, updated_at = NOW() WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Payment.updateStatus : " + e.getMessage(), e);
        }
    }

    private Payment mapRow(ResultSet rs) throws SQLException {
        Payment p = new Payment();
        p.setId(rs.getInt("id"));
        p.setUserId(rs.getInt("user_id"));
        int mId = rs.getInt("membership_id");
        if (!rs.wasNull()) p.setMembershipId(mId);
        p.setMontant(rs.getBigDecimal("montant"));
        p.setModePaiement(rs.getString("mode_paiement"));
        Timestamp dp = rs.getTimestamp("date_paiement");
        if (dp != null) p.setDatePaiement(dp.toLocalDateTime());
        p.setStatut(rs.getString("statut"));
        p.setReference(rs.getString("reference"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) p.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) p.setUpdatedAt(ua.toLocalDateTime());

        try {
            p.setUserName(rs.getString("user_name"));
        } catch (SQLException ignored) {
        }

        return p;
    }
}
