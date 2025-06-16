import React from 'react';
import './estilos/footer.css';

const Footer = () => {
  return (
    <footer className="Generalfooter">

        <div className='tituloF'><h3>Contacto</h3></div>
        <div className='soporteF'><p>Soporte técnico disponible</p></div>
        <div className='emailF'><p>Email: soporte@limpieza.com</p></div>
        <div className="FooterBottom"><p>&copy; {new Date().getFullYear()} Sistema de Limpieza. Todos los derechos reservados.</p></div>
    </footer>
  );
};

export default Footer;