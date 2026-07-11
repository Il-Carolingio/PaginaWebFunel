import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import PasswordReset from '../models/PasswordReset.js';
import { enviarCorreo } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'royal-prestige-secret-key-2026';

// Rate limiting para reset de contraseña (3 intentos por hora)
const resetAttempts = new Map();

const verificarRateLimit = (email) => {
  const ahora = Date.now();
  const intentos = resetAttempts.get(email) || [];
  
  // Limpiar intentos antiguos (más de 1 hora)
  const intentosRecientes = intentos.filter(tiempo => ahora - tiempo < 3600000);
  
  if (intentosRecientes.length >= 3) {
    return false; // Bloquear
  }
  
  intentosRecientes.push(ahora);
  resetAttempts.set(email, intentosRecientes);
  return true; // Permitir
};

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
};

// POST /api/auth/login - Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta al administrador.'
      });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = generarToken(usuario);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      usuario: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// POST /api/auth/registro - Admin crea vendedor
export const registro = async (req, res) => {
  try {
    const { email, password, nombre, telefono, direccion, contrato, reclutamientoId } = req.body;

    // Solo admin puede crear usuarios
    if (req.usuario?.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden crear vendedores'
      });
    }

    const existe = await Usuario.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
    }

    const usuario = new Usuario({
      email,
      password,
      nombre,
      telefono,
      direccion,
      contrato,
      rol: 'vendedor',
      reclutamientoId: reclutamientoId || null
    });

    await usuario.save();

    res.status(201).json({
      success: true,
      message: 'Vendedor creado exitosamente',
      usuario: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear vendedor',
      error: error.message
    });
  }
};

// GET /api/auth/verificar - Verificar token
export const verificarToken = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario: usuario.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar token'
    });
  }
};

// POST /api/auth/solicitar-reset - Solicitar reset de contraseña
export const solicitarReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    // Verificar rate limiting
    if (!verificarRateLimit(email.toLowerCase())) {
      return res.status(429).json({
        success: false,
        message: 'Demasiados intentos. Por favor espera 1 hora antes de intentar nuevamente.'
      });
    }

    // Buscar usuario (sin revelar si existe o no)
    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    
    // Siempre responder con éxito (por seguridad)
    if (!usuario) {
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación.'
      });
    }

    // Generar token de reset (expira en 1 hora)
    const token = jwt.sign(
      { email: usuario.email, tipo: 'reset-password' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Guardar token en base de datos
    const passwordReset = new PasswordReset({
      email: usuario.email,
      token,
      expiracion: new Date(Date.now() + 3600000) // 1 hora
    });

    await passwordReset.save();

    // Enviar correo con enlace de reset
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const enlaceReset = `${frontendUrl}/resetear-password/${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f4f4f4;">
        <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color:#2B6CB0; color:white; padding:20px; text-align:center;">
            <h2 style="margin:0;">Royal Prestige</h2>
            <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">Recuperación de Contraseña</p>
          </div>
          <div style="padding:20px;">
            <h3 style="color:#2B6CB0; margin-top:0;">Solicitud de Recuperación</h3>
            <p style="font-size:16px; color:#333;">
              Hola <strong>${usuario.nombre}</strong>,
            </p>
            <p style="font-size:16px; color:#333;">
              Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:
            </p>
            <div style="text-align:center; margin:30px 0;">
              <a href="${enlaceReset}" style="background-color:#2B6CB0; color:white; padding:12px 30px; text-decoration:none; border-radius:5px; font-size:16px; font-weight:bold;">
                Restablecer Contraseña
              </a>
            </div>
            <p style="font-size:14px; color:#666;">
              O copia y pega este enlace en tu navegador:<br>
              <a href="${enlaceReset}" style="color:#2B6CB0; word-break:break-all;">${enlaceReset}</a>
            </p>
            <p style="font-size:14px; color:#666;">
              Este enlace expirará en <strong>1 hora</strong>.
            </p>
            <p style="font-size:14px; color:#666;">
              Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no será modificada.
            </p>
            <hr style="border:none; border-top:1px solid #e0e0e0; margin:20px 0;">
            <p style="font-size:12px; color:#999; text-align:center;">
              Por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await enviarCorreo({
      to: usuario.email,
      subject: 'Recuperación de Contraseña - Royal Prestige',
      html
    });

    res.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace de recuperación.'
    });
  } catch (error) {
    console.error('Error al solicitar reset de contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud'
    });
  }
};

// GET /api/auth/validar-token-reset - Validar token de reset
export const validarTokenReset = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const passwordReset = await PasswordReset.findOne({ token });

    if (!passwordReset) {
      return res.status(404).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    if (!passwordReset.esValido()) {
      return res.status(400).json({
        success: false,
        message: 'Token expirado o ya utilizado'
      });
    }

    res.json({
      success: true,
      message: 'Token válido',
      email: passwordReset.email
    });
  } catch (error) {
    console.error('Error al validar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar el token'
    });
  }
};

// POST /api/auth/resetear-password - Resetear contraseña con token
export const resetearPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token y contraseña son requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const passwordReset = await PasswordReset.findOne({ token });

    if (!passwordReset) {
      return res.status(404).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (!passwordReset.esValido()) {
      return res.status(400).json({
        success: false,
        message: 'Token expirado o ya utilizado'
      });
    }

    // Buscar usuario y actualizar contraseña
    const usuario = await Usuario.findOne({ email: passwordReset.email });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Asignar la contraseña en texto plano - el pre('save') del modelo la hasheará automáticamente
    usuario.password = password;
    await usuario.save();

    // Marcar token como usado
    passwordReset.usado = true;
    await passwordReset.save();

    // Enviar correo de confirmación
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f4f4f4;">
        <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color:#2B6CB0; color:white; padding:20px; text-align:center;">
            <h2 style="margin:0;">Royal Prestige</h2>
            <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">Contraseña Actualizada</p>
          </div>
          <div style="padding:20px;">
            <h3 style="color:#2B6CB0; margin-top:0;">✅ Contraseña Cambiada</h3>
            <p style="font-size:16px; color:#333;">
              Hola <strong>${usuario.nombre}</strong>,
            </p>
            <p style="font-size:16px; color:#333;">
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <p style="font-size:14px; color:#666;">
              Si no realizaste este cambio, por favor contacta al administrador inmediatamente.
            </p>
            <hr style="border:none; border-top:1px solid #e0e0e0; margin:20px 0;">
            <p style="font-size:12px; color:#999; text-align:center;">
              Por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await enviarCorreo({
      to: usuario.email,
      subject: 'Contraseña Actualizada - Royal Prestige',
      html
    });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la contraseña'
    });
  }
};

// POST /api/auth/cambiar-password - Cambiar contraseña
export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;
    const usuarioId = req.usuario.id;

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual y la nueva son requeridas'
      });
    }

    if (passwordNuevo.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const passwordCoincide = await usuario.compararPassword(passwordActual);
    if (!passwordCoincide) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Asignar la contraseña en texto plano - el pre('save') del modelo la hasheará automáticamente
    usuario.password = passwordNuevo;
    await usuario.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar la contraseña',
      error: error.message
    });
  }
};