// src/services/technicianService.js
import api from "./api.js";

// --- VERSÃO SIMULADA PARA DESENVOLVIMENTO DO FRONTEND ---
// const MOCK_TECHNICIANS = [
//   {
//     id: 1,
//     matricula: "12345",
//     nome: "João da Silva",
//     cargo: "Técnico Eletricista",
//     nivelAcesso: "TECNICO",
//     usuario: "joao.silva",
//   },
//   {
//     id: 2,
//     matricula: "54321",
//     nome: "Maria Oliveira",
//     cargo: "Supervisora de Campo",
//     nivelAcesso: "SUPERVISOR",
//     usuario: "maria.oliveira",
//   },
//   {
//     id: 3,
//     matricula: "98765",
//     nome: "Carlos Pereira",
//     cargo: "Engenheiro Eletricista",
//     nivelAcesso: "ADMIN",
//     usuario: "carlos.pereira",
//   },
// ];

/**
 * Busca a lista de todos os técnicos/funcionários da API, com suporte a paginação e filtros.
 * @param {object} [params] - Parâmetros opcionais para a query string.
 * @param {number} [params.page=1] - O número da página a ser buscada.
 * @param {number} [params.limit=20] - O número de itens por página.
 * @param {string} [params.nome] - Filtro por nome do funcionário.
 * @returns {Promise<object>} Um objeto contendo a lista de funcionários e os dados de paginação.
 */
export const getTechnicians = async (
  matriculaUsuarioLogado,
  params = { page: 1, limit: 20 }
) => {
  try {
    // Faz a requisição GET, passando os parâmetros. O Axios os transformará em query string.
    // Ex: /home/funcionarios?page=1&limit=20
    const response = await api.get(`/home/funcionarios`, {
      params,
    });

    if(!response.status) return console.error(response.message)

    // O seu backend retorna: { status, mensagem, data: { currentPage, ..., funcionarios: [...] } }
    // Vamos retornar o objeto 'data' inteiro, que contém tanto a lista quanto as informações de paginação.
    return response.data.data;
  } catch (error) {
    console.error("Falha ao carregar técnicos:", error);
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível buscar os funcionários."
    );
  }
};

// Deixaremos as funções de adicionar, editar e deletar prontas para o futuro.
export const addTechnician = async (technicianData, matriculaUsuarioLogado) => {
  try {
    // Faz a chamada POST para a rota do backend, passando a matrícula do usuário logado na URL
    const response = await api.post(
      `/home/${matriculaUsuarioLogado}/funcionarios`,
      technicianData
    );
    return response.data;
  } catch (error) {
    // Captura erros da API (ex: matrícula já existente, erro de validação) e os propaga
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível cadastrar o funcionário."
    );
  }
};

export const updateTechnician = async (
  matriculaUsuarioLogado,
  technicianData
) => {
  try {
    // Remove a senha do objeto se ela estiver vazia, para não enviar uma string em branco para o backend.
    if (technicianData.senha === "") {
      delete technicianData.senha;
    }

    const response = await api.put(
      `/home/${matriculaUsuarioLogado}/funcionarios/${technicianData.matricula}`,
      technicianData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível atualizar o funcionário."
    );
  }
};

export const deleteTechnician = async (matricula, outraMatricula) => {
  try {
    // Faz a chamada POST para a rota do backend, passando a matrícula do usuário logado na URL
    const response = await api.delete(
      `/home/${matricula}/funcionarios/${outraMatricula}`
    );
    return response.data;
  } catch (error) {
    // Captura erros da API (ex: matrícula já existente, erro de validação) e os propaga
    throw new Error(
      error.response?.data?.message || "Não foi possível deletar o funcionário."
    );
  }
};
