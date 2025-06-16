<<<<<<< HEAD
=======
import logo from './logo.svg';
import './App.css';
import './FRM.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import Navbar from './componentes/navbar';
import Footer from './componentes/footer';

>>>>>>> 357c3f0b71a95e340bfef208df4e32f5177e3ba5

import './App.css';
import EncargadoLimpieza from './componentes/encargado_limpieza';
import Footer from './componentes/footer';
import Navbar from './componentes/navbar';
function App() {
  return ( 
    <div className="App">
        <EncargadoLimpieza/>
        <Footer/>
        <Navbar/>

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
