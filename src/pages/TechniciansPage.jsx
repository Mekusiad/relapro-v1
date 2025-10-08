// src/pages/TechniciansPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getTechnicians, addTechnician, updateTechnician, deleteTechnician } from "../services/technicianService.js";
import TechnicianCard from "../components/ui/TechnicianCard.jsx";
import TechnicianFormModal from "../components/modals/TechnicianFormModal.jsx";
import ConfirmationModal from "../components/modals/ConfirmationModal.jsx";
import Button from "../components/ui/Button.jsx";
import { Search } from "lucide-react";
import "../styles/technicians.css";

function TechniciansPage() {
  const [allTechnicians, setAllTechnicians] = useState([]); // Armazena todos os técnicos
  const [filteredTechnicians, setFilteredTechnicians] = useState([]); // Armazena os técnicos filtrados
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca

  const { user } = useAuth();

  // Função para carregar todos os técnicos uma única vez
  const loadAllTechnicians = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTechnicians(); // Busca a lista completa
      setAllTechnicians(data.funcionarios);
      setFilteredTechnicians(data.funcionarios); // Inicialmente, a lista filtrada é a lista completa
    } catch (error) {
      console.error("Falha ao carregar técnicos:", error);
      toast.error(error.message || "Falha ao carregar técnicos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega os dados quando o componente é montado
  useEffect(() => {
    if (user) {
      loadAllTechnicians();
    }
  }, [user, loadAllTechnicians]);

  // Efeito para aplicar o filtro sempre que o searchTerm ou a lista principal mudam
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = allTechnicians.filter(item => {
      const nameMatch = item.nome.toLowerCase().includes(lowercasedFilter);
      const matriculaMatch = item.matricula.toString().includes(lowercasedFilter);
      return nameMatch || matriculaMatch;
    });
    setFilteredTechnicians(filteredData);
  }, [searchTerm, allTechnicians]);


  const handleOpenFormModal = (technician = null) => {
    setEditingTechnician(technician);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingTechnician(null);
  };

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
        loadAllTechnicians(); // Recarrega a lista completa após salvar
        handleCloseFormModal();
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleDeleteClick = (technician) => {
    setTechnicianToDelete(technician);
    setIsConfirmModalOpen(true);
  };

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
        loadAllTechnicians(); // Recarrega a lista completa após excluir
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }

    setIsConfirmModalOpen(false);
    setTechnicianToDelete(null);
  };

  return (
    <div className="technicians-screen-container container">
      <div className="screen-header with-filter">
        <div className="header-content">
          <h1>
            <span className="material-icons">engineering</span> Gestão de
            Técnicos
          </h1>
          <Button variant="primary" onClick={() => handleOpenFormModal(null)}>
            <span className="material-icons">add</span> Cadastrar Novo Técnico
          </Button>
        </div>
        <div className="search-bar-wrapper">
           <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou matrícula..."
            className="input search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Carregando técnicos...</p>
      ) : (
        <div className="technicians-grid">
          {filteredTechnicians.length > 0 ? (
            filteredTechnicians.map((tech) => (
              <TechnicianCard
                key={tech.id}
                technician={tech}
                onEdit={() => handleOpenFormModal(tech)}
                onDelete={() => handleDeleteClick(tech)}
              />
            ))
          ) : (
            <p>Nenhum técnico encontrado com os critérios de busca.</p>
          )}
        </div>
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

