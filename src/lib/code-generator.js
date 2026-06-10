import crypto from 'crypto';

const PREFIXES = {
  student_certificate: 'CERT-EST',
  teacher_certificate: 'CERT-DOC',
  teacher_contract: 'CONT-DOC',
};

export function generateUniqueCode(type) {
  const prefix = PREFIXES[type] || 'DOC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getPublicBaseUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export function generateValidationUrl(codigo, baseUrl = getPublicBaseUrl()) {
  return `${baseUrl.replace(/\/+$/, '')}/validar-certificado/${encodeURIComponent(codigo)}`;
}

export function generateQrUrl(validationUrl, baseUrl = getPublicBaseUrl()) {
  return `${baseUrl.replace(/\/+$/, '')}/api/public/qr?url=${encodeURIComponent(validationUrl)}`;
}
