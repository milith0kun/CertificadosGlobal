export default function HomePage() {
  return (
    <>
      <style>{`
        .home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }
        .home-card {
          background: var(--card-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-xl);
          padding: 3.5rem 3rem;
          max-width: 520px;
          width: 100%;
          box-shadow: var(--shadow-md);
          animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .home-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .home-logos img {
          height: 42px;
          width: auto;
          object-fit: contain;
          opacity: 0.9;
        }
        .home-logo-sep {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.25), transparent);
        }
        .home-title {
          font-size: 2rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--text-heading);
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        .home-title span {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .home-desc {
          color: var(--text-light);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }
        .home-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .home-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-family: var(--font-body);
          font-size: 0.9rem;
          text-decoration: none;
          transition: all var(--transition-fast);
          cursor: pointer;
        }
        .home-btn-primary {
          background: var(--primary);
          color: #fff;
          box-shadow: var(--shadow-primary);
        }
        .home-btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }
        .home-btn-outline {
          background: transparent;
          color: var(--primary);
          border: 2px solid rgba(14, 165, 233, 0.3);
        }
        .home-btn-outline:hover {
          border-color: var(--primary);
          background: var(--primary-light-bg);
        }
        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .home-card { padding: 2rem 1.5rem; }
          .home-title { font-size: 1.6rem; }
          .home-logos img { height: 32px; }
        }
      `}</style>

      <main className="home-container">
        <div className="home-card">
          <div className="home-logos">
            <img src="/assets/logociip.png" alt="CIIP LATAM" />
            <div className="home-logo-sep" />
            <img src="/assets/logogeomina.png" alt="Geomina" />
            <div className="home-logo-sep" />
            <img src="/assets/logobiomedic.png" alt="Biomedic" />
          </div>
          <h1 className="home-title">
            <span>Certificados</span> Global
          </h1>
          <p className="home-desc">
            Plataforma de emisión, gestión y validación de certificados digitales y contratos docentes.
          </p>
          <div className="home-actions">
            <a href="/login" className="home-btn home-btn-primary">
              Iniciar Sesión
            </a>
            <a href="/validar-certificado" className="home-btn home-btn-outline">
              🔍 Validar Certificado
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
