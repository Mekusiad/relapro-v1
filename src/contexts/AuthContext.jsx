import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../services/api";
import { performLogin as apiPerformLogin } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LÓGICA CORRIGIDA E SIMPLIFICADA
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro na chamada de logout ao backend (continuando o logout no frontend):", error);
    } finally {
      // 1. Apenas limpamos o estado do utilizador e o localStorage.
      setUser(null);
      localStorage.removeItem("loggedInUserName");
      localStorage.removeItem("loggedInUserId");
      localStorage.removeItem("loggedInUserAccessLevel");
      // 2. REMOVEMOS o `window.location.href`. O componente PrivateRoute
      //    irá agora tratar do redirecionamento de forma automática e segura.
    }
  }, []);
  
  useEffect(() => {
    const handleForceLogout = () => {
      console.log("Evento 'forceLogout' recebido. A executar logout.");
      setLoading(false)
      logout();
    };

    window.addEventListener('forceLogout', handleForceLogout);
    
    async function verifyUserSession() {
      try {
        const response = await api.get("/auth/me");
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Nenhuma sessão ativa encontrada ou token inválido:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verifyUserSession();

    return () => {
      setLoading(false)
      window.removeEventListener('forceLogout', handleForceLogout);
    };
  }, [logout]);

  const login = async (usuario, senha) => {
    try {
      const response = await apiPerformLogin(usuario, senha);
      if (response && response.status === true) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

