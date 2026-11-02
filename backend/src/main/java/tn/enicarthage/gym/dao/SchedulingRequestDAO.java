package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.SchedulingRequest;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SchedulingRequestDAO {

    public List<SchedulingRequest> findAll() {
        List<SchedulingRequest> list = new ArrayList<>();
        String sql = "SELECT s.*, u.nom_complet AS coach_nom, u.email AS coach_email, u.telephone AS coach_telephone, g.nom AS gym_nom "
                   + "FROM scheduling_request s "
                   + "JOIN user u ON s.coach_id = u.id "
                   + "JOIN gym g ON s.gym_id = g.id "
                   + "ORDER BY s.created_at DESC";
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

    public SchedulingRequest findById(int id) {
        String sql = "SELECT s.*, u.nom_complet AS coach_nom, u.email AS coach_email, u.telephone AS coach_telephone, g.nom AS gym_nom "
                   + "FROM scheduling_request s "
                   + "JOIN user u ON s.coach_id = u.id "
                   + "JOIN gym g ON s.gym_id = g.id "
                   + "WHERE s.id = ?";
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

    public List<SchedulingRequest> findByCoachId(int coachId) {
        List<SchedulingRequest> list = new ArrayList<>();
        String sql = "SELECT s.*, u.nom_complet AS coach_nom, u.email AS coach_email, u.telephone AS coach_telephone, g.nom AS gym_nom "
                   + "FROM scheduling_request s "
                   + "JOIN user u ON s.coach_id = u.id "
                   + "JOIN gym g ON s.gym_id = g.id "
                   + "WHERE s.coach_id = ? "
                   + "ORDER BY s.created_at DESC";
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

    public SchedulingRequest create(SchedulingRequest req) {
        String sql = "INSERT INTO scheduling_request (coach_id, gym_id, activite, class_id, jours_semaine, "
                   + "heure_debut, heure_fin, date_debut, date_fin, salle, remarques, statut) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, req.getCoachId());
            stmt.setInt(2, req.getGymId() > 0 ? req.getGymId() : 1);
            stmt.setString(3, req.getActivite());
            if (req.getClassId() != null && req.getClassId() > 0) {
                stmt.setInt(4, req.getClassId());
            } else {
                stmt.setNull(4, Types.INTEGER);
            }
            stmt.setString(5, req.getJoursSemaine());
            stmt.setString(6, req.getHeureDebut());
            stmt.setString(7, req.getHeureFin());
            stmt.setDate(8, Date.valueOf(req.getDateDebut()));
            stmt.setDate(9, Date.valueOf(req.getDateFin()));
            stmt.setString(10, req.getSalle() != null ? req.getSalle() : "Salle Principale");
            stmt.setString(11, req.getRemarques());
            stmt.setString(12, req.getStatut() != null ? req.getStatut() : "PENDING");

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
        String sql = "UPDATE scheduling_request SET statut = ?, motif_rejet = ? WHERE id = ?";
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

    private SchedulingRequest mapRow(ResultSet rs) throws SQLException {
        SchedulingRequest s = new SchedulingRequest();
        s.setId(rs.getInt("id"));
        s.setCoachId(rs.getInt("coach_id"));
        s.setGymId(rs.getInt("gym_id"));
        s.setActivite(rs.getString("activite"));
        int cid = rs.getInt("class_id");
        if (!rs.wasNull()) {
            s.setClassId(cid);
        }
        s.setJoursSemaine(rs.getString("jours_semaine"));
        s.setHeureDebut(rs.getString("heure_debut"));
        s.setHeureFin(rs.getString("heure_fin"));

        Date dd = rs.getDate("date_debut");
        if (dd != null) s.setDateDebut(dd.toLocalDate());
        Date df = rs.getDate("date_fin");
        if (df != null) s.setDateFin(df.toLocalDate());

        s.setSalle(rs.getString("salle"));
        s.setRemarques(rs.getString("remarques"));
        s.setStatut(rs.getString("statut"));
        s.setMotifRejet(rs.getString("motif_rejet"));

        Timestamp cat = rs.getTimestamp("created_at");
        if (cat != null) s.setCreatedAt(cat.toLocalDateTime());
        Timestamp uat = rs.getTimestamp("updated_at");
        if (uat != null) s.setUpdatedAt(uat.toLocalDateTime());

        s.setCoachNomComplet(rs.getString("coach_nom"));
        s.setCoachEmail(rs.getString("coach_email"));
        s.setCoachTelephone(rs.getString("coach_telephone"));
        s.setGymNom(rs.getString("gym_nom"));
        return s;
    }
}
