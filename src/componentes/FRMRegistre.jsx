import React from "react";
import frmstyle from "../FRM.css";
import epetfoto from '../imagenes/epetfoto.jpg';
//aca se importan los datos que necesita el fotmulario

const FRMregistro =() => {

    return(
            <div className="container-FRM">
                <div className="fotoEpet"><img src={epetfoto} alt="imagen de epet20" heigth="168" width="300" title="epet20"></img></div>
                <div className="titulo1"><h1>Limpieza continua</h1></div>
                <div className="titulo2"><h2>Bienvenido a la app de limpieza</h2></div>
                <div className="botongoogle" >
                     <button onClick={() => alert('!hiciste click!')}>
                     google
                     </button>
                </div>
                <div className="enviar">
                    <button type="submit">Enviar</button>
                </div>
            </div>
    )
}

export default FRMregistro;
