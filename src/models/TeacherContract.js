import mongoose from 'mongoose';

const TeacherContractSchema = new mongoose.Schema({
  codigoContrato: { type: String, required: true, unique: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  teacherAssignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherAssignment', default: null },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentTemplate' },
  marcaId: { type: String },
  datosDocente: {
    nombreCompleto: String,
    documento: String,
    email: String,
    telefono: String,
  },
  datosCursoPrograma: {
    nombre: String,
    tipoProducto: String,
    rolDocente: String,
  },
  datosContrato: {
    fechaInicio: Date,
    fechaFin: Date,
    montoHonorarios: Number,
    moneda: String,
    obligaciones: String,
    condiciones: String,
    representanteInstitucional: String,
  },
  pdfUrl: { type: String, default: '' },
  estado: {
    type: String,
    enum: ['draft', 'in_review', 'observed', 'approved', 'issued', 'cancelled', 'replaced'],
    default: 'draft',
  },
  version: { type: Number, default: 1 },
  contratoOriginalId: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherContract', default: null },
  reemplazadoPorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherContract', default: null },
  motivoCorreccion: { type: String, default: '' },
  motivoAnulacion: { type: String, default: '' },
  observaciones: { type: String, default: '' },
  aprobadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emitidoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  anuladoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

TeacherContractSchema.index({ codigoContrato: 1 }, { unique: true });
TeacherContractSchema.index({ teacherId: 1 });
TeacherContractSchema.index({ productId: 1 });
TeacherContractSchema.index({ estado: 1 });

export default mongoose.models.TeacherContract || mongoose.model('TeacherContract', TeacherContractSchema);
