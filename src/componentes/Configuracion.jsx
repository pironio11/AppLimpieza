import React from 'react';
import './estilos/Configuracion.css';

const Configuracion = () => {
  return (
    <div className="configuracion-container">
      <h2>Configuración</h2>
      <button className="config-btn">Gestión de usuarios</button>
      <button className="config-btn">Asignación de tareas</button>
      <button className="config-btn">Estadísticas y reportes generales</button>
    </div>
  );
};

export default Configuracion;
