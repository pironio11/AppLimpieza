import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Usuario from './componentes/usuario';
import './VistaAdmin.css';

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

function Vista_Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const { token } = getSession();

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