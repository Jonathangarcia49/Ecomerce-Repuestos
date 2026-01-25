
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">AutoParts</Link>

      <div className="d-flex gap-2">
        <Link className="btn btn-outline-light" to="/cart">Carrito</Link>
        {user?.role === 'ADMIN' && <Link className="btn btn-outline-warning" to="/admin/products">Admin</Link>}
        {!token ? (
          <>
            <Link className="btn btn-outline-light" to="/login">Login</Link>
            <Link className="btn btn-light" to="/register">Registro</Link>
          </>
        ) : (
          <button className="btn btn-danger" onClick={logout}>Salir</button>
        )}
      </div>
    </nav>
  );
}
