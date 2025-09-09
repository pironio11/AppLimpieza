import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FRMregistro from '../src/pages/FRMregistro';
import VistaAdmin from './views/admin/VistaAdmin';
import VistaUsuario from './views/usuario/VistaUsuario';
import './App.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import ReportesProblemas from './componentes/ReportesProblemas';
import Configuracion from './componentes/Configuracion';
import Tareas from './componentes/tareas';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<FRMregistro />} />
          <Route path="/admin" element={<VistaAdmin />} />
          <Route path="/usuario" element={<VistaUsuario />} />
          <Route path="/encargado" element={<EncargadoLimpieza />} />
          <Route path="/reportes" element={<ReportesProblemas />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/tareas" element={<Tareas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
