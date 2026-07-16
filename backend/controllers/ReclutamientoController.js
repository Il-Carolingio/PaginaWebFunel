import Reclutamiento from '../models/Reclutamiento.js';
import Tarea from '../models/Tarea.js';

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

    // Crear tarea automática en la colección tareas (HU-017)
    // Nota: vendedorId es null porque es una tarea de reclutamiento general
    const nuevaTarea = new Tarea({
      tipo: 'llamada',
      titulo: 'Reclutamiento',
      descripcion: `Nombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\nExperiencia: ${experiencia}\nDisponibilidad: ${disponibilidad}`,
      fecha: null, // Sin fecha - se asignará después
      hora: null, // Sin hora - se asignará después
      estado: 'pendiente',
      vendedorId: null // Tarea general, no asignada a vendedor específico
    });

    await nuevaTarea.save();

    // Marcar el registro como tarea generada
    nuevoRegistro.tareaGenerada = true;
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

// Obtener tareas de reclutamiento (para HU-017)
export const obtenerTareasLlamada = async (req, res) => {
  try {
    // Obtener tareas con título "Reclutamiento" de la colección tareas
    const tareas = await Tarea.find({ titulo: 'Reclutamiento' })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    res.status(200).json({
      success: true,
      message: 'Tareas de reclutamiento obtenidas exitosamente',
      data: tareas,
      total: tareas.length
    });
  } catch (error) {
    console.error('Error al obtener tareas de reclutamiento:', error);
    res.status(500).json({
      message: 'Error al obtener tareas de reclutamiento',
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

// Enviar correo de registro a candidato de reclutamiento
export const enviarCorreoRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    // Validar datos requeridos
    if (!nombre || !email || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y rol son requeridos'
      });
    }

    // Validar rol
    if (!['admin', 'vendedor', 'invitado'].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser: admin, vendedor o invitado'
      });
    }

    // Buscar el registro de reclutamiento por email
    const registro = await Reclutamiento.findOne({ email: email.toLowerCase() });
    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro de reclutamiento no encontrado con ese email'
      });
    }

    // Verificar que no esté ya completado
    if (registro.registroCompletado) {
      return res.status(400).json({
        success: false,
        message: 'El registro ya fue completado anteriormente'
      });
    }

    // Verificar que no tenga token activo
    if (registro.tokenRegistro && registro.tokenExpiracion && new Date() < registro.tokenExpiracion) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un token de registro activo. Espera a que expire o usa ese enlace.'
      });
    }

    // Generar token JWT
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign(
      {
        reclutamientoId: registro._id,
        email: registro.email,
        nombre: nombre || registro.nombre,
        rol: rol
      },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    // Actualizar el registro con el token
    registro.tokenRegistro = token;
    registro.tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    await registro.save();

    // Marcar la tarea de reclutamiento como completada
    await Tarea.findOneAndUpdate(
      { titulo: 'Reclutamiento', estado: 'pendiente' },
      { estado: 'completada', fechaCompletado: new Date() },
      { sort: { createdAt: -1 } }
    );

    // Enviar correo
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const enlaceRegistro = `${frontendUrl}/registro-vendedor?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f4f4f4;">
        <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color:#2B6CB0; color:white; padding:20px; text-align:center;">
            <h2 style="margin:0;">Casa Pleroma</h2>
            <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">Invitación a Registro de Vendedor</p>
          </div>
          <div style="padding:20px;">
            <h3 style="color:#2B6CB0; margin-top:0;">¡Bienvenido a Casa Pleroma!</h3>
            <p style="font-size:16px; color:#333;">
              Hola <strong>${nombre || registro.nombre}</strong>,
            </p>
            <p style="font-size:16px; color:#333;">
              Has sido invitado a formar parte de nuestro equipo de vendedores. Para completar tu registro, haz clic en el siguiente enlace:
            </p>
            <div style="text-align:center; margin:30px 0;">
              <a href="${enlaceRegistro}" style="background-color:#2B6CB0; color:white; padding:12px 30px; text-decoration:none; border-radius:5px; font-size:16px; font-weight:bold;">
                Completar Registro
              </a>
            </div>
            <p style="font-size:14px; color:#666;">
              O copia y pega este enlace en tu navegador:<br>
              <a href="${enlaceRegistro}" style="color:#2B6CB0; word-break:break-all;">${enlaceRegistro}</a>
            </p>
            <p style="font-size:14px; color:#666;">
              Este enlace expirará en <strong>24 horas</strong>.
            </p>
            <hr style="border:none; border-top:1px solid #e0e0e0; margin:20px 0;">
            <p style="font-size:12px; color:#999; text-align:center;">
              Si no solicitaste este registro, puedes ignorar este correo.<br>
              Por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Importar servicio de email
    const { enviarCorreo } = await import('../services/emailService.js');

    await enviarCorreo({
      to: registro.email,
      subject: '¡Bienvenido a Casa Pleroma! Completa tu registro',
      html
    });

    res.status(200).json({
      success: true,
      message: 'Correo de registro enviado exitosamente',
      data: {
        email: registro.email,
        nombre: nombre || registro.nombre,
        rol: rol,
        tokenExpiracion: registro.tokenExpiracion
      }
    });
  } catch (error) {
    console.error('Error al enviar correo de registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el correo de registro',
      error: error.message
    });
  }
};
