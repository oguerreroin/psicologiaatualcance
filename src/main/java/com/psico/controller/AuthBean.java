package com.psico.controller;

import com.psico.dao.UsuarioDAO;
import com.psico.model.Usuario;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import java.io.Serializable;

@Named
@SessionScoped
public class AuthBean implements Serializable {
    private Usuario usuario;
    private String email;
    private String password;
    private String nombre; // For registration
    private UsuarioDAO usuarioDAO;

    public AuthBean() {
        usuarioDAO = new UsuarioDAO();
    }

    public String login() {
        System.out.println("DEBUG: Intentando login con email: " + email);
        usuario = usuarioDAO.validarUsuario(email, password);
        if (usuario != null) {
            System.out.println("DEBUG: Login exitoso para: " + usuario.getNombre());
            FacesContext.getCurrentInstance().getExternalContext().getSessionMap().put("usuario", usuario);
            if ("PSICOLOGO".equals(usuario.getRol())) {
                return "dashboard_psicologo?faces-redirect=true";
            }
            return "dashboard?faces-redirect=true";
        } else {
            System.out.println("DEBUG: Login fallido para: " + email);
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", "Credenciales inválidas"));
            return null;
        }
    }

    public String registro() {
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(nombre);
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setPassword(password);

        if (usuarioDAO.registrarUsuario(nuevoUsuario)) {
            return "login?faces-redirect=true";
        } else {
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", "No se pudo registrar"));
            return null;
        }
    }

    public String logout() {
        FacesContext.getCurrentInstance().getExternalContext().invalidateSession();
        return "login?faces-redirect=true";
    }

    public boolean isLoggedIn() {
        return usuario != null;
    }

    // Getters and Setters
    public Usuario getUsuario() {
        return usuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
