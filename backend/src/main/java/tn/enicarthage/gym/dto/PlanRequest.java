package tn.enicarthage.gym.dto;

import java.math.BigDecimal;

public class PlanRequest {
    private String nom;
    private String description;
    private BigDecimal prix;
    private int dureeMois;
    private boolean accesCoursIllimite;
    private boolean estActif;

    public PlanRequest() {
    }

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
}
