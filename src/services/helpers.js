export const translateStatus = (status) => {
    const statusMap = {
      ABERTA: "Aberta",
      EM_ANDAMENTO: "Em Andamento",
      AGUARDANDO_PECAS: "Aguardando Peças",
      FINALIZADA: "Finalizada",
    };
    return statusMap[status] || status;
};

// Esta função precisa existir para que o Dashboard funcione
export const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  
  return date.toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
  });
};