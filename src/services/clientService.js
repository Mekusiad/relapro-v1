// src/services/clientService.js
import { handleError } from "../utils/handleError.js";
import api from "./api.js";

// ==================================================================
// INÍCIO DA CORREÇÃO
// Adicionada a palavra-chave 'export' para que a função possa ser importada por outros arquivos.
// ==================================================================
export const isUUID = (id) => {
  if (typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};
// ==================================================================
// FIM DA CORREÇÃO
// ==================================================================

/**
 * Busca a lista de clientes de um usuário, com suporte a paginação.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @param {object} [params] - Parâmetros opcionais para a query string (ex: page, limit).
 * @returns {Promise<object>} A resposta da API contendo a lista e dados de paginação.
 */
export const getClients = async (loggedInUserMatricula, params = null) => {
  try {
    const response = await api.get(`/home/${loggedInUserMatricula}/clientes`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Não foi possível buscar os clientes."
    );
  }
};

/**
 * Busca um cliente específico pelo ID.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @param {string} clientId - O ID do cliente a ser buscado.
 * @returns {Promise<object>} Os dados do cliente.
 */
export const getClientById = async (loggedInUserMatricula, clientId) => {
  try {
    const response = await api.get(
      `/home/${loggedInUserMatricula}/clientes/${clientId}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Não foi possível encontrar o cliente."
    );
  }
};

/**
 * Cadastra um novo cliente ou atualiza um existente.
 * @param {object} clientData - Os dados completos do cliente.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<object>} A resposta da API.
 */
export const saveClient = async (clientData, loggedInUserMatricula) => {
  if (!clientData.id) {
    try {
      const response = await api.post(
        `/home/${loggedInUserMatricula}/clientes`,
        clientData
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  } else {
    try {
      const { id, ...dataToUpdate } = clientData;
      const response = await api.put(
        `/home/${loggedInUserMatricula}/clientes/${id}`,
        dataToUpdate
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

/**
 * Exclui um cliente.
 * @param {string} clientId - O ID do cliente a ser excluído.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<object>} A resposta da API.
 */
export const deleteClient = async (clientId, loggedInUserMatricula) => {
  try {
    const response = await api.delete(
      `/home/${loggedInUserMatricula}/clientes/${clientId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Atualiza as informações de um único componente.
 * @param {string} loggedInUserMatricula A matrícula do usuário logado.
 * @param {string} substationId O ID da subestação pai do componente.
 * @param {string} componentId O ID do componente a ser atualizado.
 * @param {object} componentData Os novos dados do componente.
 * @returns {Promise<object>} A resposta da API.
 */
export const updateComponent = async (loggedInUserMatricula, substationId, componentId, componentData) => {
  try {
    if (!isUUID(componentId)) {
      throw new Error("Apenas componentes já salvos podem ser atualizados.");
    }
    const response = await api.put(
      `/home/${loggedInUserMatricula}/subestacoes/${substationId}/componentes/${componentId}`,
      componentData
    );

    console.log(response)
    return response.data;
  } catch (error) {
    handleError(error);
    throw new Error(
      error.response?.data?.message || "Não foi possível atualizar o componente."
    );
  }
};