package tn.enicarthage.gym.controller;

import tn.enicarthage.gym.model.FitnessClass;
import tn.enicarthage.gym.service.FitnessClassService;

import java.util.List;

public class FitnessClassController {
    private final FitnessClassService classService = new FitnessClassService();

    public List<FitnessClass> lister() {
        return classService.getAllClasses();
    }

    public FitnessClass obtenir(int id) {
        return classService.getClassById(id);
    }

    public FitnessClass creer(FitnessClass fc) {
        return classService.createClass(fc);
    }

    public FitnessClass modifier(int id, FitnessClass fc) {
        return classService.updateClass(id, fc);
    }

    public void supprimer(int id) {
        classService.deleteClass(id);
    }
}
