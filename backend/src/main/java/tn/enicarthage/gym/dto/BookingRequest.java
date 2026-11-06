package tn.enicarthage.gym.dto;

import com.google.gson.annotations.SerializedName;

public class BookingRequest {
    @SerializedName(value = "sessionId", alternate = {"session_id"})
    private int sessionId;

    @SerializedName(value = "memberId", alternate = {"member_id", "userId", "user_id"})
    private int memberId;

    public BookingRequest() {
    }

    public int getSessionId() { return sessionId; }
    public void setSessionId(int sessionId) { this.sessionId = sessionId; }

    public int getMemberId() { return memberId; }
    public void setMemberId(int memberId) { this.memberId = memberId; }
}
