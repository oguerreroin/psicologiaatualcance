package com.psico.api;

import com.google.gson.Gson;
import com.psico.dao.UsuarioDAO;
import com.psico.model.Usuario;
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

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {
    private UsuarioDAO usuarioDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        usuarioDAO = new UsuarioDAO();
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(createErrorResponse("Ruta no encontrada")));
            return;
        }

        BufferedReader reader = req.getReader();

        try {
            if (pathInfo.equals("/login")) {
                LoginRequest loginReq = gson.fromJson(reader, LoginRequest.class);
                Usuario user = usuarioDAO.validarUsuario(loginReq.email, loginReq.password);

                if (user != null) {
                    Map<String, Object> response = new HashMap<>();

                    // Genuino Signed JWT Emission
                    String token = JwtUtil.generateToken(user.getId(), user.getRol(), user.getEmail());

                    response.put("token", token);
                    response.put("user", user);

                    resp.setStatus(HttpServletResponse.SC_OK);
                    out.print(gson.toJson(response));
                } else {
                    resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.print(gson.toJson(createErrorResponse("Credenciales inválidas")));
                }

            } else if (pathInfo.equals("/register/paciente")) {
                RegisterRequest regReq = gson.fromJson(reader, RegisterRequest.class);

                Usuario nuevoUsuario = new Usuario();
                nuevoUsuario.setNombre(regReq.nombre);
                nuevoUsuario.setEmail(regReq.email);
                nuevoUsuario.setPassword(regReq.password);
                nuevoUsuario.setRol("PACIENTE");

                boolean registrado = usuarioDAO.registrarUsuario(nuevoUsuario);
                if (registrado) {
                    resp.setStatus(HttpServletResponse.SC_CREATED);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Usuario registrado exitosamente");
                    out.print(gson.toJson(response));
                } else {
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.print(gson.toJson(createErrorResponse("El correo electrónico ya está en uso o hubo un error")));
                }
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(createErrorResponse("Ruta no existente en AuthServlet")));
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(createErrorResponse("Error procesando solicitud: " + e.getMessage())));
            e.printStackTrace();
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }

    private static class LoginRequest {
        String email;
        String password;
    }

    private static class RegisterRequest {
        String nombre;
        String email;
        String password;
    }
}
