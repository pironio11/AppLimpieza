import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import googlefoto from '../imagenes/googleFoto.jpg';
import { auth, db } from '../firebase/config';
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

export const Login = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

     const handleGoogleLogin = async () => {
    // Verificar si Firebase está configurado
    const isFirebaseConfigured = process.env.REACT_APP_FIREBASE_API_KEY && 
                               !process.env.REACT_APP_FIREBASE_API_KEY.includes('Demo');

           if (isFirebaseConfigured) {
      try {
        // Primero intenta con signInWithPopup
        try {
          const result = await signInWithPopup(auth, provider);
          // Login exitoso
          handleSuccessfulLogin(result.user);
        } catch (popupError) {
          if (popupError.code === 'auth/popup-blocked') {
            // Si el popup es bloqueado, usa redirect como fallback
            await signInWithRedirect(auth, provider);
          } else {
            throw popupError;
          }
        }
      
      } catch (error) {
        console.error('Error Firebase:', error);
        handleDemoLogin();
      }
    } else {
      // Modo demo directo sin intentar Firebase
      handleDemoLogin();
    }
  };
   }

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

  const handleSuccessfulLogin = async (user) => {
    try {
      // Primero verificamos si hay algún usuario en la colección
      const usersCollection = await getDocs(collection(db, 'usuarios'));
      const isFirstUser = usersCollection.empty;

        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate('/admin');  // Corregimos la ruta
        } else {
          navigate('/usuario');
        }
      } else {
        // Si es el primer usuario, será admin, si no, será usuario normal
        await setDoc(doc(db, 'usuarios', user.uid), {
          email: user.email,
          role: isFirstUser ? 'admin' : 'usuario',
          createdAt: new Date(),
          displayName: user.displayName,
          photoURL: user.photoURL
        });
        navigate(isFirstUser ? '/admin' : '/usuario');
        
        // Mostrar mensaje de bienvenida
        alert(isFirstUser ? 
          '¡Bienvenido! Has sido registrado como el primer usuario y tienes privilegios de administrador.' :
          '¡Bienvenido! Tu cuenta ha sido registrada exitosamente.');
      }
    } catch (error) {
      console.error('Error verificando rol:', error);
      navigate('/usuario');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const displayName = e.target.name?.value || email.split('@')[0];

     try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar si es el primer usuario
      const usersCollection = await getDocs(collection(db, 'usuarios'));
      const isFirstUser = usersCollection.empty;

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        email: user.email,
        role: isFirstUser ? 'admin' : 'usuario',
        createdAt: new Date(),
        displayName: displayName,
        registrationType: 'manual'
      });

      // Mostrar mensaje de éxito
      alert(isFirstUser ? 
        '¡Registro exitoso! Has sido registrado como administrador.' :
        '¡Registro exitoso! Tu cuenta ha sido creada como usuario.');

      // Redirigir según el rol
      navigate(isFirstUser ? '/admin' : '/usuario');
    } catch (error) {
      console.error('Error en el registro:', error);
      setError(error.message);
    }
  };

  return (
    <div className="botongoogle">
      <button onClick={handleGoogleLogin}>
        <img src={googlefoto} height={20} width={20} alt="Google" />
        Iniciar sesión con Google
      </button>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <input 
            type="text" 
            name="name" 
            placeholder="Nombre completo"
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            placeholder="Correo electrónico"
            required 
          />
        </div>
   <div className="form-group">
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña"
            required 
            minLength="6"
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );

 

