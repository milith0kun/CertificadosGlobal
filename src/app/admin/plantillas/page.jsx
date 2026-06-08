'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function PlantillasPage() {
  const [templates, setTemplates] = useState([]);

  return (
    <>
      <style>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .page-kicker { font-size: 0.68rem; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--success); margin-bottom: 0.25rem; }
        .page-title { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); }
        .templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
        .template-card { border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 1.5rem; background: var(--card-bg); backdrop-filter: blur(12px); transition: all var(--transition-fast); cursor: pointer; }
        .template-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .template-type-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 0.75rem; }
        .template-name { font-size: 1.05rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); margin-bottom: 0.35rem; }
        .template-meta { font-size: 0.8rem; color: var(--text-light); }
      `}</style>

      <div className="page-header">
        <div>
          <p className="page-kicker">Configuración</p>
          <h1 className="page-title">Plantillas de Documentos</h1>
        </div>
        <Button size="sm">+ Crear Plantilla</Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <EmptyState
            icon="📄"
            title="Sin plantillas"
            description="Crea tu primera plantilla para poder generar certificados y contratos."
          />
        </Card>
      ) : (
        <div className="templates-grid">
          {templates.map((tpl) => (
            <div key={tpl._id} className="template-card">
              <span className="template-type-badge" style={{ background: 'var(--primary-light-bg)', color: 'var(--primary)' }}>
                {tpl.tipoPlantilla}
              </span>
              <h3 className="template-name">{tpl.nombre}</h3>
              <p className="template-meta">Marca: {tpl.marcaId} · Estado: {tpl.estado}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
