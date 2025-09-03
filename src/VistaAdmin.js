import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Usuario from './componentes/usuario';

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
    <div>
      <Usuario />
      <h2>Lista de Usuarios</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <button onClick={() => setSelectedUser(u)}>
                    Ver perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to="/">Volver al inicio</Link>

      {/* Modal para mostrar/editar/eliminar usuario */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '10px',
            minWidth: '300px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
          }}>
            <h3>Perfil de Usuario</h3>
            {editMode ? (
              <div>
                <label>
                  Nombre:
                  <input
                    name="nombre"
                    value={editData.nombre}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label>
                  Apellido:
                  <input
                    name="apellido"
                    value={editData.apellido}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label>
                  DNI:
                  <input
                    name="dni"
                    value={editData.dni}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label>
                  Email:
                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label>
                  Rol:
                  <select
                    name="rol"
                    value={editData.rol}
                    onChange={handleChange}
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>
                <br />
                <button onClick={handleSaveEdit}>Guardar</button>
                <button onClick={closeModal}>Cancelar</button>
              </div>
            ) : (
              <div>
                <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
                <p><strong>Apellido:</strong> {selectedUser.apellido}</p>
                <p><strong>DNI:</strong> {selectedUser.dni}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Rol:</strong> {selectedUser.rol}</p>
                <button onClick={handleEdit}>Editar</button>
                <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Eliminar</button>
                <button onClick={closeModal} style={{ marginLeft: '10px' }}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Vista_Admin;