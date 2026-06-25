// backend/services/emailService.js
// Servicio de envío de correos electrónicos usando Nodemailer
import nodemailer from 'nodemailer';

/**
 * Sanitiza un valor para evitar inyección HTML en la tabla de reportes
 * @param {string} value - Valor a sanitizar
 * @returns {string} - Valor sanitizado
 */
const sanitizeHtml = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  const map = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Genera una tabla HTML con los datos de los prospectos
 * @param {Array} prospectos - Lista de prospectos
 * @returns {string} - Tabla HTML formateada
 */
const generarTablaHTML = (prospectos) => {
  if (!prospectos || prospectos.length === 0) {
    return '<p style="font-size:16px; color:#555;">No hay prospectos disponibles en este momento.</p>';
  }

  const filas = prospectos.map((p, index) => {
    const marcas = Array.isArray(p.marcasPrefiere) 
      ? p.marcasPrefiere.join(', ') 
      : (p.marcasPrefiere || '');
    
    return `
      <tr${index % 2 === 0 ? '' : ' style="background-color:#f8f9fa;"'}>
        <td style="text-align:center;">${index + 1}</td>
        <td>${sanitizeHtml(p.nombre)}</td>
        <td>${sanitizeHtml(p.telefono)}</td>
        <td style="text-align:center;">${sanitizeHtml(p.estadoCivil)}</td>
        <td style="text-align:center;">${sanitizeHtml(p.nivelEstudios)}</td>
        <td style="text-align:right;">$${(p.ingresoEstimado || 0).toLocaleString()}</td>
        <td style="text-align:center;">${sanitizeHtml(p.rangoIngreso)}</td>
        <td>${sanitizeHtml(marcas)}</td>
        <td style="text-align:center;">${p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-MX') : '-'}</td>
      </tr>`;
  }).join('');

  return `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%; font-family:Arial, sans-serif; font-size:14px;">
      <thead style="background-color:#2B6CB0; color:white;">
        <tr>
          <th style="padding:10px;">#</th>
          <th style="padding:10px;">Nombre</th>
          <th style="padding:10px;">Teléfono</th>
          <th style="padding:10px;">Estado Civil</th>
          <th style="padding:10px;">Nivel Estudios</th>
          <th style="padding:10px;">Ingreso Estimado</th>
          <th style="padding:10px;">Rango Ingreso</th>
          <th style="padding:10px;">Marcas Prefiere</th>
          <th style="padding:10px;">Registrado</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>`;
};

/**
 * Genera el cuerpo HTML completo del correo
 * @param {Array} prospectos - Lista de prospectos
 * @param {string} fechaEnvio - Fecha del envío formateada
 * @returns {string} - Cuerpo HTML del correo
 */
const generarCuerpoCorreo = (prospectos, fechaEnvio) => {
  const total = prospectos?.length || 0;
  const titulo = total > 0
    ? `📊 Reporte de Prospectos Confiables - ${fechaEnvio}`
    : `📊 Reporte de Prospectos Confiables - Sin resultados - ${fechaEnvio}`;
  
  const mensaje = total > 0
    ? `<p style="font-size:16px; color:#333;">Se encontraron <strong>${total}</strong> prospecto(s) que cumplen al 100% los filtros de confianza.</p>`
    : `<p style="font-size:16px; color:#999;">No se encontraron prospectos que cumplan los filtros al 100% en este momento.</p>`;

  const tabla = generarTablaHTML(prospectos);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f4f4f4;">
      <div style="max-width:800px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <div style="background-color:#2B6CB0; color:white; padding:20px; text-align:center;">
          <h2 style="margin:0;">Royal Prestige</h2>
          <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">Reporte Automático de Prospectos</p>
        </div>
        <div style="padding:20px;">
          <h3 style="color:#2B6CB0; margin-top:0;">${titulo}</h3>
          ${mensaje}
          ${total > 0 ? tabla : ''}
          <hr style="border:none; border-top:1px solid #e0e0e0; margin:20px 0;">
          <p style="font-size:12px; color:#999; text-align:center;">
            Este es un correo generado automáticamente por el sistema de Royal Prestige.<br>
            Por favor no responda a este mensaje.
          </p>
        </div>
      </div>
    </body>
    </html>`;
};

/**
 * Espera un tiempo determinado (para reintentos con backoff)
 * @param {number} ms - Milisegundos a esperar
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Envía un correo electrónico con reintentos y backoff exponencial
 * @param {Object} opciones - Opciones de envío
 * @param {string} opciones.to - Destinatario(s)
 * @param {string} opciones.subject - Asunto
 * @param {string} opciones.html - Cuerpo HTML
 * @param {number} [opciones.maxRetries=3] - Número máximo de reintentos
 * @returns {Promise<Object>} - Resultado del envío
 */
const enviarCorreo = async ({ to, subject, html, maxRetries = 3 }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Royal Prestige" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  };

  let lastError = null;

  for (let intento = 1; intento <= maxRetries; intento++) {
    try {
      console.log(`[emailService] Intento ${intento}/${maxRetries} de enviar correo a "${to}"`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`[emailService] Correo enviado exitosamente (intento ${intento}): ${info.messageId}`);
      return { success: true, messageId: info.messageId, intentos: intento };
    } catch (error) {
      lastError = error;
      console.error(`[emailService] Error en intento ${intento}/${maxRetries}: ${error.message}`);
      
      if (intento < maxRetries) {
        const espera = Math.min(1000 * Math.pow(2, intento), 15000); // 2s, 4s, 8s (máx 15s)
        console.log(`[emailService] Esperando ${espera}ms antes de reintentar...`);
        await delay(espera);
      }
    }
  }

  console.error(`[emailService] Todos los ${maxRetries} intentos fallaron. Error final: ${lastError.message}`);
  throw new Error(`No se pudo enviar el correo después de ${maxRetries} intentos. Último error: ${lastError.message}`);
};

/**
 * Envía el reporte de prospectos confiables por correo
 * @param {Array} prospectos - Lista de prospectos a reportar
 * @returns {Promise<Object>} - Resultado del envío
 */
export const enviarReporteConfianza = async (prospectos) => {
  const fechaEnvio = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = generarCuerpoCorreo(prospectos, fechaEnvio);
  const total = prospectos?.length || 0;
  const subject = total > 0
    ? `📊 Reporte de Prospectos Confiables - ${total} prospecto(s) - ${fechaEnvio}`
    : `📊 Reporte de Prospectos Confiables - Sin prospectos - ${fechaEnvio}`;

  const resultado = await enviarCorreo({
    to: process.env.EMAIL_TO,
    subject,
    html,
  });

  return {
    ...resultado,
    totalProspectos: total,
    fechaEnvio,
  };
};

// Funciones exportadas para pruebas unitarias
export { sanitizeHtml, generarTablaHTML, generarCuerpoCorreo, enviarCorreo };