import express from 'express';
import { login, registro, verificarToken, cambiarPassword, solicitarReset, validarTokenReset, resetearPassword } from '../controllers/AuthController.js';
import { verificarToken as authMiddleware, esAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/registro', authMiddleware, esAdmin, registro);

// Rutas de reset de contraseña (HU-021)
router.post('/solicitar-reset', solicitarReset);
router.get('/validar-token-reset/:token', validarTokenReset);
router.post('/resetear-password', resetearPassword);

// Rutas protegidas
router.get('/verificar', authMiddleware, verificarToken);
router.post('/cambiar-password', authMiddleware, cambiarPassword);

export default router;
