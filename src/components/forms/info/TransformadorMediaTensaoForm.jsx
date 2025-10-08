// src/components/forms/info/TransformadorMediaTensaoForm.jsx

import React from "react";

function TransformadorMediaTensaoForm({ data, onChange }) {
  return (
    <div className="info-form-grid">
      <div className="form-group">
        <label>LOCALIZAÇÃO</label>
        <input
          type="text"
          name="localizacao"
          value={data.localizacao || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>TIPO</label>
        <input
          type="text"
          name="modelo"
          value={data.modelo || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>FABRICANTE</label>
        <input
          type="text"
          name="fabricante"
          value={data.fabricante || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>Nº SÉRIE</label>
        <input
          type="text"
          name="numeroSerie"
          value={data.numeroSerie || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>MEIO ISOLANTE</label>
        <input
          type="text"
          name="meioIsolante"
          value={data.meioIsolante || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>ANO FABRICACAO</label>
        <input
          type="number"
          name="anoFabricacao"
          value={data.anoFabricacao || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>Massa (KG)</label>
        <input
          type="number"
          name="massaTotal"
          value={data.massaTotal || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>POTÊNCIA (kVA)</label>
        <input
          type="text"
          name="potencia"
          value={data.potencia || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>TIPO TENSÃO AT</label>
        <select
          name="tipoTensaoAt"
          value={data.tipoTensaoAt || ""}
          onChange={onChange}
          className="input"
        >
          <option value="" disabled>
            Selecione
          </option>
          <option value="X">Δ (Triângulo)</option>
          <option value="Y">Y (Estrela)</option>
        </select>
      </div>
      <div className="form-group">
        <label>TENSÃO AT:</label>
        <input
          type="text"
          name="tensaoPrimario"
          value={data.tensaoPrimario || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>TIPO TENSÃO BT</label>
        <select
          name="tipoTensaoBt"
          value={data.tipoTensaoBt || ""}
          onChange={onChange}
          className="input"
        >
          <option value="" disabled>
            Selecione
          </option>
          <option value="X">Δ (Triângulo)</option>
          <option value="Y">Y (Estrela)</option>
        </select>
      </div>
      <div className="form-group">
        <label>TENSÃO BT:</label>
        <input
          type="text"
          name="tensaoSecundario"
          value={data.tensaoSecundario || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>VOLUME DO ÓLEO ISOLANTE (L)</label>
        <input
          type="text"
          name="volumeOleoIsolante"
          value={data.volumeOleoIsolante || ""}
          onChange={onChange}
          className="input"
        />
      </div>
    </div>
  );
}

export default TransformadorMediaTensaoForm;
