import api from "./api.js";

/**
 * Busca os dados necessários para a página de listagem de Ordens de Serviço.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @param {object} filters - O objeto de filtros da página.
 * @returns {Promise<object>} Um objeto com a lista de ordens, clientes e dados de paginação.
 */
export const getServiceOrdersPageData = async (
  loggedInUserMatricula,
  filters
) => {
  try {
    const response = await api.get(`/home/${loggedInUserMatricula}/ordens`, {
      params: filters,
    });
    return response.data.data;
  } catch (error) {
    console.error(error)
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível buscar os dados das Ordens de Serviço."
    );
  }
};

/**
 * Busca os detalhes de uma única Ordem de Serviço pelo ID.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @param {string} osId - O ID da Ordem de Serviço.
 * @returns {Promise<object>} Os detalhes da OS.
 */
export const getOsById = async (loggedInUserMatricula, osId) => {
  try {
    const response = await api.get(
      `/home/${loggedInUserMatricula}/ordens/${osId}`
    );


    return response.data.data;
  } catch (error) {
    console.error(error)
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível buscar os detalhes da OS."
    );
  }
};

/**
 * Cria uma nova Ordem de Serviço.
 * @param {object} osData - Os dados do formulário da OS.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<object>} A resposta da API.
 */
export const createOs = async (osData, loggedInUserMatricula) => {
  try {
    console.log(osData);
    const response = await api.post(
      `/home/${loggedInUserMatricula}/ordens`,
      osData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      error.response?.data?.message || "Não foi possível criar a Ordem de Serviço."
    );
  }
};

/**
 * Atualiza uma Ordem de Serviço existente.
 * @param {string} osId - O ID da OS a ser atualizada.
 * @param {object} osData - Os novos dados do formulário da OS.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @returns {Promise<object>} A resposta da API.
 */
export const updateOs = async (osId, osData, loggedInUserMatricula) => {
  try {
    console.log(osData);
    const response = await api.put(
      `/home/${loggedInUserMatricula}/ordens/${osId}`,
      osData
    );
    return response.data;
  } catch (error) {
    console.error(error)
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível atualizar a Ordem de Serviço."
    );
  }
};

/**
 * Exclui uma Ordem de Serviço.
 * @param {string} loggedInUserMatricula - A matrícula do usuário logado.
 * @param {string} osId - O ID da Ordem de Serviço a ser excluída.
 * @returns {Promise<object>} A resposta da API.
 */
export const deleteOs = async (loggedInUserMatricula, osId) => {
  try { 
    const response = await api.delete(
      `/home/${loggedInUserMatricula}/ordens/${osId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      error.response?.data?.message ||
        "Não foi possível excluir a Ordem de Serviço."
    );
  }
};

export const generateDadosPDF = async (loggedInUserMatricula, osId) => {
  try {
    // ---- CORREÇÃO APLICADA AQUI ----
    // Adicionamos um parâmetro extra à requisição que muda a cada vez que ela é chamada.
    // Isso força o navegador a buscar os dados mais recentes do servidor, ignorando o cache.
    const response = await api.get(
      `/home/${loggedInUserMatricula}/ordens/${osId}/pdf`,
      {
        params: {
          // Parâmetro "cache buster" para garantir dados sempre atualizados
          _: new Date().getTime(),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Não foi possível buscar dados para o PDF."
    );
  }
};