package com.psico.dao;

import com.psico.model.Usuario;
import com.psico.util.ConexionDB;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {
    private Connection connection;

    public UsuarioDAO() {
        this.connection = ConexionDB.getInstance().getConnection();
    }

    public Usuario validarUsuario(String email, String password) {
        Usuario usuario = null;
        String sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, email);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNombre(rs.getString("nombre"));
                usuario.setEmail(rs.getString("email"));
                usuario.setRol(rs.getString("rol"));
                usuario.setEspecialidad(rs.getString("especialidad"));
                usuario.setImagenUrl(rs.getString("imagen_url"));
            }
        } catch (SQLException e) {
            System.out.println("DEBUG: Error SQL en validarUsuario: " + e.getMessage());
            e.printStackTrace();
        }
        if (usuario == null) {
            System.out.println("DEBUG: Usuario no encontrado en DB.");
        }
        return usuario;
    }

    public boolean registrarUsuario(Usuario usuario) {
        String sql = "INSERT INTO usuarios (nombre, email, password, rol, especialidad) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, usuario.getNombre());
            ps.setString(2, usuario.getEmail());
            ps.setString(3, usuario.getPassword());
            ps.setString(4, usuario.getRol() != null ? usuario.getRol() : "PACIENTE");
            ps.setString(5, usuario.getEspecialidad());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Usuario> listarPsicologos() {
        List<Usuario> psicologos = new ArrayList<>();
        String sql = "SELECT * FROM usuarios WHERE rol = 'PSICOLOGO'";
        try (PreparedStatement ps = connection.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Usuario u = new Usuario();
                u.setId(rs.getInt("id"));
                u.setNombre(rs.getString("nombre"));
                u.setEmail(rs.getString("email"));
                u.setEspecialidad(rs.getString("especialidad"));
                u.setImagenUrl(rs.getString("imagen_url"));
                psicologos.add(u);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return psicologos;
    }
}
