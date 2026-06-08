import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  marcaId: { type: String, required: true },
  tipoProducto: {
    type: String,
    enum: ['curso', 'diplomado', 'pae', 'taller', 'programa', 'evento'],
    default: 'curso',
  },
  modalidad: { type: String, enum: ['virtual', 'presencial', 'hibrido'], default: 'virtual' },
  generaCertificadoEstudiante: { type: Boolean, default: false },
  generaCertificadoDocente: { type: Boolean, default: false },
  plantillaCertificadoEstudianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentTemplate', default: null },
  plantillaCertificadoDocenteId: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentTemplate', default: null },
  horasAcademicasEstudiante: { type: Number, default: 0 },
  horasAcademicasDocente: { type: Number, default: 0 },
  institucionEmisora: { type: String, default: '' },
  firmaUrl: { type: String, default: '' },
  selloUrl: { type: String, default: '' },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
}, { timestamps: true });

ProductSchema.index({ slug: 1 });
ProductSchema.index({ marcaId: 1 });
ProductSchema.index({ estado: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
