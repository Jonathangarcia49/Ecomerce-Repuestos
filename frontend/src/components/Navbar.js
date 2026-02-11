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
      <Link className="navbar-brand" to="/">🚗 AutoParts</Link>

      <div className="d-flex gap-2 align-items-center">
        <Link className="btn btn-outline-light btn-sm" to="/cart">🛒 Carrito</Link>

        {user?.role === 'ADMIN' && (
          <div className="dropdown">
            <button className="btn btn-warning btn-sm dropdown-toggle" data-bs-toggle="dropdown">
              ⚙️ Admin
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link></li>
              <li><Link className="dropdown-item" to="/admin/products">Productos</Link></li>
              <li><Link className="dropdown-item" to="/admin/users">Usuarios</Link></li>
              <li><Link className="dropdown-item" to="/admin/orders">Órdenes</Link></li>
              <li><Link className="dropdown-item" to="/admin/reports">Reportes</Link></li>
            </ul>
          </div>
        )}

        {!token ? (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
            <Link className="btn btn-light btn-sm" to="/register">Registro</Link>
          </>
        ) : (
          <>
            <span className="text-light small">{user?.name}</span>
            <button className="btn btn-danger btn-sm" onClick={logout}>Salir</button>
          </>
        )}
      </div>
    </nav>
  );
}