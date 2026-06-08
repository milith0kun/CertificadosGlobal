export default function Card({ children, style: customStyle, padding = '1.5rem', ...props }) {
  const cardStyle = {
    background: 'var(--card-bg)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--card-border)',
    borderRadius: 'var(--radius-xl)',
    padding,
    boxShadow: 'var(--shadow-sm)',
    transition: 'all var(--transition-normal)',
    ...customStyle,
  };

  return <div style={cardStyle} {...props}>{children}</div>;
}
