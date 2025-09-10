import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./estilos/FRM.css";
import epetfoto from '../imagenes/epetfoto.jpg';
import googlefoto from '../imagenes/googleFoto.jpg';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';

const FRMRegistre = () => {
  const navigate = useNavigate();

  const handleLogin = (tipoUsuario) => {
    // Simular login exitoso
    localStorage.setItem('auth.token', 'demo-token');

    if (tipoUsuario === 'admin') {
      localStorage.setItem('auth.user', JSON.stringify({
        id: 1,
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@limpieza.com',
        rol: 'Admin'
      }));
    } else {
      localStorage.setItem('auth.user', JSON.stringify({
        id: 2,
        nombre: 'Usuario',
        apellido: 'Normal',
        email: 'usuario@limpieza.com',
        rol: 'Usuario'
      }));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Guardar token y usuario básico
      const token = (await user.getIdToken?.()) || 'google-token';
      localStorage.setItem('auth.token', token);
      localStorage.setItem('auth.user', JSON.stringify({
        uid: user.uid,
        nombre: user.displayName,
        email: user.email,
        foto: user.photoURL,
        rol: 'Usuario'
      }));
      // Redirigir a usuario por defecto
      navigate('/usuario');
    } catch (error) {
      console.error('Error en login con Google:', error);
      alert('No se pudo iniciar sesión con Google. Revisa la configuración de Firebase.');
    }
  };

  return (
    <div className="container-FRM">
      <div className="frm-layout">
        {/* Columna principal */}
        <div className="frm-main">
          <div className="fotoEpet">
            <img src={epetfoto} alt="imagen de epet20" height="168" width="300" title="epet20" />
          </div>

          {/* Encabezado de marca */}
          <div className="brand-header">
            <div>
              <h1 className="brand-title" style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', margin: 0 }}>Limpieza continua</h1>
              <p className="brand-subtitle" style={{ fontSize: 'clamp(14px, 2.2vw, 18px)', margin: '6px 0 0' }}>Organizá tareas, reportá problemas y mantené todo bajo control.</p>
            </div>
          </div>

          {/* Beneficios / features rápidos */}
          <div className="badge-list">
            <span className="badge">✓ Reportes en minutos</span>
            <span className="badge">✓ Asignación de tareas</span>
            <span className="badge">✓ Historial y seguimiento</span>
            <span className="badge">✓ Notificaciones</span>
          </div>

          {/* Botón Google */}
          <div className="botongoogle">
            <button className="btn-primary btn-full" onClick={handleGoogleLogin}>
              <img src={googlefoto} height={20} width={20} alt="Google" />
              Continuar con Google
            </button>
          </div>

          {/* Divisor minimalista */}
          <div className="divider"><span>o continúa como</span></div>

          {/* Botones de login */}
          <div className="botones-login">
            <div className="boton-admin">
              <Link to="/admin">
                <button className="btn-outline btn-full" onClick={() => handleLogin('admin')}>
                  Ingresar como Administrador
                </button>
              </Link>
            </div>

            <div className="boton-usuario">
              <Link to="/usuario">
                <button
                  onClick={() => handleLogin('usuario')}
                  className="btn-usuario btn-full btn-outline"
                >
                  Ingresar como Usuario
                </button>
              </Link>
            </div>
          </div>

          {/* Barra de estadísticas */}
          <div className="stats">
            <div className="stat">
              <div className="stat-value">+120</div>
              <div className="stat-label">Tareas mensuales</div>
            </div>
            <div className="stat">
              <div className="stat-value">98%</div>
              <div className="stat-label">Cumplimiento</div>
            </div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Disponibilidad</div>
            </div>
          </div>
        </div>

        {/* Columna lateral */}
        <aside className="frm-aside">
          <div className="aside-card">
            <img className="aside-cover" src={epetfoto} alt="Cobertura" />
            <ul className="checklist">
              <li>Panel para Administradores</li>
              <li>Panel para Usuarios</li>
              <li>Reportes de problemas con fotos</li>
              <li>Estadísticas en tiempo real</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FRMRegistre;