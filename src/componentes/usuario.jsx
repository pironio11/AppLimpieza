import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import './estilos/usuario.css';

const Usuario = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'usuarios', currentUser.uid));
        if (userDoc.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            ...userDoc.data(),
          });
        } else {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            nombre: currentUser.displayName || 'Usuario',
            rol: 'usuario',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('auth.token');
      localStorage.removeItem('auth.user');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Cargando información del usuario...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="usuario-component">
        <div className="usuario-container">
          <h1 className="usuario-title">No has iniciado sesión</h1>
          <div className="usuario-card">
            <p>Por favor, inicia sesión para ver tu información.</p>
            <div className="usuario-button-container">
              <button className="usuario-button" onClick={() => navigate('/')} >
                Ir a inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="usuario-component">
      <div className="usuario-container">
        <h1 className="usuario-title">Bienvenido, {user.nombre || 'Usuario'}</h1>

        <div className="usuario-card">
          <p><strong>Email:</strong> {user.email}</p>
          {user.rol && <p><strong>Rol:</strong> {user.rol}</p>}
          {user.dni && <p><strong>DNI:</strong> {user.dni}</p>}
          {user.telefono && <p><strong>Teléfono:</strong> {user.telefono}</p>}
        </div>

        <div className="usuario-card">
          <p className="usuario-info">
            Gestioná tus reportes desde este panel. Usá el botón "Nuevo Reporte" de arriba y
            la lista inferior para ver su estado.
          </p>
        </div>

        <div className="usuario-button-container">
          <button className="usuario-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
