// src/components/EquipmentCard.jsx - ATUALIZADO
import React from 'react';
import Button from './Button.jsx'; // Importamos nosso componente de botão

// Agora o componente recebe as funções onEdit e onDelete
function EquipmentCard({ equipment, onEdit, onDelete }) {
  const getFirstLetter = (name) => (name ? name.charAt(0).toUpperCase() : 'E');

  return (
    <div className="equipment-card">
      <div className="equipment-card-header">
        <div className="equipment-avatar">{getFirstLetter(equipment.nome)}</div>
        <div className="equipment-info">
          <h3 className="equipment-name">{equipment.nome}</h3>
          <p className="equipment-model">Modelo: {equipment.modelo}</p>
        </div>
      </div>
      <div className="equipment-card-body">
        <p><strong>Descrição:</strong> {equipment.descricao}</p>
        <p><strong>Nº de Série:</strong> {equipment.numeroSerie}</p>
      </div>
      <div className="equipment-card-footer">
        {/* O onClick agora chama as funções recebidas via props */}
        <Button variant="primary" onClick={onEdit}>
          <i className="material-icons">edit</i> Editar
        </Button>
        <Button variant="danger" onClick={onDelete}>
          <i className="material-icons">delete</i> Excluir
        </Button>
      </div>
    </div>
  );
}

export default EquipmentCard;