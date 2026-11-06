package tn.enicarthage.gym;

import tn.enicarthage.gym.config.DatabaseConnection;

import java.io.IOException;
import java.sql.Connection;

public class Main {

    public static void main(String[] args) {
        System.out.println("======================================================");
        System.out.println("  ENICarthage - Projet Full Stack Web : Gym Management");
        System.out.println("  Serveur Java pur (HttpServer standard + JDBC + MySQL)");
        System.out.println("======================================================");

        if (!testerConnexion()) {
            System.err.println("[Erreur] Impossible de se connecter a MySQL.");
            System.err.println("Verifiez que XAMPP / MariaDB est demarre sur le port 3306");
            System.err.println("et que le script database.sql a ete execute.");
            return;
        }

        int port = 8080;
        ApiServer serveur = null;
        try {
            serveur = new ApiServer(port);
        } catch (IOException e) {
            System.out.println("[Info] Port " + port + " indisponible, bascule automatique sur le port 8081...");
            port = 8081;
            try {
                serveur = new ApiServer(port);
            } catch (IOException ex) {
                System.err.println("[Erreur] Impossible de demarrer le serveur HTTP : " + ex.getMessage());
                return;
            }
        }

        serveur.demarrer();
        System.out.println("[Serveur HTTP] Demarre avec succes sur http://localhost:" + port);
        System.out.println("[Routes Principales]");
        System.out.println("  -> GET    http://localhost:" + port + "/api/dashboard");
        System.out.println("  -> GET    http://localhost:" + port + "/api/gym");
        System.out.println("  -> GET    http://localhost:" + port + "/api/members");
        System.out.println("  -> POST   http://localhost:" + port + "/api/members");
        System.out.println("  -> GET    http://localhost:" + port + "/api/coaches");
        System.out.println("  -> GET    http://localhost:" + port + "/api/plans");
        System.out.println("  -> GET    http://localhost:" + port + "/api/sessions");
        System.out.println("  -> POST   http://localhost:" + port + "/api/bookings");
        System.out.println("  -> GET    http://localhost:" + port + "/api/payments");
        System.out.println("------------------------------------------------------");
        System.out.println("Pret a recevoir les requetes de Postman ou React !");
    }

    private static boolean testerConnexion() {
        try (Connection connection = DatabaseConnection.getConnection()) {
            System.out.println("[MySQL] Connexion reussie a la base 'gym_management'.");
            return true;
        } catch (Exception e) {
            System.err.println("[MySQL] Erreur de connexion : " + e.getMessage());
            return false;
        }
    }
}
