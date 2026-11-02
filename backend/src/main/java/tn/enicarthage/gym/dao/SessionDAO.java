package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.ClassSession;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SessionDAO {

    public List<ClassSession> findAll() {
        List<ClassSession> list = new ArrayList<>();
        String sql = "SELECT s.*, c.titre AS class_title, c.capacite_max, u.nom_complet AS coach_name, "
                   + "(SELECT COUNT(*) FROM booking b WHERE b.session_id = s.id AND b.statut = 'CONFIRMEE') AS total_bookings "
                   + "FROM class_session s "
                   + "JOIN fitness_class c ON s.class_id = c.id "
                   + "JOIN user u ON s.coach_id = u.id "
                   + "ORDER BY s.date_heure_debut ASC";
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

    public ClassSession findById(int id) {
        String sql = "SELECT s.*, c.titre AS class_title, c.capacite_max, u.nom_complet AS coach_name, "
                   + "(SELECT COUNT(*) FROM booking b WHERE b.session_id = s.id AND b.statut = 'CONFIRMEE') AS total_bookings "
                   + "FROM class_session s "
                   + "JOIN fitness_class c ON s.class_id = c.id "
                   + "JOIN user u ON s.coach_id = u.id "
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

    public ClassSession create(ClassSession s) {
        String sql = "INSERT INTO class_session (class_id, coach_id, salle, date_heure_debut, date_heure_fin, statut) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, s.getClassId());
            stmt.setInt(2, s.getCoachId());
            stmt.setString(3, s.getSalle() != null ? s.getSalle() : "Salle Principale");
            stmt.setTimestamp(4, Timestamp.valueOf(s.getDateHeureDebut()));
            stmt.setTimestamp(5, Timestamp.valueOf(s.getDateHeureFin()));
            stmt.setString(6, s.getStatut() != null ? s.getStatut() : "PROGRAMMEE");

            stmt.executeUpdate();
            try (ResultSet gk = stmt.getGeneratedKeys()) {
                if (gk.next()) {
                    s.setId(gk.getInt(1));
                }
            }
            return findById(s.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Session.create : " + e.getMessage(), e);
        }
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM class_session WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Session.delete : " + e.getMessage(), e);
        }
    }

    public boolean isRoomOccupied(String salle, java.time.LocalDateTime debut, java.time.LocalDateTime fin, int excludeSessionId) {
        String sql = "SELECT COUNT(*) FROM class_session "
                   + "WHERE salle = ? AND statut != 'ANNULEE' AND id != ? "
                   + "AND date_heure_debut < ? AND date_heure_fin > ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, salle);
            stmt.setInt(2, excludeSessionId);
            stmt.setTimestamp(3, Timestamp.valueOf(fin));
            stmt.setTimestamp(4, Timestamp.valueOf(debut));
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isCoachOccupied(int coachId, java.time.LocalDateTime debut, java.time.LocalDateTime fin, int excludeSessionId) {
        String sql = "SELECT COUNT(*) FROM class_session "
                   + "WHERE coach_id = ? AND statut != 'ANNULEE' AND id != ? "
                   + "AND date_heure_debut < ? AND date_heure_fin > ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, coachId);
            stmt.setInt(2, excludeSessionId);
            stmt.setTimestamp(3, Timestamp.valueOf(fin));
            stmt.setTimestamp(4, Timestamp.valueOf(debut));
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private ClassSession mapRow(ResultSet rs) throws SQLException {
        ClassSession s = new ClassSession();
        s.setId(rs.getInt("id"));
        s.setClassId(rs.getInt("class_id"));
        s.setCoachId(rs.getInt("coach_id"));
        s.setSalle(rs.getString("salle"));
        Timestamp d1 = rs.getTimestamp("date_heure_debut");
        if (d1 != null) s.setDateHeureDebut(d1.toLocalDateTime());
        Timestamp d2 = rs.getTimestamp("date_heure_fin");
        if (d2 != null) s.setDateHeureFin(d2.toLocalDateTime());
        s.setStatut(rs.getString("statut"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) s.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) s.setUpdatedAt(ua.toLocalDateTime());

        try {
            s.setClassTitle(rs.getString("class_title"));
            s.setCoachName(rs.getString("coach_name"));
            s.setCapaciteMax(rs.getInt("capacite_max"));
            s.setTotalBookings(rs.getInt("total_bookings"));
        } catch (SQLException ignored) {
        }

        return s;
    }
}
