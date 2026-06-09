import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  codigoCertificado: { type: String, required: true, unique: true },
  tipoCertificado: {
    type: String,
    enum: ['student_certificate', 'teacher_certificate'],
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', default: null },
  teacherAssignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherAssignment', default: null },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentTemplate' },
  marcaId: { type: String },
  datosPersona: {
    nombreCompleto: String,
    documento: String,
    email: String,
  },
  datosCursoPrograma: {
    nombre: String,
    tipoProducto: String,
    horasAcademicas: Number,
    rolDocente: String,
  },
  datosInstitucionales: {
    institucionEmisora: String,
    marca: String,
    firmaUrl: String,
    selloUrl: String,
  },
  qrUrl: { type: String, default: '' },
  validationUrl: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  fechaEmision: { type: Date, default: Date.now },
  estado: {
    type: String,
    enum: ['pending', 'issued', 'corrected', 'reissued', 'cancelled', 'replaced', 'generation_error'],
    default: 'pending',
  },
  version: { type: Number, default: 1 },
  certificadoOriginalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate', default: null },
  reemplazadoPorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate', default: null },
  motivoCorreccion: { type: String, default: '' },
  motivoAnulacion: { type: String, default: '' },
  emitidoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  corregidoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  anuladoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

CertificateSchema.index({ codigoCertificado: 1 }, { unique: true });
CertificateSchema.index({ tipoCertificado: 1 });
CertificateSchema.index({ userId: 1 });
CertificateSchema.index({ productId: 1 });
CertificateSchema.index({ estado: 1 });
CertificateSchema.index({ fechaEmision: -1 });

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
