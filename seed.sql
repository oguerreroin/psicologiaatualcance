-- seed.sql
-- Inserción de datos iniciales requeridos para E2E Testing
USE db_psicologia;
-- Limpiar tablas para idempotecia (opcional durante testing)
-- DELETE FROM citas;
-- DELETE FROM usuarios;
-- ALTER TABLE usuarios AUTO_INCREMENT = 1;
-- 1. Insertar ADMIN y PACIENTE de prueba
INSERT INTO usuarios (nombre, email, password, rol)
VALUES (
        'Admin Prueba',
        'admin@psico.com',
        '123456',
        'ADMIN'
    ),
    (
        'Paciente Prueba',
        'paciente@psico.com',
        '123456',
        'PACIENTE'
    ) ON DUPLICATE KEY
UPDATE nombre = nombre;
-- 2. Insertar 3 Psicólogos de prueba
INSERT INTO usuarios (
        nombre,
        email,
        password,
        rol,
        especialidad,
        imagen_url
    )
VALUES (
        'Dr. Roberto Garcia',
        'roberto@psico.com',
        '123456',
        'PSICOLOGO',
        'Terapia de Pareja',
        'https://images.unsplash.com/photo-1612349317112-a1f0a2ba8b4a?auto=format&fit=crop&q=80'
    ),
    (
        'Dra. Maria Fernandez',
        'maria@psico.com',
        '123456',
        'PSICOLOGO',
        'Terapia Infantil y Adolescencia',
        'https://images.unsplash.com/photo-1594824436904-7a195eac5525?auto=format&fit=crop&q=80'
    ),
    (
        'Dr. Carlos Ruiz',
        'carlos@psico.com',
        '123456',
        'PSICOLOGO',
        'Psicología Cognitivo Conductual',
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80'
    ) ON DUPLICATE KEY
UPDATE nombre = nombre;
-- Nota: Las contraseñas aquí están en texto plano (123456) según la lógica original 
-- de AuthBean y UsuarioDAO del proyecto actual para coincidir con la validación `equals`.