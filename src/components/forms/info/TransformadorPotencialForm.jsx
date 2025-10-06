// src/components/forms/info/TransformadorPotencialForm.jsx

import React from "react";

function TransformadorPotencialForm({ data, onChange }) {
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
        <label>ANO FAB.</label>
        <input
          type="text"
          name="anoFabricacao"
          value={data.anoFabricacao || ""}
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
        <label>TENSAO NOMINAL AT</label>
        <input
          type="text"
          name="tensaoPrimario"
          value={data.tensaoPrimario || ""}
          onChange={onChange}
          className="input"
        />
      </div>
      <div className="form-group">
        <label>TENSAO NOMINAL BT</label>
        <input
          type="text"
          name="tensaoSecundario"
          value={data.tensaoSecundario || ""}
          onChange={onChange}
          className="input"
        />
      </div>
    </div>
  );
}

export default TransformadorPotencialForm;
