import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Apenas adiciona o cabeçalho CSRF para métodos que não são 'GET', 'HEAD', ou 'OPTIONS'.
    if (
      config.method &&
      !["get", "head", "options"].includes(config.method.toLowerCase())
    ) {
      const csrfToken = Cookies.get("csrfToken");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Intercetor de Resposta: Lida com tokens expirados (401) e tokens CSRF ausentes (403).
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cenário 1: Token de acesso expirado (401)
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh-token" && // Evita loop infinito
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh-token");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.dispatchEvent(new Event("forceLogout")); // Desloga o utilizador se o refresh falhar
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // --- AJUSTE APLICADO AQUI ---
    // Cenário 2: Token CSRF ausente ou inválido (403)
    if (
      error.response?.status === 403 &&
      !originalRequest._retry // Evita tentar novamente a mesma requisição múltiplas vezes
    ) {
      console.warn(
        "Detetado erro de CSRF (403). A tentar renovar os tokens..."
      );
      originalRequest._retry = true; // Marca a requisição para não tentar novamente em caso de nova falha

      try {
        // A chamada para refresh-token irá gerar um novo accessToken e um novo csrfToken
        await api.post("/auth/refresh-token");
        console.log("Tokens renovados com sucesso após falha de CSRF.");
        // Tenta novamente a requisição original, que agora deve ter o novo token CSRF
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Falha ao renovar tokens após erro de CSRF. A deslogar.",
          refreshError
        );
        window.dispatchEvent(new Event("forceLogout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
