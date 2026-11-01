package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.MembershipPlanDAO;
import tn.enicarthage.gym.dto.PlanRequest;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.MembershipPlan;

import java.math.BigDecimal;
import java.util.List;

public class MembershipPlanService {
    private final MembershipPlanDAO planDAO = new MembershipPlanDAO();

    public List<MembershipPlan> getAllPlans() {
        return planDAO.findAll();
    }

    public MembershipPlan getPlanById(int id) {
        MembershipPlan plan = planDAO.findById(id);
        if (plan == null) {
            throw new ResourceNotFoundException("Forfait introuvable : " + id);
        }
        return plan;
    }

    public MembershipPlan createPlan(PlanRequest req) {
        if (req.getNom() == null || req.getNom().trim().isEmpty()) {
            throw new ValidationException("Le nom du forfait est obligatoire.");
        }
        if (req.getPrix() == null || req.getPrix().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Le tarif doit etre strictement positif.");
        }
        if (req.getDureeMois() <= 0) {
            throw new ValidationException("La duree du forfait doit etre d'au moins 1 mois.");
        }

        MembershipPlan p = new MembershipPlan();
        p.setGymId(1);
        p.setNom(req.getNom().trim());
        p.setDescription(req.getDescription());
        p.setPrix(req.getPrix());
        p.setDureeMois(req.getDureeMois());
        p.setAccesCoursIllimite(req.isAccesCoursIllimite());
        p.setEstActif(req.isEstActif());

        return planDAO.create(p);
    }

    public MembershipPlan updatePlan(int id, PlanRequest req) {
        MembershipPlan existing = getPlanById(id);
        if (req.getNom() != null) existing.setNom(req.getNom().trim());
        if (req.getDescription() != null) existing.setDescription(req.getDescription());
        if (req.getPrix() != null && req.getPrix().compareTo(BigDecimal.ZERO) > 0) {
            existing.setPrix(req.getPrix());
        }
        if (req.getDureeMois() > 0) existing.setDureeMois(req.getDureeMois());
        existing.setAccesCoursIllimite(req.isAccesCoursIllimite());
        existing.setEstActif(req.isEstActif());

        return planDAO.update(existing);
    }

    public void deletePlan(int id) {
        getPlanById(id);
        planDAO.delete(id);
    }
}
