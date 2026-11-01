package tn.enicarthage.gym.model;

import java.time.LocalDateTime;

public class Booking {
    private int id;
    private int sessionId;
    private int memberId;
    private LocalDateTime dateReservation;
    private String statut; // CONFIRMEE, PRESENTE, ABSENTE, ANNULEE
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Champs joints
    private String memberName;
    private String memberEmail;
    private String classTitle;
    private LocalDateTime sessionStartTime;

    public Booking() {
    }

    public Booking(int id, int sessionId, int memberId, LocalDateTime dateReservation, String statut) {
        this.id = id;
        this.sessionId = sessionId;
        this.memberId = memberId;
        this.dateReservation = dateReservation;
        this.statut = statut;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getSessionId() { return sessionId; }
    public void setSessionId(int sessionId) { this.sessionId = sessionId; }

    public int getMemberId() { return memberId; }
    public void setMemberId(int memberId) { this.memberId = memberId; }

    public LocalDateTime getDateReservation() { return dateReservation; }
    public void setDateReservation(LocalDateTime dateReservation) { this.dateReservation = dateReservation; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }

    public String getMemberEmail() { return memberEmail; }
    public void setMemberEmail(String memberEmail) { this.memberEmail = memberEmail; }

    public String getClassTitle() { return classTitle; }
    public void setClassTitle(String classTitle) { this.classTitle = classTitle; }

    public LocalDateTime getSessionStartTime() { return sessionStartTime; }
    public void setSessionStartTime(LocalDateTime sessionStartTime) { this.sessionStartTime = sessionStartTime; }
}
