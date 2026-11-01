package tn.enicarthage.gym.model;

import java.time.LocalDateTime;

public class User {
    private int id;
    private int gymId;
    private String nomComplet;
    private String email;
    private String motDePasse;
    private String telephone;
    private String role; // ADMIN, COACH, MEMBER
    private String statut; // ACTIF, INACTIF, SUSPENDU
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {
    }

    public User(int id, int gymId, String nomComplet, String email, String motDePasse, String telephone, String role, String statut) {
        this.id = id;
        this.gymId = gymId;
        this.nomComplet = nomComplet;
        this.email = email;
        this.motDePasse = motDePasse;
        this.telephone = telephone;
        this.role = role;
        this.statut = statut;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getGymId() { return gymId; }
    public void setGymId(int gymId) { this.gymId = gymId; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
