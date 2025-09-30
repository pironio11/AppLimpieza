import React, { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> c049734b8fe1fe312a9e26da208b474e93089c75
import "./estilos/FRM.css";
import logoepet from '../imagenes/logoepet.jpg';
import epetfoto from '../imagenes/epetfoto.jpg';
import googlefoto from '../imagenes/googleFoto.jpg';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';

<<<<<<< HEAD
const FRMregistro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [gmail, setGmail] = useState('');
=======
const FRMRegistre = () => {
>>>>>>> c049734b8fe1fe312a9e26da208b474e93089c75
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState(null);
  const [legajo, setLegajo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (tipoUsuario) => {
    localStorage.setItem('auth.token', 'demo-token');

    if (tipoUsuario === 'admin') {
      localStorage.setItem('auth.user', JSON.stringify({
        id: 1,
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@limpieza.com',
        rol: 'Admin'
      }));
      navigate('/admin');
    } else {
      localStorage.setItem('auth.user', JSON.stringify({
        id: 2,
        nombre: 'Usuario',
        apellido: 'Normal',
        email: 'usuario@limpieza.com',
        rol: 'Usuario'
      }));
      navigate('/usuario');
    }
  };

<<<<<<< HEAD
  const handleRegister = (e) => {
    e.preventDefault();
    const nuevoUsuario = { nombre, apellido, dni, gmail };
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    // ...redirigir o mostrar mensaje de éxito...
  };

  const handleGoogleLogin = () => {
    // Aquí irá la lógica de login con Google/Firebase
    alert('Funcionalidad de Google pendiente');
=======
  const handleGoogleLogin = async () => {
    try {
      console.log('Iniciando autenticación con Google...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Resultado de autenticación:', result);
      
      const user = result.user;
      console.log('Usuario autenticado:', user);
      
      // Obtener el token de autenticación
      const token = await user.getIdToken();
      console.log('Token de autenticación:', token);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('auth.token', token);
      localStorage.setItem('auth.user', JSON.stringify({
        uid: user.uid,
        nombre: user.displayName || 'Usuario',
        email: user.email,
        foto: user.photoURL,
        rol: 'Usuario'
      }));
      
      console.log('Redirigiendo a /usuario...');
      navigate('/usuario');
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje de error:', error.message);
      alert(`Error al iniciar sesión con Google: ${error.message}`);
      console.error('Error en login con Google:', error);
      alert('No se pudo iniciar sesión con Google. Revisa la configuración de Firebase.');
    }
>>>>>>> c049734b8fe1fe312a9e26da208b474e93089c75
  };

  return (
    <div className="container-FRM">
      <div className="frm-layout">
        <div className="frm-main">
          <div className="fotoEpet">
            <img src={logoepet} alt="imagen de epet20" height="168" width="300" title="epet20" />
          </div>

          <div className="brand-header">
            <div>
              <h1 className="brand-title" style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', margin: 0 }}>Limpieza continua</h1>
              <p className="brand-subtitle" style={{ fontSize: 'clamp(14px, 2.2vw, 18px)', margin: '6px 0 0' }}>Organizá tareas, reportá problemas y mantené todo bajo control.</p>
            </div>
          </div>

<<<<<<< HEAD
      
      <div className="botongoogle">
        <button onClick={() => alert('¡FireBase en proceso!')}>
          <img src={googlefoto} height={20} width={20} alt="Google" />
          Inicia sesión con Google
        </button>
      </div>

    
      <div className="botones-login">
        <div className="boton-admin">
          <button onClick={() => handleLogin('admin')}>
            <img src={googlefoto} height={20} width={20} alt="icon" />
            Ingresar como Administrador
          </button>
        </div>

        <div className="boton-usuario">
          <button
            onClick={() => handleLogin('usuario')}
            className="btn-usuario"
          >
            Ingresar como Usuario
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '0.8rem', margin: '10px 0' }}>Acceso directo (Demo):</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/admin')} className="btn-demo">Admin</button>
          <button onClick={() => navigate('/usuario')} className="btn-demo">Usuario</button>
        </div>
=======
          <div className="badge-list">
            <span className="badge">✓ Reportes en minutos</span>
            <span className="badge">✓ Asignación de tareas</span>
            <span className="badge">✓ Historial y seguimiento</span>
            <span className="badge">✓ Notificaciones</span>
          </div>

          <div className="botongoogle">
            <button className="btn-primary btn-full" onClick={handleGoogleLogin}>
              <img src={googlefoto} height={20} width={20} alt="Google" />
              Continuar con Google
            </button>
          </div>

          <div className="divider"><span>o continúa como</span></div>

          <div className="login-forms">
            {loginMode === 'admin' ? (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin('admin'); }} className="login-form">
                <h3 className="form-title">Ingreso Administrador</h3>
                <div className="form-group">
                  <label htmlFor="legajo">N° de Legajo</label>
                  <input
                    type="text"
                    id="legajo"
                    className="form-control"
                    value={legajo}
                    onChange={(e) => setLegajo(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary btn-full">Ingresar</button>
                <button type="button" onClick={() => setLoginMode(null)} className="btn-outline btn-full btn-back">Volver</button>
              </form>
            ) : loginMode === 'user' ? (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin('usuario'); }} className="login-form">
                <h3 className="form-title">Ingreso Usuario</h3>
                <div className="form-group">
                  <label htmlFor="email">Gmail</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary btn-full">Ingresar</button>
                <button type="button" onClick={() => setLoginMode(null)} className="btn-outline btn-full btn-back">Volver</button>
              </form>
            ) : (
              <div className="botones-login">
                <div className="boton-admin">
                  <button className="btn-outline btn-full" onClick={() => setLoginMode('admin')}>
                    Ingresar como Administrador
                  </button>
                </div>
                <div className="boton-usuario">
                  <button
                    onClick={() => setLoginMode('user')}
                    className="btn-usuario btn-full btn-outline"
                  >
                    Ingresar como Usuario
                  </button>
                </div>
              </div>
            )}
          </div>

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
>>>>>>> c049734b8fe1fe312a9e26da208b474e93089c75
      </div>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
        />
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={e => setDni(e.target.value)}
        />
        <input
          type="email"
          placeholder="Gmail"
          value={gmail}
          onChange={e => setGmail(e.target.value)}
        />
        <button type="submit">Iniciar sesión</button>
        <button type="button" style={{ marginLeft: '10px' }}>
          Iniciar sesión con Google
        </button>
      </form>
    </div>
  );
};

export default FRMRegistre;