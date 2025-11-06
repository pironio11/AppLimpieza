import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Usuario from '../../componentes/usuario';
import './VistaAdmin.css';
import { useAuth } from '../../hooks/useAuthProvider';

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

function Vista_Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const { user: usuario } = useAuth();

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
  }, [usuario]);

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

  

  return (
    <div className="vista-admin">
      <Usuario />
      <h2>Lista de Usuarios</h2>
      {cargando ? (
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
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.dni}</td>
                <td>{u.email}</td>
                <td>{u.rol || (String(u.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Usuario')}</td>
                <td>{u.estado} {String(u.estado || '').toLowerCase() === 'conectado' ? '🟢' : '🔴'}</td>
                <td>{u.ultimaAccion}</td>
                <td>
                  <button className="btn-ver-perfil" onClick={() => setUsuarioSeleccionado(u)}>
                    Ver perfil
                  </button>
                  <button className="btn-secondary" onClick={() => alternarRol(u)} style={{ marginLeft: 8 }}>
                    {(u.rol || (String(u.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Usuario')) === 'Admin' ? 'Quitar administrador' : 'Asignar administrador'}
                  </button>
                  <button className="btn-peligro-suave" onClick={() => alternarBaja(u)} style={{ marginLeft: 8 }}>
                    {String(u.estado || '').toLowerCase() === 'baja' ? 'Activar' : 'Dar de baja'}
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
