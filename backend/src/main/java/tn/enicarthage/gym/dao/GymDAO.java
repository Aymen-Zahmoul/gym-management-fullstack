package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.Gym;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GymDAO {

    public Gym findById(int id) {
        String sql = "SELECT * FROM gym WHERE id = ?";
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

    public List<Gym> findAll() {
        List<Gym> list = new ArrayList<>();
        String sql = "SELECT * FROM gym ORDER BY id ASC";
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

    private Gym mapRow(ResultSet rs) throws SQLException {
        Gym g = new Gym();
        g.setId(rs.getInt("id"));
        g.setNom(rs.getString("nom"));
        g.setAdresse(rs.getString("adresse"));
        g.setTelephone(rs.getString("telephone"));
        g.setEmail(rs.getString("email"));
        g.setSiteWeb(rs.getString("site_web"));
        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) g.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) g.setUpdatedAt(ua.toLocalDateTime());
        return g;
    }
}
