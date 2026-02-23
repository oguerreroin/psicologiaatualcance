package com.psico.dao;

import com.psico.model.Cita;
import com.psico.util.ConexionDB;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CitaDAO {
    private Connection connection;

    public CitaDAO() {
        this.connection = ConexionDB.getInstance().getConnection();
    }

    public boolean registrarCita(Cita cita) {
        System.out.println("DEBUG: CitaDAO.registrarCita - Inicio");
        // Check for overlap
        if (existeCitaEnHorario(cita.getPsicologoId(), cita.getFecha())) {
            System.out.println("DEBUG: CitaDAO.registrarCita - Conflicto de horario detectado");
            return false;
        }
        String sql = "INSERT INTO citas (paciente_id, psicologo_id, fecha, estado, motivo, edad_paciente, tipo_pago, estado_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, cita.getPacienteId());
            ps.setInt(2, cita.getPsicologoId());
            ps.setTimestamp(3, new java.sql.Timestamp(cita.getFecha().getTime()));
            ps.setString(4, "PENDIENTE");
            ps.setString(5, cita.getMotivo());
            ps.setInt(6, cita.getEdadPaciente());
            ps.setString(7, cita.getTipoPago());
            ps.setString(8, cita.getEstadoPago());

            int rows = ps.executeUpdate();
            System.out.println("DEBUG: CitaDAO.registrarCita - Rows affected: " + rows);
            return rows > 0;
        } catch (SQLException e) {
            System.out.println("DEBUG: CitaDAO.registrarCita - SQLException: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private boolean existeCitaEnHorario(int psicologoId, java.util.Date fecha) {
        System.out.println(
                "DEBUG: CitaDAO.existeCitaEnHorario - Checking for psicoId=" + psicologoId + ", fecha=" + fecha);
        // Check if there is any appointment within +/- 59 minutes of the requested time
        // Or simply check if there is an appointment at the same hour and day
        // Assuming appointments are 1 hour long

        String sql = "SELECT COUNT(*) FROM citas WHERE psicologo_id = ? AND fecha > ? AND fecha < ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            // Range: requested time - 59 minutes to requested time + 59 minutes
            // This prevents overlapping appointments
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(fecha);
            cal.add(java.util.Calendar.MINUTE, -59);
            java.sql.Timestamp start = new java.sql.Timestamp(cal.getTimeInMillis());

            cal.setTime(fecha);
            cal.add(java.util.Calendar.MINUTE, 59);
            java.sql.Timestamp end = new java.sql.Timestamp(cal.getTimeInMillis());

            System.out.println("DEBUG: CitaDAO.existeCitaEnHorario - Range: " + start + " to " + end);

            ps.setInt(1, psicologoId);
            ps.setTimestamp(2, start);
            ps.setTimestamp(3, end);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int count = rs.getInt(1);
                System.out.println("DEBUG: CitaDAO.existeCitaEnHorario - Count: " + count);
                return count > 0;
            }
        } catch (SQLException e) {
            System.out.println("DEBUG: CitaDAO.existeCitaEnHorario - SQLException: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    public List<Cita> listarCitasPorUsuario(int usuarioId, String rol) {
        List<Cita> citas = new ArrayList<>();
        String sql = "";
        if ("PACIENTE".equals(rol)) {
            sql = "SELECT c.*, p.nombre as nombre_psicologo FROM citas c JOIN usuarios p ON c.psicologo_id = p.id WHERE c.paciente_id = ?";
        } else if ("PSICOLOGO".equals(rol)) {
            sql = "SELECT c.*, p.nombre as nombre_paciente FROM citas c JOIN usuarios p ON c.paciente_id = p.id WHERE c.psicologo_id = ?";
        } else {
            return citas;
        }

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, usuarioId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Cita c = new Cita();
                c.setId(rs.getInt("id"));
                c.setPacienteId(rs.getInt("paciente_id"));
                c.setPsicologoId(rs.getInt("psicologo_id"));
                c.setFecha(rs.getTimestamp("fecha"));
                c.setEstado(rs.getString("estado"));
                c.setMotivo(rs.getString("motivo"));
                c.setEdadPaciente(rs.getInt("edad_paciente"));
                c.setTipoPago(rs.getString("tipo_pago"));
                c.setEstadoPago(rs.getString("estado_pago"));

                if ("PACIENTE".equals(rol)) {
                    c.setNombrePsicologo(rs.getString("nombre_psicologo"));
                } else {
                    c.setNombrePaciente(rs.getString("nombre_paciente"));
                }
                citas.add(c);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return citas;
    }

    public boolean actualizarEstadoCita(int id, String estado, int psicologoId) {
        String sql = "UPDATE citas SET estado = ? WHERE id = ? AND psicologo_id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, estado);
            ps.setInt(2, id);
            ps.setInt(3, psicologoId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean cancelarCita(int id, int pacienteId) {
        String sql = "UPDATE citas SET estado = 'CANCELADA' WHERE id = ? AND paciente_id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.setInt(2, pacienteId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean actualizarEstadoPago(int id, String estadoPago) {
        String sql = "UPDATE citas SET estado_pago = ? WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, estadoPago);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
