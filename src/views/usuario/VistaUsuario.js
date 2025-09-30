import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Usuario from '../../componentes/usuario';
import './VistaUsuario.css';
import { reportStore, getTTLms } from '../../utils/reportStore';

// INICIO SESIÓN 
function getSession() {
  try {
    const token = localStorage.getItem('auth.token');
    const userRaw = localStorage.getItem('auth.user');
    const currentUser = userRaw ? JSON.parse(userRaw) : null;
    return { token, currentUser };
  } catch {
    return { token: null, currentUser: null };
  }
}

// Normalizador para mostrar fecha/estado aunque no vengan
function normalizeReporte(r) {
  const fecha = r.fecha || new Date(r.createdAt || Date.now()).toISOString().split('T')[0];
  const estado = r.estado || 'Pendiente';
  return { ...r, fecha, estado };
}

function Vista_Usuario() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newReporte, setNewReporte] = useState({
    area: '',
    problema: '',
    descripcion: ''
  });
  const [nowMs, setNowMs] = useState(Date.now());
  const { token, currentUser } = getSession();

<<<<<<< HEAD
  // Cargar reportes del usuario (memorizado para satisfacer reglas de hooks)
  const fetchReportes = useCallback(async () => {
=======
  // Cargar reportes del usuario
  const fetchReportes = () => {
>>>>>>> c049734b8fe1fe312a9e26da208b474e93089c75
    setLoading(true);
    try {
      const data = reportStore.loadReports();
      setReportes(data.map(normalizeReporte));
    } catch (err) {
      console.warn('Error cargando reportes:', err);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  // Crear nuevo reporte
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newReporte,
        estado: 'Pendiente',
        fecha: new Date().toISOString().split('T')[0],
      };
      const creado = reportStore.addReport(payload);
      setReportes([normalizeReporte(creado), ...reportes]);
      setNewReporte({ area: '', problema: '', descripcion: '' });
      setShowForm(false);
    } catch (err) {
      alert('Error al crear reporte');
    }
  };

  // Refresco automático según TTL (si TTL <= 60s, refrescar cada 2s; si no, cada 1h)
  useEffect(() => {
    const ttl = getTTLms();
    const intervalMs = ttl <= 60 * 1000 ? 2000 : 60 * 60 * 1000;
    const id = setInterval(fetchReportes, intervalMs);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    setNewReporte({ ...newReporte, [e.target.name]: e.target.value });
  };

  // Ciclar estado al clickear una tarjeta
  const cycleEstado = (estado) => {
    const order = ['Pendiente', 'En proceso', 'Completado'];
    const idx = order.findIndex((s) => s.toLowerCase() === String(estado || '').toLowerCase());
    const nextIdx = (idx === -1) ? 0 : (idx + 1) % order.length;
    return order[nextIdx];
  };

  const handleToggleEstado = (reporte) => {
    const nextEstado = cycleEstado(reporte.estado);
    const updated = reportStore.updateReport(reporte.id, { estado: nextEstado });
    if (updated) {
      setReportes((prev) => prev.map((r) => r.id === reporte.id ? { ...r, estado: nextEstado } : r));
    }
  };

  // Tick de 1s para actualizar visualmente los contadores de tiempo restante
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calcRemainingMs = (createdAt) => {
    const ttl = getTTLms();
    return (createdAt || Date.now()) + ttl - nowMs;
  };

  const formatRemaining = (ms) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="vista-usuario">
      <Usuario />
      
      <div className="header-usuario">
        <h2>Panel de Usuario</h2>
        <p>Bienvenido, {currentUser?.nombre || 'Usuario'}</p>
      </div>

      <div className="acciones-usuario">
        <button 
          className="btn-nuevo-reporte"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nuevo Reporte'}
        </button>
      </div>

      {/* Formulario para nuevo reporte */}
      {showForm && (
        <div className="form-container">
          <h3>Crear Nuevo Reporte</h3>
          <form onSubmit={handleSubmit} className="reporte-form">
            <div className="form-group">
              <label>Área:</label>
              <select
                name="area"
                value={newReporte.area}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar área</option>
                <option value="Baño Principal">Baño Principal</option>
                <option value="Baño Secundario">Baño Secundario</option>
                <option value="Aula 101">Aula 101</option>
                <option value="Aula 102">Aula 102</option>
                <option value="Cafetería">Cafetería</option>
                <option value="Biblioteca">Biblioteca</option>
                <option value="Patio">Patio</option>
                <option value="Laboratorio">Laboratorio</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Problema:</label>
              <input
                type="text"
                name="problema"
                value={newReporte.problema}
                onChange={handleChange}
                placeholder="Ej: Falta papel higiénico"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Descripción (opcional):</label>
              <textarea
                name="descripcion"
                value={newReporte.descripcion}
                onChange={handleChange}
                placeholder="Describe el problema con más detalle..."
                rows="3"
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn-primary">Crear Reporte</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de reportes */}
      <div className="reportes-section">
        <h3>Mis Reportes</h3>
        {loading ? (
          <p className="loading">Cargando reportes...</p>
        ) : (
          <div className="reportes-grid">
            {reportes.map((reporte) => (
              <div
                key={reporte.id}
                className={`reporte-card ${reporte.estado.toLowerCase().replace(' ', '-')}`}
                onClick={() => handleToggleEstado(reporte)}
                title="Click para cambiar estado"
                style={{ cursor: 'pointer' }}
              >
                <div className="reporte-header">
                  <h4>{reporte.area}</h4>
                  <span className={`estado-badge ${reporte.estado.toLowerCase().replace(' ', '-')}`}>
                    {reporte.estado}
                  </span>
                </div>
                <p className="problema">{reporte.problema}</p>
                {reporte.descripcion && (
                  <p className="descripcion">{reporte.descripcion}</p>
                )}
                <div className="reporte-footer">
                  <span className="fecha">Reportado: {reporte.fecha}</span>
                  <span className="ttl" style={{ marginLeft: 12, color: '#555', fontWeight: 600 }}>
                    Se elimina en: {formatRemaining(calcRemainingMs(reporte.createdAt))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link to="/" className="link-inicio">Cerrar Sesión</Link>
    </div>
  );
}

export default Vista_Usuario;
