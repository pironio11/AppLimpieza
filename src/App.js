import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FRMregistro from '../src/pages/FRMregistro';
import VistaAdmin from './views/admin/VistaAdmin';
import VistaUsuario from './views/usuario/VistaUsuario';
import Configuracion from './pages/Configuracion';
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
        {/*<FRMregistro/>
        {/* <EncargadoLimpieza/>
        <ReportesProblemas/>
        <Configuracion/>
        <FRMregistro/> */}
      {/* <Navbar /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FRMregistro />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
