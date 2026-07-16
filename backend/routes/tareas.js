import express from 'express';
import { listarTareas, crearTarea, actualizarTarea, eliminarTarea, cambiarEstadoTarea, eliminarTareaCancelada } from '../controllers/TareaController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

router.get('/', listarTareas);
router.post('/', crearTarea);
router.put('/:id', actualizarTarea);
router.patch('/:id/estado', cambiarEstadoTarea);
router.delete('/:id', eliminarTarea);
router.delete('/:id/cancelada', eliminarTareaCancelada);

export default router;
