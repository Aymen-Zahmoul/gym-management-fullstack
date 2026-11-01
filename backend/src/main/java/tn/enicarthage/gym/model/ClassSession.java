package tn.enicarthage.gym.model;

import java.time.LocalDateTime;

public class ClassSession {
    private int id;
    private int classId;
    private int coachId;
    private String salle;
    private LocalDateTime dateHeureDebut;
    private LocalDateTime dateHeureFin;
    private String statut; // PROGRAMMEE, EN_COURS, TERMINEE, ANNULEE
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Jointures pratiques pour affichage
    private String classTitle;
    private String coachName;
    private int totalBookings;
    private int capaciteMax;

    public ClassSession() {
    }

    public ClassSession(int id, int classId, int coachId, String salle, LocalDateTime dateHeureDebut, LocalDateTime dateHeureFin, String statut) {
        this.id = id;
        this.classId = classId;
        this.coachId = coachId;
        this.salle = salle;
        this.dateHeureDebut = dateHeureDebut;
        this.dateHeureFin = dateHeureFin;
        this.statut = statut;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getClassId() { return classId; }
    public void setClassId(int classId) { this.classId = classId; }

    public int getCoachId() { return coachId; }
    public void setCoachId(int coachId) { this.coachId = coachId; }

    public String getSalle() { return salle; }
    public void setSalle(String salle) { this.salle = salle; }

    public LocalDateTime getDateHeureDebut() { return dateHeureDebut; }
    public void setDateHeureDebut(LocalDateTime dateHeureDebut) { this.dateHeureDebut = dateHeureDebut; }

    public LocalDateTime getDateHeureFin() { return dateHeureFin; }
    public void setDateHeureFin(LocalDateTime dateHeureFin) { this.dateHeureFin = dateHeureFin; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getClassTitle() { return classTitle; }
    public void setClassTitle(String classTitle) { this.classTitle = classTitle; }

    public String getCoachName() { return coachName; }
    public void setCoachName(String coachName) { this.coachName = coachName; }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public int getCapaciteMax() { return capaciteMax; }
    public void setCapaciteMax(int capaciteMax) { this.capaciteMax = capaciteMax; }
}
