package tn.enicarthage.gym.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SchedulingRequest {
    private int id;
    private int coachId;
    private int gymId;
    private String activite;
    private Integer classId;
    private String joursSemaine; // e.g. "LUNDI,VENDREDI"
    private String heureDebut;    // e.g. "17:00"
    private String heureFin;      // e.g. "19:00"
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String salle;
    private String remarques;
    private String statut;        // PENDING, APPROVED, REJECTED
    private String motifRejet;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Jointures pratiques pour affichage
    private String coachNomComplet;
    private String coachEmail;
    private String coachTelephone;
    private String gymNom;

    public SchedulingRequest() {
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getCoachId() { return coachId; }
    public void setCoachId(int coachId) { this.coachId = coachId; }

    public int getGymId() { return gymId; }
    public void setGymId(int gymId) { this.gymId = gymId; }

    public String getActivite() { return activite; }
    public void setActivite(String activite) { this.activite = activite; }

    public Integer getClassId() { return classId; }
    public void setClassId(Integer classId) { this.classId = classId; }

    public String getJoursSemaine() { return joursSemaine; }
    public void setJoursSemaine(String joursSemaine) { this.joursSemaine = joursSemaine; }

    public String getHeureDebut() { return heureDebut; }
    public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

    public String getHeureFin() { return heureFin; }
    public void setHeureFin(String heureFin) { this.heureFin = heureFin; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public String getSalle() { return salle; }
    public void setSalle(String salle) { this.salle = salle; }

    public String getRemarques() { return remarques; }
    public void setRemarques(String remarques) { this.remarques = remarques; }

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

    public String getGymNom() { return gymNom; }
    public void setGymNom(String gymNom) { this.gymNom = gymNom; }
}
