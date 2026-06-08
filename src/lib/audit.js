import { connectDB } from './mongodb.js';
import AuditLog from '../models/AuditLog.js';

export async function logAudit({ documentType, documentId, accion, descripcion, realizadoPor, rol, metadata = {}, request = null }) {
  try {
    await connectDB();
    const logEntry = {
      documentType,
      documentId,
      accion,
      descripcion,
      realizadoPor,
      rol,
      metadata,
    };
    if (request) {
      logEntry.ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      logEntry.userAgent = request.headers.get('user-agent') || 'unknown';
    }
    await AuditLog.create(logEntry);
  } catch (err) {
    console.error('Error logging audit:', err);
  }
}
