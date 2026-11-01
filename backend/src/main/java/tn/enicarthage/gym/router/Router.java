package tn.enicarthage.gym.router;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.sun.net.httpserver.HttpExchange;

import tn.enicarthage.gym.controller.*;
import tn.enicarthage.gym.dto.*;
import tn.enicarthage.gym.exception.ResourceNotFoundException;
import tn.enicarthage.gym.exception.ValidationException;
import tn.enicarthage.gym.model.FitnessClass;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Router {

    private record Reponse(int statut, String corps) {
    }

    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class,
                    (JsonSerializer<LocalDate>) (src, type, ctx) -> new JsonPrimitive(src.toString()))
            .registerTypeAdapter(LocalDate.class,
                    (JsonDeserializer<LocalDate>) (json, type, ctx) ->
                            json.isJsonNull() ? null : LocalDate.parse(json.getAsString()))
            .registerTypeAdapter(LocalDateTime.class,
                    (JsonSerializer<LocalDateTime>) (src, type, ctx) -> new JsonPrimitive(src.toString()))
            .registerTypeAdapter(LocalDateTime.class,
                    (JsonDeserializer<LocalDateTime>) (json, type, ctx) ->
                            json.isJsonNull() ? null : LocalDateTime.parse(json.getAsString()))
            .create();

    // Contrôleurs injectés
    private final DashboardController dashboardController = new DashboardController();
    private final GymController gymController = new GymController();
    private final UserController userController = new UserController();
    private final MembershipPlanController planController = new MembershipPlanController();
    private final MembershipController membershipController = new MembershipController();
    private final FitnessClassController classController = new FitnessClassController();
    private final SessionController sessionController = new SessionController();
    private final BookingController bookingController = new BookingController();
    private final PaymentController paymentController = new PaymentController();

    public void dispatcher(HttpExchange exchange) throws IOException {
        String methode = exchange.getRequestMethod();

        // Support CORS Pre-flight
        if ("OPTIONS".equalsIgnoreCase(methode)) {
            envoyerCORS(exchange);
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        String chemin = exchange.getRequestURI().getPath();
        // Nettoyer les slashes initiaux et optionnels
        if (chemin.startsWith("/")) chemin = chemin.substring(1);
        if (chemin.endsWith("/")) chemin = chemin.substring(0, chemin.length() - 1);
        String[] segments = chemin.isEmpty() ? new String[0] : chemin.split("/");

        try {
            Reponse reponse = router(methode, segments, exchange);
            envoyer(exchange, reponse.statut(), reponse.corps());
        } catch (ResourceNotFoundException e) {
            envoyer(exchange, 404, messageErreur(e.getMessage()));
        } catch (ValidationException | IllegalArgumentException e) {
            envoyer(exchange, 400, messageErreur(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            envoyer(exchange, 500, messageErreur("Erreur interne du serveur : " + e.getMessage()));
        }
    }

    private Reponse router(String methode, String[] segments, HttpExchange exchange) throws IOException {
        if (segments.length == 0) {
            return new Reponse(200, "{\"service\":\"Gym Management API\",\"version\":\"1.0\",\"status\":\"RUNNING\"}");
        }

        int index = 0;
        // Supporter /api/... ou directement /ressource
        if ("api".equalsIgnoreCase(segments[0])) {
            index = 1;
            if (segments.length <= 1) {
                return new Reponse(200, "{\"message\":\"Gym Management REST API v1.0\"}");
            }
        }

        String ressource = segments[index].toLowerCase();
        int subLen = segments.length - index;

        return switch (ressource) {
            case "dashboard" -> routesDashboard(methode);
            case "gym" -> routesGym(methode, segments, index);
            case "members" -> routesMembers(methode, segments, index, exchange);
            case "coaches" -> routesCoaches(methode);
            case "plans" -> routesPlans(methode, segments, index, exchange);
            case "memberships" -> routesMemberships(methode, segments, index, exchange);
            case "classes" -> routesClasses(methode, segments, index, exchange);
            case "sessions" -> routesSessions(methode, segments, index, exchange);
            case "bookings" -> routesBookings(methode, segments, index, exchange);
            case "payments" -> routesPayments(methode, segments, index);
            default -> throw new ResourceNotFoundException("Ressource inconnue : /" + ressource);
        };
    }

    // 1. Dashboard
    private Reponse routesDashboard(String methode) {
        if ("GET".equalsIgnoreCase(methode)) {
            return new Reponse(200, gson.toJson(dashboardController.getStats()));
        }
        throw new IllegalArgumentException("Methode " + methode + " non supportee pour /dashboard");
    }

    // 2. Gym
    private Reponse routesGym(String methode, String[] segments, int offset) {
        if ("GET".equalsIgnoreCase(methode)) {
            if (segments.length - offset == 1) {
                return new Reponse(200, gson.toJson(gymController.obtenir(1)));
            } else {
                int id = entier(segments[offset + 1]);
                return new Reponse(200, gson.toJson(gymController.obtenir(id)));
            }
        }
        throw new IllegalArgumentException("Methode " + methode + " non supportee");
    }

    // 3. Members
    private Reponse routesMembers(String methode, String[] segments, int offset, HttpExchange exchange) throws IOException {
        int len = segments.length - offset;
        if (len == 1) {
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(userController.listerMembres()));
            } else if ("POST".equalsIgnoreCase(methode)) {
                MemberRequest req = lireCorps(exchange, MemberRequest.class);
                return new Reponse(201, gson.toJson(userController.creerMembre(req)));
            }
        } else if (len == 2) {
            int id = entier(segments[offset + 1]);
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(userController.obtenir(id)));
            } else if ("PUT".equalsIgnoreCase(methode)) {
                MemberRequest req = lireCorps(exchange, MemberRequest.class);
                return new Reponse(200, gson.toJson(userController.modifierMembre(id, req)));
            } else if ("DELETE".equalsIgnoreCase(methode)) {
                userController.supprimer(id);
                return new Reponse(204, "");
            }
        }
        throw new ResourceNotFoundException("Route introuvable");
    }

    // 4. Coaches
    private Reponse routesCoaches(String methode) {
        if ("GET".equalsIgnoreCase(methode)) {
            return new Reponse(200, gson.toJson(userController.listerCoachs()));
        }
        throw new IllegalArgumentException("Methode " + methode + " non supportee");
    }

    // 5. Plans
    private Reponse routesPlans(String methode, String[] segments, int offset, HttpExchange exchange) throws IOException {
        int len = segments.length - offset;
        if (len == 1) {
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(planController.lister()));
            } else if ("POST".equalsIgnoreCase(methode)) {
                PlanRequest req = lireCorps(exchange, PlanRequest.class);
                return new Reponse(201, gson.toJson(planController.creer(req)));
            }
        } else if (len == 2) {
            int id = entier(segments[offset + 1]);
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(planController.obtenir(id)));
            } else if ("PUT".equalsIgnoreCase(methode)) {
                PlanRequest req = lireCorps(exchange, PlanRequest.class);
                return new Reponse(200, gson.toJson(planController.modifier(id, req)));
            } else if ("DELETE".equalsIgnoreCase(methode)) {
                planController.supprimer(id);
                return new Reponse(204, "");
            }
        }
        throw new ResourceNotFoundException("Route introuvable");
    }

    // 6. Memberships
    private Reponse routesMemberships(String methode, String[] segments, int offset, HttpExchange exchange) throws IOException {
        int len = segments.length - offset;
        if (len == 1) {
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(membershipController.lister()));
            } else if ("POST".equalsIgnoreCase(methode)) {
                record SubscribeReq(int userId, int planId, String modePaiement) {}
                SubscribeReq req = lireCorps(exchange, SubscribeReq.class);
                return new Reponse(201, gson.toJson(membershipController.souscrire(req.userId(), req.planId(), req.modePaiement())));
            }
        } else if (len == 2) {
            int id = entier(segments[offset + 1]);
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(membershipController.obtenir(id)));
            } else if ("DELETE".equalsIgnoreCase(methode)) {
                membershipController.resilier(id);
                return new Reponse(204, "");
            }
        }
        throw new ResourceNotFoundException("Route introuvable");
    }

    // 7. Classes
    private Reponse routesClasses(String methode, String[] segments, int offset, HttpExchange exchange) throws IOException {
        int len = segments.length - offset;
        if (len == 1) {
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(classController.lister()));
            } else if ("POST".equalsIgnoreCase(methode)) {
                FitnessClass fc = lireCorps(exchange, FitnessClass.class);
                return new Reponse(201, gson.toJson(classController.creer(fc)));
            }
        } else if (len == 2) {
            int id = entier(segments[offset + 1]);
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(classController.obtenir(id)));
            } else if ("PUT".equalsIgnoreCase(methode)) {
                FitnessClass fc = lireCorps(exchange, FitnessClass.class);
                return new Reponse(200, gson.toJson(classController.modifier(id, fc)));
            } else if ("DELETE".equalsIgnoreCase(methode)) {
                classController.supprimer(id);
                return new Reponse(204, "");
            }
        }
        throw new ResourceNotFoundException("Route introuvable");
    }

    // 8. Sessions
    private Reponse routesSessions(String methode, String[] segments, int offset, HttpExchange exchange) throws IOException {
        int len = segments.length - offset;
        if (len == 1) {
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(sessionController.lister()));
            } else if ("POST".equalsIgnoreCase(methode)) {
                SessionRequest req = lireCorps(exchange, SessionRequest.class);
                return new Reponse(201, gson.toJson(sessionController.creer(req)));
            }
        } else if (len == 2) {
            int id = entier(segments[offset + 1]);
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(sessionController.obtenir(id)));
            } else if ("DELETE".equalsIgnoreCase(methode)) {
                sessionController.supprimer(id);
                return new Reponse(204, "");
            }
        }
        throw new ResourceNotFoundException("Route introuvable");
    }

    // 9. Bookings
    private Reponse routesBookings(String methode, String[] segments, int offset, HttpExchange exchange) throws IOException {
        int len = segments.length - offset;
        if (len == 1) {
            if ("GET".equalsIgnoreCase(methode)) {
                return new Reponse(200, gson.toJson(bookingController.lister()));
            } else if ("POST".equalsIgnoreCase(methode)) {
                BookingRequest req = lireCorps(exchange, BookingRequest.class);
                return new Reponse(201, gson.toJson(bookingController.reserver(req)));
            }
        } else if (len == 2) {
            int id = entier(segments[offset + 1]);
            if ("DELETE".equalsIgnoreCase(methode)) {
                bookingController.annuler(id);
                return new Reponse(204, "");
            }
        }
        throw new ResourceNotFoundException("Route introuvable");
    }

    // 10. Payments
    private Reponse routesPayments(String methode, String[] segments, int offset) {
        int len = segments.length - offset;
        if (len == 1 && "GET".equalsIgnoreCase(methode)) {
            return new Reponse(200, gson.toJson(paymentController.lister()));
        } else if (len == 2 && "GET".equalsIgnoreCase(methode)) {
            int id = entier(segments[offset + 1]);
            return new Reponse(200, gson.toJson(paymentController.obtenir(id)));
        }
        throw new ResourceNotFoundException("Route introuvable");
    }

    private <T> T lireCorps(HttpExchange exchange, Class<T> clazz) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            String json = new String(is.readAllBytes(), StandardCharsets.UTF_8).trim();
            if (json.isEmpty()) {
                throw new ValidationException("Le corps JSON de la requete ne peut pas etre vide.");
            }
            T obj = gson.fromJson(json, clazz);
            if (obj == null) {
                throw new ValidationException("Format JSON invalide.");
            }
            return obj;
        }
    }

    private int entier(String val) {
        try {
            return Integer.parseInt(val);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Identifiant numerique invalide : " + val);
        }
    }

    private String messageErreur(String msg) {
        return "{\"erreur\":\"" + (msg != null ? msg.replace("\"", "\\\"") : "Erreur") + "\"}";
    }

    private void envoyerCORS(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
    }

    private void envoyer(HttpExchange exchange, int statut, String corps) throws IOException {
        envoyerCORS(exchange);
        byte[] bytes = corps == null ? new byte[0] : corps.getBytes(StandardCharsets.UTF_8);
        if (bytes.length > 0) {
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(statut, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        } else {
            exchange.sendResponseHeaders(statut, -1);
            exchange.close();
        }
    }
}
