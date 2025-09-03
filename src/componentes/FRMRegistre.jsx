import React from "react";
import { useNavigate } from 'react-router-dom';
import "./estilos/FRM.css";
import epetfoto from '../imagenes/epetfoto.jpg';
import googlefoto from '../imagenes/googleFoto.jpg';
//aca se importan los datos que necesita el fotmulario

const FRMregistro =() => {
    const navigate = useNavigate();

    const handleLogin = (tipoUsuario) => {
        // Simular login exitoso
        localStorage.setItem('auth.token', 'demo-token');
        
        if (tipoUsuario === 'admin') {
            localStorage.setItem('auth.user', JSON.stringify({
                id: 1,
                nombre: 'Admin',
                apellido: 'Sistema',
                email: 'admin@limpieza.com',
                rol: 'Admin'
            }));
            navigate('/admin');
        } else {
            localStorage.setItem('auth.user', JSON.stringify({
                id: 2,
                nombre: 'Usuario',
                apellido: 'Normal',
                email: 'usuario@limpieza.com',
                rol: 'Usuario'
            }));
            navigate('/usuario');
        }
    };

    return(
            <div className="container-FRM">
                

                <div className="fotoEpet"><img src={epetfoto} alt="imagen de epet20" heigth="168" width="300" title="epet20"></img></div>
                <div className="titulo1"><h1>Limpieza continua</h1></div>
                <div className="titulo2"><h2>Bienvenido a la app de limpieza</h2></div>
                    <div className="botones-login">
                        <div className="botongoogle">
                            <button onClick={() => handleLogin('admin')}>
                                <img src={googlefoto} height={20} width={20}></img>
                                Ingresar como Administrador
                            </button>
                        </div>
                        
                        <div className="boton-usuario">
                            <button onClick={() => handleLogin('usuario')} style={{
                                padding: '12px 24px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                marginTop: '15px',
                                width: '100%',
                                transition: 'all 0.3s ease'
                            }}>
                                Ingresar como Usuario
                            </button>
                        </div>
                        
                        <div style={{marginTop: '20px', textAlign: 'center'}}>
                            <p style={{color: '#666', fontSize: '0.8rem', margin: '10px 0'}}>Acceso directo (Demo):</p>
                            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                                <button onClick={() => navigate('/admin')} style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}>
                                    Admin
                                </button>
                                <button onClick={() => navigate('/usuario')} style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}>
                                    Usuario
                                </button>
                            </div>
                        </div>
                    </div>

            </div>
    )
}

export default FRMregistro;
