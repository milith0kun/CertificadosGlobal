import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireRole } from '@/lib/middleware';

export async function GET() {
  try {
    const { error } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    await connectDB();
    const products = await Product.find({ estado: 'activo' }).sort({ createdAt: -1 }).lean();
    return Response.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
