package tn.enicarthage.gym.dto;

import java.time.LocalDateTime;

public class SessionRequest {
    private int classId;
    private int coachId;
    private String salle;
    private LocalDateTime dateHeureDebut;
    private LocalDateTime dateHeureFin;

    public SessionRequest() {
    }

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
}
