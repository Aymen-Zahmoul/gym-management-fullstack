package tn.enicarthage.gym.model;

import java.time.LocalDateTime;

public class FitnessClass {
    private int id;
    private int gymId;
    private String titre;
    private String description;
    private int capaciteMax;
    private int dureeMinutes;
    private String categorie; // CARDIO, FORCE, ARTS_MARTIAUX, BIEN_ETRE
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FitnessClass() {
    }

    public FitnessClass(int id, int gymId, String titre, String description, int capaciteMax, int dureeMinutes, String categorie) {
        this.id = id;
        this.gymId = gymId;
        this.titre = titre;
        this.description = description;
        this.capaciteMax = capaciteMax;
        this.dureeMinutes = dureeMinutes;
        this.categorie = categorie;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getGymId() { return gymId; }
    public void setGymId(int gymId) { this.gymId = gymId; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getCapaciteMax() { return capaciteMax; }
    public void setCapaciteMax(int capaciteMax) { this.capaciteMax = capaciteMax; }

    public int getDureeMinutes() { return dureeMinutes; }
    public void setDureeMinutes(int dureeMinutes) { this.dureeMinutes = dureeMinutes; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
