package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.GymDAO;
import tn.enicarthage.gym.model.Gym;

import java.util.List;

public class GymService {
    private final GymDAO gymDAO = new GymDAO();

    public Gym getGym(int id) {
        return gymDAO.findById(id);
    }

    public List<Gym> getAllGyms() {
        return gymDAO.findAll();
    }
}
