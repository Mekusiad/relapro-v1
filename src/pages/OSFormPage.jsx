// src/pages/OSFormPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getOsById, createOs, updateOs } from "../services/osService.js";

import {
  deleteOsPhoto,
  updatePhotoDescription,
  uploadOsPhoto,
} from "../services/photoService.js";

import OSDetailsForm from "../components/os/OSDetailsForm.jsx";
import TechnicianSelection from "../components/os/TechnicianSelection.jsx";
import ConclusionSection from "../components/os/ConclusionSection.jsx";
import SubstationsForm from "../components/os/SubstationsForm.jsx";
import PhotoUploadBlock from "../components/ui/PhotoUploadBlock.jsx";
import Button from "../components/ui/Button.jsx";
import MeasurementModal from "../components/modals/MeasurementModal.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

import "../styles/os-form.css";

function OSFormPage() {
  const { osId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!osId;

  const { user } = useAuth();
  const isTecnico = user?.nivelAcesso === "TECNICO";

  const [osData, setOsData] = useState({
    clienteId: "",
    cliente: null,
    tipoServico: "OUTRO",
    previsaoInicio: new Date().toISOString().split("T")[0],
    status: "ABERTA",
    engenheiroMatricula: null,
    supervisorMatricula: null,
    tecnicos: [],
    subestacoes: [],
    fotosAntes: [],
    fotosDurante: [],
    fotosDepois: [],
    conclusao: "",
    recomendacoes: "",
  });
  const [initialOsData, setInitialOsData] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [isMeasurementModalOpen, setMeasurementModalOpen] = useState(false);
  const [currentMeasurementInfo, setCurrentMeasurementInfo] = useState(null);

  useEffect(() => {
    if (isEditMode && user) {
      const fetchOsData = async () => {
        setLoading(true);
        try {
          const data = await getOsById(user.matricula, osId);
          if (data) {
            const selectedComponentIds = new Set(
              data.componentes.map((c) => c.id)
            );
            const allClientSubstations = data.cliente?.subestacoes || [];

            const processedSubstations = allClientSubstations.map((sub) => ({
              ...sub,
              componentes: (sub.componentes || []).map((comp) => ({
                ...comp,
                selecionado: selectedComponentIds.has(comp.id),
                ensaios: comp.ensaios || [],
              })),
            }));

            const finalOsData = {
              ...data,
              clienteId: data.cliente?.id,
              cliente: data.cliente,
              subestacoes: processedSubstations,
              tecnicos: (data.tecnicos || []).map((t) => t.matricula),
              fotosAntes: (
                data.fotos?.filter((f) => f.tipoFoto === "ANTES") || []
              ).map((p) => ({ ...p, preview: p.url })),
              fotosDurante: (
                data.fotos?.filter((f) => f.tipoFoto === "DURANTE") || []
              ).map((p) => ({ ...p, preview: p.url })),
              fotosDepois: (
                data.fotos?.filter((f) => f.tipoFoto === "DEPOIS") || []
              ).map((p) => ({ ...p, preview: p.url })),
            };
            setOsData(finalOsData);
            setInitialOsData(JSON.parse(JSON.stringify(finalOsData)));
          }
        } catch (error) {
          toast.error(error.message || "Falha ao carregar dados da OS.");
          navigate("/servicos-os");
        } finally {
          setLoading(false);
        }
      };
      fetchOsData();
    }
  }, [osId, isEditMode, user, navigate]);

  const substationsToDisplay = useMemo(() => {
    if (!isEditMode) {
      return osData.subestacoes;
    }
    return osData.subestacoes
      .map((sub) => ({
        ...sub,
        componentes: sub.componentes.filter((comp) => comp.selecionado),
      }))
      .filter((sub) => sub.componentes.length > 0);
  }, [osData.subestacoes, isEditMode]);

  const handleDescriptionBlur = async (photo, category) => {
    // Não faz nada para fotos novas (que ainda não foram para o backend)
    if (photo.file) {
      return;
    }

    // Encontra a versão original da foto no estado inicial
    const initialCategoryPhotos = initialOsData?.[category] || [];
    const initialPhoto = initialCategoryPhotos.find((p) => p.id === photo.id);

    // Se a foto não existia no estado inicial ou a descrição não mudou, não faz nada
    if (!initialPhoto || initialPhoto.descricao === photo.descricao) {
      return;
    }

    try {
      // Chama a API para atualizar a descrição

      const numeroOs = osData.numeroOs;
      // Validação robusta para garantir que temos todos os dados necessários
      if (!numeroOs || !photo.cloudinaryId) {
        throw new Error(
          "Não foi possível identificar a OS ou a foto para exclusão."
        );
      }

      const response = await updatePhotoDescription(
        numeroOs,
        photo.cloudinaryId,
        photo.descricao
      );

      // Atualiza o estado inicial com a nova descrição para evitar chamadas repetidas
      // se o utilizador editar e voltar ao texto original.
      setInitialOsData((prev) => {
        const newCategory = (prev[category] || []).map((p) =>
          p.id === photo.id ? { ...p, descricao: response.data.descricao } : p
        );
        return { ...prev, [category]: newCategory };
      });
    } catch (error) {
      console.error(
        "Falha ao salvar a descrição, a reverter a alteração localmente.",
        error
      );
      // Opcional: reverte a mudança no estado se a API falhar
      setOsData((prev) => {
        const newCategory = (prev[category] || []).map((p) =>
          p.id === photo.id
            ? { ...p, descricao: initialPhoto.descricao || "" }
            : p
        );
        return { ...prev, [category]: newCategory };
      });
    }
  };

  const handleRemovePhoto = (photoToRemove, category) => {
    toast("Tem a certeza que deseja excluir esta foto?", {
      action: {
        label: "Excluir",
        onClick: async () => {
          // Se a foto tem a propriedade 'file', é uma foto nova (local).
          // Remove-a apenas do estado.
          if (photoToRemove.file) {
            setOsData((prev) => ({
              ...prev,
              [category]: prev[category].filter(
                (p) => p.id !== photoToRemove.id
              ),
            }));
            toast.success("Foto removida da lista.");
            return; // Termina a execução aqui.
          }

          // Se a foto não tem 'file', é uma foto existente no banco de dados.
          try {
            const numeroOs = osData.numeroOs;
            // Validação robusta para garantir que temos todos os dados necessários
            if (!numeroOs || !photoToRemove.cloudinaryId) {
              throw new Error(
                "Não foi possível identificar a OS ou a foto para exclusão."
              );
            }

            // Chama a API para excluir a foto usando o cloudinaryId
            await deleteOsPhoto(numeroOs, photoToRemove.cloudinaryId);

            // Após o sucesso da API, remove a foto do estado local usando o seu ID único (photoToRemove.id)
            setOsData((prev) => ({
              ...prev,
              [category]: prev[category].filter(
                (p) => p.id !== photoToRemove.id
              ),
            }));

            toast.success("Foto excluída com sucesso!");
          } catch (error) {
            // A mensagem de erro específica já é mostrada pelo photoService
            console.error("Erro ao excluir a foto:", error);
          }
        },
      },
      cancel: {
        label: "Cancelar",
      },
      duration: 10000,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (selectedClient) => {
    if (selectedClient) {
      const substationsWithSelection = (selectedClient.subestacoes || []).map(
        (sub) => ({
          ...sub,
          componentes: (sub.componentes || []).map((comp) => ({
            ...comp,
            selecionado: false,
          })),
        })
      );
      setOsData((prev) => ({
        ...prev,
        clienteId: selectedClient.id,
        cliente: selectedClient,
        subestacoes: substationsWithSelection,
      }));
    }
  };

  const handleResponsiblesChange = (name, value) => {
    setOsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubstationsChange = (updatedSubstations) => {
    setOsData((prev) => ({ ...prev, subestacoes: updatedSubstations }));
  };

  // ==================================================================
  // INÍCIO DA CORREÇÃO
  // Esta função agora recebe apenas o componente e garante que o estado
  // 'currentMeasurementInfo' seja definido antes de abrir o modal.
  // ==================================================================
  const handleOpenMeasurementModal = (component) => {
    const ensaioExistente = component.ensaios?.[0];

    setCurrentMeasurementInfo({
      component: component,
      ensaioId: ensaioExistente?.id || null,
      dadosMedicaoExistente: ensaioExistente?.dados || {},
      equipamentosUtilizados: ensaioExistente?.equipamentos || [],
      // --- CORREÇÃO APLICADA AQUI ---
      // Extrai a matrícula do responsável do ensaio existente e a passa para o modal.
      // O 'optional chaining' (?.) garante que não quebre se não houver ensaio ou responsável.
      responsavelMatricula: ensaioExistente?.responsavel?.matricula || null,
    });

    setMeasurementModalOpen(true);
  };
  // ==================================================================
  // FIM DA CORREÇÃO
  // ==================================================================

  // ==================================================================
  // CORREÇÃO APLICADA AQUI
  // A função agora se chama 'onSaveSuccess' e apenas atualiza o estado.
  // ==================================================================
  const handleSaveMeasurementSuccess = (ensaioAtualizado) => {
    toast.info("A atualizar dados locais da medição...");

    const updatedSubestacoes = osData.subestacoes.map((sub) => {
      const updatedComponentes = sub.componentes.map((comp) => {
        // Encontra o componente que foi atualizado
        if (comp.id === ensaioAtualizado.componenteId) {
          // Procura pelo ensaio dentro do componente
          const ensaioIndex = comp.ensaios.findIndex(
            (e) => e.id === ensaioAtualizado.id
          );
          const newEnsaios = [...comp.ensaios];

          if (ensaioIndex > -1) {
            // Se encontrou, atualiza o ensaio existente
            newEnsaios[ensaioIndex] = ensaioAtualizado;
          } else {
            // Se não encontrou (é um ensaio novo), adiciona-o
            newEnsaios.push(ensaioAtualizado);
          }
          return { ...comp, ensaios: newEnsaios };
        }
        return comp;
      });
      return { ...sub, componentes: updatedComponentes };
    });

    // Atualiza o estado principal da OSFormPage com os dados frescos do modal
    setOsData((prev) => ({ ...prev, subestacoes: updatedSubestacoes }));
    setMeasurementModalOpen(false); // Fecha o modal
    toast.success("Dados da medição atualizados na página.");
  };

  const handlePhotosChange = useCallback((photos, category) => {
    setOsData((prev) => ({ ...prev, [category]: photos }));
  }, []);

  const handlePhotoDescriptionChange = useCallback(
    (photoId, newDescription, category) => {
      setOsData((prev) => {
        const updatedPhotos = prev[category].map((photo) => {
          if (photo.id === photoId) {
            return { ...photo, descricao: newDescription };
          }
          return photo;
        });
        return { ...prev, [category]: updatedPhotos };
      });
    },
    []
  );

  // Substitua a função handleSubmit inteira por esta versão

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sessão inválida. Por favor, faça login novamente.");
      return;
    }

    // ==================================================================
    // INÍCIO DA CORREÇÃO
    // Verificação para garantir que pelo menos um técnico foi selecionado.
    // ==================================================================
    if (!osData.tecnicos || osData.tecnicos.length === 0) {
      toast.error("Por favor, selecione pelo menos um técnico responsável.");
      return; // Impede o envio do formulário
    }
    // ==================================================================
    // FIM DA CORREÇÃO
    // ==================================================================

    const hasSelectedComponent = osData.subestacoes.some((sub) =>
      sub.componentes?.some((comp) => comp.selecionado)
    );

    if (!hasSelectedComponent) {
      toast.error(
        "É necessário selecionar pelo menos um componente para a Ordem de Serviço."
      );
      return;
    }

    const tecnicos = osData.tecnicos || [];
    const componentesSelecionados = osData.subestacoes
      .flatMap((sub) => sub.componentes?.filter((c) => c.selecionado) || [])
      .map((c) => ({ id: c.id }));

    const subestacoesComComponentesIds = [
      ...new Set(
        osData.subestacoes
          .filter((sub) => sub.componentes?.some((c) => c.selecionado))
          .map((sub) => sub.id)
      ),
    ].map((id) => ({ id }));

    const payload = {
      responsavel: osData.responsavel,
      localizacao: osData.localizacao,
      email: osData.email,
      status: osData.status,
      contato: osData.contato,
      valorServico: parseFloat(osData.valorServico) || null,
      numeroOrcamento: osData.numeroOrcamento,
      descricaoInicial: osData.descricaoInicial,
      tipoServico: osData.tipoServico,
      previsaoInicio: osData.previsaoInicio,
      previsaoTermino: osData.previsaoTermino,
      conclusao: osData.conclusao,
      recomendacoes: osData.recomendacoes,
      tecnicos: { set: tecnicos.map((m) => ({ matricula: m })) },
      subestacoes: { set: subestacoesComComponentesIds },
      componentes: { set: componentesSelecionados },
    };

    if (osData.engenheiroMatricula) {
      payload.engenheiro = {
        connect: { matricula: osData.engenheiroMatricula },
      };
    } else if (isEditMode) {
      payload.engenheiro = { disconnect: true };
    }

    if (osData.supervisorMatricula) {
      payload.supervisor = {
        connect: { matricula: osData.supervisorMatricula },
      };
    } else if (isEditMode) {
      payload.supervisor = { disconnect: true };
    }

    if (!isEditMode) {
      payload.cliente = { connect: { id: osData.clienteId } };
    }

    const toastId = toast.loading(
      isEditMode ? "Atualizando OS..." : "Criando OS..."
    );
    setLoading(true);

    try {
      console.log(osData);
      const response = isEditMode
        ? await updateOs(osId, payload, user.matricula)
        : await createOs(payload, user.matricula);

      if (response.status !== true) {
        throw new Error(response.message || "Falha ao salvar a OS.");
      }

      const numeroOs = response.data.numeroOs || osData.numeroOs;

      // Passo 2: Fazer o upload das fotos
      toast.loading("Enviando fotos...", { id: toastId });

      const photosToUpload = [
        ...osData.fotosAntes
          .filter((p) => p.file)
          .map((p) => ({ ...p, tipo: "ANTES" })),
        ...osData.fotosDurante
          .filter((p) => p.file)
          .map((p) => ({ ...p, tipo: "DURANTE" })),
        ...osData.fotosDepois
          .filter((p) => p.file)
          .map((p) => ({ ...p, tipo: "DEPOIS" })),
      ];

      if (photosToUpload.length > 0) {
        // Cria uma lista de promessas de upload
        const uploadPromises = photosToUpload.map((photo) =>
          uploadOsPhoto(
            numeroOs,
            photo.file,
            photo.descricao,
            photo.tipo,
            user.matricula
          )
        );

        // Executa todos os uploads em paralelo
        await Promise.all(uploadPromises);
      }

      toast.success("OS e fotos salvas com sucesso!", { id: toastId });
      navigate("/servicos-os");
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <LoadingSpinner />;

  return (
    <div className="os-form-screen-container">
      <div className="container">
        <h1>
          <span className="material-icons">
            {isEditMode ? "edit_document" : "post_add"}
          </span>
          {isEditMode
            ? `Editando OS #${osData.numeroOs}`
            : "Criar Nova Ordem de Serviço"}
        </h1>
        <form className="os-form" onSubmit={handleSubmit}>
          <OSDetailsForm
            osData={osData}
            handleInputChange={handleInputChange}
            onClientSelect={handleClientSelect}
            isEditMode={isEditMode}
            userMatricula={user?.matricula}
            isDisabled={isTecnico}
          />
          <TechnicianSelection
            osData={osData}
            handleResponsiblesChange={handleResponsiblesChange}
            userMatricula={user?.matricula}
            isDisabled={isTecnico}
          />
          <SubstationsForm
            substations={substationsToDisplay}
            onChange={handleSubstationsChange}
            onOpenMeasurementModal={handleOpenMeasurementModal}
            isOsForm={true}
            isEditMode={isEditMode}
            isDisabled={isTecnico}
          />
          <ConclusionSection
            osData={osData}
            handleInputChange={handleInputChange}
            isDisabled={isTecnico}
          />
          <div className="form-section">
            <h3>
              <span className="material-icons">camera_alt</span> Registros
              Fotográficos
            </h3>
            <PhotoUploadBlock
              title="Antes do Serviço"
              name="fotosAntes"
              photos={osData.fotosAntes || []}
              onPhotosChange={handlePhotosChange}
              onPhotoDescriptionChange={handlePhotoDescriptionChange}
              onPhotoRemove={handleRemovePhoto}
              onDescriptionBlur={handleDescriptionBlur}
            />
            <PhotoUploadBlock
              title="Durante o Serviço"
              name="fotosDurante"
              photos={osData.fotosDurante || []}
              onPhotosChange={handlePhotosChange}
              onPhotoDescriptionChange={handlePhotoDescriptionChange}
              onPhotoRemove={handleRemovePhoto}
              onDescriptionBlur={handleDescriptionBlur}
            />
            <PhotoUploadBlock
              title="Depois do Serviço"
              name="fotosDepois"
              photos={osData.fotosDepois || []}
              onPhotosChange={handlePhotosChange}
              onPhotoDescriptionChange={handlePhotoDescriptionChange}
              onPhotoRemove={handleRemovePhoto}
              onDescriptionBlur={handleDescriptionBlur}
            />
          </div>
          <div className="form-actions">
            <Button
              type="button"
              variant="cancel"
              onClick={() => navigate("/servicos-os")}
            >
              <span className="material-icons">close</span> Cancelar
            </Button>
            {!isTecnico && (
              <Button type="submit" variant="primary" disabled={loading}>
                <span className="material-icons">save</span> Salvar OS
              </Button>
            )}
          </div>
        </form>
      </div>
      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onRequestClose={() => setMeasurementModalOpen(false)}
        currentMeasurement={currentMeasurementInfo}
        numeroOs={osData.numeroOs}
        onSaveSuccess={handleSaveMeasurementSuccess}
        isDisabled={isTecnico}
      />
    </div>
  );
}

export default OSFormPage;
