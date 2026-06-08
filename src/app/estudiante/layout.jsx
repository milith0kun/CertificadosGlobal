export const metadata = { title: 'Panel Estudiante' };

export default function EstudianteLayout({ children }) {
  return (
    <>
      <style>{`
        .student-layout { min-height: 100vh; }
        .student-nav { background: linear-gradient(135deg, #060e1a 0%, #0a1e35 100%); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(56, 189, 248, 0.08); }
        .student-nav-brand { display: flex; align-items: center; gap: 0.75rem; }
        .student-nav-brand img { height: 28px; opacity: 0.9; }
        .student-nav-title { color: #f0f9ff; font-family: var(--font-heading); font-weight: 800; font-size: 0.9rem; }
        .student-nav-links { display: flex; gap: 1rem; }
        .student-nav-link { color: #94a3b8; font-size: 0.82rem; font-weight: 600; transition: color 0.2s; }
        .student-nav-link:hover { color: #e0f2fe; }
        .student-main { padding: 2rem; max-width: 1000px; margin: 0 auto; }
      `}</style>
      <div className="student-layout">
        <nav className="student-nav">
          <div className="student-nav-brand">
            <img src="/assets/logociip.png" alt="CIIP" />
            <span className="student-nav-title">Mi Panel</span>
          </div>
          <div className="student-nav-links">
            <a href="/estudiante/certificados" className="student-nav-link">🎓 Mis Certificados</a>
            <a href="/login" className="student-nav-link">🚪 Salir</a>
          </div>
        </nav>
        <main className="student-main">{children}</main>
      </div>
    </>
  );
}
