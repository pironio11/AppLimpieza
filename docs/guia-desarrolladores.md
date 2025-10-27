Este documento proporciona la información esencial para que cualquier nuevo desarrollador pueda configurar su entorno, ejecutar el proyecto y comprender las tecnologías clave.Markdown# 🛠️ Guía para Nuevos Desarrolladores - AppLimpieza

## 1. Introducción

Bienvenido/a al equipo de desarrollo de **AppLimpieza**, el Sistema de Gestión de Limpieza de la EPET N°20. Este documento es su punto de partida para configurar el entorno de desarrollo y comenzar a contribuir.

## 2. Requisitos Previos

Asegúrese de tener instaladas las siguientes herramientas en su sistema:

| Herramienta | Versión Mínima | Propósito |
| :--- | :--- | :--- |
| **Node.js** | 18+ | Entorno de ejecución de JavaScript. |
| **npm** | 9+ | Gestor de paquetes de Node.js (incluido con Node). |
| **Git** | Más reciente | Control de versiones. |
| **Editor de Código** | VS Code (Recomendado) | Para desarrollo y depuración. |

## 3. Configuración del Entorno Local

Siga estos pasos para obtener una copia local del proyecto y prepararla para la ejecución.

### 3.1. Clonación del Repositorio

Abra su terminal (o Git Bash) y ejecute los siguientes comandos:

```bash
# Reemplazar por la URL real del repositorio
git clone [URL_DEL_REPOSITORIO_AQUÍ] 
cd AppLimpieza
3.2. Instalación de DependenciasEl proyecto utiliza npm para la gestión de paquetes.Bashnpm install
3.3. Configuración de Variables de Entorno (FIREBASE)Para conectar la aplicación con la base de datos y la autenticación de Firebase, es obligatorio crear un archivo de configuración.Cree un archivo llamado .env en la raíz del proyecto.Copie y pegue la siguiente plantilla de configuración (sustituyendo los valores por sus credenciales reales de Firebase):Fragmento de código# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=tu_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com

# Environment
REACT_APP_ENV=development
⚠️ Alerta de Seguridad: Verifique que el archivo .gitignore incluya la línea .env para evitar subir credenciales sensibles.4. Scripts de Ejecución (Apéndice F)Utilice los siguientes comandos para trabajar con el proyecto:ComandoDescripciónnpm startInicia el servidor de desarrollo en http://localhost:3000. Soporta Hot Reload.npm run buildCompila la aplicación para producción, creando una carpeta /build optimizada y lista para el deploy.npm testEjecuta la suite de pruebas automatizadas.5. Estructura y Tecnologías Clave5.1. Estructura de CarpetasLa lógica principal de la aplicación reside en la carpeta src/ (Ver /docs/estructura.md para el mapa completo).DirectorioPropósitosrc/views/Contiene los componentes de página completa (ej: VistaAdmin.jsx).src/componentes/Componentes de UI reutilizables (ej: Navbar, ThemeToggle).src/contexts/Lógica de estado global (ej: ThemeContext.js).src/firebase/Inicialización y configuración del SDK de Firebase.5.2. Dependencias Relevantes (Apéndice E)PaqueteRolreactFramework principal de la UI.react-router-domManejo de navegación entre /admin y /usuario.firebaseBackend as a Service (Autenticación y Base de Datos).@google-cloud/local-authSoporte para el login de Google.6. Estándares y ConvencionesConvención de Nombres: Utilizar PascalCase para los componentes de React (MiComponente.jsx).Estilos: Los estilos se manejan mediante CSS Modules (.css anidados en componentes/estilos/).Roles: La lógica de permisos debe implementarse en la capa de Routing (App.js) y reforzarse en los componentes.