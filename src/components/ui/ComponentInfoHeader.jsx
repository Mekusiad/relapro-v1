// src/components/ui/ComponentInfoHeader.jsx

import React from 'react';
import '../../styles/component-info-header.css';

// Componente auxiliar para renderizar um campo apenas se ele tiver valor
const InfoField = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="info-field">
            <span className="info-label">{label}:</span>
            <span className="info-value">{value}</span>
        </div>
    );
};

function ComponentInfoHeader({ component }) {
    if (!component) return null;

    // Acessa as informações que estão no objeto 'info'
    const info = component.info || {};

    return (
        <div className="component-info-header">
            <h4 className="header-title">{component.nomeEquipamento}</h4>
            <div className="header-grid">
                {/* Campos Genéricos */}
                <InfoField label="TAG" value={info.tag} />
                <InfoField label="Localização" value={info.localizacao} />
                <InfoField label="Fabricante" value={info.fabricante} />
                <InfoField label="Nº de Série" value={info.numeroSerie} />
                <InfoField label="Tensão Nominal" value={info.tensaoNominal} />
                <InfoField label="Corrente Nominal" value={info.correnteNominal} />
                <InfoField label="Potência" value={info.potencia} />
                <InfoField label="Ano Fabricação" value={info.anoFabricacao} />

                {/* ================================================== */}
                {/* INÍCIO DA CORREÇÃO - Campos Específicos Adicionados */}
                {/* ================================================== */}
                <InfoField label="Identificação" value={info.identificacao} />
                <InfoField label="Circuito" value={info.circuito} />
                <InfoField label="Tensão (kV)" value={info.tensao} />
                <InfoField label="Seção do Cabo (mm²)" value={info.secaoCabo} />
                {/* ================================================== */}
                {/* FIM DA CORREÇÃO                                    */}
                {/* ================================================== */}
            </div>
        </div>
    );
}

export default ComponentInfoHeader;