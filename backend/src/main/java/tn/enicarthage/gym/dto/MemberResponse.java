package tn.enicarthage.gym.dto;

import java.time.LocalDateTime;

public class MemberResponse {
    private int id;
    private int gymId;
    private String nomComplet;
    private String email;
    private String telephone;
    private String role;
    private String statut;
    private LocalDateTime createdAt;
    private String activePlanName;
    private String paymentStatut;
    private Double lastPaymentAmount;

    public MemberResponse() {
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getGymId() { return gymId; }
    public void setGymId(int gymId) { this.gymId = gymId; }

    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getActivePlanName() { return activePlanName; }
    public void setActivePlanName(String activePlanName) { this.activePlanName = activePlanName; }

    public String getPaymentStatut() { return paymentStatut; }
    public void setPaymentStatut(String paymentStatut) { this.paymentStatut = paymentStatut; }

    public Double getLastPaymentAmount() { return lastPaymentAmount; }
    public void setLastPaymentAmount(Double lastPaymentAmount) { this.lastPaymentAmount = lastPaymentAmount; }
}
