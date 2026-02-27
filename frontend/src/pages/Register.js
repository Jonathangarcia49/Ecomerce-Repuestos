import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!form.name || !form.email || !form.password) {
      return setErr('Todos los campos son obligatorios');
    }

    if (form.password.length < 6) {
      return setErr('La contraseña debe tener mínimo 6 caracteres');
    }

    if (form.password !== form.confirmPassword) {
      return setErr('Las contraseñas no coinciden');
    }

    try {
      setLoading(true);
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      nav('/');
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ 
       minHeight: '100vh',
       backgroundColor: '#E6ECF5'
  }}
    >
      <div
        className="bg-white p-5"
        style={{
          width: '100%',
          maxWidth: 460,
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <h2 className="fw-bold mb-4">Crear Cuenta</h2>

        {err && (
          <div className="alert alert-danger py-2 text-center">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              className="form-control form-control-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirmar Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>

          <button
            className="btn btn-secondary btn-lg w-100"
            disabled={loading}
            style={{ borderRadius: 12 }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            ¿Ya tienes cuenta?{' '}
            <span
              onClick={() => nav('/login')}
              style={{ cursor: 'pointer' }}
              className="fw-semibold"
            >
              Inicia sesión
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}