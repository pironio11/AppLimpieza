
import React, { useState } from 'react';

const estadosLimpieza = ['Limpieza leve', 'Limpieza media', 'Limpieza profunda'];
const colores = {
  'Limpieza leve': '#a8e6a3',
  'Limpieza media': '#ffe082',
  'Limpieza profunda': '#ff8a80',
};

const TarjetaEstadoAula = ({ aula = 'Aula 1' }) => {
  const [estado, setEstado] = useState(0);
  const handleClick = () => {
    setEstado((prev) => (prev + 1) % estadosLimpieza.length);
  };
  return (
    <div
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        background: colores[estadosLimpieza[estado]],
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '220px',
        margin: '2rem auto',
        userSelect: 'none',
        transition: 'background 0.3s',
      }}
    >
      <h2>{aula}</h2>
      <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{estadosLimpieza[estado]}</p>
      <small>Haz clic para cambiar el estado</small>
    </div>
  );
};

export default TarjetaEstadoAula;