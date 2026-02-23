package com.psico.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionDB {
    private static ConexionDB instance;
    private Connection connection;
    private String url = "jdbc:mysql://localhost:3306/db_psicologia";
    private String username = "root";
    private String password = "Os98645763";

    private ConexionDB() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection(url, username, password);
            System.out.println("DEBUG: Conexión a DB exitosa: " + url);
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("DEBUG: Error conectando a DB: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static ConexionDB getInstance() {
        if (instance == null) {
            instance = new ConexionDB();
        } else {
            try {
                if (instance.getConnection().isClosed()) {
                    instance = new ConexionDB();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }
}
