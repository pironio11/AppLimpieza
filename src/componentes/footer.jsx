import React from 'react';
import './estilos/footer.css';

const Footer = () => {
  return (
    <footer className="Generalfooter">

        <h3>Contacto</h3>
        <p>Soporte técnico disponible</p>
        <p>Email: soporte@limpieza.com</p>
      
      <p className="FooterBottom">&copy; {new Date().getFullYear()} Sistema de Limpieza. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;