import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FRMregistro from "./componentes/FRMRegistre";
// ...otros imports...
import VistaUsuario from "./vistaUsuario";
import ChatBot from "./components/ChatBot/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FRMregistro />} />
        <Route path="/usuario" element={<VistaUsuario />} />
        {/* Otras rutas */}
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}

export default App;