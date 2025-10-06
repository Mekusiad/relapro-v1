// src/utils/helpers.js

// =============================================================================
// CORREÇÃO APLICADA AQUI:
// A constante SERVICE_TYPE_NAMES foi movida para este arquivo de utilitários.
// =============================================================================
export const SERVICE_TYPE_NAMES = {
  MANUTENCAO_PREVENTIVA: "Manutenção Preventiva",
  MANUTENCAO_CORRETIVA: "Manutenção Corretiva",
  MANUTENCAO_PREDITIVA: "Manutenção Preditiva",
  FOTOGRAFICO: "Relatório Fotográfico",
  TERMOGRAFIA: "Termografia",
  ENSAIO_EPI: "Ensaio de EPI",
  INSTALACAO: "Instalação",
  INSPECAO: "Inspeção",
  REFORMA: "Reforma",
  OUTRO: "Serviços Diversos",
};

const OS_STATUS_MAP = {
  ABERTA: 'Aberta',
  EM_ANDAMENTO: 'Em Andamento',
  AGUARDANDO_PECAS: 'Aguardando Peças',
  AGUARDANDO_REVISAO: 'Aguardando Revisão',
  AGUARDANDO_APROVACAO: 'Aguardando Aprovação',
  PENDENCIA: 'Pendência',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

export const translateStatus = (status) => {
  return OS_STATUS_MAP[status] || status.replace(/_/g, ' ');
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Data inválida';
  // Adiciona timeZone UTC para evitar problemas de fuso horário na formatação
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};