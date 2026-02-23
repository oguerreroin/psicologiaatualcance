package com.psico.model;

import java.util.Date;

public class Cita {
    private int id;
    private int pacienteId;
    private int psicologoId;
    private Date fecha;
    private String estado;
    
    private String motivo;
    private int edadPaciente;
    private String tipoPago;
    private String estadoPago;

    // Helper fields for display
    private String nombrePaciente;
    private String nombrePsicologo;

    public Cita() {}

    public Cita(int id, int pacienteId, int psicologoId, Date fecha, String estado, String motivo, int edadPaciente, String tipoPago, String estadoPago) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.psicologoId = psicologoId;
        this.fecha = fecha;
        this.estado = estado;
        this.motivo = motivo;
        this.edadPaciente = edadPaciente;
        this.tipoPago = tipoPago;
        this.estadoPago = estadoPago;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getPacienteId() { return pacienteId; }
    public void setPacienteId(int pacienteId) { this.pacienteId = pacienteId; }
    public int getPsicologoId() { return psicologoId; }
    public void setPsicologoId(int psicologoId) { this.psicologoId = psicologoId; }
    public Date getFecha() { return fecha; }
    public void setFecha(Date fecha) { this.fecha = fecha; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public int getEdadPaciente() { return edadPaciente; }
    public void setEdadPaciente(int edadPaciente) { this.edadPaciente = edadPaciente; }
    public String getTipoPago() { return tipoPago; }
    public void setTipoPago(String tipoPago) { this.tipoPago = tipoPago; }
    public String getEstadoPago() { return estadoPago; }
    public void setEstadoPago(String estadoPago) { this.estadoPago = estadoPago; }
    public String getNombrePaciente() { return nombrePaciente; }
    public void setNombrePaciente(String nombrePaciente) { this.nombrePaciente = nombrePaciente; }
    public String getNombrePsicologo() { return nombrePsicologo; }
    public void setNombrePsicologo(String nombrePsicologo) { this.nombrePsicologo = nombrePsicologo; }
}
