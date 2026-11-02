package tn.enicarthage.gym.service;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.dto.DashboardStats;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DashboardService {

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();
        String sql = "SELECT "
                   + "(SELECT COUNT(*) FROM user WHERE role = 'MEMBER') AS total_members, "
                   + "(SELECT COUNT(DISTINCT user_id) FROM membership WHERE statut = 'ACTIVE') AS active_members, "
                   + "(SELECT COUNT(*) FROM user WHERE role = 'COACH') AS total_coaches, "
                   + "(SELECT COUNT(*) FROM class_session WHERE date_heure_debut >= NOW() AND statut != 'ANNULEE') AS upcoming_sessions, "
                   + "(SELECT COUNT(*) FROM booking WHERE statut = 'CONFIRMEE') AS total_bookings, "
                   + "COALESCE((SELECT SUM(montant) FROM payment WHERE statut = 'PAYE'), 0) AS total_revenue";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                stats.setTotalMembers(rs.getInt("total_members"));
                stats.setActiveMembers(rs.getInt("active_members"));
                stats.setTotalCoaches(rs.getInt("total_coaches"));
                stats.setUpcomingSessions(rs.getInt("upcoming_sessions"));
                stats.setTotalBookings(rs.getInt("total_bookings"));
                stats.setTotalRevenue(rs.getBigDecimal("total_revenue"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            stats.setTotalRevenue(BigDecimal.ZERO);
        }
        return stats;
    }
}
