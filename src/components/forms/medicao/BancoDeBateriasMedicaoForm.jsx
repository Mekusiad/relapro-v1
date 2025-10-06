// src/components/forms/medicao/BancoDeBateriasMedicaoForm.jsx
import React, { useMemo } from "react";
import Button from "../../ui/Button.jsx";

// Estado inicial para a nova seção de serviços
const initialServicosState = {
  inspecaoVisual: "N/A",
  limpezaSeco: "N/A",
  reapertoConexoes: "N/A",
  inspecaoFios: "N/A",
};

function BancoDeBateriasMedicaoForm({ data, onDataChange }) {
   const formData = data || {};
  
  // CORREÇÃO APLICADA AQUI:
  // Envolvemos a inicialização em useMemo para garantir que 'tabelaData'
  // tenha uma referência estável, evitando re-renderizações desnecessárias.
  const tabelaData = useMemo(() => data?.tabelaData || [], [data?.tabelaData]);
  
  // Boa prática: Aplicamos a mesma lógica para 'servicosData'
  const servicosData = useMemo(() => data?.servicos || initialServicosState, [data?.servicos]);

  const handleGerarTabela = () => {
    const novaQuantidade = parseInt(data.numBaterias, 10);

    if (novaQuantidade > 0 && novaQuantidade <= 100) {
      const tabelaAntiga = tabelaData || [];
      const novaTabela = Array.from({ length: novaQuantidade }, (_, i) => {
        // Se já existe uma bateria nesta posição, mantém os seus dados.
        // Senão, cria uma nova com tensão vazia.
        return {
          id: i + 1,
          tensao: tabelaAntiga[i]?.tensao || "",
        };
      });
      // Comunica a nova tabela (com os dados preservados) para o componente pai
      onDataChange({ tabelaData: novaTabela });
    }
  };

  const handleTableChange = (index, value) => {
    const updatedData = [...tabelaData];
    updatedData[index].tensao = value;
    // Comunica a tabela atualizada para o pai
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
    // Comunica a alteração de um campo simples para o pai
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

    const handleServiceChange = (e) => {
        const { name, value } = e.target;
        // Comunica a alteração nos serviços para o pai
        const updatedServicos = { ...servicosData, [name]: value };
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
            name="numBaterias" // Adicionado o 'name' para o handleChange funcionar
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

      <h3 className="form-section-title">SERVIÇOS</h3>
      <div className="servicos-list" style={{ marginBottom: "1rem" }}>
        <div className="servico-item">
          <label>
            Inspeção visual geral de cada célula do banco de baterias
          </label>
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
          <label>Realizar limpeza a seco do banco de baterias</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="limpezaSeco"
                value="sim"
                checked={servicosData.limpezaSeco === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="limpezaSeco"
                value="nao"
                checked={servicosData.limpezaSeco === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="limpezaSeco"
                value="N/A"
                checked={servicosData.limpezaSeco === "N/A"}
                onChange={handleServiceChange}
              />{" "}
              N/A
            </label>
          </div>
        </div>
        <div className="servico-item">
          <label>Reaperto de todas as conexões</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="reapertoConexoes"
                value="sim"
                checked={servicosData.reapertoConexoes === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="reapertoConexoes"
                value="nao"
                checked={servicosData.reapertoConexoes === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="reapertoConexoes"
                value="N/A"
                checked={servicosData.reapertoConexoes === "N/A"}
                onChange={handleServiceChange}
              />{" "}
              N/A
            </label>
          </div>
        </div>
        <div className="servico-item">
          <label>
            Inspeção da fiação e parafusos quanto à corrosão e contato elétrico
          </label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="inspecaoFios"
                value="sim"
                checked={servicosData.inspecaoFios === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="inspecaoFios"
                value="nao"
                checked={servicosData.inspecaoFios === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="inspecaoFios"
                value="N/A"
                checked={servicosData.inspecaoFios === "N/A"}
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
          EQUIPAMENTO NÃO CONFORME (se houver, selecione a caixa e
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

export default BancoDeBateriasMedicaoForm;

