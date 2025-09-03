import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Usuario from './componentes/usuario';
import './VistaUsuario.css';

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

// API para reportes
const reportesService = {
  async list({ token }) {
    if (!token) throw new Error('SIN_TOKEN');
    // Simulamos datos de reportes para demo
    return [
      { id: 1, area: 'Baño Principal', problema: 'Falta papel higiénico', estado: 'Pendiente', fecha: '2024-01-15' },
      { id: 2, area: 'Aula 101', problema: 'Pizarrón sucio', estado: 'En proceso', fecha: '2024-01-14' },
      { id: 3, area: 'Cafetería', problema: 'Mesa rota', estado: 'Resuelto', fecha: '2024-01-13' }
    ];
  },
  async create({ token, data }) {
    if (!token) throw new Error('SIN_TOKEN');
    // Simular creación de reporte
    console.log('Nuevo reporte:', data);
    return { id: Date.now(), ...data, estado: 'Pendiente', fecha: new Date().toISOString().split('T')[0] };
  }
};

function Vista_Usuario() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newReporte, setNewReporte] = useState({
    area: '',
    problema: '',
    descripcion: ''
  });
  const { token, currentUser } = getSession();

  // Cargar reportes del usuario
  const fetchReportes = async () => {
    setLoading(true);
    try {
      const data = await reportesService.list({ token });
      setReportes(data);
    } catch (err) {
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, [token]);

  // Crear nuevo reporte
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoReporte = await reportesService.create({ token, data: newReporte });
      setReportes([nuevoReporte, ...reportes]);
      setNewReporte({ area: '', problema: '', descripcion: '' });
      setShowForm(false);
    } catch (err) {
      alert('Error al crear reporte');
    }
  };

  const handleChange = (e) => {
    setNewReporte({ ...newReporte, [e.target.name]: e.target.value });
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
              <div key={reporte.id} className={`reporte-card ${reporte.estado.toLowerCase().replace(' ', '-')}`}>
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
