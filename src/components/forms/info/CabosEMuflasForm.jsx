// src/components/forms/info/CabosEMuflasForm.jsx

import React from "react";

function CabosEMuflasForm({ data, onChange }) {
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
        <label>IDENTIFICAÇÃO</label>
        <input
          type="text"
          name="identificacao"
          value={data.identificacao || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>CIRCUITO</label>
        <input
          type="text"
          name="circuito"
          value={data.circuito || ""}
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
        <label>TENSÃO (kV)</label>
        <input
          type="text"
          name="tensao"
          value={data.tensao || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>SEÇÃO DO CABO (mm²)</label>
        <input
          type="text"
          name="secaoCabo"
          value={data.secaoCabo || ""}
          onChange={onChange}
          className="input"
        />
      </div>
    </div>
  );
}

export default CabosEMuflasForm;
