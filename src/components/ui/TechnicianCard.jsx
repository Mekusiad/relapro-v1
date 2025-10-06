// src/components/TechnicianCard.jsx
import React from 'react';
import Button from './Button.jsx';

function TechnicianCard({ technician, onEdit, onDelete }) {
  const getFirstLetter = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  return (
    <div className="technician-card">
      <div className="technician-card-header">
        <span className="technician-avatar">{getFirstLetter(technician.nome)}</span>
        <div className="technician-info">
          <h3 className="technician-name">{technician.nome}</h3>
          <p className="technician-role">{technician.cargo || 'N/A'}</p>
        </div>
      </div>
      <div className="technician-card-body">
        <p><strong>Usuário:</strong> {technician.usuario}</p>
        <p><strong>Matrícula:</strong> {technician.matricula || 'N/A'}</p>
        <p><strong>Nível:</strong><span className={`access-level-badge level-${technician.nivelAcesso || 'tecnico'}`}>{technician.nivelAcesso || 'Técnico'}</span></p>
      </div>
      <div className="technician-card-footer">
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
export default TechnicianCard;