'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Cert. Estudiantes', href: '/admin/certificados-estudiantes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
  { label: 'Contratos Docentes', href: '/admin/contratos-docentes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg> },
  { label: 'Cert. Docentes', href: '/admin/certificados-docentes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
  { label: 'Plantillas', href: '/admin/plantillas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { label: 'Config. Académica', href: '/admin/configuracion-academica', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  { label: 'Auditoría', href: '/admin/auditoria', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <style>{`
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: ${collapsed ? '72px' : '280px'};
          background: linear-gradient(180deg, #060e1a 0%, #0a1e35 40%, #0c2844 100%);
          color: #e2e8f0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          border-right: 1px solid rgba(56, 189, 248, 0.08);
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? 'center' : 'space-between'};
          padding: ${collapsed ? '1.25rem 0.5rem' : '1.25rem 1.5rem'};
          border-bottom: 1px solid rgba(56, 189, 248, 0.08);
          min-height: 72px;
        }
        .sidebar-brand {
          display: ${collapsed ? 'none' : 'flex'};
          align-items: center;
          gap: 0.75rem;
        }
        .sidebar-brand-logos {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sidebar-brand-logos img {
          height: 24px;
          width: auto;
          opacity: 0.85;
        }
        .sidebar-brand-text {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.85rem;
          color: #f0f9ff;
          white-space: nowrap;
        }
        .sidebar-toggle {
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.12);
          color: #94a3b8;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .sidebar-toggle:hover {
          background: rgba(56, 189, 248, 0.15);
          color: #e0f2fe;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .sidebar-section-label {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.6);
          padding: ${collapsed ? '0.75rem 0' : '0.75rem 1.5rem'};
          display: ${collapsed ? 'none' : 'block'};
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: ${collapsed ? '0.7rem 0' : '0.7rem 1.5rem'};
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          position: relative;
          white-space: nowrap;
        }
        .sidebar-link:hover {
          color: #e0f2fe;
          background: rgba(56, 189, 248, 0.06);
        }
        .sidebar-link.active {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          border-left-color: #38bdf8;
        }
        .sidebar-link-icon {
          font-size: 1.1rem;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }
        .sidebar-link-label {
          display: ${collapsed ? 'none' : 'inline'};
        }
        .sidebar-footer {
          padding: 1rem ${collapsed ? '0.5rem' : '1.5rem'};
          border-top: 1px solid rgba(56, 189, 248, 0.08);
        }
        .sidebar-logout {
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          gap: 0.75rem;
          width: 100%;
          padding: 0.65rem ${collapsed ? '0' : '1rem'};
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.12);
          border-radius: var(--radius-sm);
          color: #f87171;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-body);
        }
        .sidebar-logout:hover {
          background: rgba(239, 68, 68, 0.15);
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            width: ${collapsed ? '0' : '280px'};
            ${collapsed ? 'border: none;' : ''}
          }
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-logos">
              <img src="/assets/ciip-latam.png" alt="CIIP" />
            </div>
            <span className="sidebar-brand-text">Certificados</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Gestión</span>
          {menuItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <a
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-logout"
            onClick={async () => {
              await fetch('/api/auth/me', { method: 'DELETE' });
              window.location.href = '/login';
            }}
          >
            <span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
