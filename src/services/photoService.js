// src/services/photoService.js
import api from "./api";
import { toast } from "sonner";

/**
 * Faz o upload de um único arquivo de foto para o backend.
 * O backend deve ser responsável por enviar para o Cloudinary.
 * @param {string} osId - O ID da Ordem de Serviço à qual a foto pertence.
 * @param {File} file - O objeto do arquivo da foto a ser enviada.
 * @param {string} descricao - A descrição da foto.
 * @param {'ANTES' | 'DURANTE' | 'DEPOIS'} tipoFoto - A categoria da foto.
 * @param {string} userMatricula - Matrícula do usuário para autorização.
 * @returns {Promise<object>} A resposta da API.
 */
export const uploadOsPhoto = async (
  numeroOs,
  file,
  descricao,
  tipoFoto,
  userMatricula
) => {
  // FormData é necessário para enviar arquivos via HTTP.
  const formData = new FormData();
  formData.append("photo", file); // 'photo' deve ser o nome que o backend espera (ex: com Multer).
  formData.append("descricao", descricao || "");
  formData.append("tipoFoto", tipoFoto);
  formData.append("userMatricula", userMatricula);

  try {
    // O cabeçalho 'Content-Type': 'multipart/form-data' é adicionado
    // automaticamente pelo navegador quando você envia um FormData.

    const response = await api.post(
      `/api/ordens/${numeroOs}/upload-photo`,
      formData
    );
    return response.data;
  } catch (error) {
    // Lança um erro para ser capturado pelo Promise.all no formulário.
    console.error(error);
    toast.error(`Falha no upload da foto: ${file.name}`);
    throw error;
  }
};

export const deleteOsPhoto = async (numeroOs, cloudinaryId) => {
  try {
    // O cabeçalho 'Content-Type': 'multipart/form-data' é adicionado
    // automaticamente pelo navegador quando você envia um FormData.
    const encoded = encodeURIComponent(cloudinaryId);

    const response = await api.delete(
      `/api/ordens/${numeroOs}/upload-photo/${encoded}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error(`Falha na exclusão da foto: ${cloudinaryId}`);
    throw error;
  }
};

// ===============================================
// NOVA FUNÇÃO PARA ATUALIZAR A DESCRIÇÃO
// ===============================================

/**
 * Atualiza a descrição de uma foto existente.
 * @param {string} fotoId - O ID da foto no banco de dados.
 * @param {string} descricao - A nova descrição para a foto.
 * @returns {Promise<object>} A resposta da API.
 */
export const updatePhotoDescription = async (
  numeroOs,
  cloudinaryId,
  descricao
) => {
  try {
    const encoded = encodeURIComponent(cloudinaryId);
    console.log(
      "Updating description for photo ID:",
      encoded,
      "to:",
      descricao
    );
    const response = await api.patch(
      `/api/ordens/${numeroOs}/upload-photo/${encoded}`,
      {
        descricao: descricao,
      }
    );
    toast.success("Descrição da foto salva!");
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar a descrição da foto:",
      error.response?.data || error.message
    );
    toast.error("Falha ao salvar a descrição.");
    throw error;
  }
};

/**
 * Faz o upload de uma foto para um Ensaio (Medição) específico.
 * @param {string} numeroOs - O número da OS para a estrutura da pasta.
 * @param {string} ensaioId - O ID do ensaio ao qual a foto será associada.
 * @param {File} file - O objeto do arquivo da foto.
 * @param {string} descricao - A descrição da foto.
 * @returns {Promise<object>} A resposta da API.
 */
export const uploadEnsaioPhoto = async (
  numeroOs,
  ensaioId,
  file,
  descricao
) => {
  const formData = new FormData();
  formData.append("photo", file);
  formData.append("descricao", descricao || "");

  try {
    const response = await api.post(
      `/api/ordens/${numeroOs}/ensaios/${ensaioId}/upload-photo`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erro no upload da foto do ensaio:",
      error.response?.data || error.message
    );
    toast.error(`Falha no upload da foto: ${file.name}`);
    throw error;
  }
};

export const updatePhotoEnsaioDescription = async (
  numeroOs,
  ensaioId,
  cloudinaryId,
  descricao
) => {
  try {
    const encoded = encodeURIComponent(cloudinaryId);

    const response = await api.patch(
      `/api/ordens/${numeroOs}/ensaios/${ensaioId}/upload-photo/${encoded}`,
      {
        descricao: descricao,
      }
    );
    toast.success("Descrição da foto salva!");
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar a descrição da foto:",
      error.response?.data || error.message
    );
    toast.error("Falha ao salvar a descrição.");
    throw error;
  }
};
