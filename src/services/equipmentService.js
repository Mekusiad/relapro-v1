// src/services/equipmentService.js
import api from "./api.js";

/**
 * Busca a lista de equipamentos de um usuário.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<Array>} A lista de equipamentos.
 */
export const getEquipments = async (loggedInUserMatricula) => {
  try {
    const response = await api.get(
      `/home/${loggedInUserMatricula}/equipamentos`
    );
    // Assumindo que o backend retorna { status: true, data: [...] }
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível buscar os equipamentos."
    );
  }
};

/**
 * Cadastra um novo equipamento.
 * @param {object} equipmentData - Os dados do novo equipamento.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<object>} A resposta da API.
 */
export const addEquipment = async (equipmentData, loggedInUserMatricula) => {
  try {
    const response = await api.post(
      `/home/${loggedInUserMatricula}/equipamentos`,
      equipmentData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível cadastrar o equipamento."
    );
  }
};

/**
 * Atualiza um equipamento existente.
 * @param {number|string} equipmentId - O ID do equipamento a ser atualizado.
 * @param {object} equipmentData - Os novos dados do equipamento.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<object>} A resposta da API.
 */
export const updateEquipment = async (
  equipmentId,
  equipmentData,
  loggedInUserMatricula
) => {
  try {
    const response = await api.put(
      `/home/${loggedInUserMatricula}/equipamentos/${equipmentId}`,
      equipmentData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível atualizar o equipamento."
    );
  }
};

/**
 * Exclui um equipamento.
 * @param {number|string} equipmentId - O ID do equipamento a ser excluído.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<object>} A resposta da API.
 */
export const deleteEquipment = async (equipmentId, loggedInUserMatricula) => {
  try {
    const response = await api.delete(
      `/home/${loggedInUserMatricula}/equipamentos/${equipmentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Não foi possível excluir o equipamento."
    );
  }
};
