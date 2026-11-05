# 🏛️ Guide Complet pour la Soutenance & Manuel d'Architecture
## Projet Fédérateur : Plateforme Fullstack de Gestion de Salle de Sport — HADID Byrsa
**École Nationale d'Ingénieurs de Carthage (ENICarthage)**  
*Binôme : Aymen Zahmoul (Lead Architect ~65%) & Aziz (Domain & Features Developer ~35%)*

---

> Ce document de référence contient **l'ensemble des explications techniques, des démarches opérationnelles et des réponses aux questions de jury** pour votre évaluation académique.

---

## 📑 Table des Matières
1. [Guide de Démarrage Pas-à-Pas (VS Code & XAMPP)](#1-guide-de-démarrage-pas-à-pas-vs-code--xampp)
2. [Fiche d'Identité & Philosophie Technique](#2-fiche-didentité--philosophie-technique)
3. [Le Voyage d'une Requête : Du Clic React à MySQL](#3-le-voyage-dune-requête--du-clic-react-à-mysql)
4. [Le Backend Java Natif : Couche par Couche](#4-le-backend-java-natif--couche-par-couche)
5. [Le Frontend React 19 : Structure & Services](#5-le-frontend-react-19--structure--services)
6. [Décorticage Exhaustif de Tous les CRUD Métier](#6-décorticage-exhaustif-de-tous-les-crud-métier)
7. [Matrice des Endpoints API & Méthodes HTTP](#7-matrice-des-endpoints-api--méthodes-http)
8. [Schéma Relationnel & Modélisation SQL](#8-schéma-relationnel--modélisation-sql)
9. [Répartition du Travail en Binôme (Rapport d'Activité)](#9-répartition-du-travail-en-binôme-rapport-dactivité)
10. [Scénario Idéal de Démonstration en Soutenance (5 Minutes)](#10-scénario-idéal-de-démonstration-en-soutenance-5-minutes)
11. [Questions-Pièges Probables du Professeur & Réponses Idéales](#11-questions-pièges-probables-du-professeur--réponses-idéales)

---

## 1. Guide de Démarrage Pas-à-Pas (VS Code & XAMPP)

Voici la procédure rigoureuse pour lancer le projet lors de la présentation. **L'ordre d'allumage est crucial** : la base de données doit démarrer en premier, puis le backend Java, et enfin le frontend React.

```
       +-------------------+
       | Étape 1 : XAMPP   | -> Démarre MySQL (Port 3306)
       +---------+---------+
                 │
                 ▼
       +-------------------+
       | Étape 2 : Backend | -> Démarre Java Native HttpServer (Port 8080 ou 8081)
       +---------+---------+
                 │
                 ▼
       +-------------------+
       | Étape 3 : Frontend| -> Démarre Vite / React 19 (Port 3000)
       +-------------------+
```

---

### Étape 1 : Démarrer MySQL via le Panneau de Contrôle XAMPP
1. Ouvrez l'application **XAMPP Control Panel**.
2. Sur la ligne **MySQL**, cliquez sur le bouton **Start**.
3. Le libellé MySQL passe au vert avec le port **3306**.
4. *(Vérification facultative)* : Ouvrez votre navigateur sur `http://localhost/phpmyadmin` pour vérifier que la base de données `gym_management` existe bien. Si ce n'est pas fait, importez le fichier `backend/src/main/resources/database.sql`.

> **Alternative en ligne de commande (si XAMPP n'a pas d'interface ouverte) :**
> ```powershell
> & "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --console
> ```

---

### Étape 2 : Démarrer le Backend Java dans VS Code
1. Ouvrez le dossier `gym_fullstack` dans **Visual Studio Code**.
2. Ouvrez un premier terminal intégré (**Terminal > New Terminal** ou `Ctrl + ~`).
3. Positionnez-vous dans le sous-dossier `backend` :
   ```powershell
   cd backend
   ```
4. Lancez le serveur Java via le JAR exécutable pré-compilé :
   ```powershell
   & "C:\Program Files\Java\jdk-21.0.12.1\bin\java.exe" -jar "target\gym-management-1.0-SNAPSHOT.jar"
   ```
   *(Si Java 21 est dans votre PATH Windows standard, la commande simple suffit : `java -jar target/gym-management-1.0-SNAPSHOT.jar`)*.
5. **Sortie attendue dans la console :**
   ```text
   ======================================================
     ENICarthage - Projet Full Stack Web : Gym Management
     Serveur Java pur (HttpServer standard + JDBC + MySQL)
   ======================================================
   [MySQL] Connexion reussie a la base 'gym_management'.
   [Serveur HTTP] Demarre avec succes sur http://localhost:8080
   ------------------------------------------------------
   Pret a recevoir les requetes de Postman ou React !
   ```
   *(Le terminal reste actif et écoute les requêtes HTTP).*

---

### Étape 3 : Démarrer le Frontend React dans VS Code
1. Dans VS Code, ouvrez un **deuxième terminal** (cliquez sur le petit bouton **`+`** à droite de la barre des terminaux).
2. Positionnez-vous dans le sous-dossier `frontend` :
   ```powershell
   cd frontend
   ```
3. Lancez le serveur de développement Vite :
   ```powershell
   npm run dev
   ```
4. **Sortie attendue dans la console :**
   ```text
     VITE v8.3.5  ready in 950 ms

     ➜  Local:   http://localhost:3000/
     ➜  Network: use --host to expose
     ➜  press h + enter to show help
   ```

---

### Étape 4 : Ouvrir l'Application
Ouvrez votre navigateur web (Google Chrome, Edge ou Firefox) et naviguez sur :
👉 **`http://localhost:3000`**

L'écran d'accueil **HADID Byrsa Sanctuary** s'affiche immédiatement.

---

### 🛑 Comment arrêter proprement le projet ?
* Dans le terminal Frontend de VS Code : appuyez sur `Ctrl + C` puis tapez `O` (Oui).
* Dans le terminal Backend de VS Code : appuyez sur `Ctrl + C`.
* Dans le panneau XAMPP : cliquez sur le bouton **Stop** de MySQL.

---

## 2. Fiche d'Identité & Philosophie Technique

| Propriété | Choix Technique | Justification Ingénieur |
| :--- | :--- | :--- |
| **Backend** | Java 21 LTS pur (*Native `com.sun.net.httpserver.HttpServer`*) | **Zéro Spring Boot** : Maîtrise totale des sockets HTTP, démarrage instantané (<150ms), empreinte mémoire minimale (<40Mo), compréhension pédagogique intime du protocole sans "magie noire" d'annotations. |
| **Persistance** | MySQL 8 / MariaDB via **JDBC Natif** | Pilote officiel `mysql-connector-j`. Écriture manuelle du SQL avec requêtes préparées `PreparedStatement`. |
| **Design Pattern Données** | **DAO** (*Data Access Object*) | Isolation complète du SQL dans une couche dédiée. Si on change de SGBD, la logique métier reste intacte. |
| **Sérialisation JSON** | Google Gson 2.11.0 | Parsing et conversion Java $\leftrightarrow$ JSON avec adaptateurs typés pour `LocalDate` et `LocalDateTime`. |
| **Frontend** | React 19 + TypeScript + Vite 8 | Single Page Application (SPA) ultra-rapide, typage statique strict, zéro rechargement de page. |
| **Style & UI** | Tailwind CSS + Framer Motion | Design System industriel de luxe sur-mesure (HADID Bronze `#B07845`, Deep Black `#101010`, Charcoal `#191919`). |
| **Ports Réseau** | Frontend : `3000` • Backend : `8080` (ou `8081`) • MySQL : `3306` | Découpage net et standard des responsabilités réseau. |

---

## 3. Le Voyage d'une Requête : Du Clic React à MySQL

Voici le parcours précis, milliseconde par milliseconde, d'une action utilisateur sur la plateforme :

```
[ ÉCRAN REACT ] L'utilisateur clique sur "Valider la réservation" dans le navigateur
       │
       ▼
1. COMPOSANT REACT (ScheduleView.tsx)
   ↳ Capture l'événement, valide les données saisies localement (ex: ID séance, ID membre)
   ↳ Appelle la méthode asynchrone du service API : api.createBooking(sessionId, memberId)
       │
       ▼
2. SERVICE FRONTEND (frontend/src/services/api.ts)
   ↳ Prépare la requête HTTP native fetch()
   ↳ Sérialise le corps en JSON : JSON.stringify({ sessionId: 4, memberId: 5 })
   ↳ Émet : POST http://localhost:8080/api/bookings (Header: Content-Type: application/json)
       │
       ▼ [ Transit Réseau TCP / HTTP ]
       │
3. SERVEUR HTTP JAVA (ApiServer.java)
   ↳ Le serveur natif HttpServer réceptionne le flux réseau sur le port 8080
   ↳ Encapsule la connexion dans un objet standard com.sun.net.httpserver.HttpExchange
   ↳ Délègue immédiatement au Router central
       │
       ▼
4. ROUTEUR CENTRAL & GESTION CORS (Router.java)
   ↳ Injecte les en-têtes Access-Control-Allow-Origin: * et gère les requêtes préliminaires OPTIONS
   ↳ Découpe l'URI en segments : ["api", "bookings"]
   ↳ Lit le flux binaire InputStream du corps et le convertit en chaîne UTF-8
   ↳ Désérialise le JSON via Gson vers le DTO : BookingRequest.class
   ↳ Aiguille vers le bon Contrôleur : bookingController.creer(req)
       │
       ▼
5. CONTRÔLEUR HTTP (BookingController.java)
   ↳ Reçoit le DTO validé, fait le lien étanche entre le transport réseau et la logique métier
   ↳ Appelle la couche Service : bookingService.createBooking(req.sessionId(), req.memberId())
       │
       ▼
6. COUCHE SERVICE MÉTIER (BookingService.java)
   ↳ CERVEAU DÉCISIONNEL :
     - Vérifie que l'adhérent existe et que son adhésion est bien "ACTIVE"
     - Vérifie que la séance existe et n'est pas "ANNULEE"
     - Vérifie que la capacité maximale de la séance n'est pas atteinte
     - Vérifie que l'adhérent n'a pas DÉJÀ réservé cette même séance (anti-doublon)
   ↳ Si tout est valide, prépare l'objet Model Booking et sollicite le DAO
       │
       ▼
7. COUCHE DAO / PERSISTANCE (BookingDAO.java)
   ↳ Demande une connexion au pool/singleton : DatabaseConnection.getConnection()
   ↳ Prépare le PreparedStatement SQL :
     "INSERT INTO booking (session_id, user_id, statut) VALUES (?, ?, 'CONFIRMEE')"
   ↳ Injecte les variables typées : stmt.setInt(1, sessionId); stmt.setInt(2, memberId);
   ↳ Exécute : stmt.executeUpdate()
   ↳ Récupère la clé primaire générée (getGeneratedKeys)
   ↳ Exécute un SELECT pour re-mapper la ligne créée via mapRow(ResultSet rs)
       │
       ▼
8. BASE DE DONNÉES MYSQL (Table booking)
   ↳ Insère la ligne physiquement sur le disque
   ↳ Vérifie les contraintes de clés étrangères (fk_booking_session, fk_booking_user)
       │
       ▼ [ Remontée de la Réponse ]
Le DAO renvoie le Model Java -> Le Service l'enrichit -> Le Contrôleur le transmet -> Le Router le sérialise en JSON via Gson (Code HTTP 201 Created) -> fetch() résout la Promesse dans React -> Le state React est mis à jour -> L'interface affiche immédiatement "Place réservée avec succès !".
```

---

## 4. Le Backend Java Natif : Couche par Couche

L'arborescence backend respecte l'orthodoxie du génie logiciel : **chaque couche n'a de visibilité que sur la couche immédiatement inférieure.**

```
backend/src/main/java/tn/enicarthage/gym/
├── config/                  <-- Connexion BDD JDBC & Initialisation SQL
│   └── DatabaseConnection.java
├── dao/                     <-- Requêtes SQL directes & mapping ResultSet -> POJO
│   ├── UserDAO.java
│   ├── SessionDAO.java
│   ├── SchedulingRequestDAO.java
│   ├── CoachCollaborationRequestDAO.java
│   ├── MembershipDAO.java
│   ├── MembershipPlanDAO.java
│   ├── BookingDAO.java
│   ├── PaymentDAO.java
│   ├── FitnessClassDAO.java
│   └── GymDAO.java
├── model/                   <-- Entités calquées sur les tables physiques SQL
│   ├── User.java, ClassSession.java, SchedulingRequest.java, ...
├── dto/                     <-- Contrats réseau JSON (échanges API sans fuite d'infos sensibles)
│   ├── LoginRequest.java, CoachRegisterRequest.java, BookingRequest.java, DashboardStats.java, ...
├── service/                 <-- Logique métier, validations, calculs, transactions
│   ├── UserService.java, SchedulingRequestService.java, CoachCollaborationService.java, ...
├── controller/              <-- Dispatchers et passe-plats entre Router et Service
│   ├── UserController.java, SchedulingRequestController.java, ...
├── router/                  <-- Cerveau réseau : extraction URLs, parsing segments, CORS, JSON
│   └── Router.java
├── server/                  <-- Point d'ancrage HTTP (HttpServer standard)
│   └── ApiServer.java
└── Main.java                <-- Point d'entrée de l'application (Démarrage)
```

---

### 4.1. `DatabaseConnection.java` : Le Pattern Singleton JDBC
* **Localisation** : `backend/src/main/java/tn/enicarthage/gym/config/DatabaseConnection.java`
* **Pourquoi un Singleton ?**  
  Pour centraliser en un point unique l'URL JDBC, le driver MySQL (`com.mysql.cj.jdbc.Driver`), l'utilisateur (`root`) et le mot de passe (`""`).
* **Bonne pratique clé appliquée** :  
  Chaque DAO invoque `DatabaseConnection.getConnection()` dans un bloc `try-with-resources` :
  ```java
  try (Connection conn = DatabaseConnection.getConnection();
       PreparedStatement stmt = conn.prepareStatement(sql)) {
      // Exécution...
  } // conn et stmt sont fermés automatiquement ici, même en cas d'exception !
  ```
  Cela évite le problème classique des fuites de connexion (*Connection leak*).

---

### 4.2. Couche DAO (Data Access Object)
* **Localisation** : `backend/src/main/java/tn/enicarthage/gym/dao/`
* **Règle absolue** : **C'est la SEULE couche de tout le projet qui contient du SQL.** Ni le Controller, ni le Service, ni le Router n'ont le droit de savoir si la base est MySQL, Oracle ou SQLite.
* **Le Pattern Mapper (`mapRow`)** :
  Chaque DAO possède une méthode privée `mapRow(ResultSet rs)` qui transforme les colonnes SQL en attributs de l'objet Java :
  ```java
  private User mapRow(ResultSet rs) throws SQLException {
      User u = new User();
      u.setId(rs.getInt("id"));
      u.setNomComplet(rs.getString("nom_complet"));
      u.setEmail(rs.getString("email"));
      u.setRole(rs.getString("role"));
      u.setStatut(rs.getString("statut"));
      return u;
  }
  ```

---

### 4.3. Modèles (`model/`) vs DTOs (`dto/`) : La Différence Fondamentale
1. **Modèle (`model/`)** :
   * Reflet fidèle d'une **table en base de données**.
   * Exemple : `User.java` possède l'attribut `motDePasse`.
2. **DTO (`dto/` - Data Transfer Object)** :
   * Contrat d'échange réseau taillé sur-mesure pour une requête ou une réponse API.
   * **Sécurité** : `MemberResponse` ne renvoie JAMAIS le mot de passe sur le réseau.
   * **Agrégation** : `DashboardStats.java` regroupe en un seul objet des compteurs provenant de 5 tables différentes (adhérents actifs, séances du jour, CA mensuel, etc.).

---

### 4.4. Couche Service : Le Cœur Décisionnel
* **Localisation** : `backend/src/main/java/tn/enicarthage/gym/service/`
* **Rôle** : Elle applique les règles de gestion du club :
  * **Moteur anti-conflits** : Vérifie que deux cours ne sont pas réservés dans la même salle au même horaire avec le même coach.
  * **Génération automatique de séances** : Lors de l'approbation d'une demande de coach pour des créneaux récurrents (ex : tous les lundis et vendredis de novembre de 18h à 19h30), le service calcule dynamiquement toutes les dates de la période et insère en bloc les séances dans la table `class_session`.
  * **Transactions atomiques** : Utilisation de `conn.setAutoCommit(false)` pour créer simultanément l'adhésion (`membership`) et le règlement (`payment`). En cas d'erreur sur le paiement, `conn.rollback()` annule la création de l'adhésion.

---

### 4.5. `Router.java` : Le Répartiteur HTTP sans Framework
Dans Spring Boot, on utilise `@RestController`, `@GetMapping`, `@PostMapping`.  
Sans Spring Boot, c'est `Router.java` qui accomplit cette tâche :
1. **Extraction de la méthode** : `exchange.getRequestMethod()` (`GET`, `POST`, `PUT`, `DELETE`).
2. **Découpage de l'URL** : Découpe le chemin en segments (ex: `/api/members/5` $\rightarrow$ `["api", "members", "5"]`).
3. **Sécurité CORS** : Intercepte les requêtes pré-vol `OPTIONS` et ajoute les en-têtes nécessaires pour autoriser le frontend Vite.
4. **Désérialisation / Sérialisation** : Utilise Google Gson avec des TypeAdapters personnalisés pour convertir automatiquement les dates `LocalDate` et `LocalDateTime` en chaînes ISO-8601.

---

## 5. Le Frontend React 19 : Structure & Services

```
frontend/src/
├── types/index.ts           <-- Interfaces TypeScript strictement calquées sur les DTOs et Modèles
├── services/api.ts          <-- Tous les appels fetch() centralisés avec basculement automatique de port
├── components/
│   ├── LandingPageView.tsx  <-- Landing Page publique industrielle de luxe HADID (Deep Black & Bronze)
│   ├── Navbar.tsx           <-- Navigation adaptative basée sur le rôle de l'utilisateur (ADMIN / COACH / MEMBER)
│   ├── DashboardView.tsx    <-- Supervision Admin (KPIs dynamiques, alertes recouvrement impayés)
│   ├── ScheduleView.tsx     <-- Calendrier central studio (Mois, Semaine, Jour) + Demandes coachs
│   ├── RequestsManagementView.tsx <-- Hub Administrateur de validation des demandes (créneaux & affiliation coachs)
│   ├── MembersView.tsx      <-- Gestionnaire d'adhérents (recherche, filtres, inscriptions manuelles)
│   ├── MemberSpaceView.tsx  <-- Espace personnel adhérent (Pass Digital QR, renouvellement d'abonnement en ligne)
│   ├── CoachesCatalogueView.tsx <-- Annuaire des coachs certifiés
│   ├── LedgerView.tsx       <-- Livre de caisse et audit comptable des paiements
│   └── PlansView.tsx        <-- Grille tarifaire des formules d'entraînement
└── App.tsx                  <-- Orchestrateur d'état racine (utilisateur connecté, onglet actif, modales)
```

---

## 6. Décorticage Exhaustif de Tous les CRUD Métier

Le sigle **CRUD** désigne les 4 opérations fondamentales de persistance :
* **C** = Create (Création / Insertion) $\rightarrow$ Méthode HTTP `POST`
* **R** = Read (Lecture / Consultation) $\rightarrow$ Méthode HTTP `GET`
* **U** = Update (Mise à jour / Modification) $\rightarrow$ Méthode HTTP `PUT` ou `PATCH`
* **D** = Delete (Suppression) $\rightarrow$ Méthode HTTP `DELETE`

Voici comment chacune de ces opérations est codée, couche par couche, sur toutes les entités du projet :

---

### 6.1. CRUD Adhérents (`Member` / Table `user` avec rôle `MEMBER`)

```
+-----------+--------------------+---------------------------------------------------------------+
| Opération | HTTP Endpoint      | Implémentation SQL & Java                                     |
+-----------+--------------------+---------------------------------------------------------------+
| CREATE    | POST /api/members  | INSERT INTO user (gym_id, nom_complet, email, mot_de_passe,   |
|           |                    | telephone, role, statut) VALUES (?, ?, ?, ?, ?, 'MEMBER', ?)  |
| READ (All)| GET /api/members   | SELECT * FROM user WHERE role = 'MEMBER' ORDER BY id DESC     |
| READ (One)| GET /api/members/5 | SELECT * FROM user WHERE id = ? AND role = 'MEMBER'           |
| UPDATE    | PUT /api/members/5 | UPDATE user SET nom_complet=?, telephone=?, statut=? WHERE id=?|
| DELETE    | DELETE /api/members| DELETE FROM user WHERE id = ?                                 |
+-----------+--------------------+---------------------------------------------------------------+
```

* **Côté DAO (`UserDAO.java`)** :
  Lors de la création (`create`), on utilise le flag `Statement.RETURN_GENERATED_KEYS` pour récupérer l'ID auto-incrémenté généré par MySQL et renvoyer l'objet complet au frontend.
* **Côté Service (`UserService.java`)** :
  Vérifie que l'email n'est pas déjà utilisé (`findByEmail`) avant d'autoriser l'insertion.

---

### 6.2. CRUD Séances du Calendrier (Table `class_session`)

* **CREATE (`POST /api/sessions`)** :
  * Deux modes de création coexistent dans l'application :
    1. **Création directe** : L'administrateur crée une séance ponctuelle sur le planning.
    2. **Création automatique par lot** : Quand l'administrateur valide une demande récurrente d'un coach, `SchedulingRequestService` calcule chaque date correspondante et insère automatiquement les séances associées dans la table `class_session`.
* **READ (`GET /api/sessions`)** :
  * Exécute une jointure SQL (`JOIN fitness_class`, `JOIN user`) pour récupérer en une seule requête le titre du cours, la catégorie, le nom du coach et le nombre de réservations en cours :
  ```sql
  SELECT s.*, c.titre, c.categorie, u.nom_complet AS coach_nom,
         COUNT(b.id) AS total_bookings
  FROM class_session s
  JOIN fitness_class c ON s.class_id = c.id
  JOIN user u ON s.coach_id = u.id
  LEFT JOIN booking b ON s.id = b.session_id AND b.statut = 'CONFIRMEE'
  GROUP BY s.id
  ```
* **UPDATE / CANCEL (`PUT /api/sessions/{id}`)** :
  * Permet de marquer une séance comme `ANNULEE` ou de changer d'horaire/salle.
* **DELETE (`DELETE /api/sessions/{id}`)** :
  * Supprime la séance, avec suppression en cascade des réservations membres associées grâce à la contrainte SQL `ON DELETE CASCADE`.

---

### 6.3. CRUD Demandes de Créneaux Coach (Table `scheduling_request`)

1. **CREATE (`POST /api/scheduling-requests`)** :
   * Le coach remplit le formulaire de demande récurrente (ex : Boxe, lundis et vendredis, 17h-19h, du 1er au 30 novembre).
   * Le serveur persiste la demande avec le statut **`PENDING`**. La séance **n'apparaît pas encore** dans le calendrier officiel des membres.
2. **READ (`GET /api/scheduling-requests` & `/coach/{id}`)** :
   * L'Admin visualise toutes les demandes en attente.
   * Le coach ne voit que ses propres demandes grâce à l'endpoint dédié `/api/scheduling-requests/coach/{id}`.
3. **UPDATE : Approbation ou Rejet (`POST /api/scheduling-requests/{id}/approve` ou `/reject`)** :
   * **Si Approuvée** : Le statut passe à `APPROVED`. Le service génère immédiatement toutes les séances dans le calendrier officiel.
   * **Si Rejetée** : Le statut passe à `REJECTED` et le motif du refus saisi par l'administrateur est enregistré dans la colonne `motif_rejet`.

---

### 6.4. CRUD Réservations Membres (Table `booking`)

* **CREATE (`POST /api/bookings`)** :
  * Un adhérent réserve sa place à une séance. Le service vérifie que la capacité maximale (`capacite_max`) n'est pas dépassée.
* **READ (`GET /api/bookings`)** :
  * Historique des réservations d'un adhérent ou liste des participants d'un cours pour le coach.
* **DELETE (`DELETE /api/bookings/{id}`)** :
  * Annulation d'une réservation, libérant immédiatement la place pour les autres adhérents.

---

### 6.5. CRUD Abonnements & Paiements (Tables `membership` & `payment`)

* **CREATE Atomique (Transactionnelle)** :
  * Quand un adhérent souscrit ou renouvelle son pass en ligne (`POST /api/memberships`), le service exécute les deux insertions sous une **transaction unique** :
  ```java
  conn.setAutoCommit(false);
  try {
      // 1. Insertion dans 'membership'
      // 2. Insertion du reçu dans 'payment'
      conn.commit(); // Tout est validé ensemble
  } catch (Exception e) {
      conn.rollback(); // Annulation totale si un seul ordre échoue !
  }
  ```
* **READ (`GET /api/payments`)** :
  * Alimente le **Livre de Caisse** de l'administrateur avec le total des encaissements, le détail par mode de règlement (Espèces, Carte, Virement) et le statut.

---

## 7. Matrice des Endpoints API & Méthodes HTTP

| Verbe HTTP | Endpoint API | Contrôleur Associé | Rôle Autorisé | Action Métier |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `UserController` | Tous | Authentification par email / mot de passe |
| `GET` | `/api/dashboard` | `DashboardController` | `ADMIN` | Statistiques globales, KPIs et alertes impayés |
| `GET` | `/api/members` | `MemberController` | `ADMIN`, `COACH` | Liste de tous les adhérents de la salle |
| `POST` | `/api/members` | `MemberController` | `ADMIN` | Inscription manuelle d'un adhérent |
| `DELETE` | `/api/members/{id}` | `MemberController` | `ADMIN` | Radiation / suppression d'un adhérent |
| `GET` | `/api/sessions` | `SessionController` | Tous | Liste des séances du calendrier officiel |
| `POST` | `/api/sessions` | `SessionController` | `ADMIN` | Création directe d'une séance |
| `GET` | `/api/scheduling-requests` | `SchedulingRequestController` | `ADMIN` | Liste toutes les demandes de créneaux |
| `GET` | `/api/scheduling-requests/coach/{id}` | `SchedulingRequestController` | `COACH`, `ADMIN` | Demandes propres à un coach connecté |
| `POST` | `/api/scheduling-requests` | `SchedulingRequestController` | `COACH` | Soumission d'une demande de créneau récurrent |
| `POST` | `/api/scheduling-requests/{id}/approve` | `SchedulingRequestController` | `ADMIN` | Validation de la demande et génération des cours |
| `POST` | `/api/scheduling-requests/{id}/reject` | `SchedulingRequestController` | `ADMIN` | Refus de la demande avec motif obligatoire |
| `POST` | `/api/coach-collaborations` | `CoachCollaborationController` | Public | Dépôt de candidature d'un coach |
| `GET` | `/api/coach-collaborations` | `CoachCollaborationController` | `ADMIN` | Liste des demandes d'affiliation coachs |
| `POST` | `/api/coach-collaborations/{id}/approve` | `CoachCollaborationController` | `ADMIN` | Approbation et activation officielle du coach |
| `POST` | `/api/bookings` | `BookingController` | `MEMBER` | Réservation d'une place à une séance |
| `DELETE` | `/api/bookings/{id}` | `BookingController` | `MEMBER` | Annulation d'une réservation |
| `POST` | `/api/memberships` | `MembershipController` | `MEMBER` | Achat/renouvellement de pass en ligne sécurisé |
| `GET` | `/api/plans` | `MembershipPlanController` | Tous | Grille tarifaire des abonnements |
| `GET` | `/api/payments` | `PaymentController` | `ADMIN` | Grand livre de caisse et audit des paiements |

---

## 8. Schéma Relationnel & Modélisation SQL

Toutes les relations sont protégées par des contraintes d'intégrité référentielle :

```
+-------------------+
|        gym        | (Salle de sport racine : ID 1 = Carthage Fitness / Byrsa)
+---------+---------+
          | 1
          |
          | *
+---------+---------+        1      * +-------------------------------+
|       user        |----------------<|   coach_collaboration_request   |
| (ADMIN/COACH/MBR) |                 +-------------------------------+
+---------+---------+
          | 1
          |
          +-----------------------------+
          | 1                           | 1
          | *                           | *
+---------+---------+         +---------+---------+
| scheduling_request|         |    membership     |
+-------------------+         +----+---------+----+
                                   | *       | 1
                                   | 1       | *
                     +-------------+--+    +-+-------------+
                     | membership_plan|    |    payment    |
                     +----------------+    +---------------+

          | 1 (coach_id)
          | *
+---------+---------+         1      * +-------------------+
|   class_session   |-----------------<|      booking      |
+-------------------+ (séances générées)+-------------------+
```

---

## 9. Répartition du Travail en Binôme (Rapport d'Activité)

Pour respecter les standards d'évaluation académique de l'ENICarthage, le projet a fait l'objet d'une division nette et complémentaire des responsabilités :

```
+---------------------------------------------------------------------------------------+
|                       RÉPARTITION DU TRAVAIL & DIVISION DU TRAVAIL                    |
+-------------------------------------------+-------------------------------------------+
|      AYMEN ZAHMOUL (Lead Architect ~65%)  |     AZIZ (Domain & Features ~35%)         |
+-------------------------------------------+-------------------------------------------+
| • Conception de l'architecture N-Tiers    | • Modélisation de la base SQL database.sql|
| • Serveur HTTP natif & Router central     | • Implémentation des classes DAO (JDBC)   |
| • Moteur de routage d'URL & sécurité CORS | • Contrôleurs CRUD (Coaches, Classes)     |
| • Services métier & Moteur anti-conflits  | • Vues Fichier Adhérents (MembersView)    |
| • Transactions atomiques JDBC             | • Vue Annuaire Coachs (CoachesCatalogue)  |
| • Design System HADID (Palette & Fonts)   | • Grille tarifaire des formules (PlansView)|
| • Responsive Navbar & Landing Page de luxe| • Filtres de recherche et exports de listes|
| • Coordination Git & validation des builds| • Recette et tests unitaires d'intégration |
+-------------------------------------------+-------------------------------------------+
```

---

## 10. Scénario Idéal de Démonstration en Soutenance (5 Minutes)

Pour captiver votre professeur, suivez ce fil conducteur fluide et chronométré :

1. **Minute 1 : La Landing Page Publique (Vitrine Industrielle)**
   * Montrez la page d'accueil `http://localhost:3000`.
   * Expliquez l'identité de marque HADID : palette stricte de luxe industriel (`#101010` Deep Black, `#191919` Charcoal, `#B07845` Bronze, `#A8A9AD` Silver).
   * Faites défiler : montrez la fluidité des effets de défilement (*Smooth Scroll*), les cartes écosystème à 3 volets (Gym Owners, Coaches, Members) et la barre de navigation dynamique qui s'assombrit.
2. **Minute 2 : L'Espace Administrateur (Supervision & Contrôle)**
   * Cliquez sur *Login*, utilisez le bouton de remplissage rapide **ADMIN** (`admin@carthagefitness.tn`).
   * Montrez le **Tableau de Bord** avec les KPIs calculés en temps réel et l'alerte sur les impayés.
   * Allez dans l'onglet **Demandes** pour montrer les candidatures de coachs et les demandes de créneaux en attente.
3. **Minute 3 : L'Espace Coach (Demande de Créneaux Récurrents)**
   * Déconnectez-vous et connectez-vous en **COACH** (`karim.coach@carthagefitness.tn`).
   * Allez dans le **Planning**. Montrez le calendrier central avec les vues Mois / Semaine / Jour.
   * Cliquez sur **« Demander un créneau »** : soumettez une demande récurrente (ex : Boxe, lundis et mercredis 18h-19h30).
   * Montrez que la demande est enregistrée avec le statut `PENDING` et n'apparaît pas encore comme un cours validé.
4. **Minute 4 : L'Approbation Admin & la Génération Automatique**
   * Reconnectez-vous en **ADMIN**.
   * Ouvrez l'onglet **Demandes**, visualisez la demande du coach Karim Ben Ali.
   * Cliquez sur **« Approuver »** : expliquez au professeur que le Service Java vient de générer automatiquement toutes les séances récurrentes dans `class_session` sans conflit.
   * Retournez dans le calendrier : les cours apparaissent maintenant en vert/bronze !
5. **Minute 5 : L'Espace Membre & l'Architecture de Code**
   * Connectez-vous en **MEMBER** (`yassine.khemir@gmail.com`).
   * Montrez son Pass Actif avec son QR Code, réservez une séance sur le planning.
   * Ouvrez VS Code pour montrer rapidement au professeur l'organisation propre des packages : `dao`, `service`, `router`, `controller`.

---

## 11. Questions-Pièges Probables du Professeur & Réponses Idéales

### Q1 : « Pourquoi ne pas avoir utilisé Spring Boot ? Est-ce que ce n'est pas réinventer la roue ? »
> **Réponse d'ingénieur :**  
> *« L'objectif pédagogique de ce projet fédérateur était de comprendre en profondeur les mécanismes sous-jacents d'un serveur web et du protocole HTTP. Utiliser Spring Boot aurait masqué cette complexité derrière des annotations magiques comme `@RestController` ou `@Autowired`.  
> En implémentant notre propre `HttpServer` natif Java 21 et notre propre `Router`, nous démontrons que nous maîtrisons la gestion des sockets, les threads, le cycle de vie des connexions TCP, la sécurité CORS et la désérialisation JSON via Gson. De plus, notre backend démarre en 120 millisecondes et consomme moins de 40 Mo de RAM, contre plusieurs secondes et 500 Mo pour une application Spring Boot standard. »*

---

### Q2 : « Quelle est la différence entre un `Statement` et un `PreparedStatement` ? »
> **Réponse technique :**  
> *« Un `Statement` exécute du SQL statique en concaténant des chaînes, ce qui ouvre la porte aux failles critiques d'**injections SQL** (`' OR 1=1 --`).  
> Un `PreparedStatement` pré-compile la requête côté moteur de base de données et utilise des paramètres typés (`?`). Les données utilisateur sont transmises comme valeurs littérales, rendant toute injection SQL mathématiquement impossible. De plus, le moteur SQL met en cache le plan d'exécution, ce qui améliore sensiblement les performances lors d'appels répétés. »*

---

### Q3 : « Pourquoi avez-vous séparé la couche DAO de la couche Service ? »
> **Réponse architecturale :**  
> *« C'est le principe fondamental de **séparation des responsabilités (Single Responsibility Principle)**.  
> Le DAO n'a qu'un seul rôle : parler à la base de données via le dialecte SQL et mapper le `ResultSet`. Il ne contient aucune règle métier.  
> Le Service ne contient aucun SQL : il applique les règles de gestion (par exemple : vérifier si un cours chevauche un créneau existant, ou vérifier si l'adhésion est valide).  
> Grâce à ce découplage, si demain l'entreprise décide de passer de MySQL à PostgreSQL ou à une base cloud, nous n'avons qu'à modifier les DAOs. Les milliers de lignes de logique métier des Services restent strictement intactes. »*

---

### Q4 : « Comment garantissez-vous qu'un paiement et une adhésion ne se désynchronisent pas en cas de panne réseau ? »
> **Réponse sécurité & données :**  
> *« Grâce aux **transactions atomiques JDBC**. Dans `MembershipService.java`, nous désactivons le mode par défaut avec `conn.setAutoCommit(false)`. Nous insérons d'abord la ligne d'adhésion, puis le reçu comptable dans la table `payment`. Si l'une des deux opérations échoue, le bloc `catch` déclenche immédiatement `conn.rollback()`. La base revient à son état initial strict : aucun adhérent ne peut bénéficier d'un pass actif sans paiement enregistré dans le grand livre. »*

---

### Q5 : « Comment gérez-vous le problème des CORS entre le frontend sur le port 3000 et le backend sur le port 8080 ? »
> **Réponse réseau :**  
> *« Le navigateur applique la Same-Origin Policy. Lorsque React (port 3000) envoie une requête vers le backend (port 8080), le navigateur émet d'abord une requête pré-vol `OPTIONS`.  
> Dans notre `Router.java`, nous interceptons toutes les requêtes entrantes pour leur injecter les en-têtes HTTP de sécurité : `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS` et `Access-Control-Allow-Headers: Content-Type, Authorization`. Pour les requêtes `OPTIONS`, le routeur renvoie immédiatement un code 204 No Content, ce qui autorise le navigateur à émettre la vraie requête métier. »*

---

### 12. Comptes de Test Rapides

| Rôle | Email | Mot de passe | Permissions & Périmètre |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@carthagefitness.tn` | `admin123` | Supervision complète, validation demandes créneaux/coachs, caisse, membres |
| **COACH** | `karim.coach@carthagefitness.tn` | `coach123` | Consultation planning studio, soumission de demandes de cours récurrents |
| **MEMBER** | `yassine.khemir@gmail.com` | `pass123` | Pass actif, réservation de places au calendrier, renouvellement en ligne |
| **CANDIDAT** | *(Formulaire public)* | *(Libre)* | Soumission de candidature coach $\rightarrow$ compte inactif jusqu'à validation Admin |
