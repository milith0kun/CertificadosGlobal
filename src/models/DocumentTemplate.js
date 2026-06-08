import mongoose from 'mongoose';

const DocumentTemplateSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipoPlantilla: {
    type: String,
    enum: ['student_certificate', 'teacher_contract', 'teacher_certificate'],
    required: true,
  },
  marcaId: { type: String, required: true },
  htmlTemplate: { type: String, default: '' },
  cssTemplate: { type: String, default: '' },
  fondoUrl: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  firmaUrl: { type: String, default: '' },
  selloUrl: { type: String, default: '' },
  incluyeQR: { type: Boolean, default: true },
  variables: [{ type: String }],
  estado: { type: String, enum: ['activa', 'inactiva'], default: 'activa' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

DocumentTemplateSchema.index({ tipoPlantilla: 1 });
DocumentTemplateSchema.index({ marcaId: 1 });
DocumentTemplateSchema.index({ estado: 1 });

export default mongoose.models.DocumentTemplate || mongoose.model('DocumentTemplate', DocumentTemplateSchema);
