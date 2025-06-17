import React from 'react';

const Usuario = () => {
  const user = {
    nombre: 'Juan Pérez',
    email: 'juanperez@gmail.com',
    rol: 'Usuario',
  };

  const handleLogout = () => {
    alert('Sesión cerrada');
  };

  return (
    <div>
      <div className='usuario'>
        <h1>hola</h1>
      </div>
      <div style={styles.container}>
        <h1 style={styles.title}>Bienvenido, {user.nombre}</h1>

        <div style={styles.card}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f3f3f3',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
    marginBottom: '20px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  buttonContainer: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Usuario;
