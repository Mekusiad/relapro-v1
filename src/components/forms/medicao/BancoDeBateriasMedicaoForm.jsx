// src/components/forms/medicao/BancoDeBateriasMedicaoForm.jsx
import React, { useMemo } from "react";
import Button from "../../ui/Button.jsx";

// ==================================================================
// ALTERAÇÃO 1: O estado inicial dos serviços agora é um array de objetos
// ==================================================================
const defaultServicos = [
  {
    label: "Inspeção visual geral de cada célula do banco de baterias",
    valor: "N/A",
  },
  { label: "Realizar limpeza a seco do banco de baterias", valor: "N/A" },
  { label: "Reaperto de todas as conexões", valor: "N/A" },
  {
    label:
      "Inspeção da fiação e parafusos quanto à corrosão e contato elétrico",
    valor: "N/A",
  },
];

function BancoDeBateriasMedicaoForm({ data, onDataChange }) {
  const formData = data || {};
  const tabelaData = useMemo(() => data?.tabelaData || [], [data?.tabelaData]);

  // O estado dos serviços agora usa o novo array como padrão
  const servicos = useMemo(
    () => data?.servicos || defaultServicos,
    [data?.servicos]
  );

  const handleGerarTabela = () => {
    const novaQuantidade = parseInt(data.numBaterias, 10);
    if (novaQuantidade > 0 && novaQuantidade <= 100) {
      const tabelaAntiga = tabelaData || [];
      const novaTabela = Array.from({ length: novaQuantidade }, (_, i) => ({
        id: i + 1,
        tensao: tabelaAntiga[i]?.tensao || "",
      }));
      onDataChange({ tabelaData: novaTabela });
    }
  };

  const handleTableChange = (index, value) => {
    const updatedData = [...tabelaData];
    updatedData[index].tensao = value;
    onDataChange({ tabelaData: updatedData });
  };

  const totalTensao = useMemo(() => {
    return tabelaData
      .reduce(
        (sum, row) =>
          sum + (parseFloat(String(row.tensao).replace(",", ".")) || 0),
        0
      )
      .toFixed(2);
  }, [tabelaData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  // ==================================================================
  // ALTERAÇÃO 2: O handler de serviços foi atualizado para trabalhar com o array
  // ==================================================================
  const handleServiceChange = (index, value) => {
    const updatedServicos = [...servicos];
    updatedServicos[index] = { ...updatedServicos[index], valor: value };
    onDataChange({ servicos: updatedServicos });
  };

  return (
    <>
      <h3 className="form-section-title">Condições do Ensaio</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Temperatura de Ensaio (°C)</label>
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

      <h3 className="form-section-title">Ensaio de Tensão</h3>
      <div className="gerar-tabela-section">
        <div className="form-group">
          <label>Quantidade de Baterias</label>
          <input
            type="number"
            name="numBaterias"
            value={formData.numBaterias || 10}
            onChange={handleChange}
            className="input"
            min="1"
            max="100"
          />
        </div>
        <Button type="button" variant="secondary" onClick={handleGerarTabela}>
          Gerar Tabela
        </Button>
      </div>

      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Bateria N°</th>
              <th>Tensão (Vcc)</th>
            </tr>
          </thead>
          <tbody>
            {tabelaData.map((row, index) => (
              <tr key={row.id}>
                <td>Bateria N° {row.id}</td>
                <td>
                  <input
                    value={row.tensao}
                    onChange={(e) => handleTableChange(index, e.target.value)}
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>{totalTensao}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="form-section-sm" style={{ marginTop: "2rem" }}>
        <h4 className="section-title">SERVIÇOS</h4>
        <div className="servicos-list">
          {servicos?.map((servico, index) => (
            <div className="servico-item" key={index}>
              <label>{servico.label}</label>
              <div className="servico-options">
                <label>
                  <input
                    type="radio"
                    name={`servico_${index}`}
                    value="SIM"
                    checked={servico.valor === "SIM"}
                    onChange={() => handleServiceChange(index, "SIM")}
                  />{" "}
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name={`servico_${index}`}
                    value="NAO"
                    checked={servico.valor === "NAO"}
                    onChange={() => handleServiceChange(index, "NAO")}
                  />{" "}
                  Não
                </label>
                <label>
                  <input
                    type="radio"
                    name={`servico_${index}`}
                    value="N/A"
                    checked={servico.valor === "N/A"}
                    onChange={() => handleServiceChange(index, "N/A")}
                  />{" "}
                  N/A
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>OBSERVAÇÕES</label>
        <textarea
          name="observacoes"
          rows="4"
          placeholder="Resultados considerados satisfatórios."
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

export default BancoDeBateriasMedicaoForm;
