import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'Mínimo 6 caracteres']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  direccion: {
    type: String,
    trim: true
  },
  contrato: {
    type: String,
    trim: true
  },
  rol: {
    type: String,
    enum: ['vendedor', 'admin'],
    default: 'vendedor'
  },
  activo: {
    type: Boolean,
    default: true
  },
  reclutamientoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reclutamiento'
  }
}, {
  timestamps: true
});

// Hash password antes de guardar
usuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar password
usuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// No devolver password en JSON
usuarioSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Usuario', usuarioSchema);
