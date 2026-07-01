import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 8
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
  }
}, {
  timestamps: true
});

usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

usuarioSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Usuario', usuarioSchema);