import Reclutamiento from '../models/Reclutamiento.js';

// Registrar nuevo candidato
export const registrar = async (req, res) => {
  try {
    const { nombre, telefono, email, experiencia, disponibilidad, motivacion } = req.body;

    // Validar que no exista email o teléfono duplicado
    const existeEmail = await Reclutamiento.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        message: 'Ya existe un registro con este correo electrónico'
      });
    }

    const existeTelefono = await Reclutamiento.findOne({ telefono });
    if (existeTelefono) {
      return res.status(400).json({
        message: 'Ya existe un registro con este teléfono'
      });
    }

    // Crear nuevo registro
    const nuevoRegistro = new Reclutamiento({
      nombre,
      telefono,
      email,
      experiencia,
      disponibilidad,
      motivacion,
      status: 'pendiente' // Estado inicial
    });

    await nuevoRegistro.save();

    res.status(201).json({
      message: 'Registro exitoso. Nos pondremos en contacto contigo pronto.',
      data: {
        id: nuevoRegistro._id,
        nombre: nuevoRegistro.nombre,
        email: nuevoRegistro.email,
        status: nuevoRegistro.status,
        fechaRegistro: nuevoRegistro.fechaRegistro
      }
    });
  } catch (error) {
    console.error('Error en registro de reclutamiento:', error);
    res.status(500).json({
      message: 'Error al registrar',
      error: error.message
    });
  }
};

// Obtener todos los registros (para admin)
export const obtenerTodos = async (req, res) => {
  try {
    const registros = await Reclutamiento.find()
      .sort({ fechaRegistro: -1 })
      .select('-__v');

    res.status(200).json({
      message: 'Registros obtenidos exitosamente',
      data: registros,
      total: registros.length
    });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({
      message: 'Error al obtener registros',
      error: error.message
    });
  }
};

// Obtener registro por ID
export const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await Reclutamiento.findById(id).select('-__v');

    if (!registro) {
      return res.status(404).json({
        message: 'Registro no encontrado'
      });
    }

    res.status(200).json({
      message: 'Registro encontrado',
      data: registro
    });
  } catch (error) {
    console.error('Error al obtener registro:', error);
    res.status(500).json({
      message: 'Error al obtener registro',
      error: error.message
    });
  }
};

// Actualizar status del candidato
export const actualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar que el status sea válido
    if (!['pendiente', 'contratado', 'cancelado'].includes(status)) {
      return res.status(400).json({
        message: 'Status inválido. Debe ser: pendiente, contratado o cancelado'
      });
    }

    const registro = await Reclutamiento.findByIdAndUpdate(
      id,
      { status },
      { new: true, select: '-__v' }
    );

    if (!registro) {
      return res.status(404).json({
        message: 'Registro no encontrado'
      });
    }

    res.status(200).json({
      message: 'Status actualizado exitosamente',
      data: registro
    });
  } catch (error) {
    console.error('Error al actualizar status:', error);
    res.status(500).json({
      message: 'Error al actualizar status',
      error: error.message
    });
  }
};

// Obtener registros como tareas de llamada (para HU-017)
export const obtenerTareasLlamada = async (req, res) => {
  try {
    // Obtener todos los registros de reclutamiento
    const registros = await Reclutamiento.find()
      .sort({ fechaRegistro: -1 })
      .select('-__v');

    // Transformar registros a formato de tareas
    const tareas = registros.map(registro => ({
      _id: registro._id,
      tipo: 'reclutamiento',
      titulo: `Llamar a ${registro.nombre}`,
      descripcion: `Seguimiento de candidato a equipo de ventas`,
      nombre: registro.nombre,
      telefono: registro.telefono,
      email: registro.email,
      experiencia: registro.experiencia,
      disponibilidad: registro.disponibilidad,
      motivacion: registro.motivacion,
      status: registro.status === 'pendiente' ? 'pendiente' : 
              (registro.status === 'contratado' ? 'completada' : 'cancelada'),
      estadoOriginal: registro.status || 'pendiente',
      fechaRegistro: registro.fechaRegistro,
      fechaCreacion: registro.fechaRegistro,
      tareaGenerada: registro.tareaGenerada || false
    }));

    res.status(200).json({
      message: 'Tareas de llamada obtenidas exitosamente',
      data: tareas,
      total: tareas.length
    });
  } catch (error) {
    console.error('Error al obtener tareas de llamada:', error);
    res.status(500).json({
      message: 'Error al obtener tareas de llamada',
      error: error.message
    });
  }
};

// Marcar registro como tarea generada
export const marcarTareaGenerada = async (req, res) => {
  try {
    const { id } = req.params;
    
    const registro = await Reclutamiento.findByIdAndUpdate(
      id,
      { tareaGenerada: true },
      { new: true, select: '-__v' }
    );

    if (!registro) {
      return res.status(404).json({
        message: 'Registro no encontrado'
      });
    }

    res.status(200).json({
      message: 'Registro marcado como tarea generada',
      data: registro
    });
  } catch (error) {
    console.error('Error al marcar tarea generada:', error);
    res.status(500).json({
      message: 'Error al marcar tarea generada',
      error: error.message
    });
  }
};

// Eliminar registro
export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await Reclutamiento.findByIdAndDelete(id);

    if (!registro) {
      return res.status(404).json({
        message: 'Registro no encontrado'
      });
    }

    res.status(200).json({
      message: 'Registro eliminado exitosamente',
      data: registro
    });
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({
      message: 'Error al eliminar registro',
      error: error.message
    });
  }
};