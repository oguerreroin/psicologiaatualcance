package com.psico.controller;

import com.psico.dao.CitaDAO;
import com.psico.model.Cita;
import com.psico.model.Usuario;
import jakarta.annotation.PostConstruct;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.List;

@Named
@ViewScoped
public class PsicologoBean implements Serializable {

    private CitaDAO citaDAO;
    private List<Cita> citas;
    private Usuario usuarioSesion;

    @PostConstruct
    public void init() {
        citaDAO = new CitaDAO();
        usuarioSesion = (Usuario) FacesContext.getCurrentInstance().getExternalContext().getSessionMap().get("usuario");
        if (usuarioSesion != null && "PSICOLOGO".equals(usuarioSesion.getRol())) {
            cargarCitas();
        }
    }

    public void cargarCitas() {
        citas = citaDAO.listarCitasPorUsuario(usuarioSesion.getId(), "PSICOLOGO");
    }

    public void atenderCita(Cita cita) {
        if (citaDAO.actualizarEstadoCita(cita.getId(), "ATENDIDO", usuarioSesion.getId())) {
            addMessage(FacesMessage.SEVERITY_INFO, "Éxito", "Cita marcada como atendida.");
            cargarCitas();
        } else {
            addMessage(FacesMessage.SEVERITY_ERROR, "Error", "No se pudo actualizar la cita.");
        }
    }

    public void cancelarCita(Cita cita) {
        if (citaDAO.actualizarEstadoCita(cita.getId(), "CANCELADA", usuarioSesion.getId())) {
            addMessage(FacesMessage.SEVERITY_INFO, "Éxito", "Cita cancelada.");
            cargarCitas();
        } else {
            addMessage(FacesMessage.SEVERITY_ERROR, "Error", "No se pudo cancelar la cita.");
        }
    }

    public void reprogramarCita(Cita cita) {
        if (citaDAO.actualizarEstadoCita(cita.getId(), "REPROGRAMADO", usuarioSesion.getId())) {
            addMessage(FacesMessage.SEVERITY_INFO, "Éxito", "Cita marcada para reprogramación.");
            cargarCitas();
        } else {
            addMessage(FacesMessage.SEVERITY_ERROR, "Error", "No se pudo actualizar la cita.");
        }
    }

    public List<Cita> getCitas() {
        return citas;
    }

    private void addMessage(FacesMessage.Severity severity, String summary, String detail) {
        FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(severity, summary, detail));
    }
}
