import React, { useState, useEffect } from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx";
import Button from "../ui/Button.jsx";
import "../../styles/modals.css";

const initialFormData = {
  nome: "",
  modelo: "",
  numeroSerie: "",
  dataAquisicao: "",
  status: "ATIVO",
};

function EquipmentFormModal({ isOpen, onRequestClose, equipment, onSave }) {
  const [formData, setFormData] = useState(initialFormData);
  const isEditing = !!equipment;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setFormData({
          nome: equipment.nome || "",
          modelo: equipment.modelo || "",
          numeroSerie: equipment.numeroSerie || "",
          dataAquisicao: equipment.dataAquisicao
            ? new Date(equipment.dataAquisicao).toISOString().split("T")[0]
            : "",
          status: equipment.status || "ATIVO",
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, equipment, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="equipment-form-modal"
    >
      <h2 className="main-title">
        {isEditing ? "Editar Equipamento" : "Cadastrar Novo Equipamento"}
      </h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Equipamento</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="modelo">Modelo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="numeroSerie">Número de Série</label>
          <input
            type="text"
            id="numeroSerie"
            name="numeroSerie"
            value={formData.numeroSerie}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dataAquisicao">Data de Aquisição</label>
          <input
            type="date"
            id="dataAquisicao"
            name="dataAquisicao"
            value={formData.dataAquisicao}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
          >
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="MANUTENCAO">Em Manutenção</option>
          </select>
        </div>
        <div className="form-actions">
          <Button type="button" variant="cancel" onClick={onRequestClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}

export default EquipmentFormModal;
