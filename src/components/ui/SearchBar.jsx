'use client';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div style={{ position: 'relative', maxWidth: '360px', width: '100%' }}>
      <span aria-hidden="true" style={{
        position: 'absolute', left: '0.85rem', top: '50%',
        transform: 'translateY(-50%)', color: 'var(--text-light)',
        pointerEvents: 'none',
        display: 'flex',
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.8-3.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.65rem 1rem 0.65rem 2.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--card-border)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(8px)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--text-main)',
          outline: 'none',
          transition: 'all var(--transition-fast)',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
