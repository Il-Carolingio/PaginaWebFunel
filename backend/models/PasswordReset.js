// backend/models/PasswordReset.js
import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  token: {
    type: String,
    required: [true, 'El token es requerido'],
    unique: true
  },
  expiracion: {
    type: Date,
    required: [true, 'La fecha de expiración es requerida']
  },
  usado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índice para búsquedas por email
passwordResetSchema.index({ email: 1 });
// Índice para limpiar tokens expirados
passwordResetSchema.index({ expiracion: 1 }, { expireAfterSeconds: 0 });

// Método para verificar si el token es válido
passwordResetSchema.methods.esValido = function() {
  return !this.usado && new Date() < this.expiracion;
};

export default mongoose.model('PasswordReset', passwordResetSchema);