package tn.enicarthage.gym.dao;

import tn.enicarthage.gym.config.DatabaseConnection;
import tn.enicarthage.gym.model.FitnessClass;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FitnessClassDAO {

    public List<FitnessClass> findAll() {
        List<FitnessClass> list = new ArrayList<>();
        String sql = "SELECT * FROM fitness_class ORDER BY titre ASC";
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

    public FitnessClass findById(int id) {
        String sql = "SELECT * FROM fitness_class WHERE id = ?";
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

    public FitnessClass create(FitnessClass fc) {
        String sql = "INSERT INTO fitness_class (gym_id, titre, description, capacite_max, duree_minutes, categorie) "
                   + "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, fc.getGymId() > 0 ? fc.getGymId() : 1);
            stmt.setString(2, fc.getTitre());
            stmt.setString(3, fc.getDescription());
            stmt.setInt(4, fc.getCapaciteMax() > 0 ? fc.getCapaciteMax() : 20);
            stmt.setInt(5, fc.getDureeMinutes() > 0 ? fc.getDureeMinutes() : 60);
            stmt.setString(6, fc.getCategorie() != null ? fc.getCategorie() : "CARDIO");

            stmt.executeUpdate();
            try (ResultSet gk = stmt.getGeneratedKeys()) {
                if (gk.next()) {
                    fc.setId(gk.getInt(1));
                }
            }
            return findById(fc.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO FitnessClass.create : " + e.getMessage(), e);
        }
    }

    public FitnessClass update(FitnessClass fc) {
        String sql = "UPDATE fitness_class SET titre = ?, description = ?, capacite_max = ?, duree_minutes = ?, categorie = ? WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, fc.getTitre());
            stmt.setString(2, fc.getDescription());
            stmt.setInt(3, fc.getCapaciteMax());
            stmt.setInt(4, fc.getDureeMinutes());
            stmt.setString(5, fc.getCategorie());
            stmt.setInt(6, fc.getId());
            stmt.executeUpdate();
            return findById(fc.getId());
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO FitnessClass.update : " + e.getMessage(), e);
        }
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM fitness_class WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur DAO FitnessClass.delete : " + e.getMessage(), e);
        }
    }

    private FitnessClass mapRow(ResultSet rs) throws SQLException {
        FitnessClass fc = new FitnessClass();
        fc.setId(rs.getInt("id"));
        fc.setGymId(rs.getInt("gym_id"));
        fc.setTitre(rs.getString("titre"));
        fc.setDescription(rs.getString("description"));
        fc.setCapaciteMax(rs.getInt("capacite_max"));
        fc.setDureeMinutes(rs.getInt("duree_minutes"));
        fc.setCategorie(rs.getString("categorie"));

        Timestamp ca = rs.getTimestamp("created_at");
        if (ca != null) fc.setCreatedAt(ca.toLocalDateTime());
        Timestamp ua = rs.getTimestamp("updated_at");
        if (ua != null) fc.setUpdatedAt(ua.toLocalDateTime());
        return fc;
    }
}
