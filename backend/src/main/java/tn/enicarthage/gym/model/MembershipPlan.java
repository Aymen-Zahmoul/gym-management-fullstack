package tn.enicarthage.gym.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MembershipPlan {
    private int id;
    private int gymId;
    private String nom;
    private String description;
    private BigDecimal prix;
    private int dureeMois;
    private boolean accesCoursIllimite;
    private boolean estActif;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MembershipPlan() {
    }

    public MembershipPlan(int id, int gymId, String nom, String description, BigDecimal prix, int dureeMois, boolean accesCoursIllimite, boolean estActif) {
        this.id = id;
        this.gymId = gymId;
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.dureeMois = dureeMois;
        this.accesCoursIllimite = accesCoursIllimite;
        this.estActif = estActif;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getGymId() { return gymId; }
    public void setGymId(int gymId) { this.gymId = gymId; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }

    public int getDureeMois() { return dureeMois; }
    public void setDureeMois(int dureeMois) { this.dureeMois = dureeMois; }

    public boolean isAccesCoursIllimite() { return accesCoursIllimite; }
    public void setAccesCoursIllimite(boolean accesCoursIllimite) { this.accesCoursIllimite = accesCoursIllimite; }

    public boolean isEstActif() { return estActif; }
    public void setEstActif(boolean estActif) { this.estActif = estActif; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
