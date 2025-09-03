import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FRMregistro from '../src/pages/FRMregistro';
import VistaAdmin from './VistaAdmin';
import VistaUsuario from './VistaUsuario';
import './App.css';


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
