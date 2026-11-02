package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.model.Membership;
import tn.enicarthage.gym.service.MembershipService;

import java.util.List;

public class MembershipController {
    private final MembershipService membershipService = new MembershipService();

    public List<Membership> lister() {
        return membershipService.getAllMemberships();
    }

    public Membership obtenir(int id) {
        return membershipService.getMembershipById(id);
    }

    public Membership souscrire(int userId, int planId, String modePaiement) {
        return membershipService.subscribe(userId, planId, modePaiement);
    }

    public void resilier(int id) {
        membershipService.cancelMembership(id);
    }
}
