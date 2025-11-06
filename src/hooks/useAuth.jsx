import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

   const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'usuarios', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        setError('USUARIO NO REGISTRADO');
        return false;
      }

      const userData = userDoc.data();
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: userData.role // 'admin' o 'usuario'
      });
      return true;
    } catch (error) {
      setError('USUARIO NO REGISTRADO');
      return false;
    }
  };

  return { user, error, login };
};