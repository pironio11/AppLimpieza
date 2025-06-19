import React from "react";
import './estilos/navbar.css';  


const Navbar = () => {
  return (
    <div className="GeneralNavbar">
      <div className="TituloNavbar">Navbar</div>
      <div className="flex justify-end">
        <button className="CerrarSesion">
          Salir
        </button>
      </div>
    </div>
  );
};

export default Navbar;
