import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      cargarUsuario(token);
    } else {
      setCargando(false);
    }
  }, []);

  const cargarUsuario = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsuario(data.usuario);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setCargando(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUsuario(data.usuario);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const actualizarUsuario = (usuarioActualizado) => {
    setUsuario(usuarioActualizado);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      cargando,
      login,
      logout,
      actualizarUsuario
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;