

import './App.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import Footer from './componentes/footer';
import Navbar from './componentes/navbar';
import FRMregistro from './componentes/FRMRegistre';
function App() {
  return ( 
    <div className="App">
        <EncargadoLimpieza/>
        <Footer/>
        <Navbar/>
        <FRMregistro/>

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
