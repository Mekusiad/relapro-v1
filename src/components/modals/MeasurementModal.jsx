import React, { useState, useEffect, useCallback } from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx";
import Button from "../ui/Button.jsx";
import EquipmentSelectionModal from "./EquipmentSelectionModal.jsx";
import ComponentInfoHeader from "../ui/ComponentInfoHeader.jsx";
import { getTechnicians } from "../../services/technicianService.js";
import {
  uploadEnsaioPhoto,
  deleteOsPhoto,
  updatePhotoEnsaioDescription,
} from "../../services/photoService.js";
import {
  saveMeasurement,
  updateMeasurement,
} from "../../services/measurementService.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

import "../../styles/modals.css";
import "../../styles/measurement-modal.css";

import BancoDeBateriasMedicaoForm from "../forms/medicao/BancoDeBateriasMedicaoForm.jsx";
import MalhaAterramentoMedicaoForm from "../forms/medicao/MalhaAterramentoMedicaoForm.jsx";
import ResistorAterramentoMedicaoForm from "../forms/medicao/ResistorAterramentoMedicaoForm.jsx";
import PararaiosMedicaoForm from "../forms/medicao/PararaiosMedicaoForm.jsx";
import CabosEMuflasMedicaoForm from "../forms/medicao/CabosEMuflasMedicaoForm.jsx";
import ChaveSeccionadoraAltaTensaoMedicaoForm from "../forms/medicao/ChaveSeccionadoraAltaTensaoMedicaoForm.jsx";
import ChaveSeccionadoraMediaTensaoMedicaoForm from "../forms/medicao/ChaveSeccionadoraMediaTensaoMedicaoForm.jsx";
import DisjuntorMediaTensaoMedicaoForm from "../forms/medicao/DisjuntorMediaTensaoMedicaoForm.jsx";
import DisjuntorAltaTensaoMedicaoForm from "../forms/medicao/DisjuntorAltaTensaoMedicaoForm.jsx";
import TransformadorAltaTensaoMedicaoForm from "../forms/medicao/TransformadorAltaTensaoMedicaoForm.jsx";
import TransformadorPotencialMedicaoForm from "../forms/medicao/TransformadorPotencialMedicaoForm.jsx";
import TransformadorCorrenteMedicaoForm from "../forms/medicao/TransformadorCorrenteMedicaoForm.jsx";
import TransformadorMediaTensaoMedicaoForm from "../forms/medicao/TransformadorMediaTensaoMedicaoForm.jsx";
import { toast } from "sonner";
import PhotoUploadBlock from "../ui/PhotoUploadBlock.jsx";

const MeasurementFormContent = ({ equipmentType, data, onDataChange }) => {
  // O conteúdo deste componente permanece inalterado
  switch (equipmentType) {
    case "BATERIA":
      return (
        <BancoDeBateriasMedicaoForm data={data} onDataChange={onDataChange} />
      );
    case "MALHA":
      return (
        <MalhaAterramentoMedicaoForm data={data} onDataChange={onDataChange} />
      );
    case "RESISTOR":
      return (
        <ResistorAterramentoMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "PARARAIO":
      return <PararaiosMedicaoForm data={data} onDataChange={onDataChange} />;
    case "CABOMUFLA":
      return (
        <CabosEMuflasMedicaoForm data={data} onDataChange={onDataChange} />
      );
    case "CHAVE_SECCIONADORA_ALTA":
      return (
        <ChaveSeccionadoraAltaTensaoMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "CHAVE_SECCIONADORA_MEDIA":
      return (
        <ChaveSeccionadoraMediaTensaoMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "DISJUNTOR_MEDIA":
      return (
        <DisjuntorMediaTensaoMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "DISJUNTOR_ALTA":
      return (
        <DisjuntorAltaTensaoMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "TRAFO_ALTA":
      return (
        <TransformadorAltaTensaoMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "TRAFO_POTENCIAL":
      return (
        <TransformadorPotencialMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "TRAFO_CORRENTE":
      return (
        <TransformadorCorrenteMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    case "TRAFO_MEDIA":
      return (
        <TransformadorMediaTensaoMedicaoForm
          data={data}
          onDataChange={onDataChange}
        />
      );
    default:
      return (
        <p>Formulário de medição não encontrado para o tipo: {equipmentType}</p>
      );
  }
};

// Função helper para formatar a data para o input
const formatDateForInput = (dateString) => {
  // Se não houver data, retorna a data de hoje formatada
  if (!dateString) return new Date().toISOString().split("T")[0];
  // Se houver data, formata ela
  return new Date(dateString).toISOString().split("T")[0];
};

function MeasurementModal({
  isOpen,
  onRequestClose,
  currentMeasurement,
  numeroOs,
  onSaveSuccess,
}) {
  const { user } = useAuth();
  const [measurementData, setMeasurementData] = useState({});
  const [initialPhotos, setInitialPhotos] = useState([]); // 3. Estado para guardar as fotos originais
  // const [specificMeasurementData, setSpecificMeasurementData] = useState({});
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);

  useEffect(() => {
    if (isOpen && currentMeasurement) {
      const loadTechnicians = async () => {
        if (!user) return;
        setLoadingTechs(true);
        try {
          const data = await getTechnicians(user.matricula);
          setTechnicians(data.funcionarios || []);
        } catch (error) {
          console.error("Falha ao carregar técnicos no modal", error);
          setTechnicians([]);
        } finally {
          setLoadingTechs(false);
        }
      };
      loadTechnicians();

      const ensaioExistente = currentMeasurement.component?.ensaios?.[0] || {};
      const existingData = ensaioExistente.dados || {};

      setMeasurementData({
        ...existingData,
        responsavelMatricula:
          ensaioExistente.responsavel?.matricula || user?.matricula || "",
        dataEnsaio: formatDateForInput(ensaioExistente.dataEnsaio),
        equipamentosUtilizados: ensaioExistente.equipamentos || [],
        // 4. Inicializar o estado das fotos
        fotos: (ensaioExistente.fotos || []).map((p) => ({
          ...p,
          preview: p.fotoUrl,
        })),
      });

      // 5. Guardar uma cópia inicial das fotos para comparação posterior
      setSelectedEquipment(ensaioExistente.equipamentos || []);
      setInitialPhotos(JSON.parse(JSON.stringify(ensaioExistente.fotos || [])));
    }
  }, [isOpen, currentMeasurement, user]);

   const handleDataChange = useCallback((newData) => {
    setMeasurementData(prevData => ({ ...prevData, ...newData }));
  }, []);

  const handlePhotosChange = useCallback((updatedPhotos) => {
    setMeasurementData((prev) => ({ ...prev, fotos: updatedPhotos }));
  }, []);

  const handlePhotoDescriptionChange = useCallback(
    (photoId, newDescription) => {
      setMeasurementData((prev) => ({
        ...prev,
        fotos: prev.fotos.map((p) =>
          p.id === photoId ? { ...p, descricao: newDescription } : p
        ),
      }));
    },
    []
  );

  const handleDescriptionBlur = async (photo) => {
    if (photo.file) return; // Não salvar para fotos novas

    const initialPhoto = initialPhotos.find((p) => p.id === photo.id);
    if (!initialPhoto || initialPhoto.descricao === photo.descricao) {
      return;
    }

    try {
      const response = await updatePhotoEnsaioDescription(
        numeroOs,
        currentMeasurement.component?.ensaios?.[0].id,
        photo.cloudinaryId, 
        photo.descricao);
      // Atualiza o estado inicial para evitar chamadas repetidas
      setInitialPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, descricao: response.data.descricao } : p
        )
      );
    } catch (error) {
      // Reverte a alteração no UI se a API falhar
      setMeasurementData((prev) => ({
        ...prev,
        fotos: prev.fotos.map((p) =>
          p.id === photo.id
            ? { ...p, descricao: initialPhoto.descricao || "" }
            : p
        ),
      }));
    }
  };

  const handleRemovePhoto = (photoToRemove) => {
    toast("Tem a certeza que deseja excluir esta foto?", {
      action: {
        label: "Excluir",
        onClick: async () => {
          if (photoToRemove.file) {
            setMeasurementData((prev) => ({
              ...prev,
              fotos: prev.fotos.filter((p) => p.id !== photoToRemove.id),
            }));
            toast.success("Foto removida da lista.");
          } else {
            try {
              // Assumimos que a rota para apagar fotos de ensaios é diferente
              // Se for a mesma, precisará passar o numeroOs da OS
              // Por agora, vamos assumir uma rota /api/fotos/:fotoId
              await deleteOsPhoto(numeroOs, photoToRemove.cloudinaryId); // Você precisará criar esta função no service

              setMeasurementData((prev) => ({
                ...prev,
                fotos: prev.fotos.filter((p) => p.id !== photoToRemove.id),
              }));
              toast.success("Foto excluída com sucesso!");
            } catch (error) {
              toast.error("Erro ao excluir foto do ensaio:");
              console.error("Erro ao excluir foto do ensaio:", error);
            }
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  // ==================================================================
  // FIM DAS NOVAS FUNÇÕES
  // ==================================================================

  if (!isOpen || !currentMeasurement || !currentMeasurement.component)
    return null;

  const { component } = currentMeasurement;

  const handleEquipmentsSave = (selected) => {
    setSelectedEquipment(selected);
    setIsEquipModalOpen(false);
  };

  const removeEquipment = (equipId) => {
    setSelectedEquipment((prev) => prev.filter((e) => e.id !== equipId));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMeasurement || !user) return;
    if (selectedEquipment.length === 0) return toast.error("Selecione ao menos um equipamento.");

    setIsSaving(true);
    const toastId = toast.loading("A salvar medições...");

    const { component, ensaioId } = currentMeasurement;
    const {
      fotos,
      responsavelMatricula,
      dataEnsaio,
      ...dadosDoFormularioEspecifico
    } = measurementData;

    try {
      // 1. Salva/Atualiza os dados de texto do ensaio
      const payload = {
        tipo: component.tipo,
        dados: dadosDoFormularioEspecifico,
        equipamentosIds: selectedEquipment.map((e) => e.id),
        componenteId: component.id,
        responsavelMatricula: responsavelMatricula || user.matricula,
        dataEnsaio: dataEnsaio,
      };

      const ensaioResponse = ensaioId
        ? await updateMeasurement(user.matricula, numeroOs, ensaioId, payload)
        : await saveMeasurement(user.matricula, numeroOs, payload);

      if (!ensaioResponse || !ensaioResponse.status) {
        throw new Error(ensaioResponse.message || "Falha ao salvar os dados da medição.");
      }

      const savedEnsaio = ensaioResponse.data;

      // 2. Faz o upload das fotos NOVAS
      const fotosParaUpload = fotos.filter((p) => p.file);
      if (fotosParaUpload.length > 0) {
        toast.loading("A enviar fotos...", { id: toastId });
        const uploadPromises = fotosParaUpload.map((photo) =>
          uploadEnsaioPhoto(numeroOs, savedEnsaio.id, photo.file, photo.descricao)
        );
        // O backend deve retornar as fotos criadas
        const uploadedPhotosData = await Promise.all(uploadPromises); 
        // Adiciona as novas fotos ao objeto de ensaio para passar para o pai
        savedEnsaio.fotos = [...(savedEnsaio.fotos || []), ...uploadedPhotosData.flatMap(res => res.data)];
      }

      toast.success("Medições e fotos salvas com sucesso!", { id: toastId });
      
      // 3. Chama o callback onSaveSuccess com o objeto de ensaio completo e atualizado
      onSaveSuccess(savedEnsaio);
      onRequestClose();

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="measurement-modal"
    >
      <h2 className="main-title">Registrar Medições</h2>

      <ComponentInfoHeader component={component} />

      <form onSubmit={handleSubmit} className="form-section">
        <div
          className="form-row"
          style={{ marginTop: "1.5rem", alignItems: "flex-end" }}
        >
          <div className="form-group">
            <label htmlFor="dataEnsaio">Data do Ensaio</label>
            <input
              type="date"
              id="dataEnsaio"
              name="dataEnsaio"
              className="input"
              value={measurementData.dataEnsaio || ""}
              onChange={(e) =>
                handleDataChange({ dataEnsaio: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="responsavelMatricula">
              Responsável pelo Ensaio
            </label>
            <select
              id="responsavelMatricula"
              name="responsavelMatricula"
              className="input"
              value={measurementData.responsavelMatricula || ""}
              onChange={(e) =>
                handleDataChange({
                  ...measurementData,
                  responsavelMatricula: e.target.value
                    ? Number(e.target.value)
                    : "",
                })
              }
              disabled={loadingTechs}
            >
              <option value="">
                {loadingTechs ? "Carregando..." : "Selecione um técnico"}
              </option>
              {technicians.map((tech) => (
                <option key={tech.matricula} value={tech.matricula}>
                  {tech.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <MeasurementFormContent
          equipmentType={component.tipo}
          data={measurementData}
          onDataChange={handleDataChange}
        />

        <hr className="form-divider" />
        <h3 className="form-section-title">Fotos do Ensaio</h3>
        <PhotoUploadBlock
          
          name="fotosEnsaio"
          photos={measurementData.fotos || []}
          onPhotosChange={handlePhotosChange}
          onPhotoDescriptionChange={handlePhotoDescriptionChange}
          onPhotoRemove={handleRemovePhoto}
          onDescriptionBlur={handleDescriptionBlur}
        />

        <hr className="form-divider" />
        <h3 className="form-section-title">
          Equipamentos Utilizados no Ensaio
        </h3>
        <div className="selected-items-container">
          {(selectedEquipment || []).map((equip) => (
            <span key={equip.id} className="selected-item-tag">
              {equip.nome} ({equip.numeroSerie})
              <button
                type="button"
                className="remove-tag-btn"
                onClick={() => removeEquipment(equip.id)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary-outline"
          onClick={() => setIsEquipModalOpen(true)}
        >
          <span className="material-icons">add</span> Selecionar Equipamentos
        </Button>

        <div className="form-actions">
          <Button type="button" variant="cancel" onClick={onRequestClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Medições"}
          </Button>
        </div>
      </form>

      <EquipmentSelectionModal
        isOpen={isEquipModalOpen}
        onRequestClose={() => setIsEquipModalOpen(false)}
        onSave={handleEquipmentsSave}
        alreadySelected={selectedEquipment}
      />
    </AnimatedModal>
  );
}

export default MeasurementModal;
