import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: 'admin@autoparts.com',
    password: 'Admin123*'
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      setLoading(true);
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#e6ecf5" }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "900px",
          maxWidth: "95%",
          borderRadius: "20px",
          overflow: "hidden",
          background: "white",
          display: "flex"
        }}
      >

        {/* PANEL IZQUIERDO */}
        <div className="p-5" style={{ width: "50%" }}>
          <h3 className="mb-4 fw-bold">AutoParts</h3>

          {err && (
            <div className="alert alert-danger">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button
              className="btn btn-secondary w-100 btn-lg"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <small className="text-muted mt-3 d-block">
              Admin: admin@autoparts.com / Admin123*
            </small>
          </form>
        </div>

        {/* PANEL DERECHO */}
        <div
          className="d-flex flex-column justify-content-center align-items-center text-white"
          style={{
            width: "50%",
            // background: "linear-gradient(135deg, #cb2d3e, #ef473a)",
            background: "linear-gradient(135deg, #212529, #495057)",
            padding: "40px"
          }}
        >
          <h2 className="fw-bold mb-3">Bienvenido</h2>
          <p className="text-center">
            Gestiona tus productos, categorías y ventas
            con un sistema profesional y moderno.
          </p>
        </div>

      </div>
    </div>
  );
}