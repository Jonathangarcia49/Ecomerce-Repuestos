import { useState } from 'react';
import { login as loginApi } from '../services/authService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.email.trim() || !form.password) {
      return setErr('Email y contraseña son requeridos');
    }
    try {
      setLoading(true);
      const res = await loginApi(form);
      login(res.data.token, res.data.user);
      const from = location.state?.from?.pathname || '/';
      nav(from, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 64px)', background: '#f1f5f9' }}>
      <div
        className="shadow-lg"
        style={{ width: 860, maxWidth: '95%', borderRadius: 20, overflow: 'hidden', background: '#fff', display: 'flex' }}
      >
        {/* Left panel */}
        <div className="auth-panel-left">
          <h4 className="fw-bold mb-1">Bienvenido de nuevo</h4>
          <p className="text-muted mb-4" style={{ fontSize: '.9rem' }}>Inicia sesión en tu cuenta</p>

          {err && <div className="alert alert-danger py-2 mb-3">{err}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button className="btn btn-accent w-100 py-2 fw-semibold" disabled={loading}>
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2" />Entrando...</span>
              ) : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-3 text-center text-muted" style={{ fontSize: '.875rem' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="fw-semibold">Regístrate</Link>
          </p>
        </div>

        {/* Right panel */}
        <div className="auth-panel-right">
          <span style={{ fontSize: '3.5rem' }}>🔧</span>
          <h3 className="fw-bold mt-3 mb-2">AutoParts</h3>
          <p className="text-center" style={{ color: 'rgba(255,255,255,.65)', fontSize: '.95rem', maxWidth: 240 }}>
            Repuestos automotrices de calidad. Gestiona tus pedidos con facilidad.
          </p>
        </div>
      </div>
    </div>
  );
}
