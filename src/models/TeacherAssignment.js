import mongoose from 'mongoose';

const TeacherAssignmentSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rolDocente: {
    type: String,
    enum: ['Expositor', 'Ponente', 'Capacitador', 'Instructor', 'Docente Especialista', 'Facilitador'],
    required: true,
  },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  horasDictadas: { type: Number, default: 0 },
  estadoParticipacion: { type: String, enum: ['pendiente', 'confirmada', 'completada', 'cancelada'], default: 'pendiente' },
  estadoPagoDocente: { type: String, enum: ['pendiente', 'parcial', 'pagado'], default: 'pendiente' },
  montoHonorarios: { type: Number, default: 0 },
  moneda: { type: String, default: 'PEN' },
}, { timestamps: true });

TeacherAssignmentSchema.index({ teacherId: 1 });
TeacherAssignmentSchema.index({ productId: 1 });
TeacherAssignmentSchema.index({ teacherId: 1, productId: 1 });

export default mongoose.models.TeacherAssignment || mongoose.model('TeacherAssignment', TeacherAssignmentSchema);
