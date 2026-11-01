# Carthage Fitness Club — Projet Fédérateur Full Stack Web

Projet d'application web 3-tiers réalisé dans le cadre du projet fédérateur à l'**École Nationale d'Ingénieurs de Carthage (ENICarthage)**.  
**Encadrement :** Mme. Jihen ABBASSI.

---

## 1. Architecture Générale (3-Tiers)

L'application est construite selon une architecture en 3 tiers stricte, sans Spring Boot, conformément aux directives pédagogiques :

```
[ Tier 1 : Présentation ]
   React 19 + TypeScript + Vite + Tailwind CSS (Port 3000)
         │
         │  HTTP / Requêtes JSON (CORS activé)
         ▼
[ Tier 2 : Traitement Métier ]
   Backend Java Pur (Port 8081 / 8080)
   Serveur HTTP intégré standard (com.sun.net.httpserver.HttpServer)
   + Google Gson + JDBC Direct (PreparedStatement)
         │
         │  JDBC via mysql-connector-j
         ▼
[ Tier 3 : Données ]
   Base de données relationnelle MySQL / MariaDB (Port 3306)
   Schéma 'gym_management'
```

---

## 2. Structure des Packages Backend (`tn.enicarthage.gym`)

```
backend/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── tn/enicarthage/gym/
        │       ├── config/           # DatabaseConnection.java (Connexion JDBC & initialisation SQL)
        │       ├── model/            # Entités (Gym, User, MembershipPlan, Membership, FitnessClass, Session, Booking, Payment)
        │       ├── dao/              # Data Access Objects (Requêtes SQL avec PreparedStatement)
        │       ├── service/          # Logique & règles métier (Capacités, doublons, montants)
        │       ├── controller/       # Contrôleurs recevant les requêtes et transmettant aux services
        │       ├── dto/              # Objets de transfert (MemberRequest, BookingRequest, DashboardStats, etc.)
        │       ├── exception/        # Exceptions personnalisées (ResourceNotFoundException, ValidationException)
        │       ├── router/           # Router.java (Dispatcher universel, gestion des routes, CORS et Gson)
        │       ├── server/           # ApiServer.java (HttpServer standard)
        │       └── Main.java         # Point d'entrée de l'application
        └── resources/
            └── database.sql          # Schéma et jeu de données de test
```

---

## 3. Base de Données (`database.sql`)

Toutes les tables respectent obligatoirement les trois colonnes demandées :
- `id INT AUTO_INCREMENT PRIMARY KEY`
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

### Tables implémentées :
1. `gym` : Informations de la salle de sport.
2. `user` : Administrateurs, Coachs et Membres (avec emails uniques et mots de passe).
3. `membership_plan` : Forfaits d'abonnement (Pass Mensuel, Pass Trimestriel, Pass VIP Annuel).
4. `membership` : Souscriptions d'abonnements des membres avec dates de validité.
5. `fitness_class` : Cours collectifs (Boxe, CrossFit, Yoga, Spinning).
6. `class_session` : Séances programmées avec horaire, salle et coach assigné.
7. `booking` : Réservations de séances par les membres (**Relation N:N** avec contrainte d'unicité `(session_id, member_id)`).
8. `payment` : Règlements comptables (Espèces, Carte Bancaire, Virement).

---

## 4. Endpoints de l'API REST (Tests Postman)

Base URL : `http://localhost:8081/api`

| Méthode | URL | Description | Statut HTTP |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/dashboard` | Statistiques globales (KPIs pour le tableau de bord) | 200 OK |
| **GET** | `/api/gym` | Informations du club | 200 OK |
| **GET** | `/api/members` | Liste des adhérents inscrits avec leur forfait actif | 200 OK |
| **POST** | `/api/members` | Inscription d'un nouvel adhérent (Validation email & nom) | 201 Created |
| **PUT** | `/api/members/{id}` | Modification des coordonnées d'un membre | 200 OK |
| **DELETE** | `/api/members/{id}` | Suppression d'un adhérent | 204 No Content |
| **GET** | `/api/coaches` | Liste des coachs de l'établissement | 200 OK |
| **GET** | `/api/plans` | Liste des formules d'abonnement actives | 200 OK |
| **POST** | `/api/plans` | Création d'un nouveau forfait tarifaire | 201 Created |
| **GET** | `/api/sessions` | Planning complet des séances avec jauge de places | 200 OK |
| **POST** | `/api/sessions` | Programmation d'une nouvelle séance | 201 Created |
| **POST** | `/api/bookings` | Réservation d'une séance (Vérification capacité & doublon) | 201 Created |
| **DELETE** | `/api/bookings/{id}` | Annulation d'une réservation | 204 No Content |
| **GET** | `/api/payments` | Journal comptable des règlements | 200 OK |

---

## 5. Démarrage de l'Application

### Prérequis :
- **MySQL / MariaDB** (via XAMPP) démarré sur le port `3306`.
- **JDK 21** ou supérieur.
- **Node.js** (v20+).

### 1. Démarrer le Backend Java :
```powershell
cd backend
# Soit avec le Jar exécutable généré :
java -jar target/gym-management-1.0-SNAPSHOT.jar

# Soit avec Maven :
mvn exec:java
```

### 2. Démarrer le Frontend React :
```powershell
cd frontend
npm run dev
```
Accéder à l'application web sur : **`http://localhost:3000/`**
