package com.psico.model;

import java.util.Date;

public class Pago {
    private int id;
    private int citaId;
    private double monto;
    private Date fechaPago;
    private String metodoPago;

    public Pago() {
    }

    public Pago(int id, int citaId, double monto, Date fechaPago, String metodoPago) {
        this.id = id;
        this.citaId = citaId;
        this.monto = monto;
        this.fechaPago = fechaPago;
        this.metodoPago = metodoPago;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCitaId() {
        return citaId;
    }

    public void setCitaId(int citaId) {
        this.citaId = citaId;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public Date getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(Date fechaPago) {
        this.fechaPago = fechaPago;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
}
