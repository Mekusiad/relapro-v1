// src/services/substationService.js

const STORAGE_KEY = "nexuscontrol_substations_list";

// MOCK_DATA ATUALIZADO para usar unidades individuais em vez de 'quantidade'
const MOCK_SUBSTATIONS = [
  {
    id: "sub-1",
    cliente: "Cliente Exemplo A",
    nome: "Subestação Principal",
    componentes: [
      {
        id: "comp-1-1",
        nomeEquipamento: "Malha de aterramento",
        tipo: "MALHA",
      },
      { id: "comp-1-2", nomeEquipamento: "Pára-raios", tipo: "PARARAIO" },
      { id: "comp-1-3", nomeEquipamento: "Pára-raios", tipo: "PARARAIO" },
      {
        id: "comp-1-4",
        nomeEquipamento: "Chave seccionadora de alta tensão",
        tipo: "CHAVE_SECCIONADORA",
      },
    ],
  },
  {
    id: "sub-2",
    cliente: "Empresa B",
    nome: "Subestação Única",
    componentes: [
      {
        id: "comp-2-1",
        nomeEquipamento: "Disjuntor de média tensão",
        tipo: "DISJUNTOR_MEDIA",
      },
      {
        id: "comp-2-2",
        nomeEquipamento: "Disjuntor de média tensão",
        tipo: "DISJUNTOR_MEDIA",
      },
    ],
  },
];

const loadSubstations = () => {
  try {
    const storedList = localStorage.getItem(STORAGE_KEY);
    if (storedList) {
      return JSON.parse(storedList);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_SUBSTATIONS));
    return MOCK_SUBSTATIONS;
  } catch (error) {
    console.error("Falha ao carregar subestações do localStorage.", error);
    return [];
  }
};

const saveSubstations = (substationsList) => {
  try {
    console.log(`sALVANDO DADOS DA SUBESTAÇÃO`, substationsList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(substationsList));
  } catch (error) {
    console.error("Falha ao salvar subestações no localStorage.", error);
  }
};

// A função foi simplificada, pois não precisa mais "expandir" os componentes
export const getSubstationsByClientName = async (clientName) => {
  console.log(`Buscando subestações para o cliente: ${clientName}`);
  await new Promise((resolve) => setTimeout(resolve, 200));

  const allSubstations = loadSubstations();

  return allSubstations.filter(
    (sub) => sub.cliente.toLowerCase() === clientName.toLowerCase()
  );
};

export const updateClientSubstations = async (
  clientName,
  updatedSubstations
) => {
  console.log(`Atualizando subestações para o cliente: ${clientName}`);
  await new Promise((resolve) => setTimeout(resolve, 200));

  let allSubstations = loadSubstations();
  // Remove as subestações antigas do cliente
  allSubstations = allSubstations.filter(
    (sub) => sub.cliente.toLowerCase() !== clientName.toLowerCase()
  );

  // Adiciona as novas/atualizadas
  const newSubstations = updatedSubstations.map((sub) => ({
    ...sub,
    cliente: clientName,
  }));
  allSubstations = [...allSubstations, ...newSubstations];

  saveSubstations(allSubstations);
  return newSubstations;
};

export const deleteClientSubstations = async (clientName) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  let allSubstations = loadSubstations();
  allSubstations = allSubstations.filter(
    (sub) => sub.cliente.toLowerCase() !== clientName.toLowerCase()
  );
  saveSubstations(allSubstations);
  return true;
};
