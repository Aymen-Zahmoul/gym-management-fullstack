package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    public User create(User u) {
        String sql = "INSERT INTO user (gym_id, nom_complet, email, mot_de_passe, telephone, role, statut) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, u.getGymId() > 0 ? u.getGymId() : 1);
            stmt.setString(2, u.getNomComplet());
            stmt.setString(3, u.getEmail());
            stmt.setString(4, u.getMotDePasse() != null ? u.getMotDePasse() : "pass123");
            stmt.setString(5, u.getTelephone());
            stmt.setString(6, u.getRole() != null ? u.getRole() : "MEMBER");
            stmt.setString(7, u.getStatut() != null ? u.getStatut() : "ACTIF");

            stmt.executeUpdate();
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    u.setId(generatedKeys.getInt(1));
                }
            }
            return findById(u.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO User.create : " + e.getMessage(), e);
        }
    }

    public List<User> findAll() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM user ORDER BY id DESC";
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

    public List<User> findByRole(String role) {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM user WHERE role = ? ORDER BY id DESC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, role);
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

    public User findById(int id) {
        String sql = "SELECT * FROM user WHERE id = ?";
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

    public User findByEmail(String email) {
        String sql = "SELECT * FROM user WHERE email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, email);
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

    public User update(User u) {
        String sql = "UPDATE user SET nom_complet = ?, telephone = ?, role = ?, statut = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, u.getNomComplet());
            stmt.setString(2, u.getTelephone());
            stmt.setString(3, u.getRole());
            stmt.setString(4, u.getStatut());
            stmt.setInt(5, u.getId());
            stmt.executeUpdate();
            return findById(u.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO User.update : " + e.getMessage(), e);
        }
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM user WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO User.delete : " + e.getMessage(), e);
        }
    }

    private User mapRow(ResultSet rs) throws SQLException {
        User u = new User();
        u.setId(rs.getInt("id"));
        u.setGymId(rs.getInt("gym_id"));
        u.setNomComplet(rs.getString("nom_complet"));
        u.setEmail(rs.getString("email"));
        u.setMotDePasse(rs.getString("mot_de_passe"));
        u.setTelephone(rs.getString("telephone"));
        u.setRole(rs.getString("role"));
        u.setStatut(rs.getString("statut"));
        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) u.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) u.setUpdatedAt(ua.toLocalDateTime());
        return u;
    }
}
