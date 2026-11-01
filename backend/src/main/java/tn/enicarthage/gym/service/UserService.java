package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.MembershipDAO;
import tn.enicarthage.gym.dao.MembershipPlanDAO;
import tn.enicarthage.gym.dao.UserDAO;
import tn.enicarthage.gym.dto.MemberRequest;
import tn.enicarthage.gym.dto.MemberResponse;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.Membership;
import tn.enicarthage.gym.model.MembershipPlan;
import tn.enicarthage.gym.model.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class UserService {
    private final UserDAO userDAO = new UserDAO();
    private final MembershipDAO membershipDAO = new MembershipDAO();
    private final MembershipPlanDAO planDAO = new MembershipPlanDAO();

    public List<MemberResponse> getAllMembers() {
        List<User> users = userDAO.findByRole("MEMBER");
        List<Membership> allMemberships = membershipDAO.findAll();
        List<MemberResponse> responses = new ArrayList<>();

        for (User u : users) {
            MemberResponse resp = toResponse(u);
            for (Membership m : allMemberships) {
                if (m.getUserId() == u.getId() && "ACTIVE".equals(m.getStatut())) {
                    resp.setActivePlanName(m.getPlanName());
                    break;
                }
            }
            responses.add(resp);
        }
        return responses;
    }

    public List<User> getAllCoaches() {
        return userDAO.findByRole("COACH");
    }

    public List<User> getAllUsers() {
        return userDAO.findAll();
    }

    public User getUserById(int id) {
        User u = userDAO.findById(id);
        if (u == null) {
            throw new ResourceNotFoundException("Utilisateur non trouve avec l'identifiant : " + id);
        }
        return u;
    }

    public MemberResponse createMember(MemberRequest req) {
        if (req.getNomComplet() == null || req.getNomComplet().trim().isEmpty()) {
            throw new ValidationException("Le nom complet est obligatoire.");
        }
        if (req.getEmail() == null || !req.getEmail().contains("@")) {
            throw new ValidationException("Adresse email invalide.");
        }
        if (userDAO.findByEmail(req.getEmail()) != null) {
            throw new ValidationException("Un utilisateur avec cette adresse email existe deja.");
        }

        User u = new User();
        u.setGymId(1);
        u.setNomComplet(req.getNomComplet().trim());
        u.setEmail(req.getEmail().trim().toLowerCase());
        u.setMotDePasse(req.getMotDePasse() != null && !req.getMotDePasse().isEmpty() ? req.getMotDePasse() : "pass123");
        u.setTelephone(req.getTelephone());
        u.setRole(req.getRole() != null ? req.getRole() : "MEMBER");
        u.setStatut(req.getStatut() != null ? req.getStatut() : "ACTIF");

        User saved = userDAO.create(u);

        if (req.getInitialPlanId() != null && req.getInitialPlanId() > 0) {
            MembershipPlan plan = planDAO.findById(req.getInitialPlanId());
            if (plan != null) {
                Membership m = new Membership();
                m.setUserId(saved.getId());
                m.setPlanId(plan.getId());
                m.setDateDebut(LocalDate.now());
                m.setDateFin(LocalDate.now().plusMonths(plan.getDureeMois()));
                m.setStatut("ACTIVE");
                membershipDAO.create(m);
            }
        }

        return toResponse(saved);
    }

    public MemberResponse updateMember(int id, MemberRequest req) {
        User existing = getUserById(id);
        if (req.getNomComplet() != null && !req.getNomComplet().trim().isEmpty()) {
            existing.setNomComplet(req.getNomComplet().trim());
        }
        if (req.getTelephone() != null) {
            existing.setTelephone(req.getTelephone().trim());
        }
        if (req.getRole() != null) {
            existing.setRole(req.getRole());
        }
        if (req.getStatut() != null) {
            existing.setStatut(req.getStatut());
        }
        User updated = userDAO.update(existing);
        return toResponse(updated);
    }

    public void deleteUser(int id) {
        getUserById(id); // verifie l'existence
        userDAO.delete(id);
    }

    private MemberResponse toResponse(User u) {
        MemberResponse r = new MemberResponse();
        r.setId(u.getId());
        r.setGymId(u.getGymId());
        r.setNomComplet(u.getNomComplet());
        r.setEmail(u.getEmail());
        r.setTelephone(u.getTelephone());
        r.setRole(u.getRole());
        r.setStatut(u.getStatut());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}
