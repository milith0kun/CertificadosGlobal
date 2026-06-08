export default function EmptyState({ icon = '📋', title = 'Sin resultados', description = 'No se encontraron datos.' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '4rem 2rem', textAlign: 'center',
    }}>
      <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</span>
      <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', maxWidth: '400px' }}>{description}</p>
    </div>
  );
}
