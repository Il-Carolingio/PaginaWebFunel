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

    const tarea = await Tarea.findOneAndUpdate(
      { _id: id, vendedorId: req.usuario._id },
      { tipo, titulo, descripcion, fecha, hora, ubicacion, estado },
      { new: true, runValidators: true }
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