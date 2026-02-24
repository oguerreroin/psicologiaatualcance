---

## FASE 7: Automatización Avanzada (Despliegue Continuo con GitHub Actions)

Si quieres que al hacer `git push` desde tu computadora Windows el código se vaya a GitHub y mágicamente **se actualice y compile solo en tu VPS** sin que tú tengas que entrar por SSH, configuraremos un flujo de Integración Continua (CI/CD).

### 1. Preparar el VPS para recibir la conexión automática

Tu VPS necesita una llave especial para que GitHub pueda entrar de forma segura a ejecutar los comandos de actualización.

Entra a tu VPS por SSH una vez más y ejecuta:

```bash
# General una llave SSH (Presiona Enter a todo, no le pongas contraseña)
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Autorizar esa llave en el propio servidor
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Mostrar la llave PRIVADA (Copia todo el bloque de texto que salga)
cat ~/.ssh/id_rsa
```

### 2. Configurar los "Secretos" en GitHub

Ve a tu repositorio en GitHub web: [https://github.com/oguerreroin/psicologiaatualcance/](https://github.com/oguerreroin/psicologiaatualcance/)
Navega a: **Settings** -> (Columna izquierda) **Secrets and variables** -> **Actions**.
Crea 3 `New repository secret`:

1. **Nombre:** `VPS_IP`
   - **Valor:** `Tu dirección IP pública (ej. 134.23.45.67)`
2. **Nombre:** `VPS_USER`
   - **Valor:** `root` (o el usuario con el que entras a tu VPS, como ubuntu)
3. **Nombre:** `VPS_SSH_KEY`
   - **Valor:** *(Pega aquí todo el texto gigante de "cat ~/.ssh/id_rsa" que copiaste en el paso anterior)*

### 3. Crear el Archivo de Automatización (En tu Computadora Local)

Abre tu proyecto en VSCode (tu máquina Windows) y crea la siguiente estructura de carpetas exactamente así: `.github/workflows/deploy.yml`

Pega este código dentro de `deploy.yml`:

```yaml
name: Deploy VPS Psicologia a tu Alcance

on:
  push:
    branches: [ main ] # Se ejecutará cada vez que hagas push a main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Conectar al VPS y Desplegar
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.VPS_IP }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          echo "📥 Iniciando Despliegue Automatizado..."
          
          # 1. Navegar a la carpeta del proyecto y bajar cambios
          cd ~/psicologia-a-tu-alcance
          git pull origin main
          
          # 2. Compilar el Backend en Java
          echo "☕ Compilando Spring/Tomcat..."
          mvn clean package
          sudo cp target/psicologia-a-tu-alcance-1.0-SNAPSHOT.war /opt/tomcat/webapps/psicologia-a-tu-alcance.war
          
          # 3. Compilar el Frontend en React
          echo "⚛️ Compilando Interfaz React..."
          cd frontend
          npm install
          npm run build
          
          # 4. Mover la build de React a Nginx
          sudo rm -rf /var/www/psicologia/*
          sudo cp -r dist/* /var/www/psicologia/
          sudo chown -R www-data:www-data /var/www/psicologia
          
          echo "✅ ¡Despliegue Completado Exitosamente!"
```

### 4. La Magia Final ✨

A partir de ahora, toda tu vida de desarrollador será así:

1. Haces un cambio de código en React o Java.
2. Abres la consola en VSCode y escribes:

   ```bash
   git add .
   git commit -m "Agregué un nuevo botón al dashboard"
   git push
   ```

3. GitHub toma ese código, se conecta en silenció a tu VPS, compila el Maven, construye las carpetas *dist* de Node y mueve los archivos a producción por sí solo en menos de 2 minutos.
