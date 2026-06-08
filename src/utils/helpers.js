export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function getStateColor(state) {
  const colors = {
    pending: 'var(--warning)',
    issued: 'var(--success)',
    corrected: 'var(--info)',
    reissued: 'var(--secondary)',
    cancelled: 'var(--danger)',
    replaced: 'var(--text-muted)',
    generation_error: 'var(--danger)',
    draft: 'var(--text-muted)',
    in_review: 'var(--warning)',
    observed: 'var(--danger)',
    approved: 'var(--success)',
  };
  return colors[state] || 'var(--text-light)';
}

export function getStateBgColor(state) {
  const colors = {
    pending: 'var(--warning-bg)',
    issued: 'var(--success-bg)',
    corrected: 'var(--info-bg)',
    reissued: 'hsl(199, 89%, 96%)',
    cancelled: 'var(--danger-bg)',
    replaced: '#f1f5f9',
    generation_error: 'var(--danger-bg)',
    draft: '#f1f5f9',
    in_review: 'var(--warning-bg)',
    observed: 'var(--danger-bg)',
    approved: 'var(--success-bg)',
  };
  return colors[state] || '#f1f5f9';
}
