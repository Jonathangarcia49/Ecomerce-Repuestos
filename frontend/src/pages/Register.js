import { useState } from 'react';
import { register as registerApi } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const pwStrength = (pw) => {
    if (pw.length < 4) return { level: 0, label: '' };
    if (pw.length < 8) return { level: 1, label: 'Débil', color: '#dc2626' };
    if (!/(?=.*[A-Z])(?=.*\d)/.test(pw)) return { level: 2, label: 'Regular', color: '#ca8a04' };
    return { level: 3, label: 'Fuerte', color: '#16a34a' };
  };
  const strength = pwStrength(form.password);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      return setErr('Todos los campos son obligatorios');
    }
    if (form.password !== form.confirmPassword) {
      return setErr('Las contraseñas no coinciden');
    }

    try {
      setLoading(true);
      const res = await registerApi({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      login(res.data.token, res.data.user);
      nav('/');
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Error al registrar');
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
          <h4 className="fw-bold mb-1">Crear cuenta</h4>
          <p className="text-muted mb-4" style={{ fontSize: '.9rem' }}>Regístrate gratis y empieza a comprar</p>

          {err && <div className="alert alert-danger py-2 mb-3">{err}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input
                className="form-control"
                placeholder="Juan Pérez"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                required
              />
            </div>

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

            <div className="mb-2">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Mín. 8 chars, 1 mayúscula, 1 número"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPw((v) => !v)} tabIndex={-1}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-1">
                  <div className="progress" style={{ height: 4, borderRadius: 99 }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(strength.level / 3) * 100}%`,
                        background: strength.color,
                        transition: 'width .3s',
                      }}
                    />
                  </div>
                  <small style={{ color: strength.color }}>{strength.label}</small>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label">Confirmar contraseña</label>
              <input
                type={showPw ? 'text' : 'password'}
                className="form-control"
                placeholder="Repite tu contraseña"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                autoComplete="new-password"
                required
              />
            </div>

            <button className="btn btn-accent w-100 py-2 fw-semibold" disabled={loading}>
              {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2" />Creando cuenta...</span>
              ) : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-3 text-center text-muted" style={{ fontSize: '.875rem' }}>
            ¿Ya tienes cuenta? <Link to="/login" className="fw-semibold">Inicia sesión</Link>
          </p>
        </div>

        {/* Right panel */}
        <div className="auth-panel-right">
          <span style={{ fontSize: '3.5rem' }}>🛒</span>
          <h3 className="fw-bold mt-3 mb-2">Únete a AutoParts</h3>
          <ul style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem', listStyle: 'none', padding: 0, textAlign: 'left' }}>
            <li className="mb-2">✅ Compra rápida y segura</li>
            <li className="mb-2">✅ Seguimiento de tus órdenes</li>
            <li className="mb-2">✅ Repuestos originales garantizados</li>
            <li>✅ Soporte especializado 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
