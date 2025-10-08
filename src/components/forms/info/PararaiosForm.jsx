// src/components/forms/info/PararaiosForm.jsx

import React from "react";

function PararaiosForm({ data, onChange }) {
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
        <label>TAG</label>
        <input
          type="text"
          name="tag"
          value={data.tag || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>Nº SÉRIE (Principal/Conjunto)</label>
        <input
          type="text"
          name="numeroSerie"
          value={data.numeroSerie || ""}
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
        <label>TENSÃO NOMINAL (kV)</label>
        <input
          type="text"
          name="tensaoNominal"
          value={data.tensaoNominal || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>CURTO CIRCUITO (kA)</label>
        <input
          type="text"
          name="curtoCircuito"
          value={data.curtoCircuito || ""}
          onChange={onChange}
          className="input"
        />
      </div>
    </div>
  );
}

export default PararaiosForm;
