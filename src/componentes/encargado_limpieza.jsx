import React from "react";
import './estilos/encargado.css';   

const EncargadoLimpieza = () => {
  return (
  <div className="GeneralEncargadoLimpieza">
    <div className="tituloinfo">
      <h2 className="Titulo">
        Encargado de limpieza
      </h2>
      <div className="usuario">“Nombre Apellido”</div>
 
      <div className="historial">
        <button className="BotonHistorial">
          Historial de limpiezas
        </button>
      </div>
      
      <div className="reportes">
        <button className="BotonReportes">
          Reportes y Problemas
        </button>
      </div>
    </div>
  </div>
  );
};

export default EncargadoLimpieza;
