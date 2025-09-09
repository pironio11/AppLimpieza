import React from "react";
import { Link } from 'react-router-dom';
import "./estilos/FRM.css";
import epetfoto from '../imagenes/epetfoto.jpg';
import googlefoto from '../imagenes/googleFoto.jpg';

const FRMRegistre = () => {
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

  return (
    <div className="container-FRM">
      <div className="fotoEpet">
        <img src={epetfoto} alt="imagen de epet20" height="168" width="300" title="epet20" />
      </div>

      <div className="titulo1"><h1>Limpieza continua</h1></div>
      <div className="titulo2"><h2>Bienvenido a la app de limpieza</h2></div>

      {/* Botón Google */}
      <div className="botongoogle">
        <button onClick={() => alert('¡FireBase en proceso!')}>
          <img src={googlefoto} height={20} width={20} alt="Google" />
          Inicia sesión con Google
        </button>
      </div>

      {/* Botones de login */}
      <div className="botones-login">
        <div className="boton-admin">
          <Link to="/admin">
            <button onClick={() => handleLogin('admin')}>
              <img src={googlefoto} height={20} width={20} alt="icon" />
              Ingresar como Administrador
            </button>
          </Link>
        </div>

        <div className="boton-usuario">
          <Link to="/usuario">
            <button
              onClick={() => handleLogin('usuario')}
              className="btn-usuario"
            >
              Ingresar como Usuario
            </button>
          </Link>
        </div>
      </div>

      {/* Acceso directo demo */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '0.8rem', margin: '10px 0' }}>Acceso directo (Demo):</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link to="/admin" className="btn-demo">
            <button>Admin</button>
          </Link>
          <Link to="/usuario" className="btn-demo">
            <button>Usuario</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FRMRegistre;