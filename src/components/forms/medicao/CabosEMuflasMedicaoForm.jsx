// src/components/forms/medicao/CabosEMuflasMedicaoForm.jsx

import React from "react";

// VALORES PREDEFINIDOS - Agora servem apenas como um modelo
const initialIsolamentoState = [
  {
    fase: "A",
    condicao: "A x Massa",
    tensaoEnsaio: "5000",
    valorMedido: "",
    valorReferencia: ">1000",
    tempo: "60",
  },
  {
    fase: "B",
    condicao: "B x Massa",
    tensaoEnsaio: "5000",
    valorMedido: "",
    valorReferencia: ">1000",
    tempo: "60",
  },
  {
    fase: "C",
    condicao: "C x Massa",
    tensaoEnsaio: "5000",
    valorMedido: "",
    valorReferencia: ">1000",
    tempo: "60",
  },
  {
    fase: "RESERVA",
    condicao: "RESERVA x Massa",
    tensaoEnsaio: "5000",
    valorMedido: "",
    valorReferencia: ">1000",
    tempo: "60",
  },
];

const initialServicosState = {
  inspecaoVisual: "N/A",
  limpezaGeral: "N/A",
  reapertoConexao: "N/A",
};

// Função helper para criar uma cópia profunda (deep copy) dos dados iniciais.
const getInitialState = (existingData) => ({
  ...existingData,
  resistenciaIsolamento:
    existingData?.resistenciaIsolamento ||
    JSON.parse(JSON.stringify(initialIsolamentoState)),
  servicos: existingData?.servicos || { ...initialServicosState },
});

function CabosEMuflasMedicaoForm({ data, onDataChange }) {
  // Garantimos que cada formulário trabalhe com sua própria cópia dos dados.
  const formData = getInitialState(data);
  const { resistenciaIsolamento: isolamentoData, servicos: servicosData } =
    formData;

  // Função geral para atualizar campos simples
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  // =========================================================================
  // CORREÇÃO PRINCIPAL: Atualização imutável dos dados da tabela
  // =========================================================================
  const handleTableChange = (index, field, value) => {
    const updatedData = isolamentoData.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    onDataChange({ resistenciaIsolamento: updatedData });
  };

  // Função para atualizar os campos de serviços
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    const updatedServicos = { ...servicosData, [name]: value };
    onDataChange({ servicos: updatedServicos });
  };

  return (
    <>
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

      <h3 className="form-section-title">Resistência do Isolamento (MΩ)</h3>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>FASE</th>
              <th>Condição de Medição</th>
              <th>Tensão Ensaio Vcc</th>
              <th>Valores Medidos</th>
              <th>Valores de Referência</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {isolamentoData.map((row, index) => (
              <tr key={index}>
                <td>{row.fase}</td>
                <td>{row.condicao}</td>
                <td>
                  <input
                    value={row.tensaoEnsaio}
                    onChange={(e) =>
                      handleTableChange(index, "tensaoEnsaio", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.valorMedido}
                    onChange={(e) =>
                      handleTableChange(index, "valorMedido", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.valorReferencia}
                    onChange={(e) =>
                      handleTableChange(
                        index,
                        "valorReferencia",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tempo}
                    onChange={(e) =>
                      handleTableChange(index, "tempo", e.target.value)
                    }
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SEÇÃO DE SERVIços ADICIONADA */}
      <h3 className="form-section-title">SERVIÇOS</h3>
      <div className="servicos-list" style={{ marginBottom: "2rem" }}>
        <div className="servico-item">
          <label>Inspeção visual</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="inspecaoVisual"
                value="sim"
                checked={servicosData.inspecaoVisual === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="inspecaoVisual"
                value="nao"
                checked={servicosData.inspecaoVisual === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="inspecaoVisual"
                value="N/A"
                checked={servicosData.inspecaoVisual === "N/A"}
                onChange={handleServiceChange}
              />{" "}
              N/A
            </label>
          </div>
        </div>
        <div className="servico-item">
          <label>Limpeza geral</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="limpezaGeral"
                value="sim"
                checked={servicosData.limpezaGeral === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="limpezaGeral"
                value="nao"
                checked={servicosData.limpezaGeral === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="limpezaGeral"
                value="N/A"
                checked={servicosData.limpezaGeral === "N/A"}
                onChange={handleServiceChange}
              />{" "}
              N/A
            </label>
          </div>
        </div>
        <div className="servico-item">
          <label>Reaperto, conexão da blindagem ao aterramento</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="reapertoConexao"
                value="sim"
                checked={servicosData.reapertoConexao === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="reapertoConexao"
                value="nao"
                checked={servicosData.reapertoConexao === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="reapertoConexao"
                value="N/A"
                checked={servicosData.reapertoConexao === "N/A"}
                onChange={handleServiceChange}
              />{" "}
              N/A
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>OBSERVAÇÕES</label>
        <textarea
          name="observacoes"
          rows="4"
          placeholder="Resultados dos ensaios considerados satisfatórios."
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
          EQUIPAMENTO NÃO CONFORME (se houver, selecione a caixa e descreva as
          informações na caixa abaixo)
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

export default CabosEMuflasMedicaoForm;
