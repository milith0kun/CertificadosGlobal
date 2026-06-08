export const ROLES = {
  ADMIN: 'admin',
  ADMIN_ACADEMICO: 'admin_academico',
  AREA_ADMINISTRATIVA: 'area_administrativa',
  DOCENTE: 'docente',
  ESTUDIANTE: 'estudiante',
};

export const CERTIFICATE_TYPES = {
  STUDENT: 'student_certificate',
  TEACHER: 'teacher_certificate',
};

export const TEMPLATE_TYPES = {
  STUDENT_CERTIFICATE: 'student_certificate',
  TEACHER_CONTRACT: 'teacher_contract',
  TEACHER_CERTIFICATE: 'teacher_certificate',
};

export const CERTIFICATE_STATES = {
  PENDING: 'pending',
  ISSUED: 'issued',
  CORRECTED: 'corrected',
  REISSUED: 'reissued',
  CANCELLED: 'cancelled',
  REPLACED: 'replaced',
  GENERATION_ERROR: 'generation_error',
};

export const CONTRACT_STATES = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  OBSERVED: 'observed',
  APPROVED: 'approved',
  ISSUED: 'issued',
  CANCELLED: 'cancelled',
  REPLACED: 'replaced',
};

export const CERTIFICATE_STATE_LABELS = {
  pending: 'Pendiente',
  issued: 'Emitido',
  corrected: 'Corregido',
  reissued: 'Reemitido',
  cancelled: 'Anulado',
  replaced: 'Reemplazado',
  generation_error: 'Error de generación',
};

export const CONTRACT_STATE_LABELS = {
  draft: 'Borrador',
  in_review: 'En revisión',
  observed: 'Observado',
  approved: 'Aprobado',
  issued: 'Emitido',
  cancelled: 'Anulado',
  replaced: 'Reemplazado',
};

export const BRANDS = [
  { id: 'ciip_latam', name: 'CIIP LATAM', logo: '/assets/logociip.png', color: '#0369a1' },
  { id: 'geomina', name: 'Geomina', logo: '/assets/logogeomina.png', color: '#0ea5e9' },
  { id: 'biomedic', name: 'Biomedic', logo: '/assets/logobiomedic.png', color: '#06b6d4' },
];

export const TEACHER_ROLES = [
  'Expositor',
  'Ponente',
  'Capacitador',
  'Instructor',
  'Docente Especialista',
  'Facilitador',
];
