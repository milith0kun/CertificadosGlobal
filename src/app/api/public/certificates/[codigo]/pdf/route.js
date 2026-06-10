import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { codigo } = await params;
  
  await connectDB();
  
  const doc = await Certificate.findOne({ codigoCertificado: codigo }).lean();

  if (doc && doc.pdfUrl) {
    return Response.redirect(doc.pdfUrl);
  }

  return new Response('PDF no encontrado o no ha sido generado.', { status: 404 });
}
