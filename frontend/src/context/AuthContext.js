import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const readStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStorage);

  const login = useCallback((token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  }, []);

  const updateUser = useCallback((user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuth((prev) => ({ ...prev, user }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: !!auth.token,
        isAdmin: auth.user?.role === 'ADMIN',
        isVendedor: auth.user?.role === 'VENDEDOR',
        isCliente: auth.user?.role === 'CLIENTE',
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
