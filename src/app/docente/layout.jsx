export const metadata = { title: 'Panel Docente' };

export default function DocenteLayout({ children }) {
  return (
    <>
      <style>{`
        .teacher-layout { min-height: 100vh; }
        .teacher-nav { background: linear-gradient(135deg, #060e1a 0%, #0a1e35 100%); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(56, 189, 248, 0.08); }
        .teacher-nav-brand { display: flex; align-items: center; gap: 0.75rem; }
        .teacher-nav-brand img { height: 28px; opacity: 0.9; }
        .teacher-nav-title { color: #f0f9ff; font-family: var(--font-heading); font-weight: 800; font-size: 0.9rem; }
        .teacher-nav-links { display: flex; gap: 1rem; }
        .teacher-nav-link { color: #94a3b8; font-size: 0.82rem; font-weight: 600; transition: color 0.2s; }
        .teacher-nav-link:hover { color: #e0f2fe; }
        .teacher-main { padding: 2rem; max-width: 1000px; margin: 0 auto; }
      `}</style>
      <div className="teacher-layout">
        <nav className="teacher-nav">
          <div className="teacher-nav-brand">
            <img src="/assets/logociip.png" alt="CIIP" />
            <span className="teacher-nav-title">Panel Docente</span>
          </div>
          <div className="teacher-nav-links">
            <a href="/docente/contratos" className="teacher-nav-link">📝 Mis Contratos</a>
            <a href="/docente/certificados" className="teacher-nav-link">🏅 Mis Certificados</a>
            <a href="/login" className="teacher-nav-link">🚪 Salir</a>
          </div>
        </nav>
        <main className="teacher-main">{children}</main>
      </div>
    </>
  );
}
