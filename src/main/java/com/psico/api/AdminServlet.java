package com.psico.api;

import com.google.gson.Gson;
import com.psico.dao.UsuarioDAO;
import com.psico.model.Usuario;
import io.jsonwebtoken.Claims;
import com.psico.util.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/admin/*")
public class AdminServlet extends HttpServlet {
    private UsuarioDAO usuarioDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        usuarioDAO = new UsuarioDAO();
        gson = new Gson();
    }

    private boolean isAdmin(HttpServletRequest req) {
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = JwtUtil.validateToken(token);
            return claims != null && "ADMIN".equals(claims.get("rol", String.class));
        }
        return false;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        if (!isAdmin(req)) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"No autorizado. Permisos de Administrador Requeridos.\"}");
            return;
        }

        String pathInfo = req.getPathInfo();
        try {
            if ("/usuarios".equals(pathInfo)) {
                // Return all users (For simplicity, reusing existing Psicologos logic or adding
                // a new DAO method if available)
                List<Usuario> usuarios = usuarioDAO.listarPsicologos();
                resp.setStatus(HttpServletResponse.SC_OK);
                out.print(gson.toJson(usuarios));
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"error\":\"Ruta no encontrada\"}");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        if (!isAdmin(req)) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"No autorizado. Permisos de Administrador Requeridos.\"}");
            return;
        }

        String pathInfo = req.getPathInfo();
        if ("/psicologos".equals(pathInfo)) {
            BufferedReader reader = req.getReader();
            UsuarioReq reqData = gson.fromJson(reader, UsuarioReq.class);

            Usuario nuevoPsico = new Usuario();
            nuevoPsico.setNombre(reqData.nombre);
            nuevoPsico.setEmail(reqData.email);
            nuevoPsico.setPassword(reqData.password);
            nuevoPsico.setRol("PSICOLOGO");
            nuevoPsico.setEspecialidad(reqData.especialidad);

            boolean success = usuarioDAO.registrarUsuario(nuevoPsico);
            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Psicologo creado exitosamente");
                resp.setStatus(HttpServletResponse.SC_CREATED);
                out.print(gson.toJson(response));
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\":\"No se pudo crear el psicólogo\"}");
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"error\":\"Ruta no encontrada\"}");
        }
    }

    private static class UsuarioReq {
        String nombre;
        String email;
        String password;
        String especialidad;
    }
}
