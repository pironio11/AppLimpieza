import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./estilos/FRM.css";
import logoepet from '../imagenes/logoepet.jpg';
import epetfoto from '../imagenes/epetfoto.jpg';
import googlefoto from '../imagenes/googleFoto.jpg';
import { useAuth } from '../hooks/useAuthProvider';


const FRMRegistre = () => {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, error: authError, user } = useAuth();
  const [loginMode, setLoginMode] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Redirigir si el usuario ya está logueado
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/usuario');
      }
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/usuario');
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    // Validaciones
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    try {
      const user = await register(email, password, displayName);
      navigate(user.role === 'admin' ? '/admin' : '/usuario');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError(null);
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      navigate(user.role === 'admin' ? '/admin' : '/usuario');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
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
              <form onSubmit={handleEmailLogin} className="login-form">
                <h3 className="form-title">Iniciar sesión</h3>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
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
                    autoComplete="current-password"
                  />
                </div>
                {(formError || authError) && (
                  <div className="error" style={{color: 'red', marginBottom: '1rem'}}>
                    {formError || authError}
                  </div>
                )}
                <button 
                  type="submit" 
                  className="btn-primary btn-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                <button 
                  type="button" 
                  onClick={() => setLoginMode(null)} 
                  className="btn-outline btn-full btn-back"
                  disabled={isLoading}
                >
                  Volver
                </button>
              </form>
            ) : loginMode === 'user' ? (
              <form onSubmit={handleRegister} className="login-form">
                <h3 className="form-title">Registrarse</h3>
                
                <div className="form-group">
                  <label htmlFor="displayName">Nombre completo</label>
                  <input
                    type="text"
                    id="displayName"
                    className="form-control"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    minLength={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
                    minLength={6}
                    title="Mínimo 6 caracteres"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {(formError || authError) && (
                  <div className="error" style={{color: 'red', marginBottom: '1rem'}}>
                    {formError || authError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary btn-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>

                <button 
                  type="button" 
                  onClick={() => setLoginMode(null)} 
                  className="btn-outline btn-full btn-back"
                  disabled={isLoading}
                >
                  Volver
                </button>
              </form>
            ) : (
              <div className="botones-login">
                <div className="boton-admin">
                  <button className="btn-outline btn-full" onClick={() => setLoginMode('admin')}>
                    Iniciar sesión
                  </button>
                </div>
                <div className="boton-usuario">
                  <button
                    onClick={() => setLoginMode('user')}
                    className="btn-usuario btn-full btn-outline"
                  >
                    Registrarse
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
      </div>
    </div>
  );
};

export default FRMRegistre;