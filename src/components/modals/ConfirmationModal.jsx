// src/components/ConfirmationModal.jsx - REFATORADO

import React from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx"; // Importa o novo componente
import Button from "../ui/Button.jsx";

import "../../styles/modals.css";

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onClose}>
      <div className="confirmation-modal">
        <h2 className="confirmation-title">{title}</h2>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <Button variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </AnimatedModal>
  );
}

export default ConfirmationModal;
