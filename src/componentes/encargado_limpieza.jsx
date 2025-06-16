import React from "react";
import './estilos/encargado.css';  
import avatar from '../imagenes/logoepet.jpg';
import Navbar from './navbar';
import Footer from './footer';

const EncargadoLimpieza = () => {
  return (
    <div>
      <Navbar />
  <div className="GeneralEncargadoLimpieza">
    <div className="tituloinfo">
      <img src={avatar} alt="Encargado" className="fotoPerfil" />
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
    <Footer />
    </div>
    </div>
  );
};

export default EncargadoLimpieza;
