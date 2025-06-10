import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/FRMregistro.css";
//aca se importan los datos que necesita el fotmulario

const FRMregistro = ({ titulo = "formulario inicio de sesion" }) => {

    return(
         <div>
            <button onClick={() => alert('!hiciste click!')}>
            google
            </button>
         </div>
    )
}