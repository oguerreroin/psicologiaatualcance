package com.psico.controller;

import com.psico.dao.CitaDAO;
import com.psico.dao.UsuarioDAO;
import com.psico.model.Cita;
import com.psico.model.Usuario;
import jakarta.annotation.PostConstruct;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Named
@ViewScoped
public class CitaBean implements Serializable {
    @Inject
    private AuthBean authBean;

    private CitaDAO citaDAO;
    private UsuarioDAO usuarioDAO;

    private int selectedPsicologoId;
    private Date fechaCita;
    private String motivo;
    private int edadPaciente;
    private String tipoPago;
    
    private List<Usuario> psicologos;
    private List<Cita> misCitas;

    private boolean pagoRealizado;

    private Date minDate;

    @PostConstruct
    public void init() {
        citaDAO = new CitaDAO();
        usuarioDAO = new UsuarioDAO();
        psicologos = usuarioDAO.listarPsicologos();
        cargarCitas();
        minDate = new Date(); // Set minimum date to today
    }

    public void cargarCitas() {
        if (authBean.getUsuario() != null) {
            misCitas = citaDAO.listarCitasPorUsuario(authBean.getUsuario().getId(), authBean.getUsuario().getRol());
        }
    }

    public void verificarPago() {
        // Just to update the button state via AJAX
    }

    public void simularPago() {
        this.pagoRealizado = true;
        FacesContext.getCurrentInstance().addMessage(null,
                new FacesMessage(FacesMessage.SEVERITY_INFO, "Pago Exitoso", "El pago se ha procesado correctamente."));
    }

    public void reservarCita() {
        System.out.println("DEBUG: CitaBean.reservarCita - Inicio");
        try {
            System.out.println("DEBUG: CitaBean.reservarCita - Datos: psicoId=" + selectedPsicologoId + ", fecha=" + fechaCita + ", motivo=" + motivo + ", edad=" + edadPaciente + ", tipoPago=" + tipoPago);
            
            if (selectedPsicologoId == 0 || fechaCita == null || motivo == null || motivo.isEmpty() || edadPaciente <= 0 || tipoPago == null) {
                System.out.println("DEBUG: CitaBean.reservarCita - Campos vacíos");
                FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_WARN, "Advertencia", "Complete todos los campos correctamente"));
                return;
            }

            // Validate Date (not in past)
            Date now = new Date();
            if (fechaCita.before(now)) {
                 System.out.println("DEBUG: CitaBean.reservarCita - Fecha pasada");
                 FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", "La fecha de la cita no puede ser en el pasado."));
                return;
            }

            // Validate Time (9 AM - 12 AM / 00:00)
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(fechaCita);
            int hour = cal.get(java.util.Calendar.HOUR_OF_DAY);
            System.out.println("DEBUG: CitaBean.reservarCita - Hora: " + hour);
            
            // Allow 9 AM to 11 PM (23:00) AND Midnight (00:00)
            if (hour < 9 && hour != 0) {
                 System.out.println("DEBUG: CitaBean.reservarCita - Hora inválida");
                 FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", "El horario de atención es de 9:00 AM a 12:00 AM."));
                return;
            }

            if ("ONLINE".equals(tipoPago) && !pagoRealizado) {
                 System.out.println("DEBUG: CitaBean.reservarCita - Pago online no realizado");
                 FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", "Debe realizar el pago online antes de confirmar."));
                return;
            }

            Cita nuevaCita = new Cita();
            if (authBean.getUsuario() != null) {
                nuevaCita.setPacienteId(authBean.getUsuario().getId());
                System.out.println("DEBUG: CitaBean.reservarCita - Paciente ID: " + authBean.getUsuario().getId());
            } else {
                 System.out.println("DEBUG: CitaBean.reservarCita - Usuario no identificado");
                 FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", "Usuario no identificado."));
                return;
            }
            
            nuevaCita.setPsicologoId(selectedPsicologoId);
            nuevaCita.setFecha(fechaCita);
            nuevaCita.setMotivo(motivo);
            nuevaCita.setEdadPaciente(edadPaciente);
            nuevaCita.setTipoPago(tipoPago);
            
            // Simulación de pago
            if ("ONLINE".equals(tipoPago)) {
                nuevaCita.setEstadoPago("PAGADO");
            } else {
                nuevaCita.setEstadoPago("PENDIENTE");
            }

            boolean registrado = citaDAO.registrarCita(nuevaCita);
            System.out.println("DEBUG: CitaBean.reservarCita - Resultado registrarCita: " + registrado);

            if (registrado) {
                FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_INFO, "Éxito", "Cita reservada correctamente"));
                cargarCitas();
                // Show confirmation dialog
                org.primefaces.PrimeFaces.current().executeScript("PF('dlgConfirm').show();");
                limpiarFormulario();
            } else {
                FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", "Horario no disponible"));
            }
        } catch (Exception e) {
            System.out.println("DEBUG: CitaBean.reservarCita - Excepción: " + e.getMessage());
            e.printStackTrace();
            FacesContext.getCurrentInstance().addMessage(null,
                    new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error Interno", "Ocurrió un error al procesar la reserva: " + e.getMessage()));
        }
    }
    
    private void limpiarFormulario() {
        selectedPsicologoId = 0;
        fechaCita = null;
        motivo = null;
        edadPaciente = 0;
        tipoPago = null;
        pagoRealizado = false;
    }

    // Getters and Setters
    public int getSelectedPsicologoId() { return selectedPsicologoId; }
    public void setSelectedPsicologoId(int selectedPsicologoId) { this.selectedPsicologoId = selectedPsicologoId; }
    public Date getFechaCita() { return fechaCita; }
    public void setFechaCita(Date fechaCita) { this.fechaCita = fechaCita; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public int getEdadPaciente() { return edadPaciente; }
    public void setEdadPaciente(int edadPaciente) { this.edadPaciente = edadPaciente; }
    public String getTipoPago() { return tipoPago; }
    public void setTipoPago(String tipoPago) { this.tipoPago = tipoPago; }
    public List<Usuario> getPsicologos() { return psicologos; }
    public List<Cita> getMisCitas() { return misCitas; }
    public boolean isPagoRealizado() { return pagoRealizado; }
    public void setPagoRealizado(boolean pagoRealizado) { this.pagoRealizado = pagoRealizado; }
    public Date getMinDate() { return minDate; }
}
