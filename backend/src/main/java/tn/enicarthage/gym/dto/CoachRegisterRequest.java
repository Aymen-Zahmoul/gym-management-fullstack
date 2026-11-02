package tn.enicarthage.gym.dto;

public class CoachRegisterRequest {
    private String nomComplet;
    private String email;
    private String motDePasse;
    private String telephone;
    private String specialites;
    private String bio;
    private int anneesExperience = 1;
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
