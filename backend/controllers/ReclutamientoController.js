import Reclutamiento from '../models/Reclutamiento.js';

// Registrar nuevo candidato
exports.registrar = async (req, res) => {
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
exports.obtenerTodos = async (req, res) => {
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
exports.obtenerPorId = async (req, res) => {
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
exports.actualizarStatus = async (req, res) => {
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

// Eliminar registro
exports.eliminar = async (req, res) => {
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