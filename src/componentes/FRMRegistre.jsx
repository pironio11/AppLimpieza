import React from "react";
import { useNavigate } from 'react-router-dom';
import "./estilos/FRM.css";
import epetfoto from '../imagenes/epetfoto.jpg';
import GoogleLogin from './GoogleLogin';
//aca se importan los datos que necesita el fotmulario

const FRMregistro = () => {
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
                        {/* Sección principal de login */}
                        <div className="login-principal">
                            <h3 style={{color: '#333', fontSize: '1.1rem', marginBottom: '15px', textAlign: 'center'}}>
                                Iniciar Sesión
                            </h3>
                            
                            <GoogleLogin />
                            
                            <div className="separador" style={{
                                display: 'flex', 
                                alignItems: 'center', 
                                margin: '20px 0',
                                color: '#666'
                            }}>
                                <hr style={{flex: 1, border: 'none', borderTop: '1px solid #ddd'}} />
                                <span style={{padding: '0 15px', fontSize: '0.8rem'}}>o</span>
                                <hr style={{flex: 1, border: 'none', borderTop: '1px solid #ddd'}} />
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
                                    width: '100%',
                                    transition: 'all 0.3s ease'
                                }}>
                                    Ingresar como Usuario (Demo)
                                </button>
                            </div>
                            
                            <div className="boton-admin" style={{marginTop: '10px'}}>
                                <button onClick={() => handleLogin('admin')} style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    width: '100%',
                                    transition: 'all 0.3s ease'
                                }}>
                                    Ingresar como Administrador (Demo)
                                </button>
                            </div>
                        </div>
                        
                    </div>

            </div>
    )
}

export default FRMregistro;
