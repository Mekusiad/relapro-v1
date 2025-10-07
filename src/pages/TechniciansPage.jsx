// src/pages/TechniciansPage.jsx

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  getTechnicians,
  addTechnician,
  updateTechnician,
  deleteTechnician,
} from "../services/technicianService.js";
import TechnicianCard from "../components/ui/TechnicianCard.jsx";
import TechnicianFormModal from "../components/modals/TechnicianFormModal.jsx";
import ConfirmationModal from "../components/modals/ConfirmationModal.jsx";
import Button from "../components/ui/Button.jsx";
import "../styles/technicians.css";

function TechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { user } = useAuth();

  const loadTechnicians = async (page) => {
    try {
      setLoading(true);
      const data = await getTechnicians({ page: page, limit: 12 });
      setTechnicians(data.funcionarios);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Falha ao carregar técnicos:", error);
      toast.error(error.message || "Falha ao carregar técnicos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnicians(currentPage);
  }, [currentPage]);

  const handleOpenFormModal = (technician = null) => {
    setEditingTechnician(technician);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingTechnician(null);
  };

  // Ajustado para o fluxo manual do toast
  const handleSave = async (technicianData) => {
    const isEditing = !!editingTechnician;
    const toastId = toast.loading(
      isEditing ? "Atualizando funcionário..." : "Cadastrando funcionário..."
    );

    try {
      const response = isEditing
        ? await updateTechnician(user.matricula, technicianData)
        : await addTechnician(technicianData, user.matricula);

      if (response.status === true) {
        toast.success(response.message, { id: toastId });
        loadTechnicians(currentPage);
        handleCloseFormModal();
      } else {
        // Caso a API retorne um erro lógico (status: false)
        toast.error(response.message, { id: toastId });
      }
    } catch (error) {
      // Caso a API retorne um erro de rede/servidor (ex: 4xx, 5xx)
      toast.error(error.message, { id: toastId });
    }
  };

  const handleDeleteClick = (technician) => {
    setTechnicianToDelete(technician);
    setIsConfirmModalOpen(true);
  };

  // Ajustado para o fluxo manual do toast
  const handleConfirmDelete = async () => {
    if (!technicianToDelete || !user) return;

    const toastId = toast.loading("Excluindo funcionário...");

    try {
      const response = await deleteTechnician(
        technicianToDelete.matricula,
        user.matricula
      );

      if (response.status === true) {
        toast.success(response.message, { id: toastId });
        loadTechnicians(currentPage);
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }

    setIsConfirmModalOpen(false);
    setTechnicianToDelete(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="technicians-screen-container container">
      <div className="screen-header">
        <h1>
          <span className="material-icons">engineering</span> Gestão de Técnicos
        </h1>
        <Button variant="primary" onClick={() => handleOpenFormModal(null)}>
          <span className="material-icons">add</span> Cadastrar Novo Técnico
        </Button>
      </div>

      {loading ? (
        <p>Carregando técnicos...</p>
      ) : (
        <>
          <div className="technicians-grid">
            {technicians.length > 0 ? (
              technicians.map((tech) => (
                <TechnicianCard
                  key={tech.id}
                  technician={tech}
                  onEdit={() => handleOpenFormModal(tech)}
                  onDelete={() => handleDeleteClick(tech)}
                />
              ))
            ) : (
              <p>Nenhum técnico encontrado.</p>
            )}
          </div>
          {totalPages > 1 && (
            <div
              className="pagination-controls"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
                gap: "1rem",
              }}
            >
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          )}
        </>
      )}

      <TechnicianFormModal
        isOpen={isFormModalOpen}
        onRequestClose={handleCloseFormModal}
        technician={editingTechnician}
        onSave={handleSave}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Você tem certeza que deseja excluir o técnico "${technicianToDelete?.nome}"?`}
      />
    </div>
  );
}

export default TechniciansPage;
