import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";
import { performLogin as apiPerformLogin } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Crie uma função APENAS para limpar os dados do cliente
  const clearAuthData = useCallback(() => {
    setUser(null);
    localStorage.removeItem("loggedInUserName");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserAccessLevel");
    // Não precisa de redirect aqui, o PrivateRoute vai cuidar disso
  }, []);

  // 2. A função logout agora é para quando o usuário clica no botão "Sair"
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Erro na chamada de logout ao backend (continuando o logout no frontend):",
        error
      );
    } finally {
      clearAuthData(); // Reutilize a função de limpeza
    }
  }, [clearAuthData]);

  useEffect(() => {
    // 3. O handler agora chama a função de limpeza diretamente, SEM chamada de API
    const handleForceLogout = () => {
      console.log("Evento 'forceLogout' recebido. Limpando sessão do cliente.");
      clearAuthData();
      setLoading(false); // Garante que a tela de loading suma
    };

    window.addEventListener("forceLogout", handleForceLogout);

    async function verifyUserSession() {
      try {
        const response = await api.get("/auth/me");
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          // Se não houver usuário, limpamos os dados para garantir consistência
          clearAuthData();
        }
      } catch (error) {
        console.info("Nenhuma sessão ativa encontrada.");
        clearAuthData();
      } finally {
        setLoading(false);
      }
    }

    verifyUserSession();

    // 4. Limpeza do useEffect: remova o setLoading(false) daqui, ele é desnecessário
    //    e pode causar bugs.
    return () => {
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, [clearAuthData]);

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
