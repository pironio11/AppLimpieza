import React from "react";
import './estilos/Tareas.css';
const Tareas = () => {
  <div>
     <div class name="tareas-container">
        <div class name="tareas">
            <p>Tareas a completar</p>
            <div className="aula15">

                <p>Aula 15</p>
                <div className="barrer">
                <input type="checkbox" />
                <label>barrer el piso</label>
                </div>
                <div className="bancos">               
                <input type="checkbox"/>
                <label>Ordenar los bancos</label>
                </div>
                <div className="ventanas">
                <input type="checkbox"/>
                <label>Limpiar las ventanas</label>
                </div>
                <div className="sillas">
                <input type="checkbox"/>
                <label>Ordenar las sillas</label>
                </div>
                <button>Enviar</button>
            </div>
        </div>
    </div>
 </div>
};
export default Tareas;