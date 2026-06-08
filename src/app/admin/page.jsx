import Card from '@/components/ui/Card';

const stats = [
  { label: 'Cert. Estudiantes', value: '—', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>, color: 'var(--primary)' },
  { label: 'Contratos Docentes', value: '—', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>, color: 'var(--secondary)' },
  { label: 'Cert. Docentes', value: '—', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>, color: 'var(--accent)' },
  { label: 'Plantillas', value: '—', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, color: 'var(--success)' },
];

export default function AdminDashboard() {
  return (
    <>
      <style>{`
        .dash-header {
          margin-bottom: 2rem;
        }
        .dash-kicker {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 0.35rem;
        }
        .dash-title {
          font-size: 1.75rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-heading);
        }
        .dash-subtitle {
          color: var(--text-light);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem !important;
        }
        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.65rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-heading);
          line-height: 1.1;
        }
        .stat-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-light);
          margin-top: 0.15rem;
        }
        .dash-section-title {
          font-size: 1.1rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-heading);
          margin-bottom: 1rem;
        }
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .quick-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-decoration: none;
          color: var(--text-main);
        }
        .quick-action:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: rgba(14, 165, 233, 0.3);
        }
        .quick-action-icon {
          font-size: 1.3rem;
        }
        .quick-action-text {
          font-weight: 700;
          font-size: 0.85rem;
        }
      `}</style>

      <div className="dash-header">
        <p className="dash-kicker">Panel Administrativo</p>
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">Resumen general del sistema de certificados y contratos</p>
      </div>

      <div className="dash-grid">
        {stats.map((stat) => (
          <Card key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
            <div className="stat-icon" style={{ background: `${stat.color}15` }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="dash-section-title">Acciones Rápidas</h2>
      <div className="quick-actions">
        <a href="/admin/certificados-estudiantes" className="quick-action">
          <span className="quick-action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
          <span className="quick-action-text">Emitir Certificado Estudiante</span>
        </a>
        <a href="/admin/contratos-docentes" className="quick-action">
          <span className="quick-action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg></span>
          <span className="quick-action-text">Generar Contrato Docente</span>
        </a>
        <a href="/admin/certificados-docentes" className="quick-action">
          <span className="quick-action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></span>
          <span className="quick-action-text">Emitir Certificado Docente</span>
        </a>
        <a href="/admin/plantillas" className="quick-action">
          <span className="quick-action-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
          <span className="quick-action-text">Gestionar Plantillas</span>
        </a>
      </div>
    </>
  );
}
