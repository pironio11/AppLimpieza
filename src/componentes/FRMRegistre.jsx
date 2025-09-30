import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./estilos/FRM.css";
import epetfoto from '../imagenes/epetfoto.jpg';
import googlefoto from '../imagenes/googleFoto.jpg';

const FRMregistro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [gmail, setGmail] = useState('');
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

  const handleRegister = (e) => {
    e.preventDefault();
    const nuevoUsuario = { nombre, apellido, dni, gmail };
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    // ...redirigir o mostrar mensaje de éxito...
  };

  const handleGoogleLogin = () => {
    // Aquí irá la lógica de login con Google/Firebase
    alert('Funcionalidad de Google pendiente');
  };

  return (
    <div className="container-FRM">
      <div className="fotoEpet">
        <img src={epetfoto} alt="imagen de epet20" height="168" width="300" title="epet20" />
      </div>

      <div className="titulo1"><h1>Limpieza continua</h1></div>
      <div className="titulo2"><h2>Bienvenido a la app de limpieza</h2></div>

      
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

export default FRMregistro;
