import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  estadoPago: { type: String, enum: ['pendiente', 'parcial', 'completado'], default: 'pendiente' },
  estadoMatricula: { type: String, enum: ['activa', 'inactiva', 'completada', 'cancelada'], default: 'activa' },
  montoPagado: { type: Number, default: 0 },
  moneda: { type: String, default: 'PEN' },
  fechaCompra: { type: Date, default: Date.now },
  asistenciaRegistrada: { type: Boolean, default: false },
  aprobacionManual: { type: Boolean, default: false },
}, { timestamps: true });

EnrollmentSchema.index({ studentId: 1 });
EnrollmentSchema.index({ productId: 1 });
EnrollmentSchema.index({ studentId: 1, productId: 1 });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
