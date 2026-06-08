import mongoose from 'mongoose';

const CorrectionRequestSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ['student_certificate', 'teacher_certificate', 'teacher_contract'],
    required: true,
  },
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  solicitadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  descripcion: { type: String, required: true },
  camposSolicitados: [{
    campo: String,
    valorActual: String,
    valorSolicitado: String,
  }],
  estado: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente',
  },
  revisadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaRevision: { type: Date },
  observacionesAdmin: { type: String, default: '' },
}, { timestamps: true });

CorrectionRequestSchema.index({ documentType: 1 });
CorrectionRequestSchema.index({ estado: 1 });
CorrectionRequestSchema.index({ documentId: 1 });

export default mongoose.models.CorrectionRequest || mongoose.model('CorrectionRequest', CorrectionRequestSchema);
