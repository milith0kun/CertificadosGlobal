import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

let auth;
let authSource = '';
let authConfigurationError = '';

function parseJsonEnvironment(name) {
  const value = process.env[name];
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch {
    throw new Error(`${name} no contiene JSON válido`);
  }
}

try {
  const tokenPath = path.join(process.cwd(), 'google-refresh-token.json');
  const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
  const environmentTokens = process.env.GOOGLE_REFRESH_TOKEN
    ? {
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        access_token: process.env.GOOGLE_ACCESS_TOKEN || undefined,
        expiry_date: process.env.GOOGLE_TOKEN_EXPIRY_DATE
          ? Number(process.env.GOOGLE_TOKEN_EXPIRY_DATE)
          : undefined,
      }
    : parseJsonEnvironment('GOOGLE_OAUTH_TOKENS_JSON');

  if (environmentTokens || fs.existsSync(tokenPath)) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET son requeridos para OAuth');
    }

    const tokens = environmentTokens || JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://certificaciones.ecosdelseo.com/api/auth/google/callback'
    );
    auth.setCredentials(tokens);
    authSource = environmentTokens ? 'oauth_environment' : 'oauth_file';
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || fs.existsSync(credentialsPath)) {
    const credentials = parseJsonEnvironment('GOOGLE_SERVICE_ACCOUNT_JSON');
    auth = new google.auth.GoogleAuth({
      ...(credentials ? { credentials } : { keyFile: credentialsPath }),
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/documents'
      ],
    });
    authSource = credentials ? 'service_account_environment' : 'service_account_file';
  } else {
    authConfigurationError = [
      'Google Drive no está configurado en este servidor.',
      'Configura GOOGLE_REFRESH_TOKEN junto con GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET,',
      'o GOOGLE_SERVICE_ACCOUNT_JSON.',
    ].join(' ');
  }
} catch (error) {
  authConfigurationError = error.message;
  console.error('Error inicializando Google Auth:', error.message);
}

if (auth) {
  console.log(`Google Auth configurado mediante ${authSource}`);
}

export const drive = auth ? google.drive({ version: 'v3', auth }) : null;
export const docs = auth ? google.docs({ version: 'v1', auth }) : null;
export const slides = auth ? google.slides({ version: 'v1', auth }) : null;
export const googleAuthStatus = {
  configured: Boolean(auth),
  source: authSource,
  error: authConfigurationError,
};

export function requireGoogleClients() {
  if (!drive || !slides) {
    const error = new Error(
      authConfigurationError || 'Google Drive no está configurado en este servidor'
    );
    error.code = 'GOOGLE_AUTH_NOT_CONFIGURED';
    throw error;
  }

  return { drive, slides };
}

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
