import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export async function GET(request, { params }) {
  try {
    const { codigo } = await params;
    await connectDB();

    const cert = await Certificate.findOne({ codigoCertificado: codigo }).lean();

    if (!cert) {
      return Response.json({ valid: false, message: 'Certificado no encontrado' }, { status: 404 });
    }

    const isValid = ['issued', 'corrected', 'reissued'].includes(cert.estado);

    return Response.json({
      valid: isValid,
      estado: cert.estado,
      tipo: cert.tipoCertificado,
      datos: {
        nombreCompleto: cert.datosPersona?.nombreCompleto,
        cursoPrograma: cert.datosCursoPrograma?.nombre,
        rolDocente: cert.datosCursoPrograma?.rolDocente || null,
        institucionEmisora: cert.datosInstitucionales?.institucionEmisora,
        marca: cert.datosInstitucionales?.marca,
        fechaEmision: cert.fechaEmision,
        codigo: cert.codigoCertificado,
      },
    });
  } catch (err) {
    console.error('Validation error:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
