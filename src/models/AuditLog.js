import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  documentType: { type: String, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId },
  accion: { type: String, required: true },
  descripcion: { type: String, default: '' },
  realizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rol: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
}, { timestamps: { createdAt: true, updatedAt: false } });

AuditLogSchema.index({ documentType: 1 });
AuditLogSchema.index({ documentId: 1 });
AuditLogSchema.index({ realizadoPor: 1 });
AuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
