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
import { Building2, Plus } from 'lucide-react';

import '../styles/clients.css';

function ClientsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    // Estado para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const loadClients = useCallback(async (page) => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getClients(user.matricula, { page: page, limit: 10 });
            setClients(data.clientes || []);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.currentPage || 1);
        } catch (error) {
            toast.error(error.message || "Falha ao carregar clientes.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadClients(currentPage);
    }, [currentPage, loadClients]);

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
                // Lógica para recarregar a página corretamente após a exclusão
                if (clients.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    loadClients(currentPage);
                }
            } else {
                toast.error(response.message, { id: toastId });
            }
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
        
        setIsConfirmModalOpen(false);
        setClientToDelete(null);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="clients-screen-container container">
            <div className="screen-header">
                <h1><Building2 size={32} /> Gestão de Clientes</h1>
                <Button variant="primary" onClick={handleAddNewClient}>
                    <Plus size={20} /> Cadastrar Nova Empresa
                </Button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="clients-grid">
                        {clients.length > 0 ? (
                            clients.map((client) => (
                                <ClientCard
                                    key={client.id}
                                    client={client}
                                    onEdit={() => handleEditClient(client)}
                                    onDelete={() => handleDeleteClick(client)}
                                />
                            ))
                        ) : (
                            <p className="no-items-message">Nenhum cliente cadastrado.</p>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
                            <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                                Anterior
                            </Button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Próximo
                            </Button>
                        </div>
                    )}
                </>
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
