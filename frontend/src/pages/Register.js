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

    // Validaciones simples
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
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <h3 className="mb-3">Registro</h3>

      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={onSubmit} className="card p-4 shadow-sm">
        <label className="form-label">Nombre</label>
        <input
          className="form-control"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="form-label mt-3">Email</label>
        <input
          type="email"
          className="form-control"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="form-label mt-3">Password</label>
        <input
          type="password"
          className="form-control"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label className="form-label mt-3">Confirmar Password</label>
        <input
          type="password"
          className="form-control"
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <button
          className="btn btn-dark mt-4 w-100"
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}