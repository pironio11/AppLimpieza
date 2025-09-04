import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FRMregistro />} />
          <Route path="/admin" element={<VistaAdmin />} />
          <Route path="/usuario" element={<VistaUsuario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
