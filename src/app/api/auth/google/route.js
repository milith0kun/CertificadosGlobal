import { google } from 'googleapis';

export async function GET(request) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://certificaciones.ecosdelseo.com/api/auth/google/callback'
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Forzamos para que siempre devuelva el refresh_token
    scope: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/presentations'
    ],
  });

  return Response.redirect(authUrl);
}
