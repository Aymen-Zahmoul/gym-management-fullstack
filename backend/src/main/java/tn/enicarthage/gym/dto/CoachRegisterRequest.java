package tn.enicarthage.gym.dto;

import com.google.gson.annotations.SerializedName;

public class CoachRegisterRequest {
    @SerializedName(value = "nomComplet", alternate = {"nom", "name", "fullName", "nom_complet"})
    private String nomComplet;

    @SerializedName(value = "email", alternate = {"username", "mail"})
    private String email;

    @SerializedName(value = "motDePasse", alternate = {"password", "mot_de_passe", "pass"})
    private String motDePasse;

    @SerializedName(value = "telephone", alternate = {"tel", "phone"})
    private String telephone;

    @SerializedName(value = "specialites", alternate = {"specialite", "speciality", "specialty"})
    private String specialites;

    private String bio;

    @SerializedName(value = "anneesExperience", alternate = {"experience", "yearsExperience", "annees_experience"})
    private int anneesExperience = 1;

    @SerializedName(value = "gymId", alternate = {"gym_id"})
    private int gymId = 1;

    public CoachRegisterRequest() {
    }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getSpecialites() { return specialites; }
    public void setSpecialites(String specialites) { this.specialites = specialites; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public int getAnneesExperience() { return anneesExperience; }
    public void setAnneesExperience(int anneesExperience) { this.anneesExperience = anneesExperience; }

    public int getGymId() { return gymId; }
    public void setGymId(int gymId) { this.gymId = gymId; }
}
