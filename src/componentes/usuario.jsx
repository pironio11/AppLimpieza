import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Usuario = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Si Firebase no está configurado, no intentamos suscribirnos
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'usuarios', currentUser.uid));
        if (userDoc.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            ...userDoc.data()
          });
        } else {
          // Si no hay datos adicionales, usar solo los básicos de autenticación
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            nombre: currentUser.displayName || 'Usuario',
            rol: 'usuario'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!auth || !db) {
    return (
      <div style={styles.loadingContainer}>
        <p>Firebase no está configurado. Agrega tus variables REACT_APP_* en el archivo .env y recarga la app.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {user ? `Bienvenido, ${user.nombre || 'Usuario'}` : 'No has iniciado sesión'}
      </h1>

      {user ? (
        <div style={styles.card}>
          <p><strong>Email:</strong> {user.email}</p>
          {user.rol && <p><strong>Rol:</strong> {user.rol}</p>}
          {user.dni && <p><strong>DNI:</strong> {user.dni}</p>}
          {user.telefono && <p><strong>Teléfono:</strong> {user.telefono}</p>}
          
          <div style={styles.buttonContainer}>
            <button 
              style={{ ...styles.button, backgroundColor: '#dc3545' }} 
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <p>No has iniciado sesión</p>
          <div style={styles.buttonContainer}>
            <button 
              style={styles.button}
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: '20px auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  buttonContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 25px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
   },
};

export default Usuario;
