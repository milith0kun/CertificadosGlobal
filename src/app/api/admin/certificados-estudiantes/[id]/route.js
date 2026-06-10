import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { logAudit } from '@/lib/audit';
import { requireRole } from '@/lib/middleware';
import Certificate from '@/models/Certificate';

export async function DELETE(request, { params }) {
  try {
    const { error, user } = await requireRole(
      'admin',
      'admin_academico',
      'area_administrativa'
    );
    if (error) return error;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ error: 'Identificador inválido' }, { status: 400 });
    }

    await connectDB();
    const certificate = await Certificate.findOneAndDelete({
      _id: id,
      tipoCertificado: 'student_certificate',
    }).lean();

    if (!certificate) {
      return Response.json({ error: 'Certificado no encontrado' }, { status: 404 });
    }

    await logAudit({
      documentType: 'student_certificate',
      documentId: certificate._id,
      accion: 'deleted',
      descripcion: `Certificado ${certificate.codigoCertificado} eliminado`,
      realizadoPor: user.userId,
      rol: user.rol,
      metadata: {
        codigoCertificado: certificate.codigoCertificado,
        nombreCompleto: certificate.datosPersona?.nombreCompleto || '',
        cursoPrograma: certificate.datosCursoPrograma?.nombre || '',
        pdfUrl: certificate.pdfUrl || '',
      },
      request,
    });

    return Response.json({
      success: true,
      id: certificate._id,
      codigoCertificado: certificate.codigoCertificado,
    });
  } catch (err) {
    console.error('Error deleting student certificate:', err);
    return Response.json({ error: 'No se pudo eliminar el certificado' }, { status: 500 });
  }
}
