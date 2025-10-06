// src/components/modals/EquipmentSelectionModal.jsx

import React from "react";
import { useState, useEffect } from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx";
import Button from "../ui/Button.jsx";
import { useEquipamentos } from "../../contexts/EquipamentoContext.jsx"; // 1. Importar o hook do contexto

import "../../styles/modals.css";

function EquipmentSelectionModal({
  isOpen,
  onRequestClose,
  onSave,
  alreadySelected = [],
}) {
  // 2. Consumir os dados diretamente do contexto
  const { equipamentos, loading } = useEquipamentos();

  // O estado agora gerencia apenas os IDs dos itens selecionados
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Efeito para sincronizar a seleção inicial quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(alreadySelected.map((e) => e.id)));
    }
  }, [isOpen, alreadySelected]);

  // O useEffect que buscava dados foi removido.

  const handleCheckboxChange = (equipmentId) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(equipmentId)) {
      newSelectedIds.delete(equipmentId);
    } else {
      newSelectedIds.add(equipmentId);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSave = () => {
    // Filtra a lista completa do contexto para encontrar os objetos selecionados
    const selectedEquipment = equipamentos.filter((equip) =>
      selectedIds.has(equip.id)
    );
    onSave(selectedEquipment);
    onRequestClose();
  };

  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2 className="main-title">Selecionar Equipamentos</h2>
      <div className="equipment-checklist-container">
        {loading ? (
          <p>Carregando equipamentos...</p>
        ) : (
          equipamentos.map((equip) => (
            <div key={equip.id} className="checkbox-item-detailed">
              <input
                type="checkbox"
                id={`equip-select-${equip.id}`}
                checked={selectedIds.has(equip.id)}
                onChange={() => handleCheckboxChange(equip.id)}
              />
              <label htmlFor={`equip-select-${equip.id}`}>
                <span className="item-name">{equip.nome}</span>
                <span className="item-details">
                  Modelo: {equip.modelo} | Série: {equip.numeroSerie}
                </span>
              </label>
            </div>
          ))
        )}
      </div>
      <div
        className="form-actions"
        style={{
          justifyContent: "flex-end",
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <Button type="button" variant="cancel" onClick={onRequestClose}>
          Cancelar
        </Button>
        <Button type="button" variant="primary" onClick={handleSave}>
          Salvar Seleção
        </Button>
      </div>
    </AnimatedModal>
  );
}

export default EquipmentSelectionModal;
