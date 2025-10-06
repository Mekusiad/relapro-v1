// src/components/forms/medicao/TransformadorMediaTensaoMedicaoForm.jsx

import React from "react";
import Button from "../../ui/Button.jsx";

import { Plus, Trash2 } from "lucide-react";

// Funções e constantes para inicializar os estados das tabelas
const createInitialRows = (count, rowFactory) =>
  Array.from({ length: count }, (_, i) => rowFactory(i));

const defaultServicos = [
  { label: "Limpeza dos isoladores e Pintura", valor: "N/A" },
  { label: "Aterramento do Trafo", valor: "N/A" },
  { label: "Conexões, terminais e reaperto", valor: "N/A" },
  { label: "Complemento do nível do óleo, se necessário", valor: "N/A" },
];

function TransformadorMediaTensaoMedicaoForm({ data, onDataChange }) {
  // Os dados são lidos diretamente das props, sem estado local
  const formData = data || {};
  const relacaoData = data?.relacaoData || createInitialRows(1, () => ({ id: Date.now() }));
  const resistenciaAT = data?.resistenciaAT || createInitialRows(1, () => ({ id: Date.now() }));
  const resistenciaBT = data?.resistenciaBT || createInitialRows(1, () => ({ id: Date.now() }));
  const resistenciaIsolamento = data?.resistenciaIsolamento || createInitialRows(3, (i) => ({ id: i, terminais: ["AT x BT", "AT x MASSA (BT)", "BT x MASSA (AT)"][i] }));
  const servicos = data?.servicos || defaultServicos;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  const handleRelacaoChange = (index, field, value) => {
    const updatedData = [...relacaoData];
    updatedData[index][field] = value;
    onDataChange({ relacaoData: updatedData });
  };

  const handleResistenciaATChange = (index, field, value) => {
    const updatedData = [...resistenciaAT];
    updatedData[index][field] = value;
    onDataChange({ resistenciaAT: updatedData });
  };

  const handleResistenciaBTChange = (index, field, value) => {
    const updatedData = [...resistenciaBT];
    updatedData[index][field] = value;
    onDataChange({ resistenciaBT: updatedData });
  };

  
  const handleIsolamentoChange = (index, field, value) => {
    const updatedData = [...resistenciaIsolamento];
    updatedData[index][field] = value;
    onDataChange({ resistenciaIsolamento: updatedData });
  };

    const handleServiceChange = (index, value) => {
    const updatedServicos = [...servicos];
    updatedServicos[index] = { ...updatedServicos[index], valor: value };
    onDataChange({ servicos: updatedServicos });
  };

  const addRow = (tableName) => {
    const currentTable = data[tableName] || [];
    const updatedTable = [...currentTable, { id: Date.now() }];
    onDataChange({ [tableName]: updatedTable });
  };

  const removeRow = (tableName, id) => {
    const currentTable = data[tableName] || [];
    const updatedTable = currentTable.filter((row) => row.id !== id);
    onDataChange({ [tableName]: updatedTable });
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

      <h3 className="form-section-title">RELAÇÃO DE TRANSFORMAÇÃO</h3>
      <div className="table-container dynamic-table">
        <div className="table-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => addRow("relacaoData")}
            size="sm"
          >
            <Plus size={16} /> Adicionar Tap
          </Button>
        </div>
        <table
          className="medicao-table complex-header"
          style={{ marginTop: "1rem" }}
        >
          <thead>
            <tr>
              <th colSpan="2">Tap. Comutador</th>
              <th colSpan="2">Tensões (V)</th>
              <th rowSpan="2">Relação Calculada (AT/BT*√3)</th>
              <th colSpan="3">Relação Medida</th>
              <th rowSpan="2" className="actions-column">
                Ações
              </th>
            </tr>
            <tr>
              <th>AT</th>
              <th>BT</th>
              <th>AT</th>
              <th>BT</th>
              <th>H1-H3 / X1-X0</th>
              <th>H2-H1 / X2-X0</th>
              <th>H3-H2 / X3-X0</th>
            </tr>
          </thead>
          <tbody>
            {relacaoData.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="input"
                    value={row.tap_comutador_at || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "tap_comutador_at",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.tap_comutador_bt || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "tap_comutador_bt",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.tensao_v_at || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "tensao_v_at",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.tensao_v_bt || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "tensao_v_bt",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.rel_calc || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "rel_calc",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.rel_med_h1h3x1x0 || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "rel_med_h1h3x1x0",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.rel_med_h2h1x2x0 || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "rel_med_h2h1x2x0",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.rel_med_h3h2x3x0 || ""}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "rel_med_h3h2x3x0",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <Button
                    type="button"
                    variant="icon-danger"
                    size="sm"
                    onClick={() => removeRow("relacaoData", row.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="form-section-title">
        RESISTÊNCIA ÔHMICA DOS ENROLAMENTOS DE AT (Ω)
      </h3>
      <div className="table-container dynamic-table">
        <div className="table-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => addRow("resistenciaAT")}
            size="sm"
          >
            <Plus size={16} /> Adicionar Tap
          </Button>
        </div>
        <table className="medicao-table" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Tap Comutador</th>
              <th>Tensão AT (V)</th>
              <th>H1-H3</th>
              <th>H2-H1</th>
              <th>H3-H2</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {resistenciaAT.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="input"
                    value={row.tap_comutador || ""}
                    onChange={(e) =>
                      handleResistenciaATChange(
                        index,
                        "tap_comutador",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.tensao_at || ""}
                    onChange={(e) =>
                      handleResistenciaATChange(
                        index,
                        "tensao_at",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.h1h3 || ""}
                    onChange={(e) =>
                      handleResistenciaATChange(
                        index,
                        "h1h3",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.h2h1 || ""}
                    onChange={(e) =>
                      handleResistenciaATChange(
                        index,
                        "h2h1",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.h3h2 || ""}
                    onChange={(e) =>
                      handleResistenciaATChange(
                        index,
                        "h3h2",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <Button
                    type="button"
                    variant="icon-danger"
                    size="sm"
                    onClick={() => removeRow("resistenciaAT", row.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="form-section-title">
        RESISTÊNCIA ÔHMICA DOS ENROLAMENTOS DE BT (mΩ)
      </h3>
      <div className="table-container dynamic-table">
        <div className="table-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => addRow("resistenciaBT")}
            size="sm"
          >
            <Plus size={16} /> Adicionar Tap
          </Button>
        </div>
        <table className="medicao-table" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Tap Comutador</th>
              <th>Tensão BT (V)</th>
              <th>X1-X0</th>
              <th>X2-X0</th>
              <th>X3-X0</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {resistenciaBT.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="input"
                    value={row.tap_comutador || ""}
                    onChange={(e) =>
                      handleResistenciaBTChange(
                        index,
                        "tap_comutador",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.tensao_bt || ""}
                    onChange={(e) =>
                      handleResistenciaBTChange(
                        index,
                        "tensao_bt",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.x1x0 || ""}
                    onChange={(e) =>
                      handleResistenciaBTChange(
                        index,
                        "x1x0",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.x2x0 || ""}
                    onChange={(e) =>
                      handleResistenciaBTChange(
                        index,
                        "x2x0",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.x3x0 || ""}
                    onChange={(e) =>
                      handleResistenciaBTChange(
                        index,
                        "x3x0",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <Button
                    type="button"
                    variant="icon-danger"
                    size="sm"
                    onClick={() => removeRow("resistenciaBT", row.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="form-section-title">RESISTÊNCIA DE ISOLAMENTO (MΩ)</h3>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Terminais de Medição</th>
              <th>Tensão de Ensaio (Vcc)</th>
              <th>Valores Medidos (MΩ)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {resistenciaIsolamento.map((row, index) => (
              <tr key={row.id}>
                <td>{row.terminais}</td>
                <td>
                  <input
                    className="input"
                    value={row.tensao_ensaio || ""}
                    onChange={(e) =>
                      handleIsolamentoChange(
                        index,
                        "tensao_ensaio",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.val_medido || ""}
                    onChange={(e) =>
                      handleIsolamentoChange(
                        index,
                        "val_medido",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.tempo_s || ""}
                    onChange={(e) =>
                      handleIsolamentoChange(
                        index,
                        "tempo_s",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      <div className="form-group" style={{ marginTop: "2rem" }}>
        <label>OBSERVAÇÕES</label>
        <textarea
          name="observacoes"
          rows="4"
          value={formData.observacoes || ""}
          onChange={handleChange}
          className="input"
          placeholder="Resultados considerados satisfatórios."
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

export default TransformadorMediaTensaoMedicaoForm;
