import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { requireRole } from '@/lib/middleware';

export async function GET() {
  try {
    const { error } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    await connectDB();
    const certificates = await Certificate.find({ tipoCertificado: 'teacher_certificate' })
      .sort({ fechaEmision: -1 })
      .lean();

    return Response.json(certificates);
  } catch (err) {
    console.error('Error fetching teacher certificates:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
