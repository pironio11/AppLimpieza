import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Inicio() {
  return (
    <div className="inicio-container">
      <h1>Bienvenido a la Aplicación de Limpieza</h1>
      <div className="botones-inicio">
        <Link to="/usuario" className="boton-inicio">Acceso Usuario</Link>
        <Link to="/admin" className="boton-inicio">Acceso Administrador</Link>
      </div>
    </div>
  );
}

export default Inicio;
