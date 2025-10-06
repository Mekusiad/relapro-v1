// src/components/forms/medicao/DisjuntorMediaTensaoMedicaoForm.jsx

import React from "react";

// VALORES PREDEFINIDOS - Agora servem apenas como um modelo
const initialContatoState = [
  { polo: "A", disjuntor: "Entrada - Saída", corrente: "10", medido: "", referencia: "< 120", tempo: "60" },
  { polo: "B", disjuntor: "Entrada - Saída", corrente: "10", medido: "", referencia: "< 120", tempo: "60" },
  { polo: "C", disjuntor: "Entrada - Saída", corrente: "10", medido: "", referencia: "< 120", tempo: "60" },
];

const initialIsolamentoAbertoState = [
  { polo: "A", disjuntor: "Entrada - Saída", tensao: "5000", medido: "", referencia: ">1000", tempo: "60" },
  { polo: "B", disjuntor: "Entrada - Saída", tensao: "5000", medido: "", referencia: ">1000", tempo: "60" },
  { polo: "C", disjuntor: "Entrada - Saída", tensao: "5000", medido: "", referencia: ">1000", tempo: "60" },
];

const initialIsolamentoFechadoState = [
  { polo: "A", disjuntor: "A x Massa", tensao: "5000", medido: "", referencia: ">1000", tempo: "60" },
  { polo: "B", disjuntor: "B x Massa", tensao: "5000", medido: "", referencia: ">1000", tempo: "60" },
  { polo: "C", disjuntor: "C x Massa", tensao: "5000", medido: "", referencia: ">1000", tempo: "60" },
];

const initialServicosState = {
  limpezaGeral: "N/A",
  lubrificacao: "N/A",
  testesAcionamento: "N/A",
};

// Função helper para criar uma cópia profunda (deep copy) dos dados iniciais.
// Isso garante que cada formulário tenha sua própria versão dos dados.
const getInitialState = (existingData) => ({
  ...existingData,
  tabelaContato: existingData?.tabelaContato || JSON.parse(JSON.stringify(initialContatoState)),
  tabelaIsolamentoAberto: existingData?.tabelaIsolamentoAberto || JSON.parse(JSON.stringify(initialIsolamentoAbertoState)),
  tabelaIsolamentoFechado: existingData?.tabelaIsolamentoFechado || JSON.parse(JSON.stringify(initialIsolamentoFechadoState)),
  servicos: existingData?.servicos || { ...initialServicosState },
});


function DisjuntorMediaTensaoMedicaoForm({ data, onDataChange }) {
  // Garantimos que cada formulário trabalhe com sua própria cópia dos dados.
  const formData = getInitialState(data);
  const { tabelaContato, tabelaIsolamentoAberto, tabelaIsolamentoFechado, servicos: servicosData } = formData;

  // Função genérica para atualizar campos simples, comunicando ao pai
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  // =========================================================================
  // CORREÇÃO PRINCIPAL: Atualização imutável dos dados da tabela
  // =========================================================================

  const handleContatoChange = (index, field, value) => {
    // Usamos .map() para criar um NOVO array.
    const updatedData = tabelaContato.map((row, i) => {
      if (i === index) {
        // Usamos o spread operator (...) para criar um NOVO objeto para a linha que foi alterada.
        return { ...row, [field]: value };
      }
      // Retornamos a linha original se ela não foi alterada.
      return row;
    });
    onDataChange({ tabelaContato: updatedData });
  };

  const handleIsolamentoAbertoChange = (index, field, value) => {
    const updatedData = tabelaIsolamentoAberto.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    onDataChange({ tabelaIsolamentoAberto: updatedData });
  };

  const handleIsolamentoFechadoChange = (index, field, value) => {
    const updatedData = tabelaIsolamentoFechado.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    onDataChange({ tabelaIsolamentoFechado: updatedData });
  };

  // Função para atualizar os serviços, comunicando ao pai
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    const updatedServicos = { ...servicosData, [name]: value };
    onDataChange({ servicos: updatedServicos });
  };


  return (
    <>
      {/* CAMPOS DE CONDIÇÃO ADICIONADOS */}
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

      <h3 className="form-section-title">RESISTÊNCIA DOS CONTATOS (µΩ)</h3>
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
                <td><input value={row.disjuntor || ""} onChange={(e) => handleContatoChange(index, "disjuntor", e.target.value)} className="input" /></td>
                <td><input value={row.corrente || ""} onChange={(e) => handleContatoChange(index, "corrente", e.target.value)} className="input" /></td>
                <td><input value={row.medido || ""} onChange={(e) => handleContatoChange(index, "medido", e.target.value)} className="input" /></td>
                <td><input value={row.referencia || ""} onChange={(e) => handleContatoChange(index, "referencia", e.target.value)} className="input" /></td>
                <td><input value={row.tempo || ""} onChange={(e) => handleContatoChange(index, "tempo", e.target.value)} className="input" /></td>
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
                        <td><input value={row.disjuntor || ""} onChange={(e) => handleIsolamentoAbertoChange(index, "disjuntor", e.target.value)} className="input" /></td>
                        <td><input value={row.tensao || ""} onChange={(e) => handleIsolamentoAbertoChange(index, "tensao", e.target.value)} className="input" /></td>
                        <td><input value={row.medido || ""} onChange={(e) => handleIsolamentoAbertoChange(index, "medido", e.target.value)} className="input" /></td>
                        <td><input value={row.referencia || ""} onChange={(e) => handleIsolamentoAbertoChange(index, "referencia", e.target.value)} className="input" /></td>
                        <td><input value={row.tempo || ""} onChange={(e) => handleIsolamentoAbertoChange(index, "tempo", e.target.value)} className="input" /></td>
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
                        <td><input value={row.disjuntor || ""} onChange={(e) => handleIsolamentoFechadoChange(index, "disjuntor", e.target.value)} className="input" /></td>
                        <td><input value={row.tensao || ""} onChange={(e) => handleIsolamentoFechadoChange(index, "tensao", e.target.value)} className="input" /></td>
                        <td><input value={row.medido || ""} onChange={(e) => handleIsolamentoFechadoChange(index, "medido", e.target.value)} className="input" /></td>
                        <td><input value={row.referencia || ""} onChange={(e) => handleIsolamentoFechadoChange(index, "referencia", e.target.value)} className="input" /></td>
                        <td><input value={row.tempo || ""} onChange={(e) => handleIsolamentoFechadoChange(index, "tempo", e.target.value)} className="input" /></td>
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

export default DisjuntorMediaTensaoMedicaoForm;