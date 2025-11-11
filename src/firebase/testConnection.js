import { db } from './config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    // 1. Intentar escribir un documento de prueba
    const testDoc = await addDoc(collection(db, '_test_connection'), {
      timestamp: new Date(),
      test: true
    });
    console.log('✅ Prueba de escritura exitosa, ID:', testDoc.id);

    // 2. Intentar leer el documento
    const querySnapshot = await getDocs(collection(db, '_test_connection'));
    console.log('✅ Prueba de lectura exitosa, documentos encontrados:', querySnapshot.size);

    // 3. Política: no se elimina el documento de prueba.
    console.log('ℹ️ Política activa: no se eliminan documentos de prueba');

    return true;
  } catch (error) {
    console.error('❌ Error en la prueba de conexión:', error);
    return false;
  }
};