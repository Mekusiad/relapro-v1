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
}) {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      setLoadingClients(true);
      const storedClients = await getClients(user.matricula);

      setClients(storedClients.clientes);
      setLoadingClients(false);
    };
    loadClients();
  }, []);

  const handleSelectChange = (e) => {
    const { value } = e.target;
    handleInputChange(e);
    const selectedClient = clients.find((client) => client.nome === value);
    if (selectedClient) {
      onClientSelect(selectedClient);
    }
  };
  console.log(clients);
  return (
    <div className="form-section">
      <h3>
        <span className="material-icons">info</span> Detalhes da OS
      </h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <select
            id="cliente"
            name="cliente"
            value={osData.cliente || ""}
            onChange={handleSelectChange}
            required
            disabled={isEditMode || loadingClients}
          >
            <option value="" disabled>
              {loadingClients ? "Carregando..." : "Selecione um cliente"}
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.nome}>
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
