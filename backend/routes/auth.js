import express from 'express';
import { login, registro, verificarToken } from '../controllers/AuthController.js';
import { verificarToken as authMiddleware, esAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/registro', authMiddleware, esAdmin, registro);

// Rutas protegidas
router.get('/verificar', authMiddleware, verificarToken);

export default router;