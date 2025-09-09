import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FRMregistro from "./componentes/FRMRegistre";
// ...otros imports...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FRMregistro />} />
        {/* Otras rutas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;