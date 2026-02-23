package com.psico.util;

import java.sql.*;

public class QueryTool {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Uso: java com.psico.util.QueryTool \"SELECT * FROM tabla\"");
            return;
        }

        String sql = args[0];
        String url = "jdbc:mysql://localhost:3306/db_psicologia";
        String username = "root";
        String password = "Os98645763";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(url, username, password);
                 Statement stmt = conn.createStatement()) {

                boolean isResultSet = stmt.execute(sql);

                if (isResultSet) {
                    try (ResultSet rs = stmt.getResultSet()) {
                        ResultSetMetaData meta = rs.getMetaData();
                        int colCount = meta.getColumnCount();

                        // Print header
                        for (int i = 1; i <= colCount; i++) {
                            System.out.print(meta.getColumnLabel(i) + "\t");
                        }
                        System.out.println("\n--------------------------------------------------");

                        // Print rows
                        while (rs.next()) {
                            for (int i = 1; i <= colCount; i++) {
                                System.out.print(rs.getString(i) + "\t");
                            }
                            System.out.println();
                        }
                    }
                } else {
                    int updateCount = stmt.getUpdateCount();
                    System.out.println("Comando ejecutado. Filas afectadas: " + updateCount);
                }

            } catch (SQLException e) {
                System.out.println("Error SQL: " + e.getMessage());
            }
        } catch (ClassNotFoundException e) {
            System.out.println("Error: Driver no encontrado.");
        }
    }
}
