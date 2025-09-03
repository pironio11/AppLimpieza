
import FRMregistro from '../src/pages/FRMregistro';
import './App.css';
// import EncargadoLimpieza from './componentes/encargado_limpieza';
// import FRMregistro from './componentes/FRMRegistre';
// import ReportesProblemas from './componentes/ReportesProblemas';
// import Configuracion from './componentes/Configuracion';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
// import EncargadoLimpieza from './componentes/encargado_limpieza';
// import FRMregistro from './componentes/FRMRegistre';
// import ReportesProblemas from './componentes/ReportesProblemas';
 import Configuracion from './componentes/Configuracion';
// import Navbar from './componentes/navbar'; // Si tienes un Navbar


function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<FRMregistro/>}/>
          <Route path='/configuracion' element={<Configuracion/>}/>
        </Routes>

        
        
      </BrowserRouter>
    </div>
  );
}

export default App;
