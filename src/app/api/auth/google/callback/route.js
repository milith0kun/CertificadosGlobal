import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://certificaciones.ecosdelseo.com/api/auth/google/callback'
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Guardaremos el refresh_token temporalmente en un archivo local 
    // (en producción se guarda en Base de Datos o Variables de Entorno)
    const tokenPath = path.join(process.cwd(), 'google-refresh-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));

    return new Response(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #16a34a;">¡Conexión Exitosa!</h1>
          <p>Tu cuenta de Google Drive ha sido conectada correctamente al sistema.</p>
          <p>El sistema ahora usará tus 6GB de espacio de almacenamiento para guardar los PDFs.</p>
          <p>Ya puedes cerrar esta pestaña y volver al chat.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return new Response('Error al obtener tokens: ' + error.message, { status: 500 });
  }
}
