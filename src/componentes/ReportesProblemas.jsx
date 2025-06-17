import React from "react";
import './estilos/ReportesProblemas.css';
import './footer';
import './navbar';
import Navbar from "./navbar";

const ReportesProblemas = () => {
  return (
    <div>
      <Navbar/>
    <div className="reportes-container">
      <h2>Reportes / Problemas</h2>
      <div className="reporte">
        <p><strong>Basura en el suelo</strong></p>
        <p>Aula 15</p>
        <span className="estado en-proceso">En Proceso</span>
        <p className="fecha">Ayer</p>
      </div>
      <div className="reporte">
        <p><strong>Manchas en el suelo</strong></p>
        <p>Aula 17</p>
        <span className="estado resuelto">Resuelto</span>
        <p className="fecha">17 abr</p>
      </div>
    </div>
    <footer/>
</div>
  );
};

export default ReportesProblemas;
