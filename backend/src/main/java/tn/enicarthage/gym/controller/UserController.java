package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.dto.MemberRequest;
import tn.enicarthage.gym.dto.MemberResponse;
import tn.enicarthage.gym.model.User;
import tn.enicarthage.gym.service.UserService;

import java.util.List;

public class UserController {
    private final UserService userService = new UserService();

    public MemberResponse login(String email, String motDePasse) {
        return userService.authenticate(email, motDePasse);
    }

    public List<MemberResponse> listerMembres() {
        return userService.getAllMembers();
    }

    public List<User> listerCoachs() {
        return userService.getAllCoaches();
    }

    public List<User> listerTous() {
        return userService.getAllUsers();
    }

    public User obtenir(int id) {
        return userService.getUserById(id);
    }

    public MemberResponse creerMembre(MemberRequest req) {
        return userService.createMember(req);
    }

    public MemberResponse modifierMembre(int id, MemberRequest req) {
        return userService.updateMember(id, req);
    }

    public void supprimer(int id) {
        userService.deleteUser(id);
    }
}
