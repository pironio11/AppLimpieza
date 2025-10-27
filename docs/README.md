Este es el archivo principal que verán los usuarios y desarrolladores al clonar el repositorio.
Markdown
# AppLimpieza - Sistema de Gestión de Limpieza EPET N°20
## 🎯 Descripción del Proyecto
**AppLimpieza** es un sistema web integral (Single Page Application - SPA) diseñado para
la EPET N°20 para gestionar, coordinar y supervisar las tareas de limpieza. El sistema
soporta dos roles principales: **Administrador** (gestión de personal y tareas) y **Usuario**
(personal de limpieza, ejecución de tareas y reportes de problemas).
---
## 🛠 Tecnologías Utilizadas
| Componente | Tecnología | Versión |
| :--- | :--- | :--- |
| **Frontend** | React | 18.3.1 |
| **Routing** | React Router DOM | 7.8.2 |
| **Backend** | Firebase | 12.2.1 |
| **Base de Datos** | Firestore (NoSQL) | - |
| **Autenticación** | Firebase Auth + Google OAuth | - |
---
## 🚀 Instrucciones para Clonar y Ejecutar Localmente
Siga estos pasos para levantar la aplicación en su entorno de desarrollo.
### 1. Requisitos
* Node.js (v18+)
* Git
### 2. Clonar el Repositorio
Abra su terminal y ejecute:
```bash
# Clonar el proyecto
git clone [URL_DEL_REPOSITORIO_DE_GIT_AQUÍ]
# Navegar a la carpeta
cd AppLimpieza
3. Instalar Dependencias
Bash
npm install
# o si usa Yarn: yarn install
4. Configurar Variables de Entorno
IMPORTANTE: La aplicación requiere credenciales de Firebase.
1. Cree un archivo llamado .env en la raíz del proyecto.
2. Agregue las claves de configuración de su proyecto de Firebase (ver la plantilla
completa en /docs/guia-desarrolladores.md).
5. Iniciar la Aplicación (Modo Desarrollo)
Bash
npm start
La aplicación se abrirá automáticamente en su navegador en http://localhost:3000.
Los cambios en el código se reflejarán en vivo.
6. Compilar para Producción
Para generar el código optimizado y minificado listo para el deploy:
Bash
npm run build
Esto creará una carpeta /build que puede ser desplegada en Firebase Hosting o
cualquier otro servicio de alojamiento estático.
📚 Documentación
Toda la documentación técnica y el manual de usuario se encuentran en la carpeta /docs:
● manual.pdf: Manual de usuario final.
● estructura.md: Mapa completo de carpetas.
● guia-desarrolladores.md: Guía para configurar el entorno y contribuir.
● diagrama-componentes.[formato]: Ilustración del flujo de la aplicación.