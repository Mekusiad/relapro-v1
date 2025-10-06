// src/components/forms/info/ResistorAterramentoForm.jsx

import React from 'react';

// Este componente recebe os dados (data) e a função para lidar com mudanças (onChange)
function ResistorAterramentoForm({ data, onChange }) {
  return (
    // Usamos um grid para organizar os campos em colunas, como na imagem
    <div className="info-form-grid">
      <div className="form-group">
        <label>LOCALIZAÇÃO</label>
        <input type="text" name="localizacao" value={data.localizacao || ''} onChange={onChange} className="input" />
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
        <label>ANO FABRICAÇÃO</label>
        <input type="number" name="anoFabricacao" value={data.anoFabricacao || ''} onChange={onChange} className="input" />
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
        <label>CLASSE DE TENSÃO (kV)</label>
        <input type="number" name="tensao" value={data.tensao || ''} onChange={onChange} className="input" />
      </div>
      <div className="form-group">
        <label>CORRENTE NOMINAL (A)</label>
        <input type="number" name="correnteNominal" value={data.correnteNominal || ''} onChange={onChange} className="input" />
      </div>
    </div>
  );
}

export default ResistorAterramentoForm;