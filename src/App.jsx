import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FRMregistro from "./componentes/FRMRegistre";
// ...otros imports...
import VistaUsuario from "./vistaUsuario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FRMregistro />} />
        <Route path="/usuario" element={<VistaUsuario />} />
        {/* Otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;