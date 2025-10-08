// src/components/ui/ClientCard.jsx

import React from "react";
import Button from "./Button.jsx";
import { Building, FileText, MapPin, User, Pencil, Trash2 } from "lucide-react";
import "../../styles/clients.css";

function ClientCard({ client, onEdit, onDelete }) {
  // Pega a primeira letra do nome do cliente para o avatar
  const getFirstLetter = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="client-card">
      <div className="client-card-header">
        <div className="client-avatar">{getFirstLetter(client.nome)}</div>
        <div className="client-header-info">
          <h3 className="client-name">{client.nome}</h3>
          <div className="client-cnpj">
            <Building size={14} />
            <span>{client.cnpj}</span>
          </div>
        </div>
      </div>

      <div className="client-card-body">
        <div className="client-info-item">
          <MapPin size={16} className="info-icon" />
          <span>{client.endereco}</span>
        </div>
        <div className="client-info-item">
          <User size={16} className="info-icon" />
          <span>{client.contato}</span>
        </div>
      </div>

      <div className="client-card-footer">
        <Button variant="secondary" onClick={() => onEdit(client)}>
          <Pencil size={16} /> Editar
        </Button>
        <Button variant="danger-outline" onClick={() => onDelete(client)}>
          <Trash2 size={16} /> Excluir
        </Button>
      </div>
    </div>
  );
}

export default ClientCard;
