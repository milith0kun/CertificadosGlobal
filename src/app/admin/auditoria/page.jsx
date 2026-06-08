'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SearchBar from '@/components/ui/SearchBar';

export default function AuditoriaPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  return (
    <>
      <style>{`
        .page-header { margin-bottom: 1.5rem; }
        .page-kicker { font-size: 0.68rem; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-light); margin-bottom: 0.25rem; }
        .page-title { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); }
      `}</style>

      <div className="page-header">
        <p className="page-kicker">Sistema</p>
        <h1 className="page-title">Registro de Auditoría</h1>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por acción o usuario..." />
      </div>

      <Card padding="0">
        <EmptyState
          icon="📋"
          title="Sin registros"
          description="Los registros de auditoría aparecerán aquí cuando se realicen acciones en el sistema."
        />
      </Card>
    </>
  );
}
