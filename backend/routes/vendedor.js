import express from 'express';
import { obtenerPerfil, actualizarPerfil, listarVendedores } from '../controllers/VendedorController.js';
import { verificarToken, esAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);

// Solo admin
router.get('/', verificarToken, esAdmin, listarVendedores);

export default router;