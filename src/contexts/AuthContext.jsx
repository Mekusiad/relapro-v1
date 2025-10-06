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
      // Tenta invalidar o token no backend.
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "Erro na chamada de logout ao backend (continuando no frontend):",
        error
      );
    } finally {
      // Limpa os dados do frontend independentemente do resultado do backend.
      clearAuthData();
    }
  }, [clearAuthData]);

  useEffect(() => {
    // Este listener agora serve para deslogar o usuário se um token expirar
    // DURANTE a navegação, após o carregamento inicial.
    const handleForceLogout = () => {
      console.log(
        "Evento 'forceLogout' recebido: sessão expirou durante o uso."
      );
      clearAuthData();
    };
    window.addEventListener("forceLogout", handleForceLogout);

    // Função de verificação de sessão inicial.
    async function verifyUserSession() {
      try {
        const response = await api.get("/auth/me");
        // SUCESSO: O usuário tem uma sessão válida (token de acesso válido ou refresh bem-sucedido).
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          // Caso inesperado, mas seguro.
          setUser(null);
        }
        // Define o loading como false no caminho de SUCESSO.
        setLoading(false);
      } catch (error) {
        // FALHA: O interceptor tentou renovar o token e falhou.
        // A promise foi rejeitada e o erro chegou aqui.
        console.info(
          "Não foi possível verificar a sessão. O usuário está deslogado."
        );
        clearAuthData();
        // Define o loading como false no caminho de FALHA.
        setLoading(false);
      }
    }

    verifyUserSession();

    // Função de limpeza do useEffect.
    return () => {
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, [clearAuthData]); // A dependência aqui é a função de limpeza.

  const login = async (usuario, senha) => {
    const response = await apiPerformLogin(usuario, senha);
    if (response && response.status === true) {
      setUser(response.user);
    } else {
      setUser(null);
    }
    return response;
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
