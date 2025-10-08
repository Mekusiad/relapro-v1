// src/pages/ClientsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import ClientCard from '../components/ui/ClientCard.jsx';
import ConfirmationModal from '../components/modals/ConfirmationModal.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getClients, deleteClient } from '../services/clientService.js';
import { Building2, Plus, Search } from 'lucide-react';

import '../styles/clients.css';

function ClientsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [allClients, setAllClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadClients = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Assumindo que getClients sem paginação retorna todos os clientes
            const data = await getClients(user.matricula); 
            setAllClients(data.clientes || []);
            setFilteredClients(data.clientes || []);
        } catch (error) {
            toast.error(error.message || "Falha ao carregar clientes.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadClients();
    }, [loadClients]);

    // Efeito para filtrar os clientes com base no termo de busca
    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = allClients.filter(client => {
            const nameMatch = client.nome?.toLowerCase().includes(lowercasedFilter);
            const cnpjMatch = client.cnpj?.toLowerCase().includes(lowercasedFilter);
            return nameMatch || cnpjMatch;
        });
        setFilteredClients(filteredData);
    }, [searchTerm, allClients]);


    const handleAddNewClient = () => {
        navigate('/clients/new');
    };

    const handleEditClient = (client) => {
        navigate(`/clients/edit/${client.id}`);
    };

    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!clientToDelete || !user) return;

        const toastId = toast.loading("Excluindo cliente...");
        try {
            const response = await deleteClient(clientToDelete.id, user.matricula);

            if (response.status === true) {
                toast.success(response.message, { id: toastId });
                loadClients(); // Recarrega a lista completa
            } else {
                toast.error(response.message, { id: toastId });
            }
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
        
        setIsConfirmModalOpen(false);
        setClientToDelete(null);
    };

    return (
        <div className="clients-screen-container container">
            <div className="screen-header with-filter">
                <div className="header-content">
                    <h1><Building2 size={32} /> Gestão de Clientes</h1>
                    <Button variant="primary" onClick={handleAddNewClient}>
                        <Plus size={20} /> Cadastrar Nova Empresa
                    </Button>
                </div>
                 <div className="search-bar-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome ou CNPJ..."
                        className="input search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="clients-grid">
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                onEdit={() => handleEditClient(client)}
                                onDelete={() => handleDeleteClick(client)}
                            />
                        ))
                    ) : (
                        <p className="no-items-message">Nenhum cliente encontrado.</p>
                    )}
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Você tem certeza que deseja excluir o cliente "${clientToDelete?.nome}"? Todas as suas subestações e componentes associados também serão removidos.`}
            />
        </div>
    );
}

export default ClientsPage;
