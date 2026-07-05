import express from 'express';
import { registrar, obtenerTodos, obtenerPorId, actualizarStatus, eliminar, obtenerTareasLlamada, marcarTareaGenerada } from '../controllers/ReclutamientoController.js';

const router = express.Router();

// POST /api/reclutamiento/registro - Registrar nuevo candidato
router.post('/registro', registrar);

// GET /api/reclutamiento - Obtener todos los registros (admin)
router.get('/', obtenerTodos);

// GET /api/reclutamiento/:id - Obtener registro por ID (admin)
router.get('/:id', obtenerPorId);

// PUT /api/reclutamiento/:id/status - Actualizar status del candidato (admin)
router.put('/:id/status', actualizarStatus);

// DELETE /api/reclutamiento/:id - Eliminar registro (admin)
router.delete('/:id', eliminar);

// GET /api/reclutamiento/tareas-llamada - Obtener registros como tareas de llamada (HU-017)
router.get('/tareas-llamada', obtenerTareasLlamada);

// PUT /api/reclutamiento/:id/marcar-tarea-generada - Marcar registro como tarea generada
router.put('/:id/marcar-tarea-generada', marcarTareaGenerada);

export default router;
