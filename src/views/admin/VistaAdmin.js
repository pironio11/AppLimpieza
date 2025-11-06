import React, { useEffect, useState, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Usuario from '../../componentes/usuario';
import './VistaAdmin.css';
import { useAuth } from '../../hooks/useAuthProvider';
import { reportStore, getTTLms } from '../../utils/reportStore';
import '../usuario/VistaUsuario.css';

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

// API 
const usersService = {
  async list({ token }) {
    if (!token) throw new Error('SIN_TOKEN');
    const res = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('HTTP_' + res.status);
    return await res.json();
  },
  async update({ token, id, data }) {
    if (!token) throw new Error('SIN_TOKEN');
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('HTTP_' + res.status);
    return await res.json();
  },
  async delete({ token, id }) {
    if (!token) throw new Error('SIN_TOKEN');
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('HTTP_' + res.status);
    return true;
  },
};

// Normalizador para mostrar fecha/estado aunque no vengan
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
  const { token } = getSession();
  const { user } = useAuth();
  
  // Estados para reportes
  const [reportes, setReportes] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(true);
  const [nowMs, setNowMs] = useState(Date.now());
  const [showReportes, setShowReportes] = useState(true);

  // Cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.list({ token });
      setUsers(data);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [token]);

  // Tick de 1s para actualizar visualmente los contadores de tiempo restante
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cargar todos los reportes (sin filtrar por usuario)
  const fetchReportes = useCallback(async () => {
    setLoadingReportes(true);
    try {
      // Cargar TODOS los reportes (pasar null como userId)
      const data = await reportStore.loadReports(null);
      setReportes(data.map(normalizeReporte));
    } catch (err) {
      console.warn('Error cargando reportes:', err);
      setReportes([]);
    } finally {
      setLoadingReportes(false);
    }
  }, []);

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  // Refresco automático de reportes
  useEffect(() => {
    const ttl = getTTLms();
    const intervalMs = ttl <= 60 * 1000 ? 2000 : 60 * 60 * 1000;
    const id = setInterval(fetchReportes, intervalMs);
    return () => clearInterval(id);
  }, [fetchReportes]);

  // Redirigir si no hay usuario o no es admin
  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/usuario" />;
  }

  // Cerrar modal
  const closeModal = () => {
    setSelectedUser(null);
    setEditMode(false);
    setEditData({});
  };

  // Eliminar usuario
  const handleDelete = async () => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        await usersService.delete({ token, id: selectedUser.id });
        closeModal();
        fetchUsers();
      } catch (err) {
        alert('Error al eliminar usuario');
      }
    }
  };

  // Editar usuario
  const handleEdit = () => {
    setEditMode(true);
    setEditData({
      nombre: selectedUser.nombre,
      apellido: selectedUser.apellido,
      dni: selectedUser.dni,
      email: selectedUser.email,
      rol: selectedUser.rol,
    });
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    try {
      await usersService.update({ token, id: selectedUser.id, data: editData });
      closeModal();
      fetchUsers();
    } catch (err) {
      alert('Error al editar usuario');
    }
  };

  // Manejar cambios en el formulario de edición
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Funciones para gestión de reportes
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
      console.error('Error al actualizar estado:', err);
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
      
      {/* Sección de Usuarios */}
      <div className="admin-section">
        <h2>Lista de Usuarios</h2>
        <button 
          className="btn-toggle-section"
          onClick={() => setShowReportes(false)}
          style={{ marginBottom: '1rem' }}
        >
          {showReportes ? 'Ver Usuarios' : 'Ocultar Usuarios'}
        </button>
        
        {!showReportes && (
          <>
            {loading ? (
              <p className="loading">Cargando...</p>
            ) : (
              <table className="users-table">
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
                        <button className="btn-ver-perfil" onClick={() => setSelectedUser(u)}>
                          Ver perfil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Sección de Reportes */}
      <div className="admin-section" style={{ marginTop: '2rem' }}>
        <h2>Todos los Reportes</h2>
        <button 
          className="btn-toggle-section"
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
                    key={reporte.id}
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
                         Se elimina en: {formatRemaining(calcRemainingMs(reporte.createdAt))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Link to="/" className="link-inicio" style={{ marginTop: '2rem', display: 'inline-block' }}>
        Cerrar Sesión
      </Link>

      {/* Modal para mostrar/editar/eliminar usuario */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Perfil de Usuario</h3>
            {editMode ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    name="nombre"
                    value={editData.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Apellido:</label>
                  <input
                    name="apellido"
                    value={editData.apellido}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>DNI:</label>
                  <input
                    name="dni"
                    value={editData.dni}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Rol:</label>
                  <select
                    name="rol"
                    value={editData.rol}
                    onChange={handleChange}
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="modal-buttons">
                  <button className="btn-primary" onClick={handleSaveEdit}>Guardar</button>
                  <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="user-info">
                  <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
                  <p><strong>Apellido:</strong> {selectedUser.apellido}</p>
                  <p><strong>DNI:</strong> {selectedUser.dni}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Rol:</strong> {selectedUser.rol}</p>
                </div>
                <div className="modal-buttons">
                  <button className="btn-secondary" onClick={handleEdit}>Editar</button>
                  <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
                  <button className="btn-cancel" onClick={closeModal}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Vista_Admin;
