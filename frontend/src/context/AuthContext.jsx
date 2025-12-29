import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ⚡ FIX: Read from localStorage immediately (Lazy Initialization)
  // This prevents the app from thinking you are "logged out" for 1 millisecond on refresh
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("curacore_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("curacore_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("curacore_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);