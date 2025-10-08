// src/components/forms/medicao/DisjuntorAltaTensaoMedicaoForm.jsx

import React, { useMemo } from "react";

// Estados iniciais para as tabelas com os valores predefinidos
const initialContatoState = [
  {
    polo: "A",
    disjuntor: "Entrada - Saída",
    corrente: "10",
    medido: "",
    referencia: "≤120",
    tempo: "60",
  },
  {
    polo: "B",
    disjuntor: "Entrada - Saída",
    corrente: "10",
    medido: "",
    referencia: "≤120",
    tempo: "60",
  },
  {
    polo: "C",
    disjuntor: "Entrada - Saída",
    corrente: "10",
    medido: "",
    referencia: "≤120",
    tempo: "60",
  },
];

const initialIsolamentoAbertoState = [
  {
    polo: "A",
    disjuntor: "Entrada - Saída",
    tensao: "5000",
    medido: "",
    referencia: ">1000",
    tempo: "60",
  },
  {
    polo: "B",
    disjuntor: "Entrada - Saída",
    tensao: "5000",
    medido: "",
    referencia: ">1000",
    tempo: "60",
  },
  {
    polo: "C",
    disjuntor: "Entrada - Saída",
    tensao: "5000",
    medido: "",
    referencia: ">1000",
    tempo: "60",
  },
];

const initialIsolamentoFechadoState = [
  {
    polo: "A",
    disjuntor: "A x Massa",
    tensao: "5000",
    medido: "",
    referencia: ">1000",
    tempo: "60",
  },
  {
    polo: "B",
    disjuntor: "B x Massa",
    tensao: "5000",
    medido: "",
    referencia: ">1000",
    tempo: "60",
  },
  {
    polo: "C",
    disjuntor: "C x Massa",
    tensao: "5000",
    medido: "",
    referencia: ">1000",
    tempo: "60",
  },
];

const initialFpAbertoState = [
  {
    polo: "A",
    hv: "Entrada",
    lvr: "Saída",
    ch: "UST",
    ma: "",
    watts: "0",
    fpMed: "",
    fpCorr: "20",
    cap: "",
  },
  {
    polo: "B",
    hv: "Entrada",
    lvr: "Saída",
    ch: "UST",
    ma: "",
    watts: "0",
    fpMed: "",
    fpCorr: "20",
    cap: "",
  },
  {
    polo: "C",
    hv: "Entrada",
    lvr: "Saída",
    ch: "UST",
    ma: "",
    watts: "0",
    fpMed: "",
    fpCorr: "20",
    cap: "",
  },
];

const initialFpFechadoState = [
  {
    polo: "A",
    hv: "Entrada",
    lvr: "Massa",
    ch: "GSTg",
    ma: "",
    watts: "0",
    fpMed: "",
    fpCorr: "20",
    cap: "",
  },
  {
    polo: "B",
    hv: "Entrada",
    lvr: "Massa",
    ch: "GSTg",
    ma: "",
    watts: "0",
    fpMed: "",
    fpCorr: "20",
    cap: "",
  },
  {
    polo: "C",
    hv: "Entrada",
    lvr: "Massa",
    ch: "GSTg",
    ma: "",
    watts: "0",
    fpMed: "",
    fpCorr: "20",
    cap: "",
  },
];

// ==================================================================
// ALTERAÇÃO 1: O estado inicial dos serviços agora é um array de objetos
// ==================================================================
const defaultServicos = [
  { label: "Limpeza geral", valor: "N/A" },
  { label: "Lubrificação dos componentes", valor: "N/A" },
  { label: "Testes de acionamento elétricos", valor: "N/A" },
  { label: "Reaperto das Conexões elétricas", valor: "N/A" },
];

function DisjuntorAltaTensaoMedicaoForm({ data, onDataChange }) {
  const formData = data || {};
  const tabelaContato = useMemo(
    () => data?.tabelaContato || initialContatoState,
    [data?.tabelaContato]
  );
  const tabelaIsolamentoAberto = useMemo(
    () => data?.tabelaIsolamentoAberto || initialIsolamentoAbertoState,
    [data?.tabelaIsolamentoAberto]
  );
  const tabelaIsolamentoFechado = useMemo(
    () => data?.tabelaIsolamentoFechado || initialIsolamentoFechadoState,
    [data?.tabelaIsolamentoFechado]
  );
  const tabelaFpAberto = useMemo(
    () => data?.tabelaFpAberto || initialFpAbertoState,
    [data?.tabelaFpAberto]
  );
  const tabelaFpFechado = useMemo(
    () => data?.tabelaFpFechado || initialFpFechadoState,
    [data?.tabelaFpFechado]
  );

  // O estado dos serviços agora usa o novo array como padrão
  const servicos = useMemo(
    () => data?.servicos || defaultServicos,
    [data?.servicos]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  const handleTableChange = (setter, tableKey, index, field, value) => {
    const updatedData = [...setter];
    updatedData[index][field] = value;
    onDataChange({ [tableKey]: updatedData });
  };

  // Handlers específicos para cada tabela para clareza
  const handleContatoChange = (index, field, value) =>
    handleTableChange(tabelaContato, "tabelaContato", index, field, value);
  const handleIsolamentoAbertoChange = (index, field, value) =>
    handleTableChange(
      tabelaIsolamentoAberto,
      "tabelaIsolamentoAberto",
      index,
      field,
      value
    );
  const handleIsolamentoFechadoChange = (index, field, value) =>
    handleTableChange(
      tabelaIsolamentoFechado,
      "tabelaIsolamentoFechado",
      index,
      field,
      value
    );
  const handleFpAbertoChange = (index, field, value) =>
    handleTableChange(tabelaFpAberto, "tabelaFpAberto", index, field, value);
  const handleFpFechadoChange = (index, field, value) =>
    handleTableChange(tabelaFpFechado, "tabelaFpFechado", index, field, value);

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

      <h3 className="form-section-title">RESISTÊNCIA DE CONTATO (µΩ)</h3>
      <p className="table-subtitle">Disjuntor Fechado</p>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Polos</th>
              <th>Disjuntor Fechado</th>
              <th>Corrente Aplicada (A)</th>
              <th>Valores Medidos (µΩ)</th>
              <th>Valores de Referência (µΩ)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {tabelaContato.map((row, index) => (
              <tr key={index}>
                <td>{row.polo}</td>
                <td>
                  <input
                    value={row.disjuntor}
                    onChange={(e) =>
                      handleContatoChange(index, "disjuntor", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.corrente}
                    onChange={(e) =>
                      handleContatoChange(index, "corrente", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.medido}
                    onChange={(e) =>
                      handleContatoChange(index, "medido", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.referencia}
                    onChange={(e) =>
                      handleContatoChange(index, "referencia", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tempo}
                    onChange={(e) =>
                      handleContatoChange(index, "tempo", e.target.value)
                    }
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="form-section-title">RESISTÊNCIA DE ISOLAMENTO (MΩ)</h3>
      <p className="table-subtitle">
        Disjuntor Aberto (Isolamento entre contatos)
      </p>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Polos</th>
              <th>Disjuntor Aberto</th>
              <th>Tensão Aplicada (Vcc)</th>
              <th>Valores Medidos (MΩ)</th>
              <th>Valores de Referência (MΩ)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {tabelaIsolamentoAberto.map((row, index) => (
              <tr key={index}>
                <td>{row.polo}</td>
                <td>
                  <input
                    value={row.disjuntor}
                    onChange={(e) =>
                      handleIsolamentoAbertoChange(
                        index,
                        "disjuntor",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tensao}
                    onChange={(e) =>
                      handleIsolamentoAbertoChange(
                        index,
                        "tensao",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.medido}
                    onChange={(e) =>
                      handleIsolamentoAbertoChange(
                        index,
                        "medido",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.referencia}
                    onChange={(e) =>
                      handleIsolamentoAbertoChange(
                        index,
                        "referencia",
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
                      handleIsolamentoAbertoChange(
                        index,
                        "tempo",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-subtitle">Disjuntor Fechado (Polos x Massa)</p>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Polos</th>
              <th>Disjuntor Fechado</th>
              <th>Tensão Aplicada (Vcc)</th>
              <th>Valores Medidos (MΩ)</th>
              <th>Valores de Referência (MΩ)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {tabelaIsolamentoFechado.map((row, index) => (
              <tr key={index}>
                <td>{row.polo}</td>
                <td>
                  <input
                    value={row.disjuntor}
                    onChange={(e) =>
                      handleIsolamentoFechadoChange(
                        index,
                        "disjuntor",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tensao}
                    onChange={(e) =>
                      handleIsolamentoFechadoChange(
                        index,
                        "tensao",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.medido}
                    onChange={(e) =>
                      handleIsolamentoFechadoChange(
                        index,
                        "medido",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.referencia}
                    onChange={(e) =>
                      handleIsolamentoFechadoChange(
                        index,
                        "referencia",
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
                      handleIsolamentoFechadoChange(
                        index,
                        "tempo",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="form-section-title">
        FATOR DE POTÊNCIA DE ISOLAMENTO A 10KV – DISJUNTOR ABERTO
      </h3>
      <div className="table-container">
        <table className="medicao-table complex-header">
          <thead>
            <tr>
              <th rowSpan="2">Polos</th>
              <th colSpan="2">Configuração</th>
              <th rowSpan="2">CH Posição</th>
              <th rowSpan="2">mA</th>
              <th rowSpan="2">Watts</th>
              <th colSpan="2">FP%</th>
              <th rowSpan="2">Capacitância (pF)</th>
            </tr>
            <tr>
              <th>HV</th>
              <th>LV-R</th>
              <th>Med.</th>
              <th>Corr. 20°C</th>
            </tr>
          </thead>
          <tbody>
            {tabelaFpAberto.map((row, index) => (
              <tr key={index}>
                <td>{row.polo}</td>
                <td>
                  <input
                    value={row.hv}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "hv", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.lvr}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "lvr", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.ch}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "ch", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.ma}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "ma", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.watts}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "watts", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.fpMed}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "fpMed", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.fpCorr}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "fpCorr", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.cap}
                    onChange={(e) =>
                      handleFpAbertoChange(index, "cap", e.target.value)
                    }
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="form-section-title">
        FATOR DE POTÊNCIA DE ISOLAMENTO A 10KV – DISJUNTOR FECHADO
      </h3>
      <div className="table-container">
        <table className="medicao-table complex-header">
          <thead>
            <tr>
              <th rowSpan="2">Polos</th>
              <th colSpan="2">Configuração</th>
              <th rowSpan="2">CH Posição</th>
              <th rowSpan="2">mA</th>
              <th rowSpan="2">Watts</th>
              <th colSpan="2">FP%</th>
              <th rowSpan="2">Capacitância (pF)</th>
            </tr>
            <tr>
              <th>HV</th>
              <th>LV-R</th>
              <th>Med.</th>
              <th>Corr. 20°C</th>
            </tr>
          </thead>
          <tbody>
            {tabelaFpFechado.map((row, index) => (
              <tr key={index}>
                <td>{row.polo}</td>
                <td>
                  <input
                    value={row.hv}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "hv", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.lvr}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "lvr", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.ch}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "ch", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.ma}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "ma", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.watts}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "watts", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.fpMed}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "fpMed", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.fpCorr}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "fpCorr", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.cap}
                    onChange={(e) =>
                      handleFpFechadoChange(index, "cap", e.target.value)
                    }
                    className="input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================================== */}
      {/* ALTERAÇÃO 3: O JSX foi atualizado para renderizar o array de serviços */}
      {/* ================================================================== */}
      <div className="form-section-sm" style={{ marginTop: "2rem" }}>
        <h4 className="section-title">SERVIÇOS</h4>
        <div className="servicos-list">
          {servicos.map((servico, index) => (
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

export default DisjuntorAltaTensaoMedicaoForm;
