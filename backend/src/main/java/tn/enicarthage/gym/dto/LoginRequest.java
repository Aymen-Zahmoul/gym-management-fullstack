package tn.enicarthage.gym.dto;

import com.google.gson.annotations.SerializedName;

public class LoginRequest {
    @SerializedName(value = "email", alternate = {"username", "identifiant", "login"})
    private String email;

    @SerializedName(value = "motDePasse", alternate = {"password", "mot_de_passe", "pass"})
    private String motDePasse;

    public LoginRequest() {}

    public LoginRequest(String email, String motDePasse) {
        this.email = email;
        this.motDePasse = motDePasse;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
}
