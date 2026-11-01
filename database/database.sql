-- =============================================================================
-- Projet Fédérateur Full Stack Web : Gym Management
-- ENICarthage - Encadré par Mme Jihen ABBASSI
-- Base de données relationnelle MySQL (MariaDB)
-- Respect strict des contraintes : id, created_at, updated_at sur chaque table
-- =============================================================================

DROP DATABASE IF EXISTS gym_management;
CREATE DATABASE gym_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gym_management;

-- -----------------------------------------------------------------------------
-- 1. Table: gym (Club / Salle de sport)
-- -----------------------------------------------------------------------------
CREATE TABLE gym (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(120) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    site_web VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. Table: user (Utilisateurs : Admin, Coachs, Membres/Adhérents)
-- -----------------------------------------------------------------------------
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gym_id INT NOT NULL,
    nom_complet VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(30),
    role ENUM('ADMIN', 'COACH', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    statut ENUM('ACTIF', 'INACTIF', 'SUSPENDU') NOT NULL DEFAULT 'ACTIF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_gym FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Table: membership_plan (Offres & Forfaits d'abonnement)
-- -----------------------------------------------------------------------------
CREATE TABLE membership_plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gym_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    duree_mois INT NOT NULL DEFAULT 1,
    acces_cours_illimite BOOLEAN NOT NULL DEFAULT FALSE,
    est_actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_gym FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. Table: membership (Souscriptions d'abonnements des membres)
-- -----------------------------------------------------------------------------
CREATE TABLE membership (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut ENUM('ACTIVE', 'EXPIREE', 'RESILIEE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_membership_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_membership_plan FOREIGN KEY (plan_id) REFERENCES membership_plan(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. Table: fitness_class (Disciplines & Cours collectifs)
-- -----------------------------------------------------------------------------
CREATE TABLE fitness_class (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gym_id INT NOT NULL,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    capacite_max INT NOT NULL DEFAULT 20,
    duree_minutes INT NOT NULL DEFAULT 60,
    categorie ENUM('CARDIO', 'FORCE', 'ARTS_MARTIAUX', 'BIEN_ETRE') NOT NULL DEFAULT 'CARDIO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_class_gym FOREIGN KEY (gym_id) REFERENCES gym(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. Table: class_session (Séances programmées sur le planning)
-- -----------------------------------------------------------------------------
CREATE TABLE class_session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    coach_id INT NOT NULL,
    salle VARCHAR(80) NOT NULL DEFAULT 'Salle Principale',
    date_heure_debut DATETIME NOT NULL,
    date_heure_fin DATETIME NOT NULL,
    statut ENUM('PROGRAMMEE', 'EN_COURS', 'TERMINEE', 'ANNULEE') NOT NULL DEFAULT 'PROGRAMMEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_class FOREIGN KEY (class_id) REFERENCES fitness_class(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_coach FOREIGN KEY (coach_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. Table: booking (Réservations de séances par les membres - Relation N:N)
-- -----------------------------------------------------------------------------
CREATE TABLE booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    member_id INT NOT NULL,
    date_reservation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('CONFIRMEE', 'PRESENTE', 'ABSENTE', 'ANNULEE') NOT NULL DEFAULT 'CONFIRMEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_session_member UNIQUE (session_id, member_id),
    CONSTRAINT fk_booking_session FOREIGN KEY (session_id) REFERENCES class_session(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_member FOREIGN KEY (member_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. Table: payment (Règlements & Comptabilité)
-- -----------------------------------------------------------------------------
CREATE TABLE payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    membership_id INT,
    montant DECIMAL(10,2) NOT NULL,
    mode_paiement ENUM('ESPECES', 'CARTE_BANCAIRE', 'VIREMENT') NOT NULL DEFAULT 'CARTE_BANCAIRE',
    date_paiement DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('PAYE', 'EN_ATTENTE', 'REMBOURSE') NOT NULL DEFAULT 'PAYE',
    reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_membership FOREIGN KEY (membership_id) REFERENCES membership(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================================
-- DONNÉES DE TEST REALISTES (JEU D'ESSAIS)
-- =============================================================================

-- 1. Salle de sport
INSERT INTO gym (id, nom, adresse, telephone, email, site_web) VALUES
(1, 'Carthage Fitness Club', 'Avenue Habib Bourguiba, Carthage, Tunis', '+216 71 890 123', 'contact@carthagefitness.tn', 'https://carthagefitness.tn');

-- 2. Utilisateurs (Admin, Coaches, Membres)
INSERT INTO user (id, gym_id, nom_complet, email, mot_de_passe, telephone, role, statut) VALUES
(1, 1, 'Amine Trabelsi', 'admin@carthagefitness.tn', 'admin123', '+216 98 100 200', 'ADMIN', 'ACTIF'),
(2, 1, 'Karim Ben Ali', 'karim.coach@carthagefitness.tn', 'coach123', '+216 98 200 300', 'COACH', 'ACTIF'),
(3, 1, 'Sarah Mansour', 'sarah.yoga@carthagefitness.tn', 'coach123', '+216 98 300 400', 'COACH', 'ACTIF'),
(4, 1, 'Walid Gharbi', 'walid.crossfit@carthagefitness.tn', 'coach123', '+216 98 400 500', 'COACH', 'ACTIF'),
(5, 1, 'Yassine Khemir', 'yassine.khemir@gmail.com', 'pass123', '+216 22 111 222', 'MEMBER', 'ACTIF'),
(6, 1, 'Mariem Jaziri', 'mariem.jaziri@gmail.com', 'pass123', '+216 22 333 444', 'MEMBER', 'ACTIF'),
(7, 1, 'Aziz Bouazizi', 'aziz.bouazizi@gmail.com', 'pass123', '+216 22 555 666', 'MEMBER', 'ACTIF'),
(8, 1, 'Nour Chahed', 'nour.chahed@gmail.com', 'pass123', '+216 22 777 888', 'MEMBER', 'ACTIF'),
(9, 1, 'Selim Driss', 'selim.driss@gmail.com', 'pass123', '+216 22 999 000', 'MEMBER', 'ACTIF');

-- 3. Forfaits d'abonnement
INSERT INTO membership_plan (id, gym_id, nom, description, prix, duree_mois, acces_cours_illimite, est_actif) VALUES
(1, 1, 'Pass Mensuel Cardio & Musculation', 'Accès illimité à la salle de musculation et cardio 7j/7', 80.00, 1, FALSE, TRUE),
(2, 1, 'Pass Trimestriel Fitness Total', 'Accès salle + 3 cours collectifs par semaine pendant 3 mois', 220.00, 3, FALSE, TRUE),
(3, 1, 'Pass VIP Annuel Illimité', 'Accès complet 365 jours avec cours collectifs illimités et casier privé', 750.00, 12, TRUE, TRUE);

-- 4. Souscriptions des membres
INSERT INTO membership (id, user_id, plan_id, date_debut, date_fin, statut) VALUES
(1, 5, 3, '2026-01-01', '2026-12-31', 'ACTIVE'),
(2, 6, 2, '2026-09-01', '2026-11-30', 'ACTIVE'),
(3, 7, 1, '2026-10-01', '2026-10-31', 'ACTIVE'),
(4, 8, 3, '2026-03-01', '2027-02-28', 'ACTIVE'),
(5, 9, 1, '2026-10-15', '2026-11-15', 'ACTIVE');

-- 5. Cours collectifs
INSERT INTO fitness_class (id, gym_id, titre, description, capacite_max, duree_minutes, categorie) VALUES
(1, 1, 'Boxe Anglaise & Sparring', 'Perfectionnement technique, endurance cardio et cardio-boxing', 15, 75, 'ARTS_MARTIAUX'),
(2, 1, 'CrossFit WOD Haute Intensité', 'Entraînement fonctionnel intense, force, agilité et conditionnement', 18, 60, 'FORCE'),
(3, 1, 'Vinyasa Power Yoga', 'Alignement postural, respiration guidée, souplesse et renforcement profond', 20, 60, 'BIEN_ETRE'),
(4, 1, 'Spinning Indoor Cycling', 'Parcours en rythme avec musique motivante pour brûler un max de calories', 22, 50, 'CARDIO');

-- 6. Séances programmées (Aujourd'hui et jours à venir)
INSERT INTO class_session (id, class_id, coach_id, salle, date_heure_debut, date_heure_fin, statut) VALUES
(1, 1, 2, 'Dojo & Ring 1', '2026-11-01 18:00:00', '2026-11-01 19:15:00', 'PROGRAMMEE'),
(2, 2, 4, 'Zone WOD Box', '2026-11-01 19:30:00', '2026-11-01 20:30:00', 'PROGRAMMEE'),
(3, 3, 3, 'Studio Zen', '2026-11-02 09:00:00', '2026-11-02 10:00:00', 'PROGRAMMEE'),
(4, 4, 4, 'Studio Vélo Spin', '2026-11-02 18:30:00', '2026-11-02 19:20:00', 'PROGRAMMEE'),
(5, 1, 2, 'Dojo & Ring 1', '2026-11-03 18:00:00', '2026-11-03 19:15:00', 'PROGRAMMEE');

-- 7. Réservations
INSERT INTO booking (id, session_id, member_id, date_reservation, statut) VALUES
(1, 1, 5, '2026-10-30 14:15:00', 'CONFIRMEE'),
(2, 1, 7, '2026-10-30 16:30:00', 'CONFIRMEE'),
(3, 2, 5, '2026-10-30 18:00:00', 'CONFIRMEE'),
(4, 2, 8, '2026-10-31 09:20:00', 'CONFIRMEE'),
(5, 3, 6, '2026-10-31 11:10:00', 'CONFIRMEE'),
(6, 4, 9, '2026-10-31 15:00:00', 'CONFIRMEE');

-- 8. Paiements
INSERT INTO payment (id, user_id, membership_id, montant, mode_paiement, date_paiement, statut, reference) VALUES
(1, 5, 1, 750.00, 'CARTE_BANCAIRE', '2026-01-01 10:00:00', 'PAYE', 'PAY-2026-0001'),
(2, 6, 2, 220.00, 'ESPECES', '2026-09-01 11:30:00', 'PAYE', 'PAY-2026-0089'),
(3, 7, 3, 80.00, 'CARTE_BANCAIRE', '2026-10-01 09:15:00', 'PAYE', 'PAY-2026-0145'),
(4, 8, 4, 750.00, 'VIREMENT', '2026-03-01 16:45:00', 'PAYE', 'PAY-2026-0034'),
(5, 9, 5, 80.00, 'CARTE_BANCAIRE', '2026-10-15 14:20:00', 'PAYE', 'PAY-2026-0167');

-- =============================================================================
-- REQUÊTES DE VÉRIFICATION ET DÉMONSTRATION (Pour le rapport & soutenance)
-- =============================================================================

-- R1: Liste des membres avec le nom de leur forfait actif (Relation JOIN)
-- SELECT u.id, u.nom_complet, u.email, p.nom AS forfait, m.date_debut, m.date_fin 
-- FROM user u 
-- JOIN membership m ON u.id = m.user_id 
-- JOIN membership_plan p ON m.plan_id = p.id 
-- WHERE m.statut = 'ACTIVE';

-- R2: Planning des séances avec nom du cours, du coach et nombre de réservations
-- SELECT s.id, c.titre AS cours, u.nom_complet AS coach, s.salle, s.date_heure_debut,
--        COUNT(b.id) AS inscrits, c.capacite_max AS capacite
-- FROM class_session s
-- JOIN fitness_class c ON s.class_id = c.id
-- JOIN user u ON s.coach_id = u.id
-- LEFT JOIN booking b ON s.id = b.session_id AND b.statut = 'CONFIRMEE'
-- GROUP BY s.id, c.titre, u.nom_complet, s.salle, s.date_heure_debut, c.capacite_max
-- ORDER BY s.date_heure_debut ASC;

-- R3: Chiffre d'affaires total généré par mode de paiement
-- SELECT mode_paiement, COUNT(*) AS nb_transactions, SUM(montant) AS total_recettes 
-- FROM payment 
-- WHERE statut = 'PAYE' 
-- GROUP BY mode_paiement;
