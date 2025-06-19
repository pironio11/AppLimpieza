import React from "react";
import frmstyle from "../FRM.css";
//aca se importan los datos que necesita el fotmulario

const FRMregistro =() => {

    return(
            <div className="container-FRM">
                <div className="foto"><img src="../fotos/descarga.jfif"></img></div>
                <div classname="titulo1"><h1>Limpieza continua</h1></div>
                <div classname="titulo2"><h2>Bienvenido a la app de limpieza</h2></div>
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
