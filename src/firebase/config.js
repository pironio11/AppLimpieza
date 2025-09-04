// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// Configuración temporal para desarrollo - reemplaza con tus credenciales reales
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDemo-Replace-With-Real-Key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "limpieza-app-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "limpieza-app-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "limpieza-app-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:demo123"
};

// Validar configuración
const isValidConfig = firebaseConfig.apiKey && 
                     firebaseConfig.authDomain && 
                     firebaseConfig.projectId &&
                     !firebaseConfig.apiKey.includes('Demo');

if (!isValidConfig) {
  console.warn('⚠️ Firebase no está configurado correctamente. Necesitas:');
  console.warn('1. Crear proyecto en https://console.firebase.google.com/');
  console.warn('2. Habilitar Authentication > Google');
  console.warn('3. Copiar credenciales al archivo .env');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
