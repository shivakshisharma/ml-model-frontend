import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('Checked loggedIn state:', loggedIn);
    setIsAuthenticated(loggedIn);
    setLoading(false);
  }, []);
  
  const login = () => {
    localStorage.setItem('isLoggedIn', 'true'); // Persist login state
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
