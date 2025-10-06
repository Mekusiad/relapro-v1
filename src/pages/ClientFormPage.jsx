// src/pages/ClientFormPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getClientById, saveClient, updateComponent } from "../services/clientService.js";
import Button from "../components/ui/Button.jsx";
import SubstationsForm from "../components/os/SubstationsForm.jsx";
import ComponentInfoModal from "../components/modals/ComponentInfoModal.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import "../styles/os-form.css";

function ClientFormPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!clientId;

  const { user } = useAuth();

  const [clientData, setClientData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    contato: "",
    subestacoes: [],
  });
  const [loading, setLoading] = useState(isEditMode);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [editingSubstationId, setEditingSubstationId] = useState(null);

  useEffect(() => {
    if (isEditMode && user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const client = await getClientById(user.matricula, clientId);
          if (client) {
            setClientData(client);
          } else {
            toast.error(`Cliente com ID ${clientId} não encontrado.`);
            navigate("/clients");
          }
        } catch (error) {
          toast.error(error.message || "Falha ao carregar dados do cliente.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [clientId, isEditMode, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubstationsChange = (updatedSubstations) => {
    setClientData((prev) => ({ ...prev, subestacoes: updatedSubstations }));
  };

  const handleOpenInfoModal = (component, substationId) => {
    setEditingComponent(component);
    setEditingSubstationId(substationId);
    setIsInfoModalOpen(true);
  };
   const handleSaveComponentInfo = async (updatedInfo) => {
    if (!user || !editingComponent || !editingSubstationId) {
      toast.error("Não foi possível salvar. Informações de contexto ausentes.");
      return;
    }

    const toastId = toast.loading("Salvando informações do componente...");

    try {
      const payload = {
        nomeEquipamento: editingComponent.nomeEquipamento,
        tipo: editingComponent.tipo,
        ...updatedInfo,
      };

      if (payload.tipoTensaoAt === "") delete payload.tipoTensaoAt;
      if (payload.tipoTensaoBt === "") delete payload.tipoTensaoBt;
      if (payload.tipoPressao === "") delete payload.tipoPressao;

      await updateComponent(
        user.matricula,
        editingSubstationId,
        editingComponent.id,
        payload
      );

      setClientData((prevData) => {
        const updatedSubstations = prevData.subestacoes.map((sub) => {
          if (sub.id !== editingSubstationId) return sub;
          const updatedComponents = sub.componentes.map((comp) => {
            if (comp.id !== editingComponent.id) return comp;
            return { ...comp, info: updatedInfo }; 
          });
          return { ...sub, componentes: updatedComponents };
        });
        return { ...prevData, subestacoes: updatedSubstations };
      });

      toast.success("Componente atualizado com sucesso!", { id: toastId });
      setIsInfoModalOpen(false);
    } catch (error) {
      console.error("Falha ao salvar componente:", error);
      toast.error(error.message || "Falha ao salvar componente.", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para salvar um cliente.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading(
      isEditMode ? "Atualizando cliente..." : "Cadastrando cliente..."
    );

    // 1. Cria uma cópia profunda dos dados para não alterar o estado do formulário
    const payload = JSON.parse(JSON.stringify(clientData));

    // 2. "Achata" a estrutura dos componentes
    if (payload.subestacoes && payload.subestacoes.length > 0) {
      payload.subestacoes = payload.subestacoes.map(sub => {
        if (sub.componentes && sub.componentes.length > 0) {
          sub.componentes = sub.componentes.map(comp => {
            // Pega os dados de dentro do objeto 'info' e os junta com o resto do componente
            const { info, ...compRest } = comp;
            return { ...compRest, ...info };
          });
        }
        return sub;
      });
    }

    try {
      // 3. Envia o payload com a estrutura correta para o backend
      const response = await saveClient(payload, user.matricula);

      if (response.status === true) {
        toast.success(response.message, { id: toastId });
        setTimeout(() => navigate("/clients"), 1500);
      } else {
        toast.error(response.message, { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <LoadingSpinner />;
  }

  return (
    <div className="os-form-screen-container">
      <div className="container">
        <h1>
          {isEditMode
            ? "Editar Cliente e Subestações"
            : "Cadastrar Nova Empresa"}
        </h1>
        <form onSubmit={handleSubmit} className="os-form">
          <div className="form-section">
            <h3>
              <span className="material-icons">corporate_fare</span> Informações
              da Empresa
            </h3>
            <div className="info-form-grid">
              <div className="form-group">
                <label>Nome da Empresa:</label>
                <input
                  type="text"
                  name="nome"
                  value={clientData.nome || ""}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div className="form-group">
                <label>CNPJ:</label>
                <input
                  type="text"
                  name="cnpj"
                  value={clientData.cnpj || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="form-group">
                <label>Endereço:</label>
                <input
                  type="text"
                  name="endereco"
                  value={clientData.endereco || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="form-group">
                <label>Contato:</label>
                <input
                  type="text"
                  name="contato"
                  value={clientData.contato || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          <SubstationsForm
            substations={clientData.subestacoes}
            onChange={handleSubstationsChange}
            isOsForm={false}
            onOpenInfoModal={handleOpenInfoModal}
          />

          <div className="form-actions">
            <Button
              type="button"
              variant="cancel"
              onClick={() => navigate("/clients")}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {isEditMode ? "Salvar Edições" : "Salvar Empresa"}
            </Button>
          </div>
        </form>
      </div>

      <ComponentInfoModal
        isOpen={isInfoModalOpen}
        onRequestClose={() => setIsInfoModalOpen(false)}
        component={editingComponent}
        onSave={handleSaveComponentInfo}
      />
    </div>
  );
}

export default ClientFormPage;