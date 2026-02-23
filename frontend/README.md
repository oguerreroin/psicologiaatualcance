# Psicología a tu Alcance - Arquitectura RBAC Integrada (Vite + Java Servlets)

Este repositorio contiene la integración End-to-End funcional incorporando Control de Acceso Basado en Roles (RBAC), separando los flujos funcionales para **Pacientes**, **Psicólogos** y **Administradores**.

## 🚀 Arquitectura Implementada

1. **Backend (Java HTTP Servlets)**
   - API nativa ligera utilizando `com.google.code.gson` sobre Tomcat.
   - **`AuthServlet`**: Generación de tokens y persistencia de Sesiones.
   - **`CitasServlet`**: GET/POST/DELETE polimórfico detectando el Rol del solicitante para filtrar seguridad y permitir Reservas/Cancelaciones.
   - **`PsicologoServlet`**: Edita estados de la Cita (Atendida/Cancelada)
   - **`AdminServlet`**: Lee el directorio de sistema y permite reclutar Especialistas clínicos.
   - **`SeedServlet`**: Endpoint de inyección Mock (`POST /api/dev/seed-data`).

2. **Frontend (React 19 + Vite)**
   - Router protegido por el componente `RoleGuard.jsx` redirigiendo al usuario al dashboard correcto según JWT.
   - **Paciente**: Puede reservar (`POST /citas`), listar citas filtradas y cancelar sesiones (`DELETE /citas`).
   - **Psicólogo**: Visualiza su agenda estructurada y dicta las evoluciones.
   - **Admin**: Accede a una interfaz general de configuración de sistema (`/admin/dashboard`) y alimenta la BD nativamente mediante un clickazo de testeo E2E.

## ⚙️ Cómo Levantar el Entorno Full-Stack

### 1. Backend (Apache Tomcat + Java 17)

En el directorio raíz del backend (`/DWI`), compila y lanza la versión con Servlets expuestos:

```bash
mvn clean package cargo:run
```

### 2. Frontend (React)

En el directorio `/DWI/frontend` arranca Vite:

```bash
npm install
npm run dev
```

## 🧪 Validación de Roles (Checklist E2E)

Si la base de MySQL `db_psicologia` está vacía, no necesitas inyectar SQL manual. Realiza el siguiente flujo transversal:

1. **Seed Data (Semilla Automática)**
   - Ingresa al formulario de login como un paciente fantasma (para forzar mock, o simplemente registra una cuenta de prueba).
   - *Ruta rápida:* Al intentar visualizar tu panel, o levantando manualmente una cuenta. Si modificamos tu BD para empezar de cero, el React fallará. **¡Usa Postman o el Botón "Cargar Data Mock" del Dashboard de Admin (tras registrar un admin manualmente o por BD)!**
   *Credenciales autogeneradas tras correr el Seed (botón o /dev/seed-data):*
   - **Admin:** `admin@psico.com` | `123456`
   - **Psicólogo:** `psicologo1@psico.com` | `123456`
   - **Paciente:** `paciente1@psico.com` | `123456`

2. **[Prueba Administrador]**
   - Login -> `admin@psico.com` -> Redirige a `/admin/dashboard`.
   - Crea un Psicólogo ("Dr. Ejemplo"). Aparecerá en el directorio dinámico al instante.
   - *Seguridad:* Intenta escribir `/citas` o `/psicologo/dashboard` en la URL. Serás expulsado al panel Admin de nuevo.

3. **[Prueba Paciente]**
   - Login -> `paciente1@psico.com` -> Redirige a `/citas`.
   - Selecciona el desplegable y escoge un Psicólogo (incluyendo el recién creado).
   - Agenda para mañana a las 10 AM modalidad ONLINE. Verás la alerta de éxito y la grilla cargará la sesión "PENDIENTE" y pago "PAGADO".
   - *Intenta Cancelar:* Pulsa "Cancelar Sesión".

4. **[Prueba Psicólogo]**
   - Cierra sesión y entra como `psicologo1@psico.com`. -> Redirige a `/psicologo/dashboard`.
   - Verás en pantalla gigante a tu Paciente asignado.
   - Pulsa "Atendida".

## 🛡️ Manejo de Errores Globales

- **Backend Apagado:** Axios arroja "Error de conectividad".
- **Token Vencido / Desconectado:** Generará HTTP 401 en consola, Axios lo interceptará y te borrará del localStorage, forzando un log out agresivo.
- **Acceso Cruzado:** Un Paciente no puede entrar al panel del admin. `RoleGuard` lo rebota por falta de validación de Array en Roles.
