package com.psico.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.psico.dao.CitaDAO;
import io.jsonwebtoken.Claims;
import com.psico.model.Cita;
import com.psico.util.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/api/citas/*")
public class CitasServlet extends HttpServlet {
    private CitaDAO citaDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        citaDAO = new CitaDAO();
        gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();
    }

    private Claims validateAndGetClaims(HttpServletRequest req) {
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return JwtUtil.validateToken(token);
        }
        return null;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        Claims claims = validateAndGetClaims(req);
        if (claims == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print(gson.toJson(createErrorResponse("Firma digital inválida o token expirado. Requiere login.")));
            return;
        }

        Integer usuarioId = ((Number) claims.get("id")).intValue();
        String rol = claims.get("rol", String.class);

        List<Cita> misCitas = citaDAO.listarCitasPorUsuario(usuarioId, rol);
        out.print(gson.toJson(misCitas));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        Claims claims = validateAndGetClaims(req);
        if (claims == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print(gson.toJson(createErrorResponse("Debe iniciar sesión para agendar")));
            return;
        }

        Integer pacienteId = ((Number) claims.get("id")).intValue();
        String rol = claims.get("rol", String.class);

        // Un Psicologo no puede agendar como Paciente (RBAC cruzado)
        if (!"PACIENTE".equals(rol)) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            out.print(gson.toJson(createErrorResponse("Solo los pacientes pueden reservar citas.")));
            return;
        }

        BufferedReader reader = req.getReader();
        try {
            CitaRequest citaReq = gson.fromJson(reader, CitaRequest.class);

            if (citaReq.psicologoId == 0 || citaReq.fechaCita == null || citaReq.motivo == null
                    || citaReq.tipoPago == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(createErrorResponse("Datos incompletos para procesar la cita.")));
                return;
            }

            Date fechaObj;
            try {
                fechaObj = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm").parse(citaReq.fechaCita);
            } catch (ParseException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(createErrorResponse("Formato de fecha inválido. Intente yyyy-MM-ddTHH:mm")));
                return;
            }

            Date now = new Date();
            if (fechaObj.before(now)) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(createErrorResponse("La fecha de la cita no puede estar en el pasado.")));
                return;
            }

            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(fechaObj);
            int hour = cal.get(java.util.Calendar.HOUR_OF_DAY);

            if (hour < 9 && hour != 0) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(createErrorResponse("El horario de atención es de 9:00 AM a 12:00 AM.")));
                return;
            }

            Cita nuevaCita = new Cita();
            nuevaCita.setPacienteId(pacienteId);
            nuevaCita.setPsicologoId(citaReq.psicologoId);
            nuevaCita.setFecha(fechaObj);
            nuevaCita.setMotivo(citaReq.motivo);
            nuevaCita.setEdadPaciente(citaReq.edadPaciente > 0 ? citaReq.edadPaciente : 30);
            nuevaCita.setTipoPago(citaReq.tipoPago);

            if ("ONLINE".equals(citaReq.tipoPago)) {
                nuevaCita.setEstadoPago("PAGADO");
            } else {
                nuevaCita.setEstadoPago("PENDIENTE");
            }

            boolean registrado = citaDAO.registrarCita(nuevaCita);

            if (registrado) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Cita reservada correctamente");
                out.print(gson.toJson(response));
            } else {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                out.print(gson.toJson(createErrorResponse(
                        "El horario seleccionado ya no está disponible. Trate evitando 59 min de conflictos.")));
            }

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(createErrorResponse("Error en el servidor.")));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        Claims claims = validateAndGetClaims(req);
        if (claims == null || !"PACIENTE".equals(claims.get("rol", String.class))) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print(gson.toJson(createErrorResponse("No tiene perfil de paciente.")));
            return;
        }

        Integer pacienteId = ((Number) claims.get("id")).intValue();

        String pathInfo = req.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1) {
            String citaIdStr = pathInfo.substring(1);
            try {
                int citaId = Integer.parseInt(citaIdStr);

                // Genuine DB Cancellation Mapping with Owner Identity check (pacienteId)
                boolean anulado = citaDAO.cancelarCita(citaId, pacienteId);

                if (anulado) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Cita cancelada exitosamente");
                    resp.setStatus(HttpServletResponse.SC_OK);
                    out.print(gson.toJson(response));
                } else {
                    resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    out.print(gson.toJson(createErrorResponse("No posees los derechos o la cita no es tuya.")));
                }
            } catch (Exception e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(createErrorResponse("ID inválido")));
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(createErrorResponse("ID de cita requerido")));
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }

    private static class CitaRequest {
        int psicologoId;
        String fechaCita;
        String motivo;
        int edadPaciente;
        String tipoPago;
    }
}
