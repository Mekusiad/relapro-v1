// src/components/forms/info/DisjuntorMediaTensaoForm.jsx

import React from 'react';

function DisjuntorMediaTensaoForm({ data, onChange }) {
  return (
    <div className="info-form-grid">
      <div className="form-group">
        <label>LOCALIZAÇÃO</label>
        <input type="text" name="localizacao" value={data.localizacao || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>IDENTIFICAÇÃO</label>
        <input type="text" name="identificacao" value={data.identificacao || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>TAG</label>
        <input type="text" name="tag" value={data.tag || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>TIPO</label>
        <input type="text" name="modelo" value={data.modelo || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>FABRICANTE</label>
        <input type="text" name="fabricante" value={data.fabricante || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>Nº SÉRIE</label>
        <input type="text" name="numeroSerie" value={data.numeroSerie || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>MEIO ISOLANTE</label>
        <input type="text" name="meioIsolante" value={data.meioIsolante || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>TENSÃO NOMINAL (kV)</label>
        <input type="text" name="tensaoNominal" value={data.tensaoNominal || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>CORRENTE NOMINAL (A)</label>
        <input type="text" name="correnteNominal" value={data.correnteNominal || ''} onChange={onChange} className="input" />
      </div>
    </div>
  );
}

export default DisjuntorMediaTensaoForm;