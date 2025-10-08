// src/components/forms/medicao/ResistorAterramentoMedicaoForm.jsx

import React from "react";

function ResistorAterramentoMedicaoForm({ data, onDataChange }) {
  const formData = data || {};

  // Função genérica para atualizar campos simples e comunicar ao pai.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  return (
    <>
      <h3 className="form-section-title">RESISTÊNCIA DE ATERRAMENTO</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Resistência Nominal (Ω)</label>
          <input
            type="number"
            name="resistenciaNominal"
            value={formData.resistenciaNominal || ""}
            onChange={handleChange}
            className="input"
            placeholder="Ex: 10"
          />
        </div>
        <div className="form-group">
          <label>Resistência Medida (Ω)</label>
          <input
            type="number"
            step="0.01"
            name="resistenciaMedida"
            value={formData.resistenciaMedida || ""}
            onChange={handleChange}
            className="input"
            placeholder="Ex: 9.85"
          />
        </div>
        <div className="form-group">
          <label>Resistência de Isolamento (MΩ)</label>
          <input
            type="number"
            step="0.01"
            name="resistenciaIsolamento"
            value={formData.resistenciaIsolamento || ""}
            onChange={handleChange}
            className="input"
            placeholder="Ex: 5000"
          />
        </div>
      </div>

      {/* NOVA SEÇÃO ADICIONADA */}
      <h3 className="form-section-title">Condições do Ensaio</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Temperatura Ambiente (°C)</label>
          <input
            type="number"
            step="0.1"
            name="temperatura"
            value={formData.temperatura || ""}
            onChange={handleChange}
            className="input"
            placeholder="Ex: 25.5"
          />
        </div>
        <div className="form-group">
          <label>Umidade Relativa do Ar (%)</label>
          <input
            type="number"
            step="0.1"
            name="umidade"
            value={formData.umidade || ""}
            onChange={handleChange}
            className="input"
            placeholder="Ex: 60.2"
          />
        </div>
        <div className="form-group">
          <label>Frequência (Hz)</label>
          <input
            type="number"
            name="frequencia"
            value={formData.frequencia || ""}
            onChange={handleChange}
            className="input"
            placeholder="Ex: 60"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Observações</label>
        <textarea
          name="observacoes"
          rows="4"
          placeholder="Descreva quaisquer observações relevantes sobre o ensaio..."
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
    </>
  );
}

export default ResistorAterramentoMedicaoForm;
