package com.psico.api;

import com.psico.dao.UsuarioDAO;
import com.psico.model.Usuario;
import com.google.gson.Gson;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/psicologos")
public class PsicologoResource {

    private UsuarioDAO usuarioDAO = new UsuarioDAO();
    private Gson gson = new Gson();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPsicologos() {
        List<Usuario> psicologos = usuarioDAO.listarPsicologos();
        String json = gson.toJson(psicologos);
        return Response.ok(json).build();
    }
}
