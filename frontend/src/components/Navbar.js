import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../services/cartService';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isVendedor, isCliente, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load cart item count for CLIENTE
  useEffect(() => {
    if (!isCliente) { setCartCount(0); return; }
    getCart()
      .then((res) => {
        const items = res.data?.CartItems || [];
        setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
      })
      .catch(() => setCartCount(0));
  }, [isCliente, location.pathname]); // re-fetch on route change

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <nav className="ap-navbar">
      <div className="container d-flex align-items-center justify-content-between py-2">

        {/* Brand */}
        <Link className="ap-navbar__brand" to="/">
          <span className="ap-navbar__icon">🔧</span> AutoParts
        </Link>

        {/* Right side */}
        <div className="d-flex align-items-center gap-2">

          {/* Shop link (public) */}
          <Link
            className={`ap-navbar__link d-none d-md-inline ${location.pathname === '/' ? 'active' : ''}`}
            to="/"
          >
            Repuestos
          </Link>

          {/* Cart link (CLIENTE only) */}
          {isCliente && (
            <Link className="ap-navbar__cart-btn" to="/cart">
              🛒
              {cartCount > 0 && (
                <span className="ap-navbar__cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
          )}

          {/* ADMIN dropdown */}
          {isAdmin && (
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="ap-navbar__admin-btn dropdown-toggle"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
              >
                ⚙️ Admin
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${menuOpen ? 'show' : ''}`}>
                <li><Link className="dropdown-item" to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><Link className="dropdown-item" to="/admin/products" onClick={() => setMenuOpen(false)}>Productos</Link></li>
                <li><Link className="dropdown-item" to="/admin/users" onClick={() => setMenuOpen(false)}>Usuarios</Link></li>
                <li><Link className="dropdown-item" to="/admin/orders" onClick={() => setMenuOpen(false)}>Órdenes</Link></li>
                <li><Link className="dropdown-item" to="/admin/reports" onClick={() => setMenuOpen(false)}>Reportes</Link></li>
              </ul>
            </div>
          )}

          {/* VENDEDOR */}
          {isVendedor && (
            <Link className="btn btn-sm btn-outline-info" to="/admin/products">
              Mis productos
            </Link>
          )}

          {/* Auth buttons */}
          {!isAuthenticated ? (
            <>
              <Link className="ap-navbar__link" to="/login">Entrar</Link>
              <Link className="ap-navbar__cta" to="/register">Registro</Link>
            </>
          ) : (
            <>
              <span className="ap-navbar__user d-none d-md-inline">
                {user?.name?.split(' ')[0]}
              </span>
              <button className="ap-navbar__logout" onClick={handleLogout}>
                Salir
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
