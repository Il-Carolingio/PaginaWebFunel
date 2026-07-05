import mongoose from 'mongoose';

const tareaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo de tarea es requerido'],
    enum: {
      values: ['cita', 'llamada', 'seguimiento', 'evento', 'entrevista', 'contrato'],
      message: 'Tipo no válido'
    }
  },
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    default: null
  },
  hora: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  fechaCompletado: {
    type: Date,
    default: null
  },
  vendedorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },
  prospectoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prospecto'
  },
  ubicacion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

tareaSchema.index({ vendedorId: 1, fecha: -1 });
tareaSchema.index({ estado: 1 });

export default mongoose.model('Tarea', tareaSchema);