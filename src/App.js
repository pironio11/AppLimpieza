import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FRMregistro from '../src/pages/FRMregistro';
import VistaAdmin from './views/admin/VistaAdmin';
import VistaUsuario from './views/usuario/VistaUsuario';
import './App.css';
// import { Routes, Route } from 'react-router-dom';
// import EncargadoLimpieza from './componentes/encargado_limpieza';
// import FRMregistro from './componentes/FRMRegistre';
// import ReportesProblemas from './componentes/ReportesProblemas';
// import Configuracion from './componentes/Configuracion';
// import Navbar from './componentes/navbar'; // Si tienes un Navbar


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
