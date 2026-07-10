import express from 'express';
import { registrar, obtenerTodos, obtenerPorId, actualizarStatus, eliminar, obtenerTareasLlamada, marcarTareaGenerada, enviarCorreoRegistro } from '../controllers/ReclutamientoController.js';
import { completarRegistro, validarToken } from '../controllers/RegistroVendedorController.js';

const router = express.Router();

// POST /api/reclutamiento/registro - Registrar nuevo candidato
router.post('/registro', registrar);

// GET /api/reclutamiento/tareas-llamada - Obtener registros como tareas de llamada (HU-017)
router.get('/tareas-llamada', obtenerTareasLlamada);

// GET /api/reclutamiento - Obtener todos los registros (admin)
router.get('/', obtenerTodos);

// GET /api/reclutamiento/validar-token - Validar token de registro (público)
// IMPORTANTE: Esta ruta debe estar ANTES de /:id para que no sea confundida con un ID
router.get('/validar-token', validarToken);

// POST /api/reclutamiento/completar-registro - Completar registro con token (público)
router.post('/completar-registro', completarRegistro);

// POST /api/reclutamiento/enviar-correo/:id - Enviar correo de registro (admin)
router.post('/enviar-correo/:id', enviarCorreoRegistro);

// GET /api/reclutamiento/:id - Obtener registro por ID (admin)
router.get('/:id', obtenerPorId);

// PUT /api/reclutamiento/:id/status - Actualizar status del candidato (admin)
router.put('/:id/status', actualizarStatus);

// PUT /api/reclutamiento/:id/marcar-tarea-generada - Marcar registro como tarea generada
router.put('/:id/marcar-tarea-generada', marcarTareaGenerada);

// DELETE /api/reclutamiento/:id - Eliminar registro (admin)
router.delete('/:id', eliminar);

export default router;
