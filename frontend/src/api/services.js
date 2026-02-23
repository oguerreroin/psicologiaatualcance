import api from './axios';

// AUTHENTICATION
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerPaciente = async (userData) => {
    const response = await api.post('/auth/register/paciente', userData);
    return response.data; // { message: "..." }
};

export const recuperarPassword = async (email) => {
    const response = await api.post('/auth/recuperar', { email });
    return response.data;
};

// APPOINTMENTS (Generic: works for both PACIENTE and PSICOLOGO via Backend filtering)
export const listarCitas = async () => {
    const response = await api.get('/citas');
    return response.data; // List<Cita>
};

export const crearCita = async (citaData) => {
    const response = await api.post('/citas', citaData);
    return response.data;
};

export const cancelarCita = async (citaId) => {
    const response = await api.delete(`/citas/${citaId}`);
    return response.data;
};

// PSYCHOLOGISTS
export const listarPsicologos = async () => {
    const response = await api.get('/psicologos');
    return response.data; // List<Usuario>
};

export const actualizarEstadoCita = async (citaId, estado) => {
    const response = await api.put(`/psicologo/citas/${citaId}/estado`, { estado });
    return response.data;
};

// ADMIN
export const listarUsuariosAdmin = async () => {
    const response = await api.get('/admin/usuarios');
    return response.data;
};

export const crearPsicologoAdmin = async (psicologoData) => {
    const response = await api.post('/admin/psicologos', psicologoData);
    return response.data;
};

// DEV / SEED
export const seedDatabase = async () => {
    const response = await api.post('/dev/seed-data');
    return response.data;
};
