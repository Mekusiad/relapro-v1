// src/components/forms/medicao/TransformadorCorrenteMedicaoForm.jsx

import React from "react";

// Estados iniciais para as tabelas, replicando a estrutura do vídeo
const createInitialRelacaoRows = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    numSerie: "",
    correnteAT: "",
    correnteBT: "",
    terminais: "",
    relacaoCalc: "",
    relacaoMed: "",
    resistenciaOhmica: "",
  }));

const createInitialIsolamentoRows = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    numSerie: "",
    terminais: ["P x S (M)", "P x Massa (S)", "S x Massa (P)"][i] || "",
    medido: "",
    temperatura: "",
  }));

function TransformadorCorrenteMedicaoForm({ data, onDataChange }) {
  const formData = data || {};
  const relacaoData = data?.relacaoData || createInitialRelacaoRows(3);
  const resistenciaIsolamento =
    data?.resistenciaIsolamento || createInitialIsolamentoRows(3);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  const handleRelacaoChange = (index, field, value) => {
    const updatedData = [...relacaoData];
    updatedData[index][field] = value;
    onDataChange({ relacaoData: updatedData });
  };

  const handleIsolamentoChange = (index, field, value) => {
    const updatedData = [...resistenciaIsolamento];
    updatedData[index][field] = value;
    onDataChange({ resistenciaIsolamento: updatedData });
  };

  const handleCommonRelacaoChange = (field, value) => {
    const updatedData = relacaoData.map((row) => ({
      ...row,
      [field]: value,
    }));
    onDataChange({ relacaoData: updatedData });
  };

  // Handler para campos unificados na tabela de Isolamento
  const handleCommonIsolamentoChange = (field, value) => {
    const updatedData = resistenciaIsolamento.map((row) => ({
      ...row,
      [field]: value,
    }));
    onDataChange({ resistenciaIsolamento: updatedData });
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

      <h3 className="form-section-title">
        RELAÇÃO DE TRANSFORMAÇÃO E RESISTÊNCIA ÔHMICA
      </h3>
      <div className="table-container">
        <table className="medicao-table complex-header">
          <thead>
            <tr>
              <th rowSpan="2">Nº de Série</th>
              <th colSpan="2">Corrente (A)</th>
              <th rowSpan="2">Terminais</th>
              <th rowSpan="2">Relação Calculada IP/IS</th>
              <th rowSpan="2">Relação Medida</th>
              <th rowSpan="2">Resistência Ôhmica (mΩ)</th>
            </tr>
            <tr>
              <th>AT</th>
              <th>BT</th>
            </tr>
          </thead>
          <tbody>
            {relacaoData.map((row, index) => (
              <tr key={row.id}>
                {index === 0 && (
                  <td rowSpan="3">
                    <input
                      className="input"
                      value={row.numSerie}
                      onChange={(e) =>
                        handleCommonRelacaoChange("numSerie", e.target.value)
                      }
                      placeholder="Nº de Série"
                    />
                  </td>
                )}

                <td>
                  <input
                    className="input"
                    value={row.correnteAT}
                    onChange={(e) =>
                      handleRelacaoChange(index, "correnteAT", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.correnteBT}
                    onChange={(e) =>
                      handleRelacaoChange(index, "correnteBT", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.terminais}
                    onChange={(e) =>
                      handleRelacaoChange(index, "terminais", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.relacaoCalc}
                    onChange={(e) =>
                      handleRelacaoChange(index, "relacaoCalc", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.relacaoMed}
                    onChange={(e) =>
                      handleRelacaoChange(index, "relacaoMed", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    className="input"
                    value={row.resistenciaOhmica}
                    onChange={(e) =>
                      handleRelacaoChange(
                        index,
                        "resistenciaOhmica",
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

      <h3 className="form-section-title">RESISTÊNCIA DE ISOLAMENTO (MΩ)</h3>
      <div className="table-container">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Número de Série</th>
              <th>Terminais de Medição</th>
              <th>Valores Medidos (MΩ)</th>
              <th>Temperatura de Ensaio (°C)</th>
            </tr>
          </thead>
          <tbody>
            {resistenciaIsolamento.map((row, index) => (
              <tr key={row.id}>
                {index === 0 && (
                  <td rowSpan="3">
                    <input
                      className="input"
                      value={row.numSerie}
                      onChange={(e) =>
                        handleCommonIsolamentoChange("numSerie", e.target.value)
                      }
                      placeholder="Nº de Série"
                    />
                  </td>
                )}

                <td>{row.terminais}</td>
                <td>
                  <input
                    className="input"
                    value={row.medido}
                    onChange={(e) =>
                      handleIsolamentoChange(index, "medido", e.target.value)
                    }
                  />
                </td>
                <td rowSpan="3">
                  <input
                    className="input"
                    value={row.temperatura}
                    onChange={(e) =>
                      handleIsolamentoChange(
                        index,
                        "temperatura",
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

export default TransformadorCorrenteMedicaoForm;
