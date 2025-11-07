import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VistaAdmin from './views/admin/VistaAdmin';
import VistaUsuario from './views/usuario/VistaUsuario';
import './App.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import FRMRegistre from './componentes/FRMRegistre';
import ReportesProblemas from './componentes/ReportesProblemas';
import Configuracion from './componentes/Configuracion';
import Tareas from './componentes/tareas';
import ThemeToggle from './componentes/ThemeToggle';
import { auth } from './firebase/config';
import { getRedirectResult } from 'firebase/auth';
import { AuthProvider } from './hooks/useAuthProvider';



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
  
  const basename = React.useMemo(() => {
    const url = process.env.PUBLIC_URL || '';
    try {
      const u = new URL(url, window.location.origin);
      return u.pathname || '/';
    } catch {
      return url || '/';
    }
  }, []);
  return (
    <AuthProvider>
    <Router basename={basename}>
      <div className="App">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<FRMRegistre />} />
          <Route path="/admin" element={<VistaAdmin />} />
          <Route path="/usuario" element={<VistaUsuario />} />
          <Route path="/AppLimpieza/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
