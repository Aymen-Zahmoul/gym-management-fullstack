package tn.enicarthage.gym.dto;

public class BookingRequest {
    private int sessionId;
    private int memberId;

    public BookingRequest() {
    }

    public int getSessionId() { return sessionId; }
    public void setSessionId(int sessionId) { this.sessionId = sessionId; }

    public int getMemberId() { return memberId; }
    public void setMemberId(int memberId) { this.memberId = memberId; }
}
