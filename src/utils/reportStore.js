// Utilidades para persistir reportes en Firestore con expiración a 7 días
// Estructura de reporte sugerida: { id: string, createdAt: number (ms), ...payload }
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export const STORAGE_KEY = 'app.reportes.v1';
const TTL_KEY = 'app.reportes.ttl_ms';
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días
const REPORTES_COLLECTION = 'reportes';

export function getTTLms() {
  try {
    const fromLS = localStorage.getItem(TTL_KEY);
    if (fromLS && !Number.isNaN(Number(fromLS))) return Number(fromLS);
  } catch {}
  const fromEnv = Number(process.env.REACT_APP_REPORT_TTL_MS);
  if (!Number.isNaN(fromEnv) && fromEnv > 0) return fromEnv;
  return DEFAULT_TTL_MS;
}

export function setTTLms(ms) {
  try {
    if (typeof ms === 'number' && ms > 0) {
      localStorage.setItem(TTL_KEY, String(ms));
    } else {
      localStorage.removeItem(TTL_KEY);
    }
  } catch {}
}

export function now() {
  return Date.now();
}

// Helpers de expiración (no borran, solo marcan/filtran para visualización)
export function isExpired(createdAtMs) {
  if (typeof createdAtMs !== 'number') return false;
  const cutoff = now() - getTTLms();
  return createdAtMs < cutoff;
}

export function markExpiration(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map(r => (r ? { ...r, expired: isExpired(r.createdAt) } : r));
}

export function filterVisible(list) {
  // Ocultar/neutralizar elementos expirados en la vista
  const arr = Array.isArray(list) ? list : [];
  return arr.filter(r => r && !isExpired(r.createdAt));
}

// Cargar reportes desde Firestore
export async function loadReports(userId = null) {
  try {
    const reportesRef = collection(db, REPORTES_COLLECTION);
    
    // Si se proporciona userId, filtrar por ese usuario
    let q;
    if (userId) {
      q = query(
        reportesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(reportesRef, orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    const reportes = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      reportes.push({
        id: doc.id,
        ...data,
        // Convertir Timestamp de Firestore a número (ms)
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || now()
      });
    });
    // No borrar datos: solo marcar y ocultar expirados en la respuesta de vista
    const marked = markExpiration(reportes);
    const visible = filterVisible(marked);
    console.debug('[reportStore] load count=', reportes.length, ' -> visible.count=', visible.length);
    return visible;
  } catch (e) {
    console.warn('No se pudieron cargar reportes desde Firestore:', e);
    // Fallback a localStorage en caso de error
    return loadReportsFromLocalStorage();
  }
}

// Función de respaldo para cargar desde localStorage
function loadReportsFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const withCreatedAt = (Array.isArray(parsed) ? parsed : []).map((r) => {
      if (!r) return r;
      if (typeof r.createdAt !== 'number') {
        const inferred = (typeof r.id === 'string' && /^\d{10,}$/.test(r.id)) ? Number(r.id) : now();
        return { ...r, createdAt: inferred };
      }
      return r;
    });
    // No borrar almacenado. Marcar expiración y devolver solo visibles para la UI
    const marked = markExpiration(withCreatedAt);
    return filterVisible(marked);
  } catch (e) {
    console.warn('No se pudieron cargar reportes desde localStorage:', e);
    return [];
  }
}

export function saveReports(list) {
  try {
    // Guardar sin borrar por TTL: mantener histórico local completo
    const arr = Array.isArray(list) ? list : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    console.debug('[reportStore] save count=', arr.length);
  } catch (e) {
    console.warn('No se pudieron guardar reportes:', e);
  }
}

// Agregar reporte a Firestore
export async function addReport(payload) {
  try {
    const reportesRef = collection(db, REPORTES_COLLECTION);
    
    const reportData = {
      ...payload,
      createdAt: serverTimestamp(),
      estado: payload.estado || 'Pendiente',
      fecha: payload.fecha || new Date().toISOString().split('T')[0]
    };
    
    const docRef = await addDoc(reportesRef, reportData);
    
    const report = {
      id: docRef.id,
      ...reportData,
      createdAt: now() // Usar timestamp local para la respuesta inmediata
    };
    
    console.debug('[reportStore] add report id=', report.id);
    return report;
  } catch (e) {
    console.error('Error al agregar reporte a Firestore:', e);
    // Fallback a localStorage
    return addReportToLocalStorage(payload);
  }
}

// Función de respaldo para agregar a localStorage
function addReportToLocalStorage(payload) {
  const current = loadReportsFromLocalStorage();
  const report = {
    id: String(now()),
    createdAt: now(),
    ...payload,
  };
  const next = [report, ...current];
  saveReports(next);
  console.debug('[reportStore] add report to localStorage id=', report.id);
  return report;
}

export function clearAllReports() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// Actualizar reporte en Firestore
export async function updateReport(id, patchOrUpdater) {
  try {
    const reportRef = doc(db, REPORTES_COLLECTION, id);
    
    // Si patchOrUpdater es una función, necesitamos cargar el documento primero
    let patch;
    if (typeof patchOrUpdater === 'function') {
      const reportes = await loadReports();
      const prev = reportes.find(r => r && String(r.id) === String(id));
      if (!prev) return null;
      patch = patchOrUpdater(prev);
    } else {
      patch = patchOrUpdater;
    }
    
    await updateDoc(reportRef, patch);
    
    console.debug('[reportStore] update id=', id, 'patch=', patch);
    return { id, ...patch };
  } catch (e) {
    console.error('Error al actualizar reporte en Firestore:', e);
    return null;
  }
}


export const reportStore = {
  loadReports,
  saveReports,
  addReport,
  updateReport,
  clearAllReports,
};
