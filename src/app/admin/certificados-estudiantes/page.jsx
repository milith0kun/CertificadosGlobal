'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/ui/SearchBar';
import StatusBadge from '@/components/ui/StatusBadge';
import Toast from '@/components/ui/Toast';

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></>,
    external: <><path d="M15 3h6v6" /><path d="m10 14 11-11" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 15H6L5 6" /><path d="M10 11v5" /><path d="M14 11v5" /></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function ActionButton({ label, icon, danger = false, disabled = false, onClick, href }) {
  const className = `action-btn${danger ? ' danger' : ''}`;
  const content = <><Icon name={icon} size={17} /><span className="sr-only">{label}</span></>;

  if (href) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={label}
        aria-label={label}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={className}
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

function formatBrand(brand) {
  const labels = {
    ciip_latam: 'CIIP LATAM',
    geomina: 'Geomina',
    biomedic: 'Biomedic',
  };
  return labels[brand] || brand || 'Sin marca';
}

export default function CertificadosEstudiantesPage() {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  }, []);

  useEffect(() => {
    let active = true;

    fetch('/api/admin/certificados-estudiantes', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los certificados');
        return res.json();
      })
      .then((data) => {
        if (active) setCertificates(data);
      })
      .catch((err) => {
        console.error(err);
        if (active) showToast(err.message, 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [showToast]);

  const filteredCertificates = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es');

    return certificates.filter((cert) => {
      const matchesSearch = !term || [
        cert.codigoCertificado,
        cert.datosPersona?.nombreCompleto,
        cert.datosPersona?.documento,
        cert.datosCursoPrograma?.nombre,
      ].some((value) => value?.toLocaleLowerCase('es').includes(term));

      return matchesSearch
        && (!filterState || cert.estado === filterState)
        && (!filterBrand || cert.marcaId === filterBrand);
    });
  }, [certificates, filterBrand, filterState, search]);

  const getValidationPath = (cert) => (
    `/validar-certificado/${encodeURIComponent(cert.codigoCertificado)}`
  );

  const getPublicUrl = (cert) => {
    if (typeof window === 'undefined') return getValidationPath(cert);
    return `${window.location.origin}${getValidationPath(cert)}`;
  };

  const copyValidationUrl = async (cert) => {
    try {
      await navigator.clipboard.writeText(getPublicUrl(cert));
      showToast('Enlace de validación copiado');
    } catch {
      showToast('No se pudo copiar el enlace', 'error');
    }
  };

  const deleteCertificate = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget._id);
    try {
      const res = await fetch(`/api/admin/certificados-estudiantes/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo eliminar el certificado');

      setCertificates((current) => current.filter((cert) => cert._id !== deleteTarget._id));
      setDeleteTarget(null);
      setSelectedCertificate(null);
      showToast(`Certificado ${data.codigoCertificado} eliminado`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeletingId('');
    }
  };

  const hasFilters = Boolean(search || filterState || filterBrand);

  return (
    <>
      <style>{`
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .page-kicker { font-size: 0.68rem; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--primary); margin-bottom: 0.25rem; }
        .page-title { font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-heading); }
        .header-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .primary-link-btn, .outline-link-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: var(--radius-md); font-size: 0.8rem; line-height: 1; font-weight: 700; text-decoration: none; white-space: nowrap; transition: all var(--transition-fast); }
        .primary-link-btn { color: #fff; background: var(--primary); box-shadow: var(--shadow-primary); }
        .outline-link-btn { color: var(--primary); background: transparent; border: 2px solid var(--primary); }
        .primary-link-btn:hover, .outline-link-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }
        .filters-row { display: grid; grid-template-columns: minmax(240px, 1fr) repeat(2, minmax(160px, 0.48fr)); gap: 0.75rem; align-items: center; margin-bottom: 1rem; }
        .filters-row > div { max-width: none !important; }
        .filter-select { width: 100%; padding: 0.65rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--card-border); background: var(--glass-bg); font-family: var(--font-body); font-size: 0.85rem; color: var(--text-main); outline: none; cursor: pointer; }
        .filter-select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
        .results-summary { color: var(--text-light); font-size: 0.8rem; margin-bottom: 1rem; }
        .data-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .data-table th { text-align: left; padding: 0.75rem 1rem; font-size: 0.72rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: var(--text-light); border-bottom: 2px solid var(--card-border); white-space: nowrap; }
        .data-table td { padding: 0.9rem 1rem; font-size: 0.875rem; border-bottom: 1px solid rgba(224, 242, 254, 0.55); vertical-align: middle; }
        .data-table tbody tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(14, 165, 233, 0.025); }
        .certificate-code { display: inline-block; max-width: 160px; overflow-wrap: anywhere; font-family: monospace; font-weight: 700; font-size: 0.78rem; color: var(--text-heading); }
        .program-cell { min-width: 220px; max-width: 360px; line-height: 1.45; }
        .actions-cell { display: flex; gap: 0.4rem; align-items: center; }
        .action-btn { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; background: #fff; border: 1px solid var(--card-border); border-radius: 10px; cursor: pointer; transition: all 0.2s; color: #475569; text-decoration: none; }
        .action-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light-bg); transform: translateY(-1px); }
        .action-btn.danger:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-bg); }
        .action-btn:disabled { opacity: 0.45; pointer-events: none; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
        .detail-item { padding: 0.9rem; border: 1px solid var(--card-border); border-radius: var(--radius-md); background: #f8fafc; }
        .detail-label { display: block; color: var(--text-light); font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.35rem; }
        .detail-value { color: var(--text-heading); font-size: 0.9rem; font-weight: 650; overflow-wrap: anywhere; }
        .link-box { display: flex; gap: 0.5rem; align-items: center; padding: 0.7rem; border: 1px solid var(--card-border); border-radius: var(--radius-md); background: #f8fafc; margin: 0.5rem 0 1.25rem; }
        .link-box input { min-width: 0; flex: 1; border: none; background: transparent; color: #475569; font-family: monospace; font-size: 0.78rem; outline: none; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 0.65rem; flex-wrap: wrap; }
        .delete-warning { color: var(--text-main); line-height: 1.6; margin-bottom: 1rem; }
        .delete-code { padding: 0.75rem; background: var(--danger-bg); border: 1px solid #fecaca; color: #991b1b; border-radius: var(--radius-md); font-family: monospace; font-weight: 700; overflow-wrap: anywhere; }
        @media (max-width: 760px) {
          .filters-row { grid-template-columns: 1fr; }
          .header-actions { width: 100%; }
          .header-actions > * { flex: 1; }
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-header">
        <div>
          <p className="page-kicker">Gestión</p>
          <h1 className="page-title">Certificados de Estudiantes</h1>
        </div>
        <div className="header-actions">
          <Link className="primary-link-btn" href="/admin/certificados-estudiantes/create">
            <Icon name="plus" size={16} /> Emitir certificado
          </Link>
          <Button
            size="sm"
            variant="outline"
            disabled
            title="La emisión masiva estará disponible próximamente"
          >
            <Icon name="upload" size={16} /> Emisión masiva
          </Button>
        </div>
      </div>

      <div className="filters-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por estudiante, código, DNI o curso..." />
        <select className="filter-select" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="issued">Emitido</option>
          <option value="corrected">Corregido</option>
          <option value="reissued">Reemitido</option>
          <option value="cancelled">Anulado</option>
          <option value="replaced">Reemplazado</option>
          <option value="generation_error">Error de generación</option>
        </select>
        <select className="filter-select" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
          <option value="">Todas las marcas</option>
          <option value="ciip_latam">CIIP LATAM</option>
          <option value="geomina">Geomina</option>
          <option value="biomedic">Biomedic</option>
        </select>
      </div>

      {!loading && certificates.length > 0 && (
        <p className="results-summary">
          Mostrando {filteredCertificates.length} de {certificates.length} certificados
        </p>
      )}

      <Card padding="0">
        {loading ? (
          <LoadingSpinner />
        ) : filteredCertificates.length === 0 ? (
          <EmptyState
            icon={<Icon name={hasFilters ? 'link' : 'file'} size={42} />}
            title={hasFilters ? 'Sin coincidencias' : 'Sin certificados'}
            description={hasFilters
              ? 'Prueba con otros términos o limpia los filtros seleccionados.'
              : 'Aún no se han emitido certificados de estudiantes.'}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Estudiante</th>
                  <th>Curso / Programa</th>
                  <th>Marca</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => (
                  <tr key={cert._id}>
                    <td><span className="certificate-code">{cert.codigoCertificado}</span></td>
                    <td>{cert.datosPersona?.nombreCompleto || 'Sin nombre'}</td>
                    <td className="program-cell">{cert.datosCursoPrograma?.nombre || 'Sin programa'}</td>
                    <td>{formatBrand(cert.marcaId)}</td>
                    <td>{new Date(cert.fechaEmision).toLocaleDateString('es-PE')}</td>
                    <td><StatusBadge state={cert.estado} /></td>
                    <td>
                      <div className="actions-cell">
                        <ActionButton
                          label="Ver detalles y enlace"
                          icon="link"
                          onClick={() => setSelectedCertificate(cert)}
                        />
                        <ActionButton
                          label="Abrir validación pública"
                          icon="external"
                          href={getValidationPath(cert)}
                        />
                        <ActionButton
                          label={cert.pdfUrl ? 'Descargar PDF' : 'PDF no disponible'}
                          icon="download"
                          disabled={!cert.pdfUrl}
                          href={cert.pdfUrl
                            ? `/api/public/certificates/${encodeURIComponent(cert.codigoCertificado)}/pdf?download=1`
                            : undefined}
                        />
                        <ActionButton
                          label="Eliminar certificado"
                          icon="trash"
                          danger
                          onClick={() => setDeleteTarget(cert)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={Boolean(selectedCertificate)}
        onClose={() => setSelectedCertificate(null)}
        title="Detalle del certificado"
        maxWidth="680px"
      >
        {selectedCertificate && (
          <>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Código</span>
                <span className="detail-value">{selectedCertificate.codigoCertificado}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <StatusBadge state={selectedCertificate.estado} />
              </div>
              <div className="detail-item">
                <span className="detail-label">Estudiante</span>
                <span className="detail-value">{selectedCertificate.datosPersona?.nombreCompleto || 'Sin nombre'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Marca</span>
                <span className="detail-value">{formatBrand(selectedCertificate.marcaId)}</span>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Curso / Programa</span>
                <span className="detail-value">{selectedCertificate.datosCursoPrograma?.nombre || 'Sin programa'}</span>
              </div>
            </div>

            <span className="detail-label">Enlace público de validación</span>
            <div className="link-box">
              <input value={getPublicUrl(selectedCertificate)} readOnly aria-label="Enlace público de validación" />
              <ActionButton
                label="Copiar enlace"
                icon="copy"
                onClick={() => copyValidationUrl(selectedCertificate)}
              />
            </div>

            <div className="modal-actions">
              {selectedCertificate.pdfUrl && (
                <a
                  className="outline-link-btn"
                  href={`/api/public/certificates/${encodeURIComponent(selectedCertificate.codigoCertificado)}/pdf?download=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="download" size={16} /> Descargar PDF
                </a>
              )}
              <a
                className="primary-link-btn"
                href={getValidationPath(selectedCertificate)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="external" size={16} /> Abrir validación
              </a>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !deletingId && setDeleteTarget(null)}
        title="Eliminar certificado"
        maxWidth="500px"
      >
        {deleteTarget && (
          <>
            <p className="delete-warning">
              Esta acción eliminará definitivamente el registro del certificado. El enlace público dejará de validarlo.
            </p>
            <div className="delete-code">{deleteTarget.codigoCertificado}</div>
            <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
              <Button variant="ghost" size="sm" disabled={Boolean(deletingId)} onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button variant="danger" size="sm" disabled={Boolean(deletingId)} onClick={deleteCertificate}>
                <Icon name="trash" size={16} />
                {deletingId ? 'Eliminando...' : 'Eliminar definitivamente'}
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((current) => ({ ...current, isVisible: false }))}
      />
    </>
  );
}
