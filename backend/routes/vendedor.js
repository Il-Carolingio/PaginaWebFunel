import express from 'express';
import Usuario from '../models/Usuario.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Actualizar perfil del vendedor
router.put('/perfil', async (req, res) => {
  try {
    const { nombre, telefono, direccion, contrato } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { nombre, telefono, direccion, contrato },
      { new: true, runValidators: true }
    ).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil'
    });
  }
});

export default router;