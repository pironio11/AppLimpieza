

import './App.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import FRMregistro from './componentes/FRMRegistre';
import ReportesProblemas from './componentes/ReportesProblemas';
import Configuracion from './componentes/Configuracion';
import Tareas from './componentes/tareas';

function App() {
  return ( 
    <div className="App">
        <EncargadoLimpieza/>
        <ReportesProblemas/>
        <Configuracion/>
        <FRMregistro/>
        <Tareas/>
        <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
