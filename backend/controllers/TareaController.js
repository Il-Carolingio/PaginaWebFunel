import Tarea from '../models/Tarea.js';

export const listarTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ vendedorId: req.usuario._id })
      .populate('prospectoId', 'nombre telefono')
      .sort({ fecha: -1 });

    res.json({
      success: true,
      data: tareas
    });
  } catch (error) {
    console.error('Error al listar tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar las tareas'
    });
  }
};

export const crearTarea = async (req, res) => {
  try {
    const { tipo, titulo, descripcion, fecha, hora, prospectoId, ubicacion } = req.body;

    const payload = {
      tipo,
      titulo,
      descripcion,
      fecha,
      hora,
      ubicacion,
      vendedorId: req.usuario._id
    };

    if (prospectoId && String(prospectoId).trim() !== '') {
      payload.prospectoId = String(prospectoId).trim();
    }

    const tarea = new Tarea(payload);

    const tareaGuardada = await tarea.save();

    res.status(201).json({
      success: true,
      data: tareaGuardada
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear la tarea'
    });
  }
};

export const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, titulo, descripcion, fecha, hora, ubicacion, estado } = req.body;

    // Preparar el payload de actualización
    const updateData = { tipo, titulo, descripcion, fecha, hora, ubicacion, estado };
    
    // Si el estado cambia a 'completada', registrar la fecha
    if (estado === 'completada') {
      updateData.fechaCompletado = new Date();
    } else if (estado === 'pendiente' || estado === 'cancelada') {
      // Si cambia de completada a otro estado, limpiar la fecha
      updateData.fechaCompletado = null;
    }

    const tarea = await Tarea.findOneAndUpdate(
      { _id: id, vendedorId: req.usuario._id },
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: tarea
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar la tarea'
    });
  }
};

export const cambiarEstadoTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar que el estado sea válido
    if (!['pendiente', 'completada', 'cancelada'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    // Preparar datos de actualización
    const updateData = { estado };
    
    // Si el estado cambia a 'completada', registrar la fecha
    if (estado === 'completada') {
      updateData.fechaCompletado = new Date();
    } else {
      // Si cambia de completada a otro estado, limpiar la fecha
      updateData.fechaCompletado = null;
    }

    const tarea = await Tarea.findOneAndUpdate(
      { _id: id, vendedorId: req.usuario._id },
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: tarea,
      message: `Tarea marcada como ${estado}`
    });
  } catch (error) {
    console.error('Error al cambiar estado de tarea:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al cambiar el estado de la tarea'
    });
  }
};

export const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await Tarea.findOneAndDelete({
      _id: id,
      vendedorId: req.usuario._id
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
      message: 'Error al eliminar la tarea'
    });
  }
};