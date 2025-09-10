import React, { useEffect, useMemo, useState } from 'react';
import { reportStore } from '../utils/reportStore';

const Usuario = ({ reports = [], onCrearReporte }) => {
  const user = {
    nombre: 'Juan Pérez',
    email: 'juanperez@gmail.com',
    rol: 'Usuario',
  };

  const handleLogout = () => {
    alert('Sesión cerrada');
  };

  // Formulario simple de creación de reporte
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  // Estado interno sólo si no vienen reportes por props
  const [localReports, setLocalReports] = useState([]);

  // Cargar desde store si no hay props
  useEffect(() => {
    if (!reports || reports.length === 0) {
      setLocalReports(reportStore.loadReports());
    }
  }, [reports]);

  const effectiveReports = useMemo(() => {
    return (reports && reports.length > 0) ? reports : localReports;
  }, [reports, localReports]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) return;
    if (onCrearReporte) {
      onCrearReporte({ titulo: titulo.trim(), descripcion: descripcion.trim() });
    } else {
      reportStore.addReport({ titulo: titulo.trim(), descripcion: descripcion.trim() });
      setLocalReports(reportStore.loadReports());
    }
    setTitulo('');
    setDescripcion('');
  };

  return (
    <div>
      <div className='usuario'>
        <h1>hola</h1>
      </div>
      <div style={styles.container}>
        <h1 style={styles.title}>Bienvenido, {user.nombre}</h1>

        <div style={styles.card}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
        </div>

        {/* Crear reporte */}
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Nuevo reporte</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={styles.input}
            />
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              style={{ ...styles.input, resize: 'vertical' }}
            />
            <button type="submit" style={styles.button}>Crear reporte</button>
          </form>
        </div>

        {/* Listado de reportes */}
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Mis reportes</h2>
          {(!effectiveReports || effectiveReports.length === 0) ? (
            <p style={{ color: '#666', margin: 0 }}>Aún no tenés reportes. Creá el primero.</p>
          ) : (
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {effectiveReports.map((r) => (
                <li key={r.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600 }}>{r.titulo || 'Sin título'}</div>
                  <div style={{ color: '#444' }}>{r.descripcion || 'Sin descripción'}</div>
                  <div style={{ color: '#777', fontSize: 12 }}>
                    Creado: {new Date(r.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f3f3f3',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
    marginBottom: '20px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  buttonContainer: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Usuario;
