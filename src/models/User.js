import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  documento: { type: String, default: '' },
  telefono: { type: String, default: '' },
  pais: { type: String, default: '' },
  rol: {
    type: String,
    enum: ['admin', 'admin_academico', 'area_administrativa', 'docente', 'estudiante'],
    default: 'estudiante',
  },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
}, { timestamps: true });

UserSchema.index({ email: 1 });
UserSchema.index({ rol: 1 });
UserSchema.index({ documento: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
