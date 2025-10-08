import React from "react";

const initialContatoState = [
  {
    polo: "A",
    condicao: "Entrada - Saída",
    corrente: "10",
    valorMedido: "",
    valorReferencia: "≤300",
    tempo: "60",
  },
  {
    polo: "B",
    condicao: "Entrada - Saída",
    corrente: "10",
    valorMedido: "",
    valorReferencia: "≤300",
    tempo: "60",
  },
  {
    polo: "C",
    condicao: "Entrada - Saída",
    corrente: "10",
    valorMedido: "",
    valorReferencia: "≤300",
    tempo: "60",
  },
];

const initialIsolamentoState = [
  {
    polo: "A",
    condicao: "A x Massa",
    tensaoEnsaio: "10",
    valorMedido: "",
    valorReferencia: ">1000",
    tempo: "60",
  },
  {
    polo: "B",
    condicao: "B x Massa",
    tensaoEnsaio: "10",
    valorMedido: "",
    valorReferencia: ">1000",
    tempo: "60",
  },
  {
    polo: "C",
    condicao: "C x Massa",
    tensaoEnsaio: "10",
    valorMedido: "",
    valorReferencia: ">1000",
    tempo: "60",
  },
];

const initialServicosState = {
  limpezaGeral: "N/A",
  alinhamentoContatos: "N/A",
  testesAcionamento: "N/A",
  lubrificacaoReaperto: "N/A",
};

function ChaveSeccionadoraAltaTensaoMedicaoForm({ data, onDataChange }) {
  const formData = data || {};
  const contatoData = data?.resistenciaContato || initialContatoState;
  const isolamentoData = data?.resistenciaIsolamento || initialIsolamentoState;
  const servicosData = data?.servicos || initialServicosState;

  // Função genérica para atualizar campos simples
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  // Funções para atualizar as tabelas, agora notificando o componente pai
  const handleContatoChange = (index, field, value) => {
    const updatedData = [...contatoData];
    updatedData[index][field] = value;
    onDataChange({ resistenciaContato: updatedData });
  };

  const handleIsolamentoChange = (index, field, value) => {
    const updatedData = [...isolamentoData];
    updatedData[index][field] = value;
    onDataChange({ resistenciaIsolamento: updatedData });
  };

  // Função para atualizar os serviços, notificando o pai
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

      <h3 className="form-section-title">Resistência de Contato (µΩ)</h3>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Polos</th>
              <th>Condição</th>
              <th>Corrente (A)</th>
              <th>Medido (µΩ)</th>
              <th>Referência (µΩ)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {contatoData.map((row, index) => (
              <tr key={index}>
                <td>{row.polo}</td>
                <td>{row.condicao}</td>
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
                    value={row.valorMedido}
                    onChange={(e) =>
                      handleContatoChange(index, "valorMedido", e.target.value)
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.valorReferencia}
                    onChange={(e) =>
                      handleContatoChange(
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

      <h3 className="form-section-title">Resistência de Isolamento (MΩ)</h3>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Polos</th>
              <th>Condição</th>
              <th>Tensão Ensaio (kV)</th>
              <th>Medido (MΩ)</th>
              <th>Referência (MΩ)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {isolamentoData.map((row, index) => (
              <tr key={index}>
                <td>{row.polo}</td>
                <td>{row.condicao}</td>
                <td>
                  <input
                    value={row.tensaoEnsaio}
                    onChange={(e) =>
                      handleIsolamentoChange(
                        index,
                        "tensaoEnsaio",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.valorMedido}
                    onChange={(e) =>
                      handleIsolamentoChange(
                        index,
                        "valorMedido",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.valorReferencia}
                    onChange={(e) =>
                      handleIsolamentoChange(
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
                      handleIsolamentoChange(index, "tempo", e.target.value)
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
          <label>Alinhamento dos contatos de abertura e fechamento</label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="alinhamentoContatos"
                value="sim"
                checked={servicosData.alinhamentoContatos === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="alinhamentoContatos"
                value="nao"
                checked={servicosData.alinhamentoContatos === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="alinhamentoContatos"
                value="N/A"
                checked={servicosData.alinhamentoContatos === "N/A"}
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
          <label>
            Lubrificação dos mecanismos e reaperto das Conexões elétricas
          </label>
          <div className="servico-options">
            <label>
              <input
                type="radio"
                name="lubrificacaoReaperto"
                value="sim"
                checked={servicosData.lubrificacaoReaperto === "sim"}
                onChange={handleServiceChange}
              />{" "}
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="lubrificacaoReaperto"
                value="nao"
                checked={servicosData.lubrificacaoReaperto === "nao"}
                onChange={handleServiceChange}
              />{" "}
              Não
            </label>
            <label>
              <input
                type="radio"
                name="lubrificacaoReaperto"
                value="N/A"
                checked={servicosData.lubrificacaoReaperto === "N/A"}
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

export default ChaveSeccionadoraAltaTensaoMedicaoForm;
