import Usuario from '../models/Usuario.js';

// GET /api/vendedor/perfil - Obtener perfil del vendedor
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

// PUT /api/vendedor/perfil - Actualizar perfil
export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono, direccion, contrato } = req.body;

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { nombre, telefono, direccion, contrato },
      { new: true, runValidators: true }
    );

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      usuario: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

// GET /api/vendedor - Listar todos los vendedores (solo admin)
export const listarVendedores = async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden listar vendedores'
      });
    }

    const vendedores = await Usuario.find({ rol: 'vendedor' })
      .sort({ createdAt: -1 })
      .select('-password');

    res.json({
      success: true,
      data: vendedores,
      total: vendedores.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al listar vendedores',
      error: error.message
    });
  }
};