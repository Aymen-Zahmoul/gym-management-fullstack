package tn.enicarthage.gym.dto;

public class MemberRequest {
    private String nomComplet;
    private String email;
    private String motDePasse;
    private String telephone;
    private String role;
    private String statut;
    private Integer initialPlanId; // Optionnel : souscrire immédiatement

    public MemberRequest() {
    }

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

    public Integer getInitialPlanId() { return initialPlanId; }
    public void setInitialPlanId(Integer initialPlanId) { this.initialPlanId = initialPlanId; }
}
