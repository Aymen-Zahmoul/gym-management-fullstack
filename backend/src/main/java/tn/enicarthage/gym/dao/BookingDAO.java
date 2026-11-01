package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.Booking;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookingDAO {

    public List<Booking> findAll() {
        List<Booking> list = new ArrayList<>();
        String sql = "SELECT b.*, u.nom_complet AS member_name, u.email AS member_email, "
                   + "c.titre AS class_title, s.date_heure_debut AS session_start_time "
                   + "FROM booking b "
                   + "JOIN user u ON b.member_id = u.id "
                   + "JOIN class_session s ON b.session_id = s.id "
                   + "JOIN fitness_class c ON s.class_id = c.id "
                   + "ORDER BY b.id DESC";
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

    public List<Booking> findBySessionId(int sessionId) {
        List<Booking> list = new ArrayList<>();
        String sql = "SELECT b.*, u.nom_complet AS member_name, u.email AS member_email, "
                   + "c.titre AS class_title, s.date_heure_debut AS session_start_time "
                   + "FROM booking b "
                   + "JOIN user u ON b.member_id = u.id "
                   + "JOIN class_session s ON b.session_id = s.id "
                   + "JOIN fitness_class c ON s.class_id = c.id "
                   + "WHERE b.session_id = ? "
                   + "ORDER BY b.id ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sessionId);
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

    public Booking findById(int id) {
        String sql = "SELECT b.*, u.nom_complet AS member_name, u.email AS member_email, "
                   + "c.titre AS class_title, s.date_heure_debut AS session_start_time "
                   + "FROM booking b "
                   + "JOIN user u ON b.member_id = u.id "
                   + "JOIN class_session s ON b.session_id = s.id "
                   + "JOIN fitness_class c ON s.class_id = c.id "
                   + "WHERE b.id = ?";
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

    public Booking findBySessionAndMember(int sessionId, int memberId) {
        String sql = "SELECT b.*, u.nom_complet AS member_name, u.email AS member_email, "
                   + "c.titre AS class_title, s.date_heure_debut AS session_start_time "
                   + "FROM booking b "
                   + "JOIN user u ON b.member_id = u.id "
                   + "JOIN class_session s ON b.session_id = s.id "
                   + "JOIN fitness_class c ON s.class_id = c.id "
                   + "WHERE b.session_id = ? AND b.member_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sessionId);
            stmt.setInt(2, memberId);
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

    public int countActiveBookingsForSession(int sessionId) {
        String sql = "SELECT COUNT(*) FROM booking WHERE session_id = ? AND statut = 'CONFIRMEE'";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sessionId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public Booking create(Booking b) {
        String sql = "INSERT INTO booking (session_id, member_id, date_reservation, statut) VALUES (?, ?, NOW(), ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, b.getSessionId());
            stmt.setInt(2, b.getMemberId());
            stmt.setString(3, b.getStatut() != null ? b.getStatut() : "CONFIRMEE");

            stmt.executeUpdate();
            try (ResultSet gk = stmt.getGeneratedKeys()) {
                if (gk.next()) {
                    b.setId(gk.getInt(1));
                }
            }
            return findById(b.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Booking.create : " + e.getMessage(), e);
        }
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM booking WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO Booking.delete : " + e.getMessage(), e);
        }
    }

    private Booking mapRow(ResultSet rs) throws SQLException {
        Booking b = new Booking();
        b.setId(rs.getInt("id"));
        b.setSessionId(rs.getInt("session_id"));
        b.setMemberId(rs.getInt("member_id"));
        Timestamp dr = rs.getTimestamp("date_reservation");
        if (dr != null) b.setDateReservation(dr.toLocalDateTime());
        b.setStatut(rs.getString("statut"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) b.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) b.setUpdatedAt(ua.toLocalDateTime());

        try {
            b.setMemberName(rs.getString("member_name"));
            b.setMemberEmail(rs.getString("member_email"));
            b.setClassTitle(rs.getString("class_title"));
            Timestamp st = rs.getTimestamp("session_start_time");
            if (st != null) b.setSessionStartTime(st.toLocalDateTime());
        } catch (SQLException ignored) {
        }

        return b;
    }
}
