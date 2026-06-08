import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export default async function ValidacionResultado({ params }) {
  const { codigo } = await params;

  let cert = null;
  let error = null;

  try {
    await connectDB();
    cert = await Certificate.findOne({ codigoCertificado: codigo }).lean();
  } catch (err) {
    error = 'Error al consultar la base de datos.';
  }

  const getStatusConfig = (estado) => {
    switch (estado) {
      case 'issued':
      case 'corrected':
      case 'reissued':
        return { icon: '✅', title: 'Certificado Válido', color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' };
      case 'cancelled':
        return { icon: '⚠️', title: 'Certificado Anulado', color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' };
      case 'replaced':
        return { icon: '🔄', title: 'Certificado Reemplazado', color: '#92400e', bg: '#fef3c7', border: '#fcd34d' };
      default:
        return { icon: '⏳', title: 'Certificado Pendiente', color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' };
    }
  };

  return (
    <>
      <style>{`
        .vr-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
        .vr-card { background: var(--card-bg); backdrop-filter: blur(24px); border: 1px solid var(--card-border); border-radius: var(--radius-xl); padding: 2.5rem; max-width: 520px; width: 100%; box-shadow: var(--shadow-md); animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .vr-status { text-align: center; padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem; }
        .vr-status-icon { font-size: 3rem; margin-bottom: 0.5rem; }
        .vr-status-title { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; }
        .vr-details { display: flex; flex-direction: column; gap: 0.75rem; }
        .vr-row { display: flex; justify-content: space-between; align-items: baseline; padding: 0.5rem 0; border-bottom: 1px solid rgba(224, 242, 254, 0.4); }
        .vr-label { font-size: 0.78rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; }
        .vr-value { font-size: 0.9rem; font-weight: 600; color: var(--text-heading); text-align: right; max-width: 60%; }
        .vr-code { font-family: monospace; font-size: 0.85rem; font-weight: 700; color: var(--primary); background: var(--primary-light-bg); padding: 0.5rem 1rem; border-radius: var(--radius-sm); text-align: center; margin-bottom: 1rem; }
        .vr-back { text-align: center; margin-top: 1.5rem; }
        .vr-back a { color: var(--primary); font-size: 0.85rem; font-weight: 600; }
        .vr-logos { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; opacity: 0.5; }
        .vr-logos img { height: 24px; width: auto; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <main className="vr-container">
        <div className="vr-card">
          {error ? (
            <div className="vr-status" style={{ background: '#fee2e2', color: '#991b1b' }}>
              <div className="vr-status-icon">❌</div>
              <div className="vr-status-title">Error</div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>
            </div>
          ) : !cert ? (
            <div className="vr-status" style={{ background: '#fee2e2', color: '#991b1b' }}>
              <div className="vr-status-icon">❌</div>
              <div className="vr-status-title">Certificado No Encontrado</div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>El código ingresado no corresponde a ningún certificado registrado.</p>
            </div>
          ) : (() => {
            const sc = getStatusConfig(cert.estado);
            return (
              <>
                <div className="vr-status" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                  <div className="vr-status-icon">{sc.icon}</div>
                  <div className="vr-status-title">{sc.title}</div>
                </div>

                <div className="vr-code">{cert.codigoCertificado}</div>

                <div className="vr-details">
                  <div className="vr-row">
                    <span className="vr-label">Nombre</span>
                    <span className="vr-value">{cert.datosPersona?.nombreCompleto}</span>
                  </div>
                  <div className="vr-row">
                    <span className="vr-label">Curso / Programa</span>
                    <span className="vr-value">{cert.datosCursoPrograma?.nombre}</span>
                  </div>
                  {cert.datosCursoPrograma?.rolDocente && (
                    <div className="vr-row">
                      <span className="vr-label">Rol</span>
                      <span className="vr-value">{cert.datosCursoPrograma.rolDocente}</span>
                    </div>
                  )}
                  <div className="vr-row">
                    <span className="vr-label">Institución</span>
                    <span className="vr-value">{cert.datosInstitucionales?.institucionEmisora}</span>
                  </div>
                  <div className="vr-row">
                    <span className="vr-label">Marca</span>
                    <span className="vr-value">{cert.datosInstitucionales?.marca}</span>
                  </div>
                  <div className="vr-row">
                    <span className="vr-label">Fecha de emisión</span>
                    <span className="vr-value">{cert.fechaEmision ? new Date(cert.fechaEmision).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
                  </div>
                  <div className="vr-row">
                    <span className="vr-label">Tipo</span>
                    <span className="vr-value">{cert.tipoCertificado === 'student_certificate' ? 'Certificado Estudiante' : 'Certificado Docente'}</span>
                  </div>
                </div>

                {cert.estado === 'replaced' && (
                  <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#92400e', fontStyle: 'italic', textAlign: 'center' }}>
                    Este certificado ha sido reemplazado por una versión más reciente.
                  </p>
                )}
                {cert.estado === 'cancelled' && (
                  <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#991b1b', fontStyle: 'italic', textAlign: 'center' }}>
                    Este certificado ha sido anulado y ya no es válido.
                  </p>
                )}
              </>
            );
          })()}

          <div className="vr-logos">
            <img src="/assets/logociip.png" alt="CIIP" />
            <img src="/assets/logogeomina.png" alt="Geomina" />
            <img src="/assets/logobiomedic.png" alt="Biomedic" />
          </div>
          <div className="vr-back">
            <a href="/validar-certificado">← Validar otro certificado</a>
          </div>
        </div>
      </main>
    </>
  );
}
