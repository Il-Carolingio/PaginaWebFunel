import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const JWT_SECRET = process.env.JWT_SECRET || 'royal-prestige-secret-key-2026';

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