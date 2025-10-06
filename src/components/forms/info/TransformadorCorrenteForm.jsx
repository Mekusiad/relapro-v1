// src/components/forms/info/TransformadorCorrenteForm.jsx

import React from 'react';

function TransformadorCorrenteForm({ data, onChange }) {
  return (
    <div className="info-form-grid">
      <div className="form-group">
        <label>LOCALIZAÇÃO</label>
        <input type="text" name="localizacao" value={data.localizacao || ''} onChange={onChange} className="input" />
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
        <label>ANO FAB.</label>
        <input type="text" name="anoFabricacao" value={data.anoFabricacao || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>MEIO ISOLANTE</label>
        <input type="text" name="meioIsolante" value={data.meioIsolante || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>CORRENTE NOMINAL AT (A)</label>
        <input type="text" name="correntePrimario" value={data.correntePrimario || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>CORRENTE NOMINAL BT (A)</label>
        <input type="text" name="correnteSecundario" value={data.correnteSecundario || ''} onChange={onChange} className="input" />
      </div>
    </div>
  );
}

export default TransformadorCorrenteForm;