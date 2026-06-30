import Tarea from '../models/Tarea.js';

// GET /api/tareas - Listar tareas del vendedor
export const listarTareas = async (req, res) => {
  try {
    const { tipo, estado, fecha } = req.query;
    const filtro = { vendedorId: req.usuario.id };

    if (tipo) filtro.tipo = tipo;
    if (estado) filtro.estado = estado;
    if (fecha) filtro.fecha = new Date(fecha);

    const tareas = await Tarea.find(filtro)
      .populate('prospectoId', 'nombre telefono')
      .sort({ fecha: 1, hora: 1 });

    res.json({
      success: true,
      data: tareas,
      total: tareas.length
    });
  } catch (error) {
    console.error('Error al listar tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar tareas',
      error: error.message
    });
  }
};

// POST /api/tareas - Crear tarea
export const crearTarea = async (req, res) => {
  try {
    const { tipo, titulo, descripcion, fecha, hora, prospectoId, ubicacion } = req.body;

    const tarea = new Tarea({
      tipo,
      titulo,
      descripcion,
      fecha,
      hora,
      prospectoId: prospectoId || null,
      vendedorId: req.usuario.id,
      ubicacion: ubicacion || null
    });

    await tarea.save();
    await tarea.populate('prospectoId', 'nombre telefono');

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: tarea
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea',
      error: error.message
    });
  }
};

// PUT /api/tareas/:id - Actualizar tarea
export const actualizarTarea = async (req, res) => {
  try {
    const { tipo, titulo, descripcion, fecha, hora, estado, prospectoId, ubicacion } = req.body;

    const tarea = await Tarea.findOneAndUpdate(
      { _id: req.params.id, vendedorId: req.usuario.id },
      { tipo, titulo, descripcion, fecha, hora, estado, prospectoId, ubicacion },
      { new: true, runValidators: true }
    ).populate('prospectoId', 'nombre telefono');

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: tarea
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

// DELETE /api/tareas/:id - Eliminar tarea
export const eliminarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findOneAndDelete({
      _id: req.params.id,
      vendedorId: req.usuario.id
    });

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
};