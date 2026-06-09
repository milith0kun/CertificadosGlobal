import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { requireRole } from '@/lib/middleware';

export async function GET() {
  try {
    const { error } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    await connectDB();
    const certificates = await Certificate.find({ tipoCertificado: 'student_certificate' })
      .sort({ fechaEmision: -1 })
      .lean();

    return Response.json(certificates);
  } catch (err) {
    console.error('Error fetching student certificates:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { error, user } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    const data = await request.json();
    await connectDB();
    
    // Add logic to generate unique code
    const { generateUniqueCode } = await import('@/lib/code-generator');
    data.codigoCertificado = generateUniqueCode('student_certificate');
    data.tipoCertificado = 'student_certificate';
    data.emitidoPorId = user._id;

    const cert = await Certificate.create(data);
    return Response.json(cert, { status: 201 });
  } catch (err) {
    console.error('Error creating student certificate:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
