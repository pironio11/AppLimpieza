import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VistaAdmin from './views/admin/VistaAdmin';
import VistaUsuario from './views/usuario/VistaUsuario';
import './App.css';
import FRMRegistre from './componentes/FRMRegistre';
import ThemeToggle from './componentes/ThemeToggle';
import { auth } from './firebase/config';
import { getRedirectResult } from 'firebase/auth';

function App() {
  useEffect(() => {
    // Manejar el resultado de la redirección
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          // Usuario ha iniciado sesión exitosamente mediante redirección
          console.log('Login exitoso mediante redirección');
        }
      })
      .catch((error) => {
        console.error('Error en redirección:', error);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<FRMRegistre />} />
          <Route path="/admin" element={<VistaAdmin />} />
          <Route path="/usuario" element={<VistaUsuario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
