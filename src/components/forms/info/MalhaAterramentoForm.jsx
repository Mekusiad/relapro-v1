// src/components/forms/info/MalhaAterramentoForm.jsx

import React from 'react';

function MalhaAterramentoForm({ data, onChange }) {
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
    </div>
  );
}

export default MalhaAterramentoForm;