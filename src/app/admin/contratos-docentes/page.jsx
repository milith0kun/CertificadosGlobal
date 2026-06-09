'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchBar from '@/components/ui/SearchBar';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function ContratosDocentesPage() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/contratos-docentes');
        if (res.ok) {
          const data = await res.json();
          setContracts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <style>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .page-kicker { font-size: 0.68rem; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem; }
        .page-title { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); }
        .filters-row { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .filter-select { padding: 0.6rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--card-border); background: var(--glass-bg); font-family: var(--font-body); font-size: 0.85rem; color: var(--text-main); outline: none; cursor: pointer; }
        .data-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .data-table th { text-align: left; padding: 0.75rem 1rem; font-size: 0.72rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--text-light); border-bottom: 2px solid var(--card-border); white-space: nowrap; }
        .data-table td { padding: 0.85rem 1rem; font-size: 0.875rem; border-bottom: 1px solid rgba(224, 242, 254, 0.4); vertical-align: middle; }
        .data-table tr:hover td { background: rgba(14, 165, 233, 0.02); }
        .actions-cell { display: flex; gap: 0.4rem; }
        .action-btn { background: none; border: 1px solid var(--card-border); border-radius: var(--radius-sm); padding: 0.35rem 0.6rem; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; color: var(--text-main); font-weight: 600; }
        .action-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light-bg); }
      `}</style>

      <div className="page-header">
        <div>
          <p className="page-kicker">Gestión</p>
          <h1 className="page-title">Contratos Docentes</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/admin/contratos-docentes/create">
            <Button size="sm">+ Emitir Contrato</Button>
          </Link>
        </div>
      </div>

      <div className="filters-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por docente o código..." />
        <select className="filter-select" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="in_review">En revisión</option>
          <option value="observed">Observado</option>
          <option value="approved">Aprobado</option>
          <option value="issued">Emitido</option>
          <option value="cancelled">Anulado</option>
        </select>
      </div>

      <Card padding="0">
        {loading ? (
          <LoadingSpinner />
        ) : contracts.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Sin contratos"
            description="Aún no se han generado contratos docentes. Haz clic en 'Generar Contrato' para comenzar."
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Docente</th>
                  <th>Curso / Programa</th>
                  <th>Rol</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((cont) => (
                  <tr key={cont._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem' }}>{cont.codigoContrato}</td>
                    <td>{cont.datosDocente?.nombreCompleto}</td>
                    <td>{cont.datosCursoPrograma?.nombre}</td>
                    <td>{cont.datosCursoPrograma?.rolDocente}</td>
                    <td>{new Date(cont.createdAt).toLocaleDateString('es-PE')}</td>
                    <td><StatusBadge state={cont.estado} type="contract" /></td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn" title="Ver">👁️</button>
                        <button className="action-btn" title="Descargar">⬇️</button>
                        <button className="action-btn" title="Aprobar">✅</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
