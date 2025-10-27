AppLimpieza/
│
├── public/                     # Contenido estático servido directamente (index.html, assets)
│   ├── index.html
│   └── assets/
│       └── imagenes/
│
├── src/                        # CÓDIGO FUENTE DE REACT
│   ├── App.js                      # Componente Raíz y Routing
│   ├── index.js                # Punto de entrada
│   ├── componentes/            # Componentes reutilizables de UI
│   │   ├── estilos/            # CSS para componentes
│   │   └── (archivos .jsx)
│   │
│   ├── views/                  # Vistas completas de la aplicación (páginas)
│   │   ├── admin/
│   │   └── usuario/
│   │
│   ├── contexts/               # Context API (manejo de estado global)
│   └── firebase/               # Configuración de servicios backend
│   └── imagenes/               # Imágenes internas
│
├── docs/                       # DOCUMENTACIÓN TÉCNICA
├── package.json                # Dependencias y scripts
├── README.md                   # Instrucciones generales
└── .gitignore                  # Archivos ignorados por Git