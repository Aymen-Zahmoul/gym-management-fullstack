package tn.enicarthage.gym.server;

import com.sun.net.httpserver.HttpServer;
import tn.enicarthage.gym.router.Router;

import java.io.IOException;
import java.net.InetSocketAddress;

public class ApiServer {

    private final HttpServer server;

    public ApiServer(int port) throws IOException {
        Router router = new Router();
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        this.server.createContext("/", router::dispatcher);
        this.server.setExecutor(null); // Executeur par defaut
    }

    public void demarrer() {
        server.start();
    }

    public void arreter() {
        server.stop(0);
    }
}
