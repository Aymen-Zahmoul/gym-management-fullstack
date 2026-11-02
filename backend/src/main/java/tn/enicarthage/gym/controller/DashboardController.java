package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.dto.DashboardStats;
import tn.enicarthage.gym.service.DashboardService;

public class DashboardController {
    private final DashboardService dashboardService = new DashboardService();

    public DashboardStats getStats() {
        return dashboardService.getStats();
    }
}
