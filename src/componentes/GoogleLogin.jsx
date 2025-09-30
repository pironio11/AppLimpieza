import React from 'react';
import { useNavigate } from 'react-router-dom';
import googlefoto from '../imagenes/googleFoto.jpg';

const GoogleLogin = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        // Verificar si Firebase está configurado
        const isFirebaseConfigured = process.env.REACT_APP_FIREBASE_API_KEY && 
                                   !process.env.REACT_APP_FIREBASE_API_KEY.includes('Demo');

        if (isFirebaseConfigured) {
            try {
                // Importar Firebase solo si está configurado
                const { signInWithPopup } = await import('firebase/auth');
                const { auth, googleProvider } = await import('../firebase/config');
                
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                
                const userData = {
                    id: user.uid,
                    nombre: user.displayName?.split(' ')[0] || 'Usuario',
                    apellido: user.displayName?.split(' ').slice(1).join(' ') || 'Google',
                    email: user.email,
                    foto: user.photoURL,
                    rol: 'Usuario',
                    fechaCreacion: new Date().toISOString(),
                    proveedor: 'google'
                };

                localStorage.setItem('auth.token', user.accessToken || 'google-token');
                localStorage.setItem('auth.user', JSON.stringify(userData));
                
                console.log('Usuario logueado con Google:', userData);
                navigate('/usuario');
                
            } catch (error) {
                console.error('Error Firebase:', error);
                handleDemoLogin();
            }
        } else {
            // Modo demo directo sin intentar Firebase
            handleDemoLogin();
        }
    };

    const handleDemoLogin = () => {
        const simulatedUser = {
            id: 'demo-google-' + Date.now(),
            nombre: 'Usuario',
            apellido: 'Google Demo',
            email: 'usuario.demo@gmail.com',
            foto: 'https://via.placeholder.com/150',
            rol: 'Usuario',
            fechaCreacion: new Date().toISOString(),
            proveedor: 'google-demo'
        };

        localStorage.setItem('auth.token', 'google-demo-token');
        localStorage.setItem('auth.user', JSON.stringify(simulatedUser));
        
        alert('🔧 Modo Demo: Simulando login con Google (Firebase no configurado)');
        navigate('/usuario');
    };

    return (
        <div className="botongoogle">
            <button onClick={handleGoogleLogin}>
                <img src={googlefoto} height={20} width={20} alt="Google" />
                Iniciar sesión con Google
            </button>
        </div>
    );
};

export default GoogleLogin;
