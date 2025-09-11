import React from 'react';
import './estilos/usuario.css';

const Usuario = () => {
  const user = {
    nombre: 'Juan Pérez',
    email: 'juanperez@gmail.com',
    rol: 'Usuario',
  };

  const handleLogout = () => {
    alert('Sesión cerrada');
  };

  return (
    <div className="usuario-component">
      <div className="usuario-container">
        <h1 className="usuario-title">Bienvenido, {user.nombre}</h1>

        <div className="usuario-card">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
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
