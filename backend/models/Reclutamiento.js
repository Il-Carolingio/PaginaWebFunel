import mongoose from 'mongoose';

const reclutamientoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    minlength: [3, 'Mínimo 3 caracteres'],
    trim: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    match: [/^[0-9]{10}$/, 'Debe tener 10 dígitos'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El correo es requerido'],
    match: [/^\S+@\S+\.\S+$/, 'Correo inválido'],
    trim: true,
    lowercase: true
  },
  experiencia: {
    type: String,
    required: [true, 'Selecciona una opción'],
    enum: {
      values: ['si', 'no'],
      message: 'Valor no válido'
    }
  },
  disponibilidad: {
    type: String,
    required: [true, 'Selecciona una opción'],
    enum: {
      values: ['mañana', 'tarde', 'noche', 'flexible'],
      message: 'Valor no válido'
    }
  },
  motivacion: {
    type: String,
    maxlength: [500, 'Máximo 500 caracteres'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['pendiente', 'contratado', 'cancelado'],
      message: 'Valor no válido'
    },
    default: 'pendiente'
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  tareaGenerada: {
    type: Boolean,
    default: false
  }
});

// Índices para búsquedas frecuentes
reclutamientoSchema.index({ email: 1 }, { unique: true });
reclutamientoSchema.index({ telefono: 1 }, { unique: true });
reclutamientoSchema.index({ fechaRegistro: -1 });
reclutamientoSchema.index({ status: 1 });

export default mongoose.model('Reclutamiento', reclutamientoSchema);
