    import React, { useState } from 'react';
    import { toast } from 'sonner';
    import { useEquipamentos } from '../contexts/EquipamentoContext.jsx';
    import EquipmentCard from '../components/ui/EquipmentCard.jsx';
    import Button from '../components/ui/Button.jsx';
    import EquipmentFormModal from '../components/modals/EquipmentFormModal.jsx';
    import ConfirmationModal from '../components/modals/ConfirmationModal.jsx';
    import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
    import { Wrench, Plus } from 'lucide-react';

    function EquipmentsPage() {
      // O estado e o loading agora vêm diretamente do contexto!
      const {
        equipamentos,
        loading,
        addEquipamento,
        updateEquipamento,
        deleteEquipamento,
      } = useEquipamentos();

      const [isFormModalOpen, setIsFormModalOpen] = useState(false);
      const [editingEquipment, setEditingEquipment] = useState(null);
      const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
      const [equipmentToDelete, setEquipmentToDelete] = useState(null);

      const handleOpenModal = (equipment = null) => {
        setEditingEquipment(equipment);
        setIsFormModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsFormModalOpen(false);
        setEditingEquipment(null);
      };

      const handleSave = async (equipmentData) => {
        const isEditing = !!editingEquipment;
        const toastId = toast.loading(isEditing ? "Atualizando equipamento..." : "Cadastrando equipamento...");

        try {
          // Usa as funções do contexto para fazer a chamada à API e atualizar o estado global
          const response = isEditing
            ? await updateEquipamento(editingEquipment.id, equipmentData)
            : await addEquipamento(equipmentData);

          if (response.status === true) {
            toast.success(response.message, { id: toastId });
            handleCloseModal();
          } else {
            toast.error(response.message, { id: toastId });
          }
        } catch (error) {
          toast.error(error.message, { id: toastId });
        }
      };

      const handleDeleteClick = (equipment) => {
        setEquipmentToDelete(equipment);
        setIsConfirmModalOpen(true);
      };

      const handleConfirmDelete = async () => {
        if (!equipmentToDelete) return;
        const toastId = toast.loading("Excluindo equipamento...");

        try {
          // Usa a função de delete do contexto
          const response = await deleteEquipamento(equipmentToDelete.id);
          if (response.status === true) {
            toast.success(response.message, { id: toastId });
          } else {
            toast.error(response.message, { id: toastId });
          }
        } catch (error) {
          toast.error(error.message, { id: toastId });
        }
        
        setIsConfirmModalOpen(false);
        setEquipmentToDelete(null);
      };

      return (
        <div className="equipments-screen-container container">
          <div className="screen-header">
            <h1><Wrench className="header-icon" /> Gestão de Equipamentos</h1>
            <Button variant="primary" onClick={() => handleOpenModal(null)}>
              <Plus size={20} /> Cadastrar Equipamento
            </Button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="equipments-grid">
              {equipamentos.length > 0 ? (
                equipamentos.map((equip) => (
                  <EquipmentCard
                    key={equip.id}
                    equipment={equip}
                    onEdit={() => handleOpenModal(equip)}
                    onDelete={() => handleDeleteClick(equip)}
                  />
                ))
              ) : (
                <p className="no-items-message">Nenhum equipamento cadastrado.</p>
              )}
            </div>
          )}

          <EquipmentFormModal
            isOpen={isFormModalOpen}
            onRequestClose={handleCloseModal}
            equipment={editingEquipment}
            onSave={handleSave}
          />

          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
            message={`Você tem certeza que deseja excluir o equipamento "${equipmentToDelete?.nome}"?`}
          />
        </div>
      );
    }

    export default EquipmentsPage;
    
