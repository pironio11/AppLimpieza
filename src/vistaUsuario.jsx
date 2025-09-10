import React, { useEffect, useState } from 'react';
import Usuario from './componentes/usuario'; // Ajustá la ruta si es necesario
import { reportStore } from './utils/reportStore';

const VistaUsuario = () => {
  const [reports, setReports] = useState([]);

  // Cargar reportes (y podar viejos) al montar
  useEffect(() => {
    setReports(reportStore.loadReports());
  }, []);

  // Limpieza automática periódica (cada 1 hora)
  useEffect(() => {
    const id = setInterval(() => {
      const pruned = reportStore.loadReports();
      setReports(pruned);
    }, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const handleCrearReporte = (payload) => {
    reportStore.addReport(payload);
    setReports(reportStore.loadReports());
  };

  return (
    <div>
      <h1>Vista de Usuario</h1>
      <Usuario reports={reports} onCrearReporte={handleCrearReporte} />
    </div>
  );
};

export default VistaUsuario;

