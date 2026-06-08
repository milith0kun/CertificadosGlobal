'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SearchBar from '@/components/ui/SearchBar';

export default function ConfiguracionAcademicaPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  return (
    <>
      <style>{`
        .page-header { margin-bottom: 1.5rem; }
        .page-kicker { font-size: 0.68rem; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-light); margin-bottom: 0.25rem; }
        .page-title { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); }
        .page-subtitle { color: var(--text-light); font-size: 0.88rem; margin-top: 0.25rem; }
      `}</style>

      <div className="page-header">
        <p className="page-kicker">Configuración</p>
        <h1 className="page-title">Configuración Académica Certificable</h1>
        <p className="page-subtitle">Configura qué cursos y programas generan certificados para estudiantes y docentes</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar curso o programa..." />
      </div>

      <Card>
        <EmptyState
          icon="⚙️"
          title="Sin productos configurados"
          description="Agrega cursos o programas y configúralos como certificables."
        />
      </Card>
    </>
  );
}
