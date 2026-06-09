import { generateQRBuffer } from '@/lib/pdf-generator';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const qrBuffer = await generateQRBuffer(url);
    
    return new Response(qrBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (err) {
    return new Response('Error generating QR', { status: 500 });
  }
}
