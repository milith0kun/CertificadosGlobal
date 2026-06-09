import { connectDB } from '@/lib/mongodb';
import TeacherAssignment from '@/models/TeacherAssignment';
import { requireRole } from '@/lib/middleware';

export async function GET() {
  try {
    const { error } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    await connectDB();
    const contratos = await TeacherAssignment.find().sort({ createdAt: -1 }).lean();
    return Response.json(contratos);
  } catch (err) {
    console.error('Error fetching teacher contracts:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { error } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    const data = await request.json();
    await connectDB();
    
    // Asignar código único si es necesario
    const { generateUniqueCode } = await import('@/lib/code-generator');
    data.codigoContrato = generateUniqueCode('teacher_contract');
    
    const doc = await TeacherAssignment.create(data);
    return Response.json(doc, { status: 201 });
  } catch (err) {
    console.error('Error creating teacher contract:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
