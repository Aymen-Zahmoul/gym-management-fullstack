package tn.enicarthage.gym.model;

import java.time.LocalDateTime;

public class CoachCollaborationRequest {
    private int id;
    private int coachId;
    private int gymId;
    private String specialites;
    private String bio;
    private int anneesExperience;
    private String statut; // PENDING, APPROVED, REJECTED
    private String motifRejet;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Jointures pratiques pour affichage
    private String coachNomComplet;
    private String coachEmail;
    private String coachTelephone;
    private String coachVille;
    private String gymNom;

    public CoachCollaborationRequest() {
    }

    public CoachCollaborationRequest(int id, int coachId, int gymId, String specialites, String bio, int anneesExperience, String statut) {
        this.id = id;
        this.coachId = coachId;
        this.gymId = gymId;
        this.specialites = specialites;
        this.bio = bio;
        this.anneesExperience = anneesExperience;
        this.statut = statut;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getCoachId() { return coachId; }
    public void setCoachId(int coachId) { this.coachId = coachId; }

    public int getGymId() { return gymId; }
    public void setGymId(int gymId) { this.gymId = gymId; }

    public String getSpecialites() { return specialites; }
    public void setSpecialites(String specialites) { this.specialites = specialites; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public int getAnneesExperience() { return anneesExperience; }
    public void setAnneesExperience(int anneesExperience) { this.anneesExperience = anneesExperience; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getMotifRejet() { return motifRejet; }
    public void setMotifRejet(String motifRejet) { this.motifRejet = motifRejet; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCoachNomComplet() { return coachNomComplet; }
    public void setCoachNomComplet(String coachNomComplet) { this.coachNomComplet = coachNomComplet; }

    public String getCoachEmail() { return coachEmail; }
    public void setCoachEmail(String coachEmail) { this.coachEmail = coachEmail; }

    public String getCoachTelephone() { return coachTelephone; }
    public void setCoachTelephone(String coachTelephone) { this.coachTelephone = coachTelephone; }

    public String getCoachVille() { return coachVille; }
    public void setCoachVille(String coachVille) { this.coachVille = coachVille; }

    public String getGymNom() { return gymNom; }
    public void setGymNom(String gymNom) { this.gymNom = gymNom; }
}
