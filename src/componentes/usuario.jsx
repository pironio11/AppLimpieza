import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthProvider';
import './estilos/usuario.css';

const Usuario = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirigir si no hay usuario (después del logout)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // No navegues aquí, el useEffect de arriba lo hará
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  if (loading || isLoggingOut) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>{isLoggingOut ? 'Cerrando sesión...' : 'Cargando información del usuario...'}</p>
      </div>
    );
  }
  
  if (!user) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="usuario-component">
      <div className="usuario-container">
        <h1 className="usuario-title">Bienvenido, {user.nombre || user.displayName || 'Usuario'}</h1>

        <div className="usuario-card">
          <p><strong>Email:</strong> {user.gmail || user.email}</p>
          {user.role && <p><strong>Rol:</strong> {user.role}</p>}
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
          <button 
            className="usuario-button" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usuario;