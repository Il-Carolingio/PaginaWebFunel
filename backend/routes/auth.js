import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || 'royalprestige_secret_key_2026',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      usuario: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
});

// Obtener perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  res.json({
    success: true,
    usuario: req.usuario
  });
});

// Cambiar contraseña
router.post('/cambiar-password', verificarToken, async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    const usuario = await Usuario.findById(req.usuario._id);
    const passwordValido = await usuario.compararPassword(passwordActual);

    if (!passwordValido) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    usuario.password = passwordNuevo;
    await usuario.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar password:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar la contraseña'
    });
  }
});

export default router;