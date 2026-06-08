'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

export default function MisCertificadosEstudiante() {
  const [certificates, setCertificates] = useState([]);

  return (
    <>
      <style>{`
        .my-header { margin-bottom: 2rem; }
        .my-title { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); }
        .my-subtitle { color: var(--text-light); font-size: 0.88rem; margin-top: 0.25rem; }
        .cert-list { display: flex; flex-direction: column; gap: 1rem; }
        .cert-item { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius-lg); backdrop-filter: blur(12px); transition: all var(--transition-fast); flex-wrap: wrap; gap: 1rem; }
        .cert-item:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .cert-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .cert-name { font-weight: 800; font-family: var(--font-heading); font-size: 0.95rem; color: var(--text-heading); }
        .cert-course { font-size: 0.82rem; color: var(--text-light); }
        .cert-code { font-family: monospace; font-size: 0.75rem; color: var(--primary); font-weight: 700; }
        .cert-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .cert-action-btn { padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--card-border); background: #fff; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: var(--text-main); }
        .cert-action-btn:hover { border-color: var(--primary); color: var(--primary); }
      `}</style>

      <div className="my-header">
        <h1 className="my-title">🎓 Mis Certificados</h1>
        <p className="my-subtitle">Aquí puedes ver y descargar tus certificados emitidos</p>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <EmptyState
            icon="🎓"
            title="Sin certificados"
            description="Aún no tienes certificados emitidos. Cuando completes un curso o programa, tu certificado aparecerá aquí."
          />
        </Card>
      ) : (
        <div className="cert-list">
          {certificates.map((cert) => (
            <div key={cert._id} className="cert-item">
              <div className="cert-info">
                <span className="cert-name">{cert.datosCursoPrograma?.nombre}</span>
                <span className="cert-course">{cert.datosInstitucionales?.marca} · {new Date(cert.fechaEmision).toLocaleDateString('es-PE')}</span>
                <span className="cert-code">{cert.codigoCertificado}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <StatusBadge state={cert.estado} />
                <div className="cert-actions">
                  <button className="cert-action-btn">👁️ Ver</button>
                  <button className="cert-action-btn">⬇️ Descargar</button>
                  <button className="cert-action-btn">🔗 Copiar enlace</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
