import React from 'react';

const Footer = () => {
  return (
<div className="Generalfooter">
    <footer className="">
      <div className="">
        <div className="">
          <div>
            <h3 className="">Sistema de Limpieza</h3>
            <p className="">Sistema de gestión para encargados de limpieza</p>
          </div>
          <div className='linksRapidos'>
            <h3 className="">Links Rápidos</h3>
            <ul className="">
              <li><a href="#" className="">Historial</a></li>
              <li><a href="#" className="">Reportes</a></li>
              <li><a href="#" className="">Ayuda</a></li>
            </ul>
          </div>
          <div className='contacto'>
            <h3>Contacto</h3>                
            <p>Soporte técnico disponible</p>
            <p>Email: soporte@limpieza.com</p>
          </div>
        </div>
        <div className="">
          <p>&copy; {new Date().getFullYear()} Sistema de Limpieza. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
</div>
  );
};

export default Footer;