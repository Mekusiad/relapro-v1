// src/components/ConclusionSection.jsx

import React from 'react';
import '../../styles/os-form.css';

function ConclusionSection({ osData, handleInputChange }) {
    return (
        <div className="form-section">
            <h3><span className="material-icons">comment</span> Conclusão e Recomendações</h3>
            <div className="form-group full-width">
                <label htmlFor="conclusao">Conclusão dos Serviços</label>
                <textarea 
                    id="conclusao" 
                    name="conclusao"
                    className="input" 
                    rows="5" 
                    placeholder="Descreva a conclusão geral do serviço realizado, os resultados dos testes e o estado final dos equipamentos..."
                    value={osData.conclusao || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group full-width">
                <label htmlFor="recomendacoes">Recomendações Técnicas e Pontos de Atenção</label> 
                <textarea 
                    id="recomendacoes" 
                    name="recomendacoes"
                    className="input" 
                    rows="5" 
                    placeholder="Liste as recomendações para o cliente (melhorias necessárias, próximos passos, manutenções futuras, pontos de atenção, etc.)..."
                    value={osData.recomendacoes || ''}
                    onChange={handleInputChange}
                /> 
            </div>
        </div>
    );
}

export default ConclusionSection;