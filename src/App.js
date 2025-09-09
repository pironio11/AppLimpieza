import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FRMregistro from '../src/pages/FRMregistro';
import VistaAdmin from './views/admin/VistaAdmin';
import VistaUsuario from './views/usuario/VistaUsuario';
import Configuracion from './pages/Configuracion';
import './App.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import ReportesProblemas from './componentes/ReportesProblemas';
import Configuracion from './componentes/Configuracion';
import Tareas from './componentes/tareas';

function App() {
  return (
    <div className="App">
        <FRMregistro/>
        {/* <EncargadoLimpieza/>
        <ReportesProblemas/>
        <Configuracion/>
        <FRMregistro/> */}
      {/* <Navbar /> */}
      {/* <Routes>
        <Route path="/" element={<EncargadoLimpieza />} />
        <Route path="/reportes" element={<ReportesProblemas />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/registro" element={<FRMregistro />} />
      </Routes> */}
    </div>
  );
}

export default App;
