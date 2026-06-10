import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { codigo } = await params;
  const download = new URL(request.url).searchParams.get('download') === '1';
  
  await connectDB();
  
  const doc = await Certificate.findOne({ codigoCertificado: codigo }).lean();

  if (doc && doc.pdfUrl) {
    if (download) {
      const driveFileId = doc.pdfUrl.match(/\/file\/d\/([^/]+)/)?.[1];
      if (driveFileId) {
        return Response.redirect(
          `https://drive.usercontent.google.com/download?id=${driveFileId}&export=download&confirm=t`
        );
      }
    }

    return Response.redirect(doc.pdfUrl);
  }

  return new Response('PDF no encontrado o no ha sido generado.', { status: 404 });
}
