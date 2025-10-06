// src/components/AlertModal.jsx

import React from 'react';
import AnimatedModal from '../ui/AnimatedModal.jsx'; 
import Button from '../ui/Button.jsx';
import '../../styles/modals.css';

function AlertModal({ isOpen, onRequestClose, title, message, type = 'info' }) {
    if (!isOpen) {
        return null;
    }

    let icon = 'info';
    let buttonVariant = 'primary';
    let titleClass = 'main-title'; // Classe padrão, pode ser ajustada

    switch (type) {
        case 'success':
            icon = 'check_circle';
            buttonVariant = 'success';
            titleClass = 'main-title success-title';
            break;
        case 'error':
            icon = 'error';
            buttonVariant = 'danger';
            titleClass = 'main-title error-title';
            break;
        case 'warning':
            icon = 'warning';
            buttonVariant = 'warning';
            titleClass = 'main-title warning-title';
            break;
        default: // 'info'
            icon = 'info';
            buttonVariant = 'primary';
            titleClass = 'main-title info-title';
            break;
    }

    return (
        <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className={`alert-modal-content ${type}`}>
                <h2 className={titleClass}>
                    <span className="material-icons">{icon}</span> {title}
                </h2>
                <p className="alert-message">{message}</p>
                <div className="alert-actions">
                    <Button type="button" variant={buttonVariant} onClick={onRequestClose}>
                        OK
                    </Button>
                </div>
            </div>
        </AnimatedModal>
    );
}

export default AlertModal;