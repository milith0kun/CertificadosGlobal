'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      // Redirect based on role
      const roleRoutes = {
        admin: '/admin',
        admin_academico: '/admin',
        area_administrativa: '/admin',
        docente: '/docente/certificados',
        estudiante: '/estudiante/certificados',
      };

      router.push(roleRoutes[data.user.rol] || '/admin');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .login-card {
          background: var(--card-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-xl);
          padding: 3rem;
          max-width: 420px;
          width: 100%;
          box-shadow: var(--shadow-md);
          animation: loginIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .login-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .login-logos img {
          height: 36px;
          width: auto;
          object-fit: contain;
          opacity: 0.85;
        }
        .login-sep {
          width: 1px;
          height: 24px;
          background: linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.25), transparent);
        }
        .login-title {
          text-align: center;
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 0.35rem;
        }
        .login-subtitle {
          text-align: center;
          color: var(--text-light);
          font-size: 0.85rem;
          margin-bottom: 2rem;
        }
        .login-form { display: flex; flex-direction: column; gap: 1rem; }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .login-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-heading);
          letter-spacing: 0.02em;
        }
        .login-input {
          padding: 0.7rem 1rem;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.8);
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--text-main);
          outline: none;
          transition: all var(--transition-fast);
        }
        .login-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }
        .login-btn {
          padding: 0.8rem;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-family: var(--font-body);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-primary);
          margin-top: 0.5rem;
        }
        .login-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-error {
          background: var(--danger-bg);
          color: var(--danger);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          text-align: center;
        }
        .login-back {
          text-align: center;
          margin-top: 1.5rem;
        }
        .login-back a {
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .login-back a:hover { text-decoration: underline; }
        @keyframes loginIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <main className="login-container">
        <div className="login-card">
          <div className="login-logos">
            <img src="/assets/logociip.png" alt="CIIP" />
            <div className="login-sep" />
            <img src="/assets/logogeomina.png" alt="Geomina" />
            <div className="login-sep" />
            <img src="/assets/logobiomedic.png" alt="Biomedic" />
          </div>
          <h1 className="login-title">Certificados Global</h1>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label className="login-label" htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-back">
            <a href="/">← Volver al inicio</a>
          </div>
        </div>
      </main>
    </>
  );
}
