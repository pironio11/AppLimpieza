// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurar persistencia
auth.setPersistence('local');

// Validar configuración
const isValidConfig = firebaseConfig.apiKey && 
                     firebaseConfig.authDomain && 
                     firebaseConfig.projectId;

// Verificar configuración en consola
console.log('🔍 Configuración de Firebase cargada:');
console.log('API Key:', firebaseConfig.apiKey ? '✅ Configurada' : '❌ Faltante');
console.log('Auth Domain:', firebaseConfig.authDomain || '❌ Faltante');
console.log('Project ID:', firebaseConfig.projectId || '❌ Faltante');

if (!isValidConfig) {
  console.error('❌ Firebase no está configurado correctamente. Necesitas:');
  console.error('1. Verificar que todas las variables en .env comiencen con REACT_APP_');
  console.error('2. Reiniciar el servidor después de modificar .env');
  console.error('3. Verificar que los dominios estén autorizados en Firebase Console');
} else {
  console.log('✅ Firebase está configurado correctamente');
}

export { app as default };
