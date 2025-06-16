import React from "react";


const EncargadoLimpieza = () => {
  return (
  <div>
    <div className="w-full max-w-sm mx-auto mt-8 p-4 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold text-center text-red-600 mb-4">
        Encargado de limpieza
      </h2>

      <div className="flex justify-center items-center mb-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
      </div>
 
      <div className="text-center text-sm text-gray-600 mb-4">“Nombre Apellido”</div>
 
      <div classHistorial="flex flex-col gap-3">
        <button classLimpieza="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Historial de limpiezas
        </button>
      </div>
      
      <div classResportes="flex flex-col gap-3">
        <button classRyproblemas="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
          Reportes y Problemas
        </button>
      </div>
    </div>
  </div>
  );
};

export default EncargadoLimpieza;
