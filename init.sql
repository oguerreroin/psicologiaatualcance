CREATE DATABASE IF NOT EXISTS db_psicologia;
USE db_psicologia;

-- Tabla de Usuarios (Pacientes, Psicólogos, Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('PACIENTE', 'PSICOLOGO', 'ADMIN') NOT NULL,
    especialidad VARCHAR(100), -- Solo para psicólogos
    imagen_url VARCHAR(255) -- URL de la foto de perfil
);

-- Tabla de Citas
CREATE TABLE IF NOT EXISTS citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    psicologo_id INT NOT NULL,
    fecha DATETIME NOT NULL,
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ATENDIDO', 'REPROGRAMADO') DEFAULT 'PENDIENTE',
    motivo TEXT,
    edad_paciente INT,
    tipo_pago ENUM('ONLINE', 'PRESENCIAL'),
    estado_pago ENUM('PENDIENTE', 'PAGADO') DEFAULT 'PENDIENTE',
    FOREIGN KEY (paciente_id) REFERENCES usuarios(id),
    FOREIGN KEY (psicologo_id) REFERENCES usuarios(id)
);

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50),
    FOREIGN KEY (cita_id) REFERENCES citas(id)
);

-- Inserts de prueba
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Admin', 'admin@psico.com', 'admin123', 'ADMIN'),
('Juan Perez', 'juan@mail.com', '123456', 'PACIENTE');

INSERT INTO usuarios (nombre, email, password, rol, especialidad, imagen_url) VALUES 
('Dr. Ana Lopez', 'ana@psico.com', '123456', 'PSICOLOGO', 'Psicología Clínica', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80'),
('Dr. Carlos Ruiz', 'carlos@psico.com', '123456', 'PSICOLOGO', 'Psicología Infantil', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80');

INSERT INTO citas (paciente_id, psicologo_id, fecha, estado, motivo, edad_paciente, tipo_pago, estado_pago) VALUES
(2, 3, '2023-12-01 10:00:00', 'PENDIENTE', 'Ansiedad por el trabajo', 30, 'ONLINE', 'PAGADO');
