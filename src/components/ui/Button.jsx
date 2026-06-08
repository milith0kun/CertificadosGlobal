'use client';

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '0.875rem',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  },
  sizes: {
    sm: { padding: '0.5rem 1rem', fontSize: '0.8rem' },
    md: { padding: '0.7rem 1.5rem', fontSize: '0.875rem' },
    lg: { padding: '0.85rem 2rem', fontSize: '1rem' },
  },
  variants: {
    primary: {
      background: 'var(--primary)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-primary)',
    },
    secondary: {
      background: 'var(--secondary)',
      color: '#ffffff',
    },
    success: {
      background: 'var(--success)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-success)',
    },
    danger: {
      background: 'var(--danger)',
      color: '#ffffff',
    },
    outline: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '2px solid var(--primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-main)',
    },
  },
};

export default function Button({ children, variant = 'primary', size = 'md', disabled = false, onClick, type = 'button', style: customStyle, ...props }) {
  const combinedStyle = {
    ...styles.base,
    ...styles.sizes[size],
    ...styles.variants[variant],
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    ...customStyle,
  };

  return (
    <button
      type={type}
      style={combinedStyle}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
      {...props}
    >
      {children}
    </button>
  );
}
