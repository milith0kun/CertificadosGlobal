'use client';

import { useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: { bg: 'var(--success)', icon: '✓' },
    error: { bg: 'var(--danger)', icon: '✕' },
    warning: { bg: 'var(--warning)', icon: '⚠' },
    info: { bg: 'var(--info)', icon: 'ℹ' },
  };

  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 99999,
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      background: c.bg, color: '#fff',
      padding: '0.85rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      fontWeight: 600, fontSize: '0.875rem',
      fontFamily: 'var(--font-body)',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      maxWidth: '400px',
    }}>
      <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem', marginLeft: '0.5rem' }}
      >×</button>
      <style>{`@keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
