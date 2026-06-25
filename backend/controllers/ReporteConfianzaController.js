// backend/controllers/ReporteConfianzaController.js
// Controlador para el reporte de prospectos confiables vía correo electrónico
import Prospecto from '../models/Prospecto.js';
import { enviarReporteConfianza } from '../services/emailService.js';

/**
 * Valida la API Key del reporte
 * @param {string} apiKey - API Key proporcionada
 * @returns {boolean} - true si es válida
 */
const validarApiKey = (apiKey) => {
  const keyValida = process.env.REPORTE_API_KEY;
  if (!keyValida) {
    console.warn('[ReporteConfianza] REPORTE_API_KEY no configurada en .env');
    return false;
  }
  return apiKey === keyValida;
};

/**
 * GET /api/rifa/reporte-confianza/enviar
 * Envía un reporte por correo con los prospectos que cumplen filtros al 100%
 * 
 * Headers requeridos:
 *   Authorization: Bearer <API_KEY>
 * 
 * Respuestas:
 *   200 - Reporte enviado exitosamente
 *   401 - API Key inválida o faltante
 *   404 - No hay prospectos que cumplan filtros
 *   500 - Error interno del servidor
 */
export const enviarReporte = async (req, res) => {
  try {
    // Validar API Key
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn('[ReporteConfianza] 401 - Sin header Authorization');
      return res.status(401).json({
        success: false,
        message: 'Se requiere autenticación. Proporcione una API Key válida en el header Authorization.',
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!validarApiKey(token)) {
      console.warn('[ReporteConfianza] 401 - API Key inválida');
      return res.status(401).json({
        success: false,
        message: 'API Key inválida. Verifique sus credenciales.',
      });
    }

    const UMBRAL_MINIMO = 10; // Mínimo de prospectos para enviar reporte

    // Consultar prospectos que cumplen filtros y no han sido reportados
    const totalProspectos = await Prospecto.countDocuments({
      cumpleFiltros: true,
      reporteEnviado: false,
    });

    console.log(`[ReporteConfianza] Se encontraron ${totalProspectos} prospectos pendientes (umbral mínimo: ${UMBRAL_MINIMO})`);

    // Si no se alcanza el umbral mínimo, informar sin enviar correo
    if (totalProspectos < UMBRAL_MINIMO) {
      return res.status(200).json({
        success: true,
        message: `Aún no se alcanza el umbral mínimo de ${UMBRAL_MINIMO} prospectos. Actualmente hay ${totalProspectos} prospecto(s) pendiente(s). No se envió correo.`,
        pendientes: totalProspectos,
        umbralMinimo: UMBRAL_MINIMO,
        enviados: 0,
      });
    }

    // Obtener los prospectos (máximo el umbral mínimo)
    const prospectos = await Prospecto.find({
      cumpleFiltros: true,
      reporteEnviado: false,
    })
      .sort({ createdAt: -1 })
      .limit(UMBRAL_MINIMO)
      .lean();

    // Enviar correo con los prospectos
    console.log(`[ReporteConfianza] Umbral alcanzado. Enviando reporte con ${prospectos.length} prospectos...`);
    const resultado = await enviarReporteConfianza(prospectos);

    // Marcar prospectos como enviados
    const idsProspectos = prospectos.map(p => p._id);
    await Prospecto.updateMany(
      { _id: { $in: idsProspectos } },
      { $set: { reporteEnviado: true } }
    );

    console.log(`[ReporteConfianza] ${prospectos.length} prospectos marcados como reportados`);

    return res.status(200).json({
      success: true,
      message: `Reporte enviado exitosamente con ${prospectos.length} prospecto(s).`,
      enviados: prospectos.length,
      umbralMinimo: UMBRAL_MINIMO,
      destinatarios: process.env.EMAIL_TO ? process.env.EMAIL_TO.split(',').map(e => e.trim()) : [],
      messageId: resultado.messageId,
      intentos: resultado.intentos,
      fechaEnvio: resultado.fechaEnvio,
    });
  } catch (error) {
    console.error(`[ReporteConfianza] Error al enviar reporte: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error al enviar el reporte: ${error.message}`,
    });
  }
};