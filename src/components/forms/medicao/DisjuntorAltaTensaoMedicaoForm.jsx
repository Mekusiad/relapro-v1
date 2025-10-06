import React from "react";

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

const initialServicosState = {
  limpezaGeral: "N/A",
  lubrificacao: "N/A",
  testesAcionamento: "N/A",
  reapertoConexoes: "N/A",
};

function DisjuntorAltaTensaoMedicaoForm({ data, onDataChange }) {
 // Os dados são lidos diretamente das props
  const formData = data || {};
  const tabelaContato = data?.tabelaContato || initialContatoState;
  const tabelaIsolamentoAberto = data?.tabelaIsolamentoAberto || initialIsolamentoAbertoState;
  const tabelaIsolamentoFechado = data?.tabelaIsolamentoFechado || initialIsolamentoFechadoState;
  const tabelaFpAberto = data?.tabelaFpAberto || initialFpAbertoState;
  const tabelaFpFechado = data?.tabelaFpFechado || initialFpFechadoState;
  const servicosData = data?.servicos || initialServicosState;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

   const handleContatoChange = (index, field, value) => {
    const updatedData = [...tabelaContato];
    updatedData[index][field] = value;
    onDataChange({ tabelaContato: updatedData });
  };

  const handleIsolamentoAbertoChange = (index, field, value) => {
    const updatedData = [...tabelaIsolamentoAberto];
    updatedData[index][field] = value;
    onDataChange({ tabelaIsolamentoAberto: updatedData });
  };

  const handleIsolamentoFechadoChange = (index, field, value) => {
    const updatedData = [...tabelaIsolamentoFechado];
    updatedData[index][field] = value;
    onDataChange({ tabelaIsolamentoFechado: updatedData });
  };

  const handleFpAbertoChange = (index, field, value) => {
    const updatedData = [...tabelaFpAberto];
    updatedData[index][field] = value;
    onDataChange({ tabelaFpAberto: updatedData });
  };

  const handleFpFechadoChange = (index, field, value) => {
    const updatedData = [...tabelaFpFechado];
    updatedData[index][field] = value;
    onDataChange({ tabelaFpFechado: updatedData });
  };

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
                      handleIsolamentoAbertoChange(index, "disjuntor", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tensao}
                    onChange={(e) =>
                     handleIsolamentoAbertoChange(index, "tensao", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.medido}
                    onChange={(e) =>
                     handleIsolamentoAbertoChange(index, "medido", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.referencia}
                    onChange={(e) =>
                    handleIsolamentoAbertoChange(index, "referencia", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tempo}
                    onChange={(e) =>
                      handleIsolamentoAbertoChange(index, "tempo", e.target.value)
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
                     handleIsolamentoFechadoChange(index, "disjuntor", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tensao}
                    onChange={(e) =>
                       handleIsolamentoFechadoChange(index, "tensao", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.medido}
                    onChange={(e) =>
                      handleIsolamentoFechadoChange(index, "medido", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.referencia}
                    onChange={(e) =>
                     handleIsolamentoFechadoChange(index, "referencia", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tempo}
                    onChange={(e) =>
                      handleIsolamentoFechadoChange(index, "tempo", e.target.value)
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

      <h3 className="form-section-title">SERVIÇOS</h3>
      <div className="servicos-list" style={{ marginBottom: "1rem" }}>
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
          <label>Lubrificação dos componentes</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="lubrificacao"
                value="sim"
                checked={servicosData.lubrificacao === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="lubrificacao"
                value="nao"
                checked={servicosData.lubrificacao === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="lubrificacao"
                value="N/A"
                checked={servicosData.lubrificacao === "N/A"}
                onChange={handleServiceChange}
              />{" "}
              N/A
            </label>
          </div>
        </div>
        <div className="servico-item">
          <label>Testes de acionamento elétricos</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="testesAcionamento"
                value="sim"
                checked={servicosData.testesAcionamento === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="testesAcionamento"
                value="nao"
                checked={servicosData.testesAcionamento === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="testesAcionamento"
                value="N/A"
                checked={servicosData.testesAcionamento === "N/A"}
                onChange={handleServiceChange}
              />{" "}
              N/A
            </label>
          </div>
        </div>
        <div className="servico-item">
          <label>Reaperto das Conexões elétricas</label>
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

export default DisjuntorAltaTensaoMedicaoForm;
