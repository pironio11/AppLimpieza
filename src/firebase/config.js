// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxwhviVt4qjcUF8t5qP2Y3s_Mjzq19CFc",
  authDomain: "app-limpieza-51058.firebaseapp.com",
  projectId: "app-limpieza-51058",
  storageBucket: "app-limpieza-51058.appspot.com", // Corregido el dominio del storage
  messagingSenderId: "496680278963",
  appId: "1:496680278963:web:66957f0d7a7c859dba89c6",
  measurementId: "G-8S1NGJQRVM"
};

// Validar configuración
const isValidConfig = firebaseConfig.apiKey && 
                     firebaseConfig.authDomain && 
                     firebaseConfig.projectId;

// Verificar configuración en consola
console.log('🔍 Configuración de Firebase cargada:', {
  apiKey: firebaseConfig.apiKey ? '✅ Configurada' : '❌ Faltante',
  authDomain: firebaseConfig.authDomain ? '✅ Configurada' : '❌ Faltante',
  projectId: firebaseConfig.projectId ? '✅ Configurada' : '❌ Faltante', 
  storageBucket: firebaseConfig.storageBucket ? '✅ Configurada' : '❌ Faltante',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Configurada' : '❌ Faltante',
  appId: firebaseConfig.appId ? '✅ Configurada' : '❌ Faltante' 
});

if (!isValidConfig) {
  console.error('❌ Firebase no está configurado correctamente. Necesitas:');
  console.error('1. Verificar que todas las variables en .env comiencen con REACT_APP_');
  console.error('2. Reiniciar el servidor después de modificar .env');
  console.error('3. Verificar que los dominios estén autorizados en Firebase Console');
  throw new Error('Configuración de Firebase incompleta');
}

// Inicializa Firebase
let app;
let auth;
let db;
let functions;
let googleProvider;

try {
  // Inicializar Firebase solo si no está ya inicializado
  if (!app) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App inicializada');
  }
  
  // Obtener instancias
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
  
  // Habilitar persistencia offline para Firestore (opcional)
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('💡 La persistencia offline requiere una sola pestaña abierta');
    } else if (err.code === 'unimplemented') {
      console.warn('💡 El navegador no soporta persistencia offline');
    }
  });
  
  console.log('✅ Firestore configurado correctamente');
  
  // Solo usar emuladores si explícitamente se indica
  if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
    console.log('🔧 Usando emuladores de Firebase');
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }

  // Configurar proveedor de Google
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  console.log('✅ Firebase está configurado correctamente');
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
  throw error;
}

// Exportar las instancias inicializadas
export { auth, db, googleProvider };
export default app;