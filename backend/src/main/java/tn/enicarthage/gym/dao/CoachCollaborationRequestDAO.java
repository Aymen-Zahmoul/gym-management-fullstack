package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.CoachCollaborationRequest;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CoachCollaborationRequestDAO {

    public List<CoachCollaborationRequest> findAll() {
        List<CoachCollaborationRequest> list = new ArrayList<>();
        String sql = "SELECT r.*, u.nom_complet AS coach_nom, u.email AS coach_email, u.telephone AS coach_telephone, "
                   + "u.ville AS coach_ville, g.nom AS gym_nom "
                   + "FROM coach_collaboration_request r "
                   + "JOIN user u ON r.coach_id = u.id "
                   + "JOIN gym g ON r.gym_id = g.id "
                   + "ORDER BY r.created_at DESC";
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

    public CoachCollaborationRequest findById(int id) {
        String sql = "SELECT r.*, u.nom_complet AS coach_nom, u.email AS coach_email, u.telephone AS coach_telephone, "
                   + "u.ville AS coach_ville, g.nom AS gym_nom "
                   + "FROM coach_collaboration_request r "
                   + "JOIN user u ON r.coach_id = u.id "
                   + "JOIN gym g ON r.gym_id = g.id "
                   + "WHERE r.id = ?";
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

    public List<CoachCollaborationRequest> findByCoachId(int coachId) {
        List<CoachCollaborationRequest> list = new ArrayList<>();
        String sql = "SELECT r.*, u.nom_complet AS coach_nom, u.email AS coach_email, u.telephone AS coach_telephone, "
                   + "u.ville AS coach_ville, g.nom AS gym_nom "
                   + "FROM coach_collaboration_request r "
                   + "JOIN user u ON r.coach_id = u.id "
                   + "JOIN gym g ON r.gym_id = g.id "
                   + "WHERE r.coach_id = ? "
                   + "ORDER BY r.created_at DESC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, coachId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public CoachCollaborationRequest create(CoachCollaborationRequest req) {
        String sql = "INSERT INTO coach_collaboration_request (coach_id, gym_id, specialites, bio, annees_experience, statut) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, req.getCoachId());
            stmt.setInt(2, req.getGymId() > 0 ? req.getGymId() : 1);
            stmt.setString(3, req.getSpecialites() != null ? req.getSpecialites() : "");
            stmt.setString(4, req.getBio() != null ? req.getBio() : "");
            stmt.setInt(5, req.getAnneesExperience() > 0 ? req.getAnneesExperience() : 1);
            stmt.setString(6, req.getStatut() != null ? req.getStatut() : "PENDING");

            stmt.executeUpdate();
            try (ResultSet gk = stmt.getGeneratedKeys()) {
                if (gk.next()) {
                    req.setId(gk.getInt(1));
                }
            }
            return findById(req.getId());
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateStatus(int id, String statut, String motifRejet) {
        String sql = "UPDATE coach_collaboration_request SET statut = ?, motif_rejet = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, statut);
            stmt.setString(2, motifRejet);
            stmt.setInt(3, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private CoachCollaborationRequest mapRow(ResultSet rs) throws SQLException {
        CoachCollaborationRequest r = new CoachCollaborationRequest();
        r.setId(rs.getInt("id"));
        r.setCoachId(rs.getInt("coach_id"));
        r.setGymId(rs.getInt("gym_id"));
        r.setSpecialites(rs.getString("specialites"));
        r.setBio(rs.getString("bio"));
        r.setAnneesExperience(rs.getInt("annees_experience"));
        r.setStatut(rs.getString("statut"));
        r.setMotifRejet(rs.getString("motif_rejet"));

        Timestamp cat = rs.getTimestamp("created_at");
        if (cat != null) r.setCreatedAt(cat.toLocalDateTime());
        Timestamp uat = rs.getTimestamp("updated_at");
        if (uat != null) r.setUpdatedAt(uat.toLocalDateTime());

        r.setCoachNomComplet(rs.getString("coach_nom"));
        r.setCoachEmail(rs.getString("coach_email"));
        r.setCoachTelephone(rs.getString("coach_telephone"));
        r.setCoachVille(rs.getString("coach_ville"));
        r.setGymNom(rs.getString("gym_nom"));
        return r;
    }
}
