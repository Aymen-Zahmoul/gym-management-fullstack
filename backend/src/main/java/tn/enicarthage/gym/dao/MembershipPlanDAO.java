package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.MembershipPlan;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MembershipPlanDAO {

    public List<MembershipPlan> findAll() {
        List<MembershipPlan> list = new ArrayList<>();
        String sql = "SELECT * FROM membership_plan ORDER BY prix ASC";
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

    public MembershipPlan findById(int id) {
        String sql = "SELECT * FROM membership_plan WHERE id = ?";
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

    public MembershipPlan create(MembershipPlan p) {
        String sql = "INSERT INTO membership_plan (gym_id, nom, description, prix, duree_mois, acces_cours_illimite, est_actif) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, p.getGymId() > 0 ? p.getGymId() : 1);
            stmt.setString(2, p.getNom());
            stmt.setString(3, p.getDescription());
            stmt.setBigDecimal(4, p.getPrix());
            stmt.setInt(5, p.getDureeMois());
            stmt.setBoolean(6, p.isAccesCoursIllimite());
            stmt.setBoolean(7, p.isEstActif());

            stmt.executeUpdate();
            try (ResultSet gk = stmt.getGeneratedKeys()) {
                if (gk.next()) {
                    p.setId(gk.getInt(1));
                }
            }
            return findById(p.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Plan.create : " + e.getMessage(), e);
        }
    }

    public MembershipPlan update(MembershipPlan p) {
        String sql = "UPDATE membership_plan SET nom = ?, description = ?, prix = ?, duree_mois = ?, "
                   + "acces_cours_illimite = ?, est_actif = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, p.getNom());
            stmt.setString(2, p.getDescription());
            stmt.setBigDecimal(3, p.getPrix());
            stmt.setInt(4, p.getDureeMois());
            stmt.setBoolean(5, p.isAccesCoursIllimite());
            stmt.setBoolean(6, p.isEstActif());
            stmt.setInt(7, p.getId());
            stmt.executeUpdate();
            return findById(p.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Plan.update : " + e.getMessage(), e);
        }
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM membership_plan WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Plan.delete : " + e.getMessage(), e);
        }
    }

    private MembershipPlan mapRow(ResultSet rs) throws SQLException {
        MembershipPlan p = new MembershipPlan();
        p.setId(rs.getInt("id"));
        p.setGymId(rs.getInt("gym_id"));
        p.setNom(rs.getString("nom"));
        p.setDescription(rs.getString("description"));
        p.setPrix(rs.getBigDecimal("prix"));
        p.setDureeMois(rs.getInt("duree_mois"));
        p.setAccesCoursIllimite(rs.getBoolean("acces_cours_illimite"));
        p.setEstActif(rs.getBoolean("est_actif"));
        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) p.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) p.setUpdatedAt(ua.toLocalDateTime());
        return p;
    }
}
