import express from 'express';
import { listarTareas, crearTarea, actualizarTarea, eliminarTarea } from '../controllers/TareaController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

router.get('/', listarTareas);
router.post('/', crearTarea);
router.put('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);

export default router;