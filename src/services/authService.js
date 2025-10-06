// src/services/authService.js
import api from "./api.js";

export const performLogin = async (usuario, senha) => {
  try {
    // A chamada para a API está correta.
    // É importante que sua instância 'api' esteja configurada com 'withCredentials: true'
    // para que ela envie os cookies em requisições futuras.
    const response = await api.post("/auth/login", { usuario, senha });

    // 1. Verificar o sucesso da resposta pelo campo 'status' que o backend envia
    if (response.data && response.data.status === true) {
      // SUCESSO!
      // Os cookies (accessToken, refreshToken) já foram configurados
      // no navegador pelo backend. Você não precisa guardá-los manualmente.

      // 2. Extrair e salvar as informações do usuário para usar na UI
      const { user } = response.data; // Extrai o objeto 'user' da resposta

      if (user) {
        // Salva os dados do usuário no localStorage para exibir na interface
        // localStorage.setItem("loggedInUserName", user.nome);
        // localStorage.setItem("loggedInUserId", user.id); 
        // localStorage.setItem("loggedInUserAccessLevel", user.nivelAcesso);
      }

      // 3. Retornar os dados da resposta para o componente que chamou a função
      // Isso permite que o componente decida para onde redirecionar o usuário, por exemplo.
      return response.data;
    } else {
      // Caso o backend por algum motivo retorne status 200, mas com um erro lógico
      throw new Error(
        response.data.message || "Ocorreu um erro desconhecido no login."
      );
    }
  } catch (error) {
    // O seu tratamento de erro já está muito bom.
    // Ele vai capturar erros de rede, status 401 (Não Autorizado), 400 (Bad Request), etc.
    throw new Error(
      error.response?.data?.message || "Usuário ou senha inválidos"
    );
  }
};

export const performUserLogout = () => {
  localStorage.clear();
  window.location.href = "/login"; // Força o redirecionamento
};

export const checkAuthStatus = () => {
  return localStorage.getItem("authToken") !== null;
};
