// src/components/forms/medicao/PararaiosMedicaoForm.jsx

import React from "react";

// VALORES PREDEFINIDOS - Agora servem apenas como um modelo
const initialResistenciaState = [
  { fase: "A", numeroSerie: "", tensaoEnsaio: "5000", valorMedido: "", valorReferencia: ">1000", tempo: "60" },
  { fase: "B", numeroSerie: "", tensaoEnsaio: "5000", valorMedido: "", valorReferencia: ">1000", tempo: "60" },
  { fase: "C", numeroSerie: "", tensaoEnsaio: "5000", valorMedido: "", valorReferencia: ">1000", tempo: "60" },
];

const initialFugaState = [
  { fase: "A", numeroSerie: "", tensaoEnsaio: "5000", valorMedido: "", valorReferencia: "<300", tempo: "60" },
  { fase: "B", numeroSerie: "", tensaoEnsaio: "5000", valorMedido: "", valorReferencia: "<300", tempo: "60" },
  { fase: "C", numeroSerie: "", tensaoEnsaio: "5000", valorMedido: "", valorReferencia: "<300", tempo: "60" },
];


// Função helper para criar uma cópia profunda (deep copy) dos dados iniciais.
const getInitialState = (existingData) => ({
    ...existingData,
    resistenciaIsolamento: existingData?.resistenciaIsolamento || JSON.parse(JSON.stringify(initialResistenciaState)),
    correnteFuga: existingData?.correnteFuga || JSON.parse(JSON.stringify(initialFugaState)),
});


function PararaiosMedicaoForm({ data, onDataChange }) {
  // Garantimos que cada formulário trabalhe com sua própria cópia dos dados.
  const formData = getInitialState(data);
  const { resistenciaIsolamento: isolamentoData, correnteFuga: fugaData } = formData;

  // Função genérica para atualizar campos simples e comunicar ao pai.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onDataChange({ [name]: type === "checkbox" ? checked : value });
  };

  // =========================================================================
  // CORREÇÃO PRINCIPAL: Atualização imutável dos dados da tabela
  // =========================================================================

  const handleIsolamentoChange = (index, field, value) => {
    // Usamos .map() para criar um NOVO array.
    const updatedData = isolamentoData.map((row, i) => {
        if (i === index) {
            // Usamos o spread operator (...) para criar um NOVO objeto para a linha que foi alterada.
            return { ...row, [field]: value };
        }
        // Retornamos a linha original se ela não foi alterada.
        return row;
    });
    onDataChange({ resistenciaIsolamento: updatedData });
  };
  
  const handleFugaChange = (index, field, value) => {
    const updatedData = fugaData.map((row, i) => {
        if (i === index) {
            return { ...row, [field]: value };
        }
        return row;
    });
    onDataChange({ correnteFuga: updatedData });
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
      <div className="table-container dynamic-table">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Nº Série</th>
              <th>Tensão Ensaio VCC</th>
              <th>Medido (MΩ)</th>
              <th>Referência (MΩ)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {isolamentoData.map((row, index) => (
              <tr key={index}>
                <td>{row.fase}</td>
                <td>
                  <input
                    value={row.numeroSerie || ""}
                    onChange={(e) =>
                      handleIsolamentoChange(
                        index,
                        "numeroSerie",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tensaoEnsaio || ""}
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
                    value={row.valorMedido || ""}
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
                    value={row.valorReferencia || ""}
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
                    value={row.tempo || ""}
                    onChange={(e) =>
                      handleIsolamentoChange(
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

      <h3 className="form-section-title">Corrente de Fuga (µA)</h3>
      <div className="table-container dynamic-table">
        <table className="medicao-table">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Nº Série</th>
              <th>Tensão Ensaio VCC</th>
              <th>Medido (µA)</th>
              <th>Referência (µA)</th>
              <th>Tempo (s)</th>
            </tr>
          </thead>
          <tbody>
            {fugaData.map((row, index) => (
              <tr key={index}>
                <td>{row.fase}</td>
                <td>
                  <input
                    value={row.numeroSerie || ""}
                    onChange={(e) =>
                      handleFugaChange(
                        index,
                        "numeroSerie",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </td>
                <td>
                  <input
                    value={row.tensaoEnsaio || ""}
                    onChange={(e) =>
                      handleFugaChange(
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
                    value={row.valorMedido || ""}
                    onChange={(e) =>
                      handleFugaChange(
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
                    value={row.valorReferencia || ""}
                    onChange={(e) =>
                      handleFugaChange(
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
                    value={row.tempo || ""}
                    onChange={(e) =>
                      handleFugaChange(
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

export default PararaiosMedicaoForm;
