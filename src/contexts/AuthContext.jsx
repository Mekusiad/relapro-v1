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

  // Função dedicada a limpar os dados de autenticação do frontend.
  const clearAuthData = useCallback(() => {
    setUser(null);
    localStorage.removeItem("loggedInUserName");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("loggedInUserAccessLevel");
  }, []);

  // Função de logout para ser usada quando o usuário clica em "Sair".
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Erro na chamada de logout ao backend (continuando no frontend):",
        error
      );
    } finally {
      clearAuthData();
    }
  }, [clearAuthData]);

  useEffect(() => {
    // Este listener serve para deslogar o usuário se um token expirar
    // DURANTE a navegação, após o carregamento inicial.
    const handleForceLogout = () => {
      console.log("Sessão expirou durante o uso da aplicação. Limpando dados.");
      clearAuthData();
    };
    window.addEventListener("forceLogout", handleForceLogout);

    // Função de verificação de sessão inicial.
    const verifyUserSession = async () => {
      console.log("Iniciando verificação de sessão...");
      try {
        const response = await api.get("/auth/me");
        // SUCESSO: O usuário tem uma sessão válida.
        if (response.data && response.data.user) {
          console.log("Sessão verificada com sucesso.", response.data.user);
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // FALHA: Ocorreu um erro (provavelmente 401), e o interceptor não conseguiu renovar o token.
        console.log("Falha ao verificar sessão. Usuário está deslogado.");
        clearAuthData();
      } finally {
        // ESTE BLOCO É CRUCIAL:
        // Ele será executado SEMPRE, tanto no SUCESSO (try) quanto na FALHA (catch).
        console.log(
          "Verificação de sessão finalizada. Removendo tela de loading."
        );
        setLoading(false);
      }
    };

    verifyUserSession();

    return () => {
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, [clearAuthData]);

  const login = async (usuario, senha) => {
    try {
      const response = await apiPerformLogin(usuario, senha);
      if (response && response.status === true) {
        setUser(response.user);
      } else {
        // Garante que o usuário seja nulo em caso de falha no login
        setUser(null);
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
