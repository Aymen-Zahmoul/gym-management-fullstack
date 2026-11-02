package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.dto.PlanRequest;
import tn.enicarthage.gym.model.MembershipPlan;
import tn.enicarthage.gym.service.MembershipPlanService;

import java.util.List;

public class MembershipPlanController {
    private final MembershipPlanService planService = new MembershipPlanService();

    public List<MembershipPlan> lister() {
        return planService.getAllPlans();
    }

    public MembershipPlan obtenir(int id) {
        return planService.getPlanById(id);
    }

    public MembershipPlan creer(PlanRequest req) {
        return planService.createPlan(req);
    }

    public MembershipPlan modifier(int id, PlanRequest req) {
        return planService.updatePlan(id, req);
    }

    public void supprimer(int id) {
        planService.deletePlan(id);
    }
}
