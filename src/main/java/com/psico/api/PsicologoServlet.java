package com.psico.api;

import com.google.gson.Gson;
import com.psico.dao.CitaDAO;
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
import java.util.Map;

@WebServlet("/api/psicologo/*")
public class PsicologoServlet extends HttpServlet {
    private CitaDAO citaDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        citaDAO = new CitaDAO();
        gson = new Gson();
    }

    private Claims getPsicologoClaims(HttpServletRequest req) {
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = JwtUtil.validateToken(token);
            if (claims != null && "PSICOLOGO".equals(claims.get("rol", String.class))) {
                return claims;
            }
        }
        return null;
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        Claims claims = getPsicologoClaims(req);
        if (claims == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"No autorizado. Requiere privilegios de Psicólogo.\"}");
            return;
        }

        Integer psicoId = ((Number) claims.get("id")).intValue();

        String pathInfo = req.getPathInfo();
        if (pathInfo != null && pathInfo.startsWith("/citas/") && pathInfo.endsWith("/estado")) {
            try {
                String[] parts = pathInfo.split("/");
                int citaId = Integer.parseInt(parts[2]);

                BufferedReader reader = req.getReader();
                EstadoReq estadoReq = gson.fromJson(reader, EstadoReq.class);

                // Real DB update securing psychological ownership
                boolean success = citaDAO.actualizarEstadoCita(citaId, estadoReq.estado, psicoId);

                if (success) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Estado actualizado exitosamente");
                    resp.setStatus(HttpServletResponse.SC_OK);
                    out.print(gson.toJson(response));
                } else {
                    resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    out.print("{\"error\":\"No se pudo actualizar la cita o no te pertenece.\"}");
                }

            } catch (Exception e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"" + e.getMessage() + "\"}");
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"error\":\"Ruta no encontrada\"}");
        }
    }

    private static class EstadoReq {
        String estado;
    }
}
