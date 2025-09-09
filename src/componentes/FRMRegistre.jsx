import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./estilos/FRM.css";
import epetfoto from '../imagenes/epetfoto.jpg';
import googlefoto from '../imagenes/googleFoto.jpg';

const FRMregistro = () => {
  const navigate = useNavigate();

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

  return (
    <div className="container-FRM">
      <div className="fotoEpet">
        <img src={epetfoto} alt="imagen de epet20" height="168" width="300" />
      </div>
      <h1>Limpieza continua</h1>
      <h2>Bienvenido a la app de limpieza</h2>

      <div className="botongoogle">
        <button onClick={() => alert('¡FireBase en proceso!')}>
          <img src={googlefoto} height={20} width={20} alt="Google" />
          Inicia sesión con Google
        </button>
      </div>

      <div className="botones-login">
        <button onClick={() => handleLogin('admin')}>
          Ingresar como Administrador
        </button>
        <button onClick={() => handleLogin('usuario')}>
          Ingresar como Usuario
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Acceso directo (Demo):</p>
        <Link to="/admin">Ir a Admin</Link> | <Link to="/usuario">Ir a Usuario</Link>
      </div>
    </div>
  );
};

export default FRMregistro;
