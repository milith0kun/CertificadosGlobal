export default function LoadingSpinner({ size = 40, message = 'Cargando...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '3rem', gap: '1rem',
    }}>
      <div style={{
        width: size, height: size,
        border: '3px solid var(--card-border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {message && <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 500 }}>{message}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
