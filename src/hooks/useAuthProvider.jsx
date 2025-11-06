import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Crear contexto para el estado de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Observador del estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Obtener datos adicionales del usuario desde Firestore
          const userDoc = await getDoc(doc(db, 'usuario', user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: user.uid,
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            gmail: userData.gmail || user.email,
            role: userData.role || 'usuario',
            displayName: `${userData.nombre || ''} ${userData.apellido || ''}`.trim()
          });
          
          console.log('✅ Datos de usuario cargados correctamente');
        } catch (error) {
          console.error('❌ Error al cargar datos del usuario:', error);
          // Si hay error de permisos, al menos establecer datos básicos
          setUser({
            uid: user.uid,
            gmail: user.email,
            role: 'usuario',
            nombre: '',
            apellido: '',
            displayName: user.displayName || ''
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Registro con email/password
  const register = async (email, password, displayName) => {
    try {
      setError(null);
      console.log('🔄 Iniciando registro de usuario...');
      
      // Crear usuario en Authentication
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Extraer nombre y apellido del displayName
      const [nombre = '', apellido = ''] = displayName.split(' ');

      // Crear perfil en Firestore con rol por defecto 'usuario'
      await setDoc(doc(db, 'usuario', user.uid), {
        nombre: nombre,
        apellido: apellido,
        gmail: user.email,
        role: 'usuario', // Por defecto todos son usuarios normales
        authProvider: 'email'
      });

      // Actualizar perfil en Auth
      await updateProfile(user, { displayName });
      
      console.log('✅ Usuario registrado exitosamente como usuario');
      return { ...user, role: 'usuario' };
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Login con email/password
  const login = async (email, password) => {
    try {
      console.log('🔄 Iniciando proceso de login...');
      setError(null);
      
      // Intento de autenticación
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Autenticación exitosa con Firebase Auth');
      
      try {
        // Verificar datos en Firestore
        const userDoc = await getDoc(doc(db, 'usuario', user.uid));
        
        if (!userDoc.exists()) {
          console.log('📝 Creando perfil de usuario en Firestore...');
          // Si el usuario no existe en Firestore, créalo como usuario normal
          const [nombre = '', apellido = ''] = (user.displayName || '').split(' ');
          const userData = {
            nombre: nombre,
            apellido: apellido,
            gmail: user.email,
            role: 'usuario',
            authProvider: 'email'
          };
          await setDoc(doc(db, 'usuario', user.uid), userData);
          console.log('✅ Perfil creado exitosamente');
          return { ...user, ...userData };
        } else {
          console.log('✅ Perfil de usuario encontrado en Firestore');
          const userData = userDoc.data();
          return { ...user, ...userData };
        }
      } catch (firestoreError) {
        console.error('⚠️ Error al acceder a Firestore:', firestoreError);
        // Si hay error, devolver usuario con rol por defecto
        return { ...user, role: 'usuario' };
      }
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account' // Siempre mostrar selector de cuentas
      });
      
      console.log('🔄 Iniciando autenticación con Google...');
      const { user } = await signInWithPopup(auth, provider);
      console.log('✅ Autenticación con Google exitosa');

      // Verificar/crear perfil en Firestore
      const userDoc = await getDoc(doc(db, 'usuario', user.uid));
      
      if (!userDoc.exists()) {
        console.log('📝 Creando nuevo perfil de usuario...');

        // Extraer nombre y apellido del displayName de Google
        const [nombre = '', apellido = ''] = (user.displayName || '').split(' ');
        
        const userData = {
          nombre: nombre,
          apellido: apellido,
          gmail: user.email,
          role: 'usuario', // Por defecto todos son usuarios normales
          authProvider: 'google'
        };
        
        await setDoc(doc(db, 'usuario', user.uid), userData);
        console.log('✅ Perfil creado como usuario');
        return { ...user, ...userData };
      } else {
        const userData = userDoc.data();
        console.log(`✅ Usuario autenticado como ${userData.role}`);
        return { ...user, ...userData };
      }
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Recuperar contraseña
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(formatAuthError(error));
      throw error;
    }
  };

  // Formatear mensajes de error
  const formatAuthError = (error) => {
    console.error('Error detallado:', error);
    
    const errorMessages = {
      // Errores de autenticación básicos
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es demasiado débil',
      
      // Errores de red y timeout
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/timeout': 'Tiempo de espera agotado. Intenta de nuevo',
      'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos',
      
      // Errores de permisos
      'permission-denied': 'Permiso denegado. Contacta al administrador',
      'insufficient-permissions': 'Permisos insuficientes',
      
      // Errores específicos de Google Sign-In
      'auth/popup-closed-by-user': 'Ventana de Google cerrada antes de completar el login',
      'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes e intenta de nuevo',
      'auth/cancelled-popup-request': 'Operación cancelada. Intenta de nuevo',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email pero usando otro método de login',
      
      // Errores de red
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet e intenta de nuevo',
      
      // Errores de timeout
      'auth/timeout': 'La operación expiró. Intenta de nuevo',
      
      // Errores de permisos
      'permission-denied': 'No tienes permiso para realizar esta acción',
      
      // Errores de Firestore
      'firestore/unavailable': 'Error al conectar con la base de datos. Intenta más tarde',
      'firestore/data-loss': 'Error al guardar los datos. Intenta de nuevo'
    };

    return errorMessages[error.code] || 'Error de autenticación';
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};