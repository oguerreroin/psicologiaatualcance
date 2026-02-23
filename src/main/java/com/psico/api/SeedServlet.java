package com.psico.api;

import com.google.gson.Gson;
import com.psico.dao.UsuarioDAO;
import com.psico.model.Usuario;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/dev/seed-data")
public class SeedServlet extends HttpServlet {
    private UsuarioDAO usuarioDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        usuarioDAO = new UsuarioDAO();
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            Map<String, Object> response = new HashMap<>();

            // Seed Admin
            if (usuarioDAO.validarUsuario("admin@psico.com", "123456") == null) {
                Usuario admin = new Usuario();
                admin.setNombre("Admin General");
                admin.setEmail("admin@psico.com");
                admin.setPassword("123456");
                admin.setRol("ADMIN");
                usuarioDAO.registrarUsuario(admin);
            }

            // Seed Pacientes (1/5 just for base check)
            if (usuarioDAO.validarUsuario("paciente1@psico.com", "123456") == null) {
                Usuario paciente = new Usuario();
                paciente.setNombre("Paciente Uno");
                paciente.setEmail("paciente1@psico.com");
                paciente.setPassword("123456");
                paciente.setRol("PACIENTE");
                usuarioDAO.registrarUsuario(paciente);
            }

            // Seed Psicologo (1/3)
            if (usuarioDAO.validarUsuario("psicologo1@psico.com", "123456") == null) {
                Usuario psico = new Usuario();
                psico.setNombre("Dr. Psicologo Uno");
                psico.setEmail("psicologo1@psico.com");
                psico.setPassword("123456");
                psico.setRol("PSICOLOGO");
                psico.setEspecialidad("Terapia General");
                usuarioDAO.registrarUsuario(psico);
            }

            // Clean Admin Seed Generation avoiding corrupt legacy blocks
            Usuario adminResult = usuarioDAO.validarUsuario("admin2@psico.com", "123456");
            if (adminResult == null) {
                Usuario cleanAdmin = new Usuario();
                cleanAdmin.setNombre("Super Admin");
                cleanAdmin.setEmail("admin2@psico.com");
                cleanAdmin.setPassword("123456");
                cleanAdmin.setRol("ADMIN");
                boolean rReg = usuarioDAO.registrarUsuario(cleanAdmin);

                adminResult = usuarioDAO.validarUsuario("admin2@psico.com", "123456");
                if (adminResult == null) {
                    response.put("diagnostic", "Admin 2 still null after creation. rReg: " + rReg);
                } else {
                    response.put("diagnostic", "Admin 2 created correctly.");
                }
            } else {
                response.put("diagnostic", "Admin 2 existed natively.");
            }

            // Forced role correction for old rows lacking proper role assignment
            java.sql.Connection conn = com.psico.util.ConexionDB.getInstance().getConnection();
            conn.createStatement()
                    .executeUpdate("UPDATE usuarios SET rol='ADMIN', password='123456' WHERE email='admin@psico.com'");
            conn.createStatement().executeUpdate(
                    "UPDATE usuarios SET rol='PSICOLOGO', password='123456' WHERE email='psicologo1@psico.com'");

            java.util.List<Map<String, String>> dbUsers = new java.util.ArrayList<>();
            try (java.sql.ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM usuarios")) {
                while (rs.next()) {
                    Map<String, String> row = new HashMap<>();
                    row.put("id", String.valueOf(rs.getInt("id")));
                    row.put("email", rs.getString("email"));
                    row.put("password", rs.getString("password"));
                    row.put("rol", rs.getString("rol"));
                    dbUsers.add(row);
                }
            }

            response.put("message", "Seed data executed successfully");
            response.put("users", dbUsers);
            resp.setStatus(HttpServletResponse.SC_OK);
            out.print(gson.toJson(response));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
