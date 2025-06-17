import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Usuario from './componentes/usuario';
import App from './App';
import reportWebVitals from './reportWebVitals';
import FRMRegistre from './componentes/FRMRegistre';
<<<<<<< HEAD
import Footer from './componentes/footer';
=======
import ReportesProblemas from './componentes/ReportesProblemas';
import Configuracion from './componentes/Configuracion';

>>>>>>> reportesV0


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FRMRegistre />
    <Footer/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
