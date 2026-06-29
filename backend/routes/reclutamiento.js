const express = require('express');
const router = express.Router();
const reclutamientoController = require('../controllers/ReclutamientoController');

// POST /api/reclutamiento/registro - Registrar nuevo candidato
router.post('/registro', reclutamientoController.registrar);

// GET /api/reclutamiento - Obtener todos los registros (admin)
router.get('/', reclutamientoController.obtenerTodos);

// GET /api/reclutamiento/:id - Obtener registro por ID (admin)
router.get('/:id', reclutamientoController.obtenerPorId);

// PUT /api/reclutamiento/:id/status - Actualizar status del candidato (admin)
router.put('/:id/status', reclutamientoController.actualizarStatus);

// DELETE /api/reclutamiento/:id - Eliminar registro (admin)
router.delete('/:id', reclutamientoController.eliminar);

module.exports = router;