// src/components/ClientFormModal.jsx - VERSÃO FINAL

import React, { useState, useEffect } from 'react';
import AnimatedModal from '../ui/AnimatedModal.jsx';
import Button from './Button.jsx';
import SubstationsForm from '../os/SubstationsForm.jsx';
import { updateClientSubstations } from '../../services/substationService.js';
import '../styles/modals.css';

function ClientFormModal({ isOpen, onRequestClose, onSave, client }) {
    const [clientData, setClientData] = useState({
        nome: '',
        cnpj: '',
        endereco: '',
        contato: '',
        subestacoes: [],
    });

    useEffect(() => {
        if (client) {
            setClientData(client);
        } else {
            setClientData({ nome: '', cnpj: '', endereco: '', contato: '', subestacoes: [] });
        }
    }, [client]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubstationsChange = (updatedSubstations) => {
        setClientData(prev => ({ ...prev, subestacoes: updatedSubstations }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Salva as subestações no localStorage
        if (clientData.nome) {
            await updateClientSubstations(clientData.nome, clientData.subestacoes);
        }
        
        onSave(clientData);
        onRequestClose();
    };

    return (
        <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2 className="main-title">{client ? 'Editar Cliente' : 'Cadastrar Nova Empresa'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3><span className="material-icons">corporate_fare</span> Informações da Empresa</h3>
                    <div className="form-group">
                        <label>Nome da Empresa:</label>
                        <input type="text" name="nome" value={clientData.nome} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>CNPJ:</label>
                        <input type="text" name="cnpj" value={clientData.cnpj} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Endereço:</label>
                        <input type="text" name="endereco" value={clientData.endereco} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Contato:</label>
                        <input type="text" name="contato" value={clientData.contato} onChange={handleChange} required />
                    </div>
                </div>

                <SubstationsForm
                    substations={clientData.subestacoes}
                    onChange={handleSubstationsChange}
                    isOsForm={false}
                />

                <div className="form-actions">
                    <Button type="submit" variant="primary">
                        {client ? 'Salvar Edições' : 'Salvar Empresa'}
                    </Button>
                    <Button type="button" variant="cancel" onClick={onRequestClose}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </AnimatedModal>
    );
}

export default ClientFormModal;