// src/components/forms/medicao/MalhaAterramentoMedicaoForm.jsx

import React from "react";

const initialServicosState = {
  servicoCaixas: "N/A",
  servicoCaptores: "N/A",
};

function MalhaAterramentoMedicaoForm({ data, onDataChange }) {
  // O estado local foi removido. Os dados vêm diretamente das props.
  const formData = data || {};
  const servicosData = data?.servicos || initialServicosState;

  // Função genérica para atualizar campos simples e comunicar ao pai.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  // Função para atualizar os rádios de serviço e comunicar ao pai.
  const handleRadioChange = (serviceName, value) => {
    const updatedServicos = { ...servicosData, [serviceName]: value };
    onDataChange({ servicos: updatedServicos });
  };

  return (
    <>
      <h3 className="form-section-title">
        Resistência da Malha de Aterramento
      </h3>
      <p className="form-section-description">
        Resistência da malha de aterramento da subestação.
      </p>
      <div className="form-group">
        <label>Valor da Resistência (Ω)</label>
        <input
          type="text"
          name="valorResistencia"
          value={formData.valorResistencia || ""}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>OBSERVAÇÕES</label>
        <textarea
          name="observacoes"
          rows="4"
          value={formData.observacoes || ""}
          onChange={handleChange}
          className="input"
        ></textarea>
      </div>
      <div className="form-group-inline-checkbox">
        <input
          type="checkbox"
          id="naoConforme"
          name="naoConforme"
          checked={formData.naoConforme || false}
          onChange={handleChange}
        />
        <label htmlFor="naoConforme">
          EQUIPAMENTO NÃO CONFORME (se houver, selecione a caixa acima e
          descreva as informações na caixa abaixo)
        </label>
      </div>
      {formData.naoConforme && (
        <div className="form-group">
          <textarea
            name="naoConformeDetalhes"
            rows="4"
            placeholder="Descreva a não conformidade..."
            value={formData.naoConformeDetalhes || ""}
            onChange={handleChange}
            className="input"
          ></textarea>
        </div>
      )}
      <h3 className="form-section-title">SERVIÇOS</h3>
      <div className="servicos-container">
        <div className="servicos-radiogroup">
          <span>Caixas de inspeção e descidas do sistema</span>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="servicoCaixas"
                value="sim"
                checked={servicosData.servicoCaixas === "sim"}
                onChange={() => handleRadioChange("servicoCaixas", "sim")}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="servicoCaixas"
                value="nao"
                checked={servicosData.servicoCaixas === "nao"}
                onChange={() => handleRadioChange("servicoCaixas", "nao")}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="servicoCaixas"
                value="N/A"
                checked={servicosData.servicoCaixas === "N/A"}
                onChange={() => handleRadioChange("servicoCaixas", "N/A")}
              />{" "}
              N/A
            </label>
          </div>
        </div>
        <div className="servicos-radiogroup">
          <span>Integridade dos captores</span>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                name="servicoCaptores"
                value="sim"
                checked={servicosData.servicoCaptores === "sim"}
                onChange={() => handleRadioChange("servicoCaptores", "sim")}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="servicoCaptores"
                value="nao"
                checked={servicosData.servicoCaptores === "nao"}
                onChange={() => handleRadioChange("servicoCaptores", "nao")}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="servicoCaptores"
                value="N/A"
                checked={servicosData.servicoCaptores === "N/A"}
                onChange={() => handleRadioChange("servicoCaptores", "N/A")}
              />{" "}
              N/A
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default MalhaAterramentoMedicaoForm;
