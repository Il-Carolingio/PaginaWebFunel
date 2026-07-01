import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'royalprestige_secret_key_2026');

    const usuario = await Usuario.findById(decoded.id).select('-password');
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};