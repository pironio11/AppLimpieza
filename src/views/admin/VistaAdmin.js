import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

import { db } from '../../firebase/config';
import Usuario from '../../componentes/usuario';
import './VistaAdmin.css';
import { useAuth } from '../../hooks/useAuthProvider';
import { reportStore, getTTLms } from '../../utils/reportStore';
import '../usuario/VistaUsuario.css';

function obtenerSesion() {
  try {
    const token = localStorage.getItem('auth.token');
    const userRaw = localStorage.getItem('auth.user');
    const currentUser = userRaw ? JSON.parse(userRaw) : null;
    return { token, currentUser };
  } catch {
    return { token: null, currentUser: null };
  }
}

const servicioUsuarios = {
  async list() {
    const snap = await getDocs(collection(db, 'usuarios'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  async update({ id, data }) {
    await updateDoc(doc(db, 'usuarios', id), data);
    return true;
  },
};

function normalizeReporte(r) {
  const fecha = r.fecha || new Date(r.createdAt || Date.now()).toISOString().split('T')[0];
  const estado = r.estado || 'Pendiente';
  return { ...r, fecha, estado };
}

function Vista_Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const { token } = obtenerSesion();
  const { user } = useAuth();
  
  const [reportes, setReportes] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(true);
  const [nowMs, setNowMs] = useState(Date.now());
  const [showReportes, setShowReportes] = useState(true);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await servicioUsuarios.list();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [token]);

  useEffect(() => {
    fetchReportes();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ttl = getTTLms();
    const intervalMs = ttl <= 60 * 1000 ? 2000 : 60 * 60 * 1000;
    const id = setInterval(fetchReportes, intervalMs);
    return () => clearInterval(id);
  }, []);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!((user.role || '').toLowerCase() === 'admin' || (user.rol || '') === 'Admin')) {
    return <Navigate to="/usuario" />;
  }

  const cerrarModal = () => {
    setSelectedUser(null);
  };

  // Eliminación deshabilitada por política: no se borra nada de la base de datos.

  const alternarRol = async (u) => {
    const actual = u.rol || (String(u.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Usuario');
    const nuevoRol = actual === 'Admin' ? 'Usuario' : 'Admin';
    try {
      await servicioUsuarios.update({ id: u.id, data: { rol: nuevoRol, role: nuevoRol === 'Admin' ? 'admin' : 'usuario' } });
      cargarUsuarios();
    } catch (err) {
      alert('No se pudo cambiar el rol');
    }
  };

  const alternarBaja = async (u) => {
    const estadoActual = String(u.estado || '').toLowerCase();
    const nuevoEstado = estadoActual === 'baja' ? 'Activo' : 'Baja';
    try {
      await servicioUsuarios.update({ id: u.id, data: { estado: nuevoEstado } });
      cargarUsuarios();
    } catch (err) {
      alert('No se pudo actualizar el estado');
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const fetchReportes = async () => {
    setLoadingReportes(true);
    try {
      const data = await reportStore.loadReports();
      setReportes(data.map(normalizeReporte));
    } catch (err) {
      setReportes([]);
    } finally {
      setLoadingReportes(false);
    }
  };

  const cycleEstado = (estado) => {
    const order = ['Pendiente', 'En proceso', 'Completado'];
    const idx = order.findIndex((s) => s.toLowerCase() === String(estado || '').toLowerCase());
    const nextIdx = (idx === -1) ? 0 : (idx + 1) % order.length;
    return order[nextIdx];
  };

  const handleToggleEstado = async (reporte) => {
    const nextEstado = cycleEstado(reporte.estado);
    try {
      const updated = await reportStore.updateReport(reporte.id, { estado: nextEstado });
      if (updated) {
        setReportes((prev) => prev.map((r) => r.id === reporte.id ? { ...r, estado: nextEstado } : r));
      }
    } catch (err) {
      alert('Error al actualizar el estado del reporte');
    }
  };

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
    <div className="vista-admin">
      <Usuario />
      <h2>Lista de Usuarios</h2>
      {loading ? (
        <p className="loading">Cargando</p>
      ) : (
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Última Acción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.dni}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>{u.estado}</td>
                <td>{u.ultimaAccion}</td>
                <td>
                  <button className="boton-ver-perfil" onClick={() => setSelectedUser(u)}>
                    Ver perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
          <div className="admin-section" style={{ marginTop: '2rem' }}>
        <h2>Todos los Reportes</h2>
        <button 
          className="btn-alternar-seccion"
          onClick={() => setShowReportes(!showReportes)}
          style={{ marginBottom: '1rem' }}
        >
          {showReportes ? 'Ocultar Reportes' : 'Ver Reportes'}
        </button>
        
        {showReportes && (
          <div className="reportes-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ margin: 0, color: '#666' }}>
                Total de reportes: <strong>{reportes.length}</strong>
              </p>
              <button 
                className="btn-nuevo-reporte"
                onClick={fetchReportes}
                style={{ padding: '0.5rem 1rem' }}
              >
                  Refrescar
              </button>
            </div>
            
            {loadingReportes ? (
              <p className="loading">Cargando reportes...</p>
            ) : reportes.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                No hay reportes para mostrar
              </p>
            ) : (
              <div className="reportes-grid">
                {reportes.map((reporte) => (
                  <div
                    key={reporte}
                    className={`reporte-card ${reporte.estado.toLowerCase().replace(' ', '-')}`}
                    onClick={() => handleToggleEstado(reporte)}
                    title="Click para cambiar estado (Solo admins)"
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
                      <div>
                        <span className="fecha"> {reporte.fecha}</span>
                        <br />
                        <span className="user-info" style={{ fontSize: '0.85rem', color: '#666' }}>
                            {reporte.userName || 'Usuario'}
                        </span>
                        {reporte.userEmail && (
                          <>
                            <br />
                            <span className="user-info" style={{ fontSize: '0.85rem', color: '#666' }}>
                               {reporte.userEmail}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="ttl" style={{ marginTop: '0.5rem', color: '#555', fontWeight: 600 }}>
                          Expira en: {formatRemaining(calcRemainingMs(reporte.createdAt))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

     
    
      <Link to="/" className="enlace-inicio" style={{ marginTop: '2rem', display: 'inline-block' }}>
        Cerrar Sesión
      </Link>

      {/* Modal para mostrar/editar/eliminar usuario */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Perfil de Usuario</h3>
            <div>
              <div className="user-info">
                <p><strong>Gmail:</strong> {selectedUser.gmail || selectedUser.email || '-'}</p>
                <p><strong>Nombre registrado:</strong> {selectedUser.displayName || `${(selectedUser.nombre || '')} ${(selectedUser.apellido || '')}`.trim() || '-'}</p>
                <p><strong>Nombre completo:</strong> {`${selectedUser.nombre || ''} ${selectedUser.apellido || ''}`.trim() || '-'}</p>
                <p><strong>DNI:</strong> {selectedUser.dni || '-'}</p>
                <p><strong>Legajo:</strong> {selectedUser.legajo || '-'}</p>
                <p><strong>Rol:</strong> {selectedUser.rol || (String(selectedUser.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Usuario')}</p>
                <p><strong>Estado:</strong> {selectedUser.estado || 'Activo'}</p>
              </div>
              <div className="modal-buttons">
                <button 
                    className="boton-primario" 
                    onClick={() => alternarRol(selectedUser).then(() => setSelectedUser(null))}
                    style={{ marginRight: '0.5rem' }}
                >
                    {(selectedUser.rol || (String(selectedUser.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Usuario')) === 'Admin' ? 'Quitar Admin' : 'Hacer Admin'}
                </button>

                <button 
                    className="boton-secundario" 
                    onClick={() => alternarBaja(selectedUser).then(() => setSelectedUser(null))}
                    style={{ marginRight: '0.5rem' }}
                >
                    {(String(selectedUser.estado || '').toLowerCase() === 'baja') ? 'Activar Usuario' : 'Dar de Baja'}
                </button>
                <button className="boton-cancelar" onClick={cerrarModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vista_Admin;