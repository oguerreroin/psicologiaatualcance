package com.psico.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DiagnosticTool {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/db_psicologia";
        String username = "root";
        String password = "Os98645763";

        System.out.println("--- INICIO DIAGNOSTICO ---");
        System.out.println("Intentando conectar a: " + url);

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(url, username, password)) {
                System.out.println("Conexión EXITOSA!");

                // Check users
                String sql = "SELECT id, nombre, email, password, rol FROM usuarios";
                try (PreparedStatement ps = conn.prepareStatement(sql);
                     ResultSet rs = ps.executeQuery()) {
                    
                    System.out.println("\n--- USUARIOS EN LA BASE DE DATOS ---");
                    boolean hasUsers = false;
                    while (rs.next()) {
                        hasUsers = true;
                        System.out.printf("ID: %d | Nombre: %s | Email: %s | Pass: %s | Rol: %s%n",
                                rs.getInt("id"),
                                rs.getString("nombre"),
                                rs.getString("email"),
                                rs.getString("password"),
                                rs.getString("rol"));
                    }
                    if (!hasUsers) {
                        System.out.println("ADVERTENCIA: La tabla 'usuarios' está VACÍA.");
                    }
                } catch (SQLException e) {
                    System.out.println("ERROR consultando usuarios: " + e.getMessage());
                }

            } catch (SQLException e) {
                System.out.println("ERROR de Conexión SQL: " + e.getMessage());
                if (e.getMessage().contains("Unknown database")) {
                    System.out.println("DETECTADO: La base de datos no existe. Intentando crearla...");
                    setupDatabase(username, password);
                } else if (e.getMessage().contains("Access denied")) {
                    System.out.println("POSIBLE CAUSA: Usuario o contraseña incorrectos.");
                }
            }
        } catch (ClassNotFoundException e) {
            System.out.println("ERROR: Driver MySQL no encontrado.");
            e.printStackTrace();
        }
        System.out.println("--- FIN DIAGNOSTICO ---");
    }

    private static void setupDatabase(String username, String password) {
        String urlNoDb = "jdbc:mysql://localhost:3306/";
        try (Connection conn = DriverManager.getConnection(urlNoDb, username, password)) {
            String scriptPath = "c:\\Projects\\DWI\\init.sql";
            System.out.println("Leyendo script desde: " + scriptPath);
            String script = java.nio.file.Files.readString(java.nio.file.Paths.get(scriptPath));
            
            String[] statements = script.split(";");
            for (String sql : statements) {
                if (sql.trim().isEmpty()) continue;
                try (java.sql.Statement stmt = conn.createStatement()) {
                    System.out.println("Ejecutando: " + sql.trim().substring(0, Math.min(sql.trim().length(), 50)) + "...");
                    stmt.execute(sql);
                } catch (SQLException ex) {
                    System.out.println("Error ejecutando SQL: " + ex.getMessage());
                }
            }
            System.out.println("Base de datos inicializada CORRECTAMENTE. Por favor reinicia la aplicación.");
        } catch (Exception e) {
            System.out.println("FALLO al inicializar la base de datos: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
