import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Reclutamiento from '../models/Reclutamiento.js';

const JWT_SECRET = process.env.JWT_SECRET || 'royal-prestige-secret-key-2026';

// POST /api/reclutamiento/completar-registro - Completar registro con token
export const completarRegistro = async (req, res) => {
  try {
    const { token, password, nombre, telefono, direccion } = req.body;

    // Validar datos requeridos
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token y contraseña son requeridos'
      });
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar y decodificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Buscar el registro de reclutamiento
    const registro = await Reclutamiento.findById(decoded.reclutamientoId);
    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro de reclutamiento no encontrado'
      });
    }

    // Verificar que el token coincida
    if (registro.tokenRegistro !== token) {
      return res.status(400).json({
        success: false,
        message: 'Token no válido para este registro'
      });
    }

    // Verificar que no haya expirado
    if (new Date() > registro.tokenExpiracion) {
      return res.status(400).json({
        success: false,
        message: 'El token ha expirado. Solicita un nuevo enlace de registro.'
      });
    }

    // Verificar que no esté ya completado
    if (registro.registroCompletado) {
      return res.status(400).json({
        success: false,
        message: 'El registro ya fue completado anteriormente'
      });
    }

    // Verificar que el email no esté ya registrado como usuario
    const existeUsuario = await Usuario.findOne({ email: registro.email.toLowerCase() });
    if (existeUsuario) {
      return res.status(400).json({
        success: false,
        message: 'Este correo electrónico ya está registrado'
      });
    }

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      email: registro.email,
      password: password,
      nombre: nombre || registro.nombre,
      telefono: telefono || registro.telefono,
      direccion: direccion || '',
      rol: decoded.rol || 'vendedor',
      reclutamientoId: registro._id
    });

    await nuevoUsuario.save();

    // Marcar el registro como completado
    registro.registroCompletado = true;
    registro.status = 'contratado';
    await registro.save();

    // Generar token de autenticación para el nuevo usuario
    const tokenAuth = jwt.sign(
      { id: nuevoUsuario._id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registro completado exitosamente',
      data: {
        token: tokenAuth,
        usuario: nuevoUsuario.toJSON()
      }
    });
  } catch (error) {
    console.error('Error al completar registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al completar el registro',
      error: error.message
    });
  }
};

// GET /api/reclutamiento/validar-token - Validar token de registro
export const validarToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar y decodificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado',
        expirado: true
      });
    }

    // Buscar el registro de reclutamiento
    const registro = await Reclutamiento.findById(decoded.reclutamientoId);
    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro de reclutamiento no encontrado'
      });
    }

    // Verificar que el token coincida
    if (registro.tokenRegistro !== token) {
      return res.status(400).json({
        success: false,
        message: 'Token no válido'
      });
    }

    // Verificar que no haya expirado
    if (new Date() > registro.tokenExpiracion) {
      return res.status(400).json({
        success: false,
        message: 'El token ha expirado',
        expirado: true
      });
    }

    // Verificar que no esté ya completado
    if (registro.registroCompletado) {
      return res.status(400).json({
        success: false,
        message: 'El registro ya fue completado anteriormente',
        completado: true
      });
    }

    // Token válido, devolver datos del candidato
    res.status(200).json({
      success: true,
      message: 'Token válido',
      data: {
        email: registro.email,
        nombre: registro.nombre,
        telefono: registro.telefono,
        rol: decoded.rol || 'vendedor'
      }
    });
  } catch (error) {
    console.error('Error al validar token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar el token',
      error: error.message
    });
  }
};