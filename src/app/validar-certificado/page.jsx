'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValidarCertificadoPage() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    if (!codigo.trim()) return;
    setLoading(true);
    router.push(`/validar-certificado/${codigo.trim()}`);
  }

  return (
    <>
      <style>{`
        .val-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; }
        .val-card { background: var(--card-bg); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid var(--card-border); border-radius: var(--radius-xl); padding: 3rem; max-width: 480px; width: 100%; box-shadow: var(--shadow-md); text-align: center; animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .val-icon { font-size: 3.5rem; margin-bottom: 1rem; }
        .val-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-heading); margin-bottom: 0.5rem; }
        .val-desc { color: var(--text-light); font-size: 0.9rem; margin-bottom: 2rem; line-height: 1.6; }
        .val-form { display: flex; gap: 0.5rem; }
        .val-input { flex: 1; padding: 0.75rem 1rem; border: 1px solid var(--card-border); border-radius: var(--radius-md); font-family: var(--font-body); font-size: 0.9rem; outline: none; background: rgba(255,255,255,0.8); }
        .val-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
        .val-input::placeholder { color: var(--text-muted); }
        .val-btn { padding: 0.75rem 1.5rem; background: var(--primary); color: #fff; border: none; border-radius: var(--radius-md); font-weight: 700; font-family: var(--font-body); cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-primary); }
        .val-btn:hover { background: var(--primary-hover); transform: translateY(-1px); }
        .val-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .val-logos { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2.5rem; opacity: 0.5; }
        .val-logos img { height: 28px; width: auto; }
        .val-back { margin-top: 1.5rem; }
        .val-back a { color: var(--primary); font-size: 0.85rem; font-weight: 600; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <main className="val-container">
        <div className="val-card">
          <div className="val-icon">🔍</div>
          <h1 className="val-title">Validar Certificado</h1>
          <p className="val-desc">
            Ingresa el código del certificado o escanea el código QR para verificar su autenticidad.
          </p>
          <form className="val-form" onSubmit={handleSubmit}>
            <input
              className="val-input"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej: CERT-EST-M1234-AB56CD"
              required
            />
            <button className="val-btn" type="submit" disabled={loading}>
              {loading ? '...' : 'Validar'}
            </button>
          </form>
          <div className="val-logos">
            <img src="/assets/logociip.png" alt="CIIP" />
            <img src="/assets/logogeomina.png" alt="Geomina" />
            <img src="/assets/logobiomedic.png" alt="Biomedic" />
          </div>
          <div className="val-back">
            <a href="/">← Volver al inicio</a>
          </div>
        </div>
      </main>
    </>
  );
}
