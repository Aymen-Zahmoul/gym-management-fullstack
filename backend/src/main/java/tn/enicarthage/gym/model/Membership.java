package tn.enicarthage.gym.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Membership {
    private int id;
    private int userId;
    private int planId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statut; // ACTIVE, EXPIREE, RESILIEE
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Champs joints pour affichage pratique
    private String userName;
    private String planName;

    public Membership() {
    }

    public Membership(int id, int userId, int planId, LocalDate dateDebut, LocalDate dateFin, String statut) {
        this.id = id;
        this.userId = userId;
        this.planId = planId;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getPlanId() { return planId; }
    public void setPlanId(int planId) { this.planId = planId; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
}
