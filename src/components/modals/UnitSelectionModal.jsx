// src/components/modals/UnitSelectionModal.jsx

import React from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx";
import Button from "../ui/Button.jsx";
import "../../styles/modals.css";

function UnitSelectionModal({
  isOpen,
  onRequestClose,
  instances,
  onSelectUnit,
}) {
  const handleSelect = (instance) => {
    onSelectUnit(instance);
    onRequestClose(); // Fecha este modal para abrir o de informações
  };

  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="unit-selection-modal">
        <h2 className="main-title">Selecionar Unidade para Editar</h2>
        <p>
          Existem várias unidades deste equipamento. Por favor, selecione qual
          delas você deseja editar as informações.
        </p>

        <div className="units-list">
          {instances.map((instance, index) => (
            <div key={instance.id} className="unit-item">
              <span className="unit-name">
                {instance.nomeEquipamento || instance.nome} - Unidade{" "}
                {index + 1}
                {instance.info?.numeroSerie && (
                  <span className="unit-serial">
                    {" "}
                    (Série: {instance.info.numeroSerie})
                  </span>
                )}
              </span>
              <Button
                variant="secondary"
                onClick={() => handleSelect(instance)}
              >
                <span className="material-icons">edit</span> Editar
              </Button>
            </div>
          ))}
        </div>

        <div
          className="form-actions"
          style={{ justifyContent: "flex-end", marginTop: "1.5rem" }}
        >
          <Button type="button" variant="cancel" onClick={onRequestClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </AnimatedModal>
  );
}

export default UnitSelectionModal;
