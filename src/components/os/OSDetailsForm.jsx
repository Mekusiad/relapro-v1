// src/components/os/OSDetailsForm.jsx

import React, { useState, useEffect } from "react";
import { getClients } from "../../services/clientService.js";
import "../../styles/os-form.css";
import { useAuth } from "../../contexts/AuthContext.jsx";

function OSDetailsForm({
  osData,
  handleInputChange,
  onClientSelect,
  isEditMode,
  isDisabled,
}) {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    // Evita a execução se não houver um utilizador (ex: durante o logout)
    if (!user?.matricula) return;

    const loadClients = async () => {
      setLoadingClients(true);
      try {
        const storedClients = await getClients(user.matricula);
        setClients(storedClients.clientes || []);
      } catch (error) {
        console.error("Falha ao carregar clientes:", error);
        // Opcional: Adicionar um toast de erro aqui
      } finally {
        setLoadingClients(false);
      }
    };
    loadClients();
  }, [user]); // Depende do objeto 'user' para recarregar se ele mudar

  const handleSelectChange = (e) => {
    const { value: selectedClientId } = e.target;
    // Encontra o objeto completo do cliente com base no ID selecionado
    const selectedClient = clients.find(
      (client) => client.id === selectedClientId
    );

    if (selectedClient) {
      // Passa o objeto completo do cliente para o componente principal
      onClientSelect(selectedClient);
    }
  };

  return (
    <div className="form-section">
      <h3>
        <span className="material-icons">info</span> Detalhes da OS
      </h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="clienteId">Cliente</label>
          <select
            id="clienteId"
            name="clienteId"
            // --- CORREÇÃO 1 ---
            // O valor do select agora é 'osData.clienteId', que é uma string,
            // correspondendo ao 'value' das opções.
            value={osData.clienteId || ""}
            onChange={handleSelectChange}
            required
            disabled={isEditMode || loadingClients}
          >
            <option value="" disabled>
              {loadingClients ? "Carregando..." : "Selecione um cliente"}
            </option>
            {clients.map((client) => (
              // --- CORREÇÃO 2 ---
              // O valor de cada opção agora é o 'client.id', que é um
              // identificador único e fiável.
              <option key={client.id} value={client.id}>
                {client.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="responsavel">Responsável (A/C)</label>
          <input
            type="text"
            id="responsavel"
            name="responsavel"
            value={osData.responsavel || ""}
            onChange={handleInputChange}
            required
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="localizacao">Local do Serviço</label>
          <input
            type="text"
            id="localizacao"
            name="localizacao"
            value={osData.localizacao || ""}
            onChange={handleInputChange}
            required
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={osData.email || ""}
            onChange={handleInputChange}
            disabled={isDisabled}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contato">Contato</label>
          <input
            type="text"
            id="contato"
            name="contato"
            value={osData.contato || ""}
            onChange={handleInputChange}
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="numeroOrcamento">Número do Orçamento</label>
          <input
            type="text"
            id="numeroOrcamento"
            name="numeroOrcamento"
            value={osData.numeroOrcamento || ""}
            onChange={handleInputChange}
            disabled={isDisabled}
          />
        </div>
        {/* CAMPO DE VALOR ADICIONADO */}
        <div className="form-group">
          <label htmlFor="valorServico">Valor da OS (R$)</label>
          <input
            type="number"
            id="valorServico"
            name="valorServico"
            value={osData.valorServico || ""}
            onChange={handleInputChange}
            placeholder="Ex: 1500.00"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipoServico">Tipo de Serviço</label>
          <select
            id="tipoServico"
            name="tipoServico"
            value={osData.tipoServico || "OUTRO"}
            onChange={handleInputChange}
            disabled={isDisabled}
          >
            <option value="MANUTENCAO_PREVENTIVA">Manutenção Preventiva</option>
            <option value="MANUTENCAO_CORRETIVA">Manutenção Corretiva</option>
            <option value="MANUTENCAO_PREDITIVA">Manutenção Preditiva</option>
            <option value="ENSAIO_EPI">Ensaio de EPI</option>
            <option value="INSTALACAO">Instalação</option>
            <option value="INSPECAO">Inspeção</option>
            <option value="OUTRO">Outros</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dataCriacao">Início Previsto</label>
          <input
            type="date"
            id="dataCriacao"
            name="previsaoInicio"
            value={
              osData.previsaoInicio ? osData.previsaoInicio.split("T")[0] : ""
            }
            onChange={handleInputChange}
            required
            disabled={isDisabled}
          />
        </div>
        <div className="form-group">
          <label htmlFor="statusOs">Status</label>
          <select
            id="statusOs"
            name="status"
            value={osData.status || "ABERTA"}
            onChange={handleInputChange}
            required
            disabled={isDisabled}
          >
            <option value="ABERTA">Aberta</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="AGUARDANDO_PECAS">Aguardando peças</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default OSDetailsForm;
