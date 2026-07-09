import express from 'express';
import { registrar, obtenerTodos, obtenerPorId, actualizarStatus, eliminar, obtenerTareasLlamada, marcarTareaGenerada, enviarCorreoRegistro } from '../controllers/ReclutamientoController.js';

const router = express.Router();

// POST /api/reclutamiento/registro - Registrar nuevo candidato
router.post('/registro', registrar);

// GET /api/reclutamiento/tareas-llamada - Obtener registros como tareas de llamada (HU-017)
router.get('/tareas-llamada', obtenerTareasLlamada);

// GET /api/reclutamiento - Obtener todos los registros (admin)
router.get('/', obtenerTodos);

// GET /api/reclutamiento/:id - Obtener registro por ID (admin)
router.get('/:id', obtenerPorId);

// PUT /api/reclutamiento/:id/status - Actualizar status del candidato (admin)
router.put('/:id/status', actualizarStatus);

// PUT /api/reclutamiento/:id/marcar-tarea-generada - Marcar registro como tarea generada
router.put('/:id/marcar-tarea-generada', marcarTareaGenerada);

// DELETE /api/reclutamiento/:id - Eliminar registro (admin)
router.delete('/:id', eliminar);

// POST /api/reclutamiento/enviar-correo/:id - Enviar correo de registro (admin)
router.post('/enviar-correo/:id', enviarCorreoRegistro);

export default router;
