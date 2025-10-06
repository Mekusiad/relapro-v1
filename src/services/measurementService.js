import api from "./api.js";

export const saveMeasurement = async (
  loggedInUserMatricula,
  numeroOs,
  measurementData
) => {
  try {
    console.log(measurementData);
    const response = await api.post(
      `/home/${loggedInUserMatricula}/ordens/${numeroOs}/ensaios`,
      measurementData
    );
    return response.data;
  } catch (error) {
    console.error(error)
    console.error("Error saving measurement:", error);
    throw error;
  }
};

export const updateMeasurement = async (
  loggedInUserMatricula,
  numeroOs,
  ensaioId,
  measurementData
) => {
  try {
    // Usando PUT para a atualização de um recurso existente

    // return console.log(measurementData);
    const response = await api.put(
      `/home/${loggedInUserMatricula}/ordens/${numeroOs}/ensaios/${ensaioId}`,
      measurementData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating measurement:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar medição."
    );
  }
};
