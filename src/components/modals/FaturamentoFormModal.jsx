// src/components/modals/FaturamentoFormModal.jsx

import React, { useState, useEffect } from 'react';
import AnimatedModal from '../ui/AnimatedModal.jsx';
import Button from '../ui/Button.jsx';
import { getClients } from '../../services/clientService.js';
import { X } from 'lucide-react';

const TIPOS_DE_SERVICO = [
    'MANUTENÇÃO PREVENTIVA', 'MANUTENÇÃO CORRETIVA', 'PROJETO DE SUBESTAÇÃO',
    'LOCAÇÃO DE TRANSFORMADOR', 'CONFECÇÃO DE CUBICULO', 'MONTAGEM DE TRANSFORMADOR',
    'ANÁLISE DE ÓLEO', 'ATENDIMENTO EMERGENCIA', 'CONSTRUÇÃO DE SUBESTAÇÃO',
    'ENSAIO DE EPI', 'INSTALAÇÃO DE TRANSFORMADOR', 'COMPLEMENTO DE ÓLEO',
    'DESENVOLVimento DE PROJETO'
];

function FaturamentoFormModal({ isOpen, onRequestClose, onSave, faturamentoToEdit }) {
    const [formData, setFormData] = useState({});
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);

    const isEditMode = !!faturamentoToEdit;

    useEffect(() => {
        if (isOpen) {
            const fetchClients = async () => {
                setLoadingClients(true);
                const clientData = await getClients();
                setClients(clientData);
                setLoadingClients(false);
            };
            fetchClients();

            // Se estiver editando, preenche o formulário. Senão, limpa.
            setFormData(faturamentoToEdit || {});
        }
    }, [isOpen, faturamentoToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="modal-header">
                <h2>{isEditMode ? 'Editar Faturamento' : 'Adicionar Novo Faturamento'}</h2>
                <Button variant="icon" onClick={onRequestClose}><X /></Button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Proposta</label>
                        <input name="proposta" value={formData.proposta || ''} onChange={handleChange} className="input" required />
                    </div>
                    <div className="form-group">
                        <label>Empresa</label>
                        <select name="parceiro" value={formData.parceiro || ''} onChange={handleChange} className="input" required>
                            <option value="" disabled>
                                {loadingClients ? 'Carregando...' : 'Selecione a empresa'}
                            </option>
                            {clients.map(client => (
                                <option key={client.id} value={client.nome}>{client.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Tipo de Serviço</label>
                    <select name="tipoServico" value={formData.tipoServico || ''} onChange={handleChange} className="input" required>
                        <option value="" disabled>Selecione o tipo</option>
                        {TIPOS_DE_SERVICO.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>N° da Nota</label>
                        <input name="notaFiscal" value={formData.notaFiscal || ''} onChange={handleChange} className="input" required />
                    </div>
                     <div className="form-group">
                        <label>Data do Faturamento</label>
                        <input type="date" name="dataFaturamento" value={formData.dataFaturamento || ''} onChange={handleChange} className="input" required />
                    </div>
                    <div className="form-group">
                        <label>Vencimento</label>
                        <input type="date" name="vencimento" value={formData.vencimento || ''} onChange={handleChange} className="input" required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Vlr. Total (R$)</label>
                        <input type="number" step="0.01" name="valorTotal" value={formData.valorTotal || ''} onChange={handleChange} className="input" placeholder="1500.00" required />
                    </div>
                    <div className="form-group">
                        <label>Vlr. Líquido (R$)</label>
                        <input type="number" step="0.01" name="valorLiquido" value={formData.valorLiquido || ''} onChange={handleChange} className="input" placeholder="1450.00" required />
                    </div>
                </div>
                <div className="form-actions">
                    <Button type="button" variant="cancel" onClick={onRequestClose}>Cancelar</Button>
                    <Button type="submit" variant="primary">{isEditMode ? 'Salvar Alterações' : 'Adicionar Faturamento'}</Button>
                </div>
            </form>
        </AnimatedModal>
    );
}

export default FaturamentoFormModal;