package com.psico.model;

public class Usuario {
    private int id;
    private String nombre;
    private String email;
    private String password;
    private String rol;
    private String especialidad;
    private String imagenUrl;

    public Usuario() {}

    public Usuario(int id, String nombre, String email, String password, String rol, String especialidad, String imagenUrl) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.especialidad = especialidad;
        this.imagenUrl = imagenUrl;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
