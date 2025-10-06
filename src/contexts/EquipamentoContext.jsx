    import React, {
      createContext,
      useState,
      useContext,
      useEffect,
      useCallback,
    } from "react";
    import { useAuth } from "./AuthContext";
    import {
      getEquipments,
      addEquipment,
      updateEquipment,
      deleteEquipment,
    } from "../services/equipmentService";
    import { toast } from "sonner";

    const EquipamentoContext = createContext(null);

    export const EquipamentoProvider = ({ children }) => {
      const [equipamentos, setEquipamentos] = useState([]);
      const [loading, setLoading] = useState(true);
      const { isAuthenticated, user } = useAuth();

      const fetchEquipamentos = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
          const data = await getEquipments(user.matricula);
          setEquipamentos(data.equipamentos || []);
        } catch (error) {
          console.error("Erro ao carregar equipamentos no contexto:", error);
          toast.error("Falha ao carregar equipamentos.");
        } finally {
          setLoading(false);
        }
      }, [user]);

      useEffect(() => {
        if (isAuthenticated && user) {
          fetchEquipamentos();
        } else {
          setEquipamentos([]); // Limpa os dados no logout
        }
      }, [isAuthenticated, user, fetchEquipamentos]);
      
      const addEquipamento = async (equipmentData) => {
        const response = await addEquipment(equipmentData, user.matricula);
        if (response.status === true) {
          // Atualiza o estado local para refletir a mudança imediatamente
          setEquipamentos((prev) => [...prev, response.data]);
        }
        return response;
      };
      
      const updateEquipamento = async (equipmentId, equipmentData) => {
        const response = await updateEquipment(equipmentId, equipmentData, user.matricula);
        if (response.status === true) {
          setEquipamentos((prev) =>
            prev.map((equip) =>
              equip.id === equipmentId ? response.data : equip
            )
          );
        }
        return response;
      };

      const deleteEquipamento = async (equipmentId) => {
        const response = await deleteEquipment(equipmentId, user.matricula);
        if (response.status === true) {
          setEquipamentos((prev) => prev.filter((equip) => equip.id !== equipmentId));
        }
        return response;
      };

      const value = {
        equipamentos,
        loading,
        refetch: fetchEquipamentos,
        addEquipamento,
        updateEquipamento,
        deleteEquipamento,
      };

      return (
        <EquipamentoContext.Provider value={value}>
          {children}
        </EquipamentoContext.Provider>
      );
    };

    export const useEquipamentos = () => {
      const context = useContext(EquipamentoContext);
      if (!context) {
        throw new Error(
          "useEquipamentos deve ser usado dentro de um EquipamentoProvider"
        );
      }
      return context;
    };
    
