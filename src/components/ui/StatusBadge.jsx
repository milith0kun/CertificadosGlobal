import { CERTIFICATE_STATE_LABELS, CONTRACT_STATE_LABELS } from '@/utils/constants';

export default function StatusBadge({ state, type = 'certificate' }) {
  const labels = type === 'contract' ? CONTRACT_STATE_LABELS : CERTIFICATE_STATE_LABELS;
  const label = labels[state] || state;

  const colors = {
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
    issued: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    corrected: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
    reissued: { bg: '#e0f2fe', color: '#0369a1', border: '#7dd3fc' },
    cancelled: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
    replaced: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
    generation_error: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
    draft: { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
    in_review: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
    observed: { bg: '#fce7f3', color: '#9d174d', border: '#f9a8d4' },
    approved: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  };

  const c = colors[state] || colors.draft;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: 'var(--font-body)',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      letterSpacing: '0.02em',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: c.color, marginRight: '0.4rem',
      }} />
      {label}
    </span>
  );
}
