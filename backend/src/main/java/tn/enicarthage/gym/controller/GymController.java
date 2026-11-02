package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.model.Gym;
import tn.enicarthage.gym.service.GymService;

import java.util.List;

public class GymController {
    private final GymService gymService = new GymService();

    public Gym obtenir(int id) {
        return gymService.getGym(id);
    }

    public List<Gym> lister() {
        return gymService.getAllGyms();
    }
}
