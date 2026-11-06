package tn.enicarthage.gym.dto;

import com.google.gson.annotations.SerializedName;

public class MemberRequest {
    @SerializedName(value = "nomComplet", alternate = {"nom", "name", "fullName", "nom_complet"})
    private String nomComplet;

    @SerializedName(value = "email", alternate = {"username", "mail"})
    private String email;

    @SerializedName(value = "motDePasse", alternate = {"password", "mot_de_passe", "pass"})
    private String motDePasse;

    @SerializedName(value = "telephone", alternate = {"tel", "phone"})
    private String telephone;

    private String role;
    private String statut;

    @SerializedName(value = "initialPlanId", alternate = {"planId", "plan_id", "initial_plan_id"})
    private Integer initialPlanId;

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
