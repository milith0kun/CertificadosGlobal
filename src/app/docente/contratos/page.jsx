'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

export default function MisContratosDocente() {
  const [contracts, setContracts] = useState([]);

  return (
    <>
      <style>{`
        .my-header { margin-bottom: 2rem; }
        .my-title { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); }
        .my-subtitle { color: var(--text-light); font-size: 0.88rem; margin-top: 0.25rem; }
      `}</style>

      <div className="my-header">
        <h1 className="my-title">📝 Mis Contratos</h1>
        <p className="my-subtitle">Contratos docentes asociados a tus cursos y programas</p>
      </div>

      <Card>
        <EmptyState
          icon="📝"
          title="Sin contratos"
          description="Aún no tienes contratos docentes asignados."
        />
      </Card>
    </>
  );
}
