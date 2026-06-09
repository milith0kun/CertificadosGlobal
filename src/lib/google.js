import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

let auth;
try {
  const tokenPath = path.join(process.cwd(), 'google-refresh-token.json');
  if (fs.existsSync(tokenPath)) {
    // 1. Usar OAuth2 (Cuenta del usuario, usa sus 6GB)
    const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://certificaciones.ecosdelseo.com/api/auth/google/callback'
    );
    auth.setCredentials(tokens);
    console.log('Google Auth: Usando OAuth2 del usuario (Drive Personal)');
  } else {
    // 2. Fallback a Service Account (El Robot sin espacio)
    const keyFilePath = path.join(process.cwd(), 'google-credentials.json');
    auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/documents'
      ],
    });
    console.log('Google Auth: Usando Service Account (Robot)');
  }
} catch (error) {
  console.error('Error inicializando Google Auth:', error.message);
}

export const drive = auth ? google.drive({ version: 'v3', auth }) : null;
export const docs = auth ? google.docs({ version: 'v1', auth }) : null;
export const slides = auth ? google.slides({ version: 'v1', auth }) : null;

// Helper para obtener un archivo de Drive (para descargar plantillas o firmas)
export async function downloadFile(fileId) {
  if (!drive) throw new Error('Google Auth no configurado');
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  return res.data;
}

// Helper para buscar un archivo por nombre en una carpeta específica
export async function findFileByName(folderId, fileName) {
  if (!drive) throw new Error('Google Auth no configurado');
  const res = await drive.files.list({
    q: `'${folderId}' in parents and name = '${fileName}' and trashed = false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });
  return res.data.files[0] || null;
}
