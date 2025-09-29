import React from "react";
import './estilos/Tareas.css';

const Tareas = () => {
  return (
    <div>
      <div className="tareas-container">
        <div className="tareas">
          <p>Tareas a completar</p>
          <div className="aula15">
            <p>Aula 15</p>
            <div className="barrer">
              <input type="checkbox" id="barrer" />
              <label htmlFor="barrer">barrer el piso</label>
            </div>
            <div className="bancos">
              <input type="checkbox" id="bancos" />
              <label htmlFor="bancos">Ordenar los bancos</label>
            </div>
            <div className="ventanas">
              <input type="checkbox" id="ventanas" />
              <label htmlFor="ventanas">Limpiar las ventanas</label>
            </div>
            <div className="sillas">
              <input type="checkbox" id="sillas" />
              <label htmlFor="sillas">Ordenar las sillas</label>
            </div>
            <button>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tareas;