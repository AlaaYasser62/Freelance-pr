import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(email, password, role) {
    // Mock auth
    setUser({
      id: 'u1',
      email,
      name: role === 'client' ? 'Sarah Chen' : 'Alex Rivera',
      role,
      avatar: role === 'client' ? 'SC' : 'AR',
    });
  }

  function register(data) {
    setUser({
      id: 'u1',
      email: data.email,
      name: data.name,
      role: null, // needs role selection
      avatar: data.name.substring(0, 2).toUpperCase(),
    });
  }

  function setRole(role) {
    setUser(prev => ({ ...prev, role }));
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
