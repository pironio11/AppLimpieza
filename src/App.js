import logo from './logo.svg';
import './App.css';
import './FRM.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import Navbar from './componentes/navbar';
import Footer from './componentes/footer';


function App() {
  return (
    <div className="App">
      <Navbar />
      <EncargadoLimpieza />
      <Footer />
    </div>
  );
}

export default App;
