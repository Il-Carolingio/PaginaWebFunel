// backend/services/emailService.js
// Servicio de envío de correos electrónicos
// Soporta Brevo (API), Gmail (SMTP con IPv4) y SendGrid como fallback
import nodemailer from 'nodemailer';
import { TransactionalEmailsApi, SendSmtpEmail, ApiClient } from 'brevo';

// ============================================================
// 1. CONFIGURACIÓN DE BREVO (PROVEEDOR PRINCIPAL)
// ============================================================

/**
 * Crea el cliente de Brevo para enviar correos vía API
 * @returns {Object} - Cliente de Brevo configurado
 */
const crearClienteBrevo = () => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY no configurado en variables de entorno');
  }

  // Configurar el cliente de Brevo
  const apiClient = new ApiClient();
  apiClient.setApiKey(
    ApiClient.ApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );
  
  return new TransactionalEmailsApi(apiClient);
};

/**
 * Envía correo usando la API de Brevo
 * @param {Object} opciones - Opciones de envío
 * @param {string} opciones.to - Destinatario(s)
 * @param {string} opciones.subject - Asunto
 * @param {string} opciones.html - Cuerpo HTML
 * @returns {Promise<Object>} - Resultado del envío
 */
const enviarCorreoBrevo = async ({ to, subject, html }) => {
  try {
    console.log('[emailService] Intentando enviar con Brevo API...');
    
    const apiInstance = crearClienteBrevo();
    const sendSmtpEmail = new SendSmtpEmail();
    
    // Configurar remitente (debe estar verificado en Brevo)
    sendSmtpEmail.sender = {
      name: 'Royal Prestige',
      email: process.env.EMAIL_FROM || process.env.SMTP_USER
    };
    
    // Configurar destinatario(s)
    const destinatarios = Array.isArray(to) 
      ? to.map(email => ({ email }))
      : [{ email: to }];
    sendSmtpEmail.to = destinatarios;
    
    // Configurar contenido
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = html.replace(/<[^>]*>/g, ''); // Versión texto plano
    
    // Configurar opciones adicionales
    sendSmtpEmail.headers = {
      'X-Entity-Ref-ID': `royal-prestige-${Date.now()}`
    };
    
    // Enviar correo
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log(`[emailService] ✅ Correo enviado con Brevo: ${response.messageId}`);
    return {
      success: true,
      messageId: response.messageId || 'brevo',
      provider: 'brevo',
      attempts: 1
    };
  } catch (error) {
    console.error('[emailService] ❌ Error con Brevo:', error.message);
    if (error.response) {
      console.error('[emailService] Detalles:', error.response.body);
    }
    throw error;
  }
};

// ============================================================
// 2. CONFIGURACIÓN DE GMAIL CON IPv4 FORZADO (FALLBACK 1)
// ============================================================

/**
 * Crea el transporter SMTP con IPv4 forzado para Gmail
 * @returns {Object} - Transporter de nodemailer
 */
const crearTransporterGmailIPv4 = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Usar puerto 465 (SSL) - más confiable
    secure: true, // SSL obligatorio
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // 🔑 CLAVE: Forzar IPv4 explícitamente
    family: 4,
    // Configuración de TLS para Gmail
    tls: {
      rejectUnauthorized: false,
    },
    // Timeouts mejorados
    connectionTimeout: 15000,
    socketTimeout: 15000,
  });
};

/**
 * Envía correo usando Gmail (SMTP con IPv4)
 * @param {Object} opciones - Opciones de envío
 * @returns {Promise<Object>} - Resultado del envío
 */
const enviarCorreoGmail = async ({ to, subject, html }) => {
  try {
    console.log('[emailService] Intentando enviar con Gmail (IPv4 forzado)...');
    
    const transporter = crearTransporterGmailIPv4();
    const mailOptions = {
      from: `"Casa Pleroma" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`[emailService] ✅ Correo enviado con Gmail: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
      provider: 'gmail',
      attempts: 1
    };
  } catch (error) {
    console.error('[emailService] ❌ Error con Gmail:', error.message);
    throw error;
  }
};

// ============================================================
// 3. CONFIGURACIÓN DE SENDGRID (FALLBACK 2)
// ============================================================

/**
 * Envía correo usando SendGrid como fallback
 * @param {Object} opciones - Opciones de envío
 * @returns {Promise<Object>} - Resultado del envío
 */
const enviarCorreoSendGrid = async ({ to, subject, html }) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY no configurado');
  }
  
  console.log('[emailService] Intentando enviar con SendGrid (fallback 2)...');
  
  const sg = await import('@sendgrid/mail');
  const msg = {
    to,
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    subject,
    html,
  };
  
  const result = await sg.default.send(msg);
  console.log('[emailService] ✅ Correo enviado con SendGrid');
  
  return {
    success: true,
    messageId: result[0]?.headers?.['x-message-id'] || 'sendgrid',
    provider: 'sendgrid',
    attempts: 1
  };
};

// ============================================================
// 4. FUNCIÓN PRINCIPAL DE ENVÍO CON REINTENTOS Y FALLBACKS
// ============================================================

/**
 * Espera un tiempo determinado (para reintentos con backoff)
 * @param {number} ms - Milisegundos a esperar
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sanitiza un valor para evitar inyección HTML en la tabla de reportes
 * @param {string} value - Valor a sanitizar
 * @returns {string} - Valor sanitizado
 */
const sanitizeHtml = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
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
 * Envía un correo electrónico con reintentos y múltiples fallbacks
 * @param {Object} opciones - Opciones de envío
 * @param {string} opciones.to - Destinatario(s)
 * @param {string} opciones.subject - Asunto
 * @param {string} opciones.html - Cuerpo HTML
 * @param {number} [opciones.maxRetries=2] - Número máximo de reintentos por proveedor
 * @returns {Promise<Object>} - Resultado del envío
 */
const enviarCorreo = async ({ to, subject, html, maxRetries = 2 }) => {
  let lastError = null;

  // ============================================================
  // INTENTO 1: BREVO (PROVEEDOR PRINCIPAL)
  // ============================================================
  for (let intento = 1; intento <= maxRetries; intento++) {
    try {
      console.log(`[emailService] 🔄 Brevo: Intento ${intento}/${maxRetries} para "${to}"`);
      const result = await enviarCorreoBrevo({ to, subject, html });
      return result;
    } catch (error) {
      lastError = error;
      console.error(`[emailService] Brevo intento ${intento} falló: ${error.message}`);
      
      if (intento < maxRetries) {
        const espera = Math.min(1000 * Math.pow(2, intento), 8000);
        console.log(`[emailService] Esperando ${espera}ms antes de reintentar...`);
        await delay(espera);
      }
    }
  }

  console.log('[emailService] ⚠️ Brevo falló después de reintentos, pasando a Gmail...');

  // ============================================================
  // INTENTO 2: GMAIL CON IPv4 FORZADO (FALLBACK 1)
  // ============================================================
  for (let intento = 1; intento <= maxRetries; intento++) {
    try {
      console.log(`[emailService] 🔄 Gmail: Intento ${intento}/${maxRetries} para "${to}"`);
      const result = await enviarCorreoGmail({ to, subject, html });
      return result;
    } catch (error) {
      lastError = error;
      console.error(`[emailService] Gmail intento ${intento} falló: ${error.message}`);
      
      if (intento < maxRetries) {
        const espera = Math.min(1000 * Math.pow(2, intento), 8000);
        console.log(`[emailService] Esperando ${espera}ms antes de reintentar...`);
        await delay(espera);
      }
    }
  }

  console.log('[emailService] ⚠️ Gmail falló después de reintentos, pasando a SendGrid...');

  // ============================================================
  // INTENTO 3: SENDGRID (FALLBACK 2)
  // ============================================================
  if (process.env.SENDGRID_API_KEY) {
    try {
      console.log(`[emailService] 🔄 SendGrid: Intento final para "${to}"`);
      const result = await enviarCorreoSendGrid({ to, subject, html });
      return result;
    } catch (sgError) {
      console.error(`[emailService] SendGrid falló: ${sgError.message}`);
      lastError = sgError;
    }
  } else {
    console.warn('[emailService] SENDGRID_API_KEY no configurado, omitiendo fallback');
  }

  // ============================================================
  // TODOS FALLARON
  // ============================================================
  console.error(`[emailService] ❌ Todos los proveedores fallaron. Error final: ${lastError?.message || 'Error desconocido'}`);
  throw new Error(`No se pudo enviar el correo. Último error: ${lastError?.message || 'Error desconocido'}`);
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
    to: process.env.EMAIL_TO || process.env.SMTP_USER,
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
export { 
  sanitizeHtml, 
  generarTablaHTML, 
  generarCuerpoCorreo, 
  enviarCorreo,
  enviarCorreoBrevo,
  enviarCorreoGmail,
  enviarCorreoSendGrid
};