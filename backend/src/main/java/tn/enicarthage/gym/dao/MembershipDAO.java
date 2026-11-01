package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.Membership;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MembershipDAO {

    public List<Membership> findAll() {
        List<Membership> list = new ArrayList<>();
        String sql = "SELECT m.*, u.nom_complet AS user_name, p.nom AS plan_name "
                   + "FROM membership m "
                   + "JOIN user u ON m.user_id = u.id "
                   + "JOIN membership_plan p ON m.plan_id = p.id "
                   + "ORDER BY m.id DESC";
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

    public Membership findById(int id) {
        String sql = "SELECT m.*, u.nom_complet AS user_name, p.nom AS plan_name "
                   + "FROM membership m "
                   + "JOIN user u ON m.user_id = u.id "
                   + "JOIN membership_plan p ON m.plan_id = p.id "
                   + "WHERE m.id = ?";
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

    public Membership create(Membership m) {
        String sql = "INSERT INTO membership (user_id, plan_id, date_debut, date_fin, statut) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, m.getUserId());
            stmt.setInt(2, m.getPlanId());
            stmt.setDate(3, Date.valueOf(m.getDateDebut()));
            stmt.setDate(4, Date.valueOf(m.getDateFin()));
            stmt.setString(5, m.getStatut() != null ? m.getStatut() : "ACTIVE");

            stmt.executeUpdate();
            try (ResultSet gk = stmt.getGeneratedKeys()) {
                if (gk.next()) {
                    m.setId(gk.getInt(1));
                }
            }
            return findById(m.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Membership.create : " + e.getMessage(), e);
        }
    }

    public boolean updateStatus(int id, String statut) {
        String sql = "UPDATE membership SET statut = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, statut);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Membership.updateStatus : " + e.getMessage(), e);
        }
    }

    private Membership mapRow(ResultSet rs) throws SQLException {
        Membership m = new Membership();
        m.setId(rs.getInt("id"));
        m.setUserId(rs.getInt("user_id"));
        m.setPlanId(rs.getInt("plan_id"));
        Date d1 = rs.getDate("date_debut");
        if (d1 != null) m.setDateDebut(d1.toLocalDate());
        Date d2 = rs.getDate("date_fin");
        if (d2 != null) m.setDateFin(d2.toLocalDate());
        m.setStatut(rs.getString("statut"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) m.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) m.setUpdatedAt(ua.toLocalDateTime());

        try {
            m.setUserName(rs.getString("user_name"));
            m.setPlanName(rs.getString("plan_name"));
        } catch (SQLException ignored) {
        }
        return m;
    }
}
