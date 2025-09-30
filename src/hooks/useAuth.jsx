import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('usuario'));
    if (storedUser) {
      const fetchUserData = async () => {
        const docRef = doc(db, 'usuarios', storedUser.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsuario({ id: docSnap.id, ...docSnap.data() });
        }
      };
      fetchUserData();
    }
  }, []);

  return { usuario };
};