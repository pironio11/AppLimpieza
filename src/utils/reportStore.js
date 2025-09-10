// Utilidades para persistir reportes en localStorage con expiración a 7 días
// Estructura de reporte sugerida: { id: string, createdAt: number (ms), ...payload }
export const STORAGE_KEY = 'app.reportes.v1';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function now() {
  return Date.now();
}

export function pruneOldReports(list) {
  const cutoff = now() - SEVEN_DAYS_MS;
  return (Array.isArray(list) ? list : []).filter(r =>
    r && typeof r.createdAt === 'number' && r.createdAt >= cutoff
  );
}

export function loadReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    console.debug('[reportStore] load raw=', raw);
    // Migración: si hay elementos sin createdAt, asígnalo a ahora
    const withCreatedAt = (Array.isArray(parsed) ? parsed : []).map((r) => {
      if (!r) return r;
      if (typeof r.createdAt !== 'number') {
        const inferred = (typeof r.id === 'string' && /^\d{10,}$/.test(r.id)) ? Number(r.id) : now();
        return { ...r, createdAt: inferred };
      }
      return r;
    });
    const pruned = pruneOldReports(withCreatedAt);
    // Si hubo migración o poda, persistir el resultado limpio
    if (JSON.stringify(parsed) !== JSON.stringify(pruned)) {
      saveReports(pruned);
    }
    console.debug('[reportStore] load parsed.count=', Array.isArray(parsed) ? parsed.length : 0, ' -> pruned.count=', pruned.length);
    return pruned;
  } catch (e) {
    console.warn('No se pudieron cargar reportes:', e);
    return [];
  }
}

export function saveReports(list) {
  try {
    const cleaned = pruneOldReports(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    console.debug('[reportStore] save count=', cleaned.length);
  } catch (e) {
    console.warn('No se pudieron guardar reportes:', e);
  }
}

export function addReport(payload) {
  const current = loadReports();
  const report = {
    id: String(now()),
    createdAt: now(),
    ...payload,
  };
  const next = [report, ...current];
  saveReports(next);
  console.debug('[reportStore] add report id=', report.id);
  return report;
}

export function clearAllReports() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export const reportStore = {
  loadReports,
  saveReports,
  addReport,
  pruneOldReports,
  clearAllReports,
};
