package tn.enicarthage.gym.service;

import tn.enicarthage.gym.dao.FitnessClassDAO;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.FitnessClass;

import java.util.List;

public class FitnessClassService {
    private final FitnessClassDAO classDAO = new FitnessClassDAO();

    public List<FitnessClass> getAllClasses() {
        return classDAO.findAll();
    }

    public FitnessClass getClassById(int id) {
        FitnessClass fc = classDAO.findById(id);
        if (fc == null) {
            throw new ResourceNotFoundException("Cours introuvable : " + id);
        }
        return fc;
    }

    public FitnessClass createClass(FitnessClass fc) {
        if (fc.getTitre() == null || fc.getTitre().trim().isEmpty()) {
            throw new ValidationException("Le titre du cours est obligatoire.");
        }
        if (fc.getCapaciteMax() <= 0) {
            throw new ValidationException("La capacite doit etre superieure a zero.");
        }
        fc.setGymId(1);
        return classDAO.create(fc);
    }

    public FitnessClass updateClass(int id, FitnessClass fc) {
        FitnessClass existing = getClassById(id);
        if (fc.getTitre() != null) existing.setTitre(fc.getTitre().trim());
        if (fc.getDescription() != null) existing.setDescription(fc.getDescription());
        if (fc.getCapaciteMax() > 0) existing.setCapaciteMax(fc.getCapaciteMax());
        if (fc.getDureeMinutes() > 0) existing.setDureeMinutes(fc.getDureeMinutes());
        if (fc.getCategorie() != null) existing.setCategorie(fc.getCategorie());
        return classDAO.update(existing);
    }

    public void deleteClass(int id) {
        getClassById(id);
        classDAO.delete(id);
    }
}
