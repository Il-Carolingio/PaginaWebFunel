/**
 * Convierte una fecha en formato "YYYY-MM-DD" a un objeto Date local
 * sin desplazamiento por zona horaria.
 * 
 * @param {string} fechaStr - Fecha en formato "YYYY-MM-DD"
 * @returns {Date} Fecha como objeto Date local (medianoche local)
 */
export function parseLocalDate(fechaStr) {
  if (!fechaStr) return null;
  const [year, month, day] = fechaStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month es 0-indexed en JS
}

/**
 * Obtiene el inicio del día (00:00:00.000) en hora local para una fecha string.
 */
export function getStartOfDay(fechaStr) {
  const date = parseLocalDate(fechaStr);
  if (!date) return null;
  return date;
}

/**
 * Obtiene el fin del día (23:59:59.999) en hora local para una fecha string.
 */
export function getEndOfDay(fechaStr) {
  const date = parseLocalDate(fechaStr);
  if (!date) return null;
  date.setHours(23, 59, 59, 999);
  return date;
}