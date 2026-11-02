package tn.enicarthage.gym.dto;

import java.math.BigDecimal;

public class DashboardStats {
    private int totalMembers;
    private int activeMembers;
    private int totalCoaches;
    private int upcomingSessions;
    private int totalBookings;
    private BigDecimal totalRevenue;

    public DashboardStats() {
    }

    public int getTotalMembers() { return totalMembers; }
    public void setTotalMembers(int totalMembers) { this.totalMembers = totalMembers; }

    public int getActiveMembers() { return activeMembers; }
    public void setActiveMembers(int activeMembers) { this.activeMembers = activeMembers; }

    public int getTotalCoaches() { return totalCoaches; }
    public void setTotalCoaches(int totalCoaches) { this.totalCoaches = totalCoaches; }

    public int getUpcomingSessions() { return upcomingSessions; }
    public void setUpcomingSessions(int upcomingSessions) { this.upcomingSessions = upcomingSessions; }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}
