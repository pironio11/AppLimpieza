import logo from './logo.svg';
import './App.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import Navbar from './componentes/navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <EncargadoLimpieza />
    </div>
  );
}

export default App;
