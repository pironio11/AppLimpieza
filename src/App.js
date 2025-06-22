import logo from './logo.svg';
import './App.css';
import AlumnoDocente from './componentes/alumno_docente';

function App() {
  return (
    <div className="App">
      <AlumnoDocente />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
