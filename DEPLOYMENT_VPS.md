# Guía de Despliegue: GitHub y VPS (Ubuntu/Debian)

Esta guía detalla los pasos exactos para subir todo el proyecto "Psicología a tu Alcance" a un repositorio en GitHub y posteriormente desplegarlo en un servidor VPS (Virtual Private Server) con Linux.

---

## FASE 1: Subir el Código a GitHub

Antes de subir el proyecto, debemos asegurarnos de no incluir las carpetas pesadas o autogeneradas (`node_modules` y `target`).

### 1. Crear / Verificar el archivo `.gitignore`

En la raíz de tu proyecto (donde está la carpeta `frontend` y el `pom.xml`), asegúrate de tener un archivo llamado `.gitignore` con el siguiente contenido:

```gitignore
# Maven
target/
*.war

# Node e IDEs
frontend/node_modules/
frontend/dist/
.vscode/
.idea/
```

### 2. Inicializar Git y Subir a GitHub

Abre tu terminal en la carpeta principal del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Versión final para Producción (Backend + Frontend)"
git branch -M main

# Reemplaza la siguiente URL con la de tu repositorio vacío en GitHub
git remote add origin https://github.com/tu-usuario/psicologia-a-tu-alcance.git
git push -u origin main
```

---

## FASE 2: Preparar el VPS (Ubuntu 22.04 / 24.04)

Conéctate por SSH a tu servidor VPS. Necesitaremos instalar: Java 17, Maven, Tomcat 10, MySQL, Node.js y Nginx.

### 1. Actualizar el sistema e instalar dependencias base

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install default-jdk maven git nginx mysql-server -y
```

### 2. Instalar Tomcat 10

```bash
cd /tmp
wget https://downloads.apache.org/tomcat/tomcat-10/v10.1.34/bin/apache-tomcat-10.1.34.tar.gz
sudo mkdir /opt/tomcat
sudo tar xzvf apache-tomcat-10.1.34.tar.gz -C /opt/tomcat --strip-components=1

# Dar permisos de ejecución
sudo chmod +x /opt/tomcat/bin/*.sh

# Iniciar Tomcat (Temporal)
/opt/tomcat/bin/startup.sh
```

*(Verifica que Tomcat funcione entrando a `http://TU_IP_PÚBLICA:8080/`)*

### 3. Instalar Node.js (Para construir el Frontend)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## FASE 3: Configurar Base de Datos MySQL

En el VPS, ingresa a MySQL:

```bash
sudo mysql
```

Dentro de MySQL, crea la base de datos y el usuario (ajusta contraseñas si es necesario):

```sql
CREATE DATABASE db_psicologia;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'Os98645763';
GRANT ALL PRIVILEGES ON db_psicologia.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

*(Luego, importa tu script SQL para crear las tablas, tal como lo hiciste en tu máquina local).*

---

## FASE 4: Despliegue del Backend (Java / Tomcat)

### 1. Clonar el repositorio

```bash
cd ~
git clone https://github.com/tu-usuario/psicologia-a-tu-alcance.git
cd psicologia-a-tu-alcance
```

### 2. Compilar con Maven

```bash
mvn clean package
```

Esto generará el archivo `target/psicologia-a-tu-alcance-1.0-SNAPSHOT.war`. Vamos a moverlo a Tomcat eliminando el sufijo largo para que la URL sea sencilla:

```bash
sudo cp target/psicologia-a-tu-alcance-1.0-SNAPSHOT.war /opt/tomcat/webapps/psicologia-a-tu-alcance.war
```

*Tomcat desempaquetará automáticamente el archivo. Tu API estará viva en `http://TU_IP_PÚBLICA:8080/psicologia-a-tu-alcance/api/`.*

---

## FASE 5: Despliegue del Frontend (React / Vite)

### 1. Modificar variables de entorno

Antes de construir, debes decirle a React dónde está tu backend real en Internet.

```bash
cd frontend
nano .env.production
```

Añade o edita esta línea con la URL de tu API (Nota: Usaremos Nginx como Reverse Proxy, por lo que llamará al dominio principal en la ruta `/api`):

```env
VITE_API_BASE_URL=/psicologia-a-tu-alcance/api
```

### 2. Construir la versión de producción

```bash
npm install
npm run build
```

### 3. Mover el Frontend al Servidor Web (Nginx)

Transfiere los archivos construidos (`dist/`) al directorio público de Nginx:

```bash
sudo mkdir -p /var/www/psicologia
sudo cp -r dist/* /var/www/psicologia/
sudo chown -R www-data:www-data /var/www/psicologia
```

---

## FASE 6: Configurar Nginx (Reverse Proxy + SPA)

Nginx servirá tu aplicación React en el puerto 80 y reenviará las peticiones `/psicologia-a-tu-alcance/api` internamente hacia Tomcat en el puerto 8080. Esto **resuelve automáticamente todos los problemas de CORS**.

### 1. Crear el archivo de configuración

```bash
sudo nano /etc/nginx/sites-available/psicologia
```

Pega esta configuración exacta:

```nginx
server {
    listen 80;
    server_name TU_IP_PÚBLICA_O_DOMINIO;

    root /var/www/psicologia;
    index index.html;

    # 1. Rutas del Frontend React (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Reverse Proxy hacia Backend Tomcat (API)
    location /psicologia-a-tu-alcance/ {
        proxy_pass http://localhost:8080/psicologia-a-tu-alcance/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 2. Activar la configuración y reiniciar Nginx

```bash
sudo ln -s /etc/nginx/sites-available/psicologia /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
```

---

## 🎉 Despliegue Completado

Ahora puedes abrir el navegador y entrar a la dirección de tu VPS (ej. `http://MI_IP_VPS/`).

1. React cargará la interfaz inmediatamente.
2. Todas tus peticiones al backend pasarán automáticamente de Nginx ➡️ Tomcat.
3. Tus contraseñas (como el admin configurado) funcionarán directo desde el VPS.
