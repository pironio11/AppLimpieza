import React, { useEffect, useState, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Usuario from '../../componentes/usuario';
import './VistaAdmin.css';
import { useAuth } from '../../hooks/useAuthProvider';
import { reportStore, getTTLms } from '../../utils/reportStore';
import '../usuario/VistaUsuario.css';

// INICIO SESIÓN 
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

// API 
const servicioUsuarios = {
  async list() {
    const snap = await getDocs(collection(db, 'usuario'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
  async update({ id, data }) {
    await updateDoc(doc(db, 'usuario', id), data);
    return true;
  },
  async delete({ id }) {
    await deleteDoc(doc(db, 'usuario', id));
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

  // Cargar usuarios
  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const data = await servicioUsuarios.list();
      setUsuarios(data);
    } catch (err) {
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    // eslint-disable-next-line
  }, [token]);

  // Redirigir si no hay usuario o no es admin
  if (!usuario) {
    return <Navigate to="/" />;
  }

  if (usuario.role !== 'admin') {
    return <Navigate to="/usuario" />;
  }

  // Cerrar modal
  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
  };

  // Eliminar usuario
  const eliminarUsuario = async () => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        await servicioUsuarios.delete({ id: usuarioSeleccionado.id });
        cerrarModal();
        cargarUsuarios();
      } catch (err) {
        alert('Error al eliminar usuario');
      }
    }
  };

  // (Sin edición en modal)

  

  // Cambiar rol entre Admin/Usuario
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

  // Dar de baja o activar (usa campo 'estado')
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

  // Manejar cambios en el formulario de edición
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="vista-admin">
      <Usuario />
      <h2>Lista de Usuarios</h2>
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
      <Link to="/" className="link-inicio">Volver al inicio</Link>

      {/* Modal para mostrar/editar/eliminar usuario */}
      {usuarioSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Perfil de Usuario</h3>
            <div>
              <div className="user-info">
                <p><strong>Gmail:</strong> {usuarioSeleccionado.gmail || '-'}</p>
                <p><strong>Nombre registrado:</strong> {usuarioSeleccionado.displayName || `${(usuarioSeleccionado.nombre || '')} ${(usuarioSeleccionado.apellido || '')}`.trim() || '-'}</p>
                <p><strong>Nombre completo:</strong> {`${usuarioSeleccionado.nombre || ''} ${usuarioSeleccionado.apellido || ''}`.trim() || '-'}</p>
                <p><strong>DNI:</strong> {usuarioSeleccionado.dni || '-'}</p>
                <p><strong>Legajo:</strong> {usuarioSeleccionado.legajo || '-'}</p>
                <p><strong>Rol:</strong> {usuarioSeleccionado.rol || (String(usuarioSeleccionado.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Usuario')}</p>
              </div>
              <div className="modal-buttons">
                <button className="btn-danger" onClick={eliminarUsuario}>Eliminar</button>
                <button className="btn-cancel" onClick={cerrarModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vista_Admin;
