// src/components/modals/PendenciaFormModal.jsx

import React, { useState, useEffect } from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx";
import Button from "../ui/Button.jsx";
import { X } from "lucide-react";

function PendenciaFormModal({
  isOpen,
  onRequestClose,
  onSave,
  pendenciaToEdit,
}) {
  const [formData, setFormData] = useState({});

  const isEditMode = !!pendenciaToEdit;

  useEffect(() => {
    if (isOpen) {
      // Se estiver editando, preenche o formulário. Senão, limpa.
      setFormData(pendenciaToEdit || {});
    }
  }, [isOpen, pendenciaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="modal-header">
        <h2>
          {isEditMode
            ? "Editar Faturamento Pendente"
            : "Adicionar Faturamento Pendente"}
        </h2>
        <Button variant="icon" onClick={onRequestClose}>
          <X />
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Proposta</label>
          <input
            name="proposta"
            value={formData.proposta || ""}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label>Motivo da Pendência</label>
          <input
            name="motivo"
            value={formData.motivo || ""}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              name="valor"
              value={formData.valor || ""}
              onChange={handleChange}
              className="input"
              placeholder="2500.00"
              required
            />
          </div>
          <div className="form-group">
            <label>Pedido de Compra</label>
            <input
              name="pedidoCompra"
              value={formData.pedidoCompra || ""}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Data da Pendência</label>
          <input
            type="date"
            name="dataFaturamento"
            value={formData.dataFaturamento || ""}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-actions">
          <Button type="button" variant="cancel" onClick={onRequestClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? "Salvar Alterações" : "Salvar Pendência"}
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}

export default PendenciaFormModal;
