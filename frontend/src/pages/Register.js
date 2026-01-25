
import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container py-4" style={{maxWidth: 520}}>
      <h3>Registro</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={onSubmit} className="card p-3 shadow-sm">
        <label className="form-label">Nombre</label>
        <input className="form-control" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <label className="form-label mt-3">Email</label>
        <input className="form-control" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
        <label className="form-label mt-3">Password</label>
        <input type="password" className="form-control" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        <button className="btn btn-dark mt-3">Crear cuenta</button>
      </form>
    </div>
  );
}
