package tn.enicarthage.gym.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Payment {
    private int id;
    private int userId;
    private Integer membershipId;
    private BigDecimal montant;
    private String modePaiement; // ESPECES, CARTE_BANCAIRE, VIREMENT
    private LocalDateTime datePaiement;
    private String statut; // PAYE, EN_ATTENTE, REMBOURSE
    private String reference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Jointures
    private String userName;

    public Payment() {
    }

    public Payment(int id, int userId, Integer membershipId, BigDecimal montant, String modePaiement, LocalDateTime datePaiement, String statut, String reference) {
        this.id = id;
        this.userId = userId;
        this.membershipId = membershipId;
        this.montant = montant;
        this.modePaiement = modePaiement;
        this.datePaiement = datePaiement;
        this.statut = statut;
        this.reference = reference;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public Integer getMembershipId() { return membershipId; }
    public void setMembershipId(Integer membershipId) { this.membershipId = membershipId; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public LocalDateTime getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDateTime datePaiement) { this.datePaiement = datePaiement; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
}
