import { connectDB } from '@/lib/mongodb';
import TeacherContract from '@/models/TeacherContract';
import { requireRole } from '@/lib/middleware';

export async function GET() {
  try {
    const { error } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    await connectDB();
    const contracts = await TeacherContract.find()
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(contracts);
  } catch (err) {
    console.error('Error fetching teacher contracts:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
