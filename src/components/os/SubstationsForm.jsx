// src/components/os/SubstationsForm.jsx

import React, { useState, useEffect, useMemo } from "react";
import Button from "../ui/Button.jsx";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
} from "lucide-react";
import "../../styles/os-form.css";
// 1. IMPORTAR a função 'isUUID'
import { isUUID } from "../../services/clientService.js";

const COMPONENTES_PADRAO = [
  { nome: "Malha de aterramento", tipo: "MALHA" },
  { nome: "Resistor de aterramento", tipo: "RESISTOR" },
  { nome: "Pára-raios", tipo: "PARARAIO" },
  { nome: "Cabos e muflas", tipo: "CABOMUFLA" },
  { nome: "Chave seccionadora de alta tensão", tipo: "CHAVE_SECCIONADORA_ALTA" },
  { nome: "Chave seccionadora de média tensão", tipo: "CHAVE_SECCIONADORA_MEDIA" },
  { nome: "Disjuntor de alta tensão", tipo: "DISJUNTOR_ALTA" },
  { nome: "Disjuntor de média tensão", tipo: "DISJUNTOR_MEDIA" },
  { nome: "Transformador de potência de alta tensão", tipo: "TRAFO_ALTA" },
  { nome: "TP (Transformador de Potencial)", tipo: "TRAFO_POTENCIAL" },
  { nome: "TC (Transformador de Corrente)", tipo: "TRAFO_CORRENTE" },
  { nome: "Transformador de média tensão", tipo: "TRAFO_MEDIA" },
  { nome: "Banco de baterias", tipo: "BATERIA" },
];

function SubstationsForm({
  substations = [],
  onChange,
  isOsForm,
  isEditMode,
  onOpenInfoModal,
  onOpenMeasurementModal,
}) {
  const [activeTab, setActiveTab] = useState(null);
  const [newSubstationName, setNewSubstationName] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    if (substations.length > 0) {
      const activeExists = substations.some((s) => s.id === activeTab);
      if (!activeTab || !activeExists) {
        setActiveTab(substations[0].id);
      }
    } else {
      setActiveTab(null);
    }
  }, [substations, activeTab]);

  const handleAddSubstation = () => {
    if (newSubstationName.trim()) {
      const newSubstation = {
        id: `sub-${Date.now()}`,
        nome: newSubstationName.trim(),
        componentes: [],
      };
      const newSubstations = [...substations, newSubstation];
      onChange(newSubstations);
      setActiveTab(newSubstation.id);
      setNewSubstationName("");
    }
  };

  const handleRemoveSubstation = (substationId) => {
    const newSubstations = substations.filter((s) => s.id !== substationId);
    onChange(newSubstations);
  };

  const handleAddComponent = (componentType) => {
    if (!componentType || !activeTab) return;
    const template = COMPONENTES_PADRAO.find((c) => c.tipo === componentType);
    if (!template) return;
    const newComponent = {
      id: `comp-${Date.now()}`,
      nomeEquipamento: template.nome,
      tipo: template.tipo,
      info: {},
    };
    const newSubstations = substations.map((sub) =>
      String(sub.id) === String(activeTab)
        ? { ...sub, componentes: [...(sub.componentes || []), newComponent] }
        : sub
    );
    onChange(newSubstations);
  };

  const handleRemoveComponentUnit = (substationId, componentId) => {
    const newSubstations = substations.map((sub) =>
      String(sub.id) === String(substationId)
        ? {
            ...sub,
            componentes: sub.componentes.filter(
              (c) => String(c.id) !== String(componentId)
            ),
          }
        : sub
    );
    onChange(newSubstations);
  };

  const handleToggleComponent = (substationId, componentId) => {
    const updatedSubstations = substations.map((sub) => {
      if (sub.id === substationId) {
        return {
          ...sub,
          componentes: sub.componentes.map((comp) =>
            comp.id === componentId
              ? { ...comp, selecionado: !comp.selecionado }
              : comp
          ),
        };
      }
      return sub;
    });
    onChange(updatedSubstations);
  };

  const toggleGroup = (substationId, tipo) => {
    const key = `${substationId}-${tipo}`;
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSubstation = useMemo(
    () => substations.find((s) => String(s.id) === String(activeTab)),
    [substations, activeTab]
  );

  const groupedComponents = useMemo(() => {
    if (!currentSubstation?.componentes) return {};
    return currentSubstation.componentes.reduce((acc, comp) => {
      (acc[comp.tipo] = acc[comp.tipo] || []).push(comp);
      return acc;
    }, {});
  }, [currentSubstation]);

  return (
    <div className="form-section">
      <h3>
        <span className="material-icons">electrical_services</span> Subestações
        e Componentes
      </h3>
      
      {!isOsForm && (
        <div className="add-substation-container">
          <input
            type="text"
            value={newSubstationName}
            onChange={(e) => setNewSubstationName(e.target.value)}
            placeholder="Nome da nova subestação"
            className="input"
          />
          <Button type="button" onClick={handleAddSubstation}>
            {" "}
            <Plus size={18} /> Adicionar Subestação{" "}
          </Button>
        </div>
      )}

      {substations.length > 0 && currentSubstation && (
        <div className="substation-tabs-wrapper">
          <div className="tabs-container">
            {substations.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={`tab-item ${activeTab === sub.id ? "active" : ""}`}
                onClick={() => setActiveTab(sub.id)}
              >
                {sub.nome}
              </button>
            ))}
          </div>
          <div className="tab-content">
            <div className="substation-header">
              <h4>Componentes de "{currentSubstation.nome}"</h4>
              {!isOsForm && (
                <Button
                  type="button"
                  variant="danger-outline"
                  size="sm"
                  onClick={() => handleRemoveSubstation(activeTab)}
                >
                  <Trash2 size={16} /> Remover Subestação
                </Button>
              )}
            </div>

            {!isOsForm && (
              <div className="add-component-section">
                <div className="form-group">
                  <label>Adicionar novo componente a esta subestação:</label>
                  <div className="component-template-list">
                    {COMPONENTES_PADRAO.map((c) => (
                      <div key={c.tipo} className="component-template-item">
                        <span>{c.nome}</span>
                        <Button
                          type="button"
                          variant="secondary-outline"
                          size="sm"
                          onClick={() => handleAddComponent(c.tipo)}
                        >
                          <Plus size={16} /> Adicionar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="component-list-container">
              {Object.keys(groupedComponents).length > 0 ? (
                Object.entries(groupedComponents).map(([tipo, instances]) => {
                  const key = `${currentSubstation.id}-${tipo}`;
                  const isExpanded = expandedGroups[key] ?? true;

                  return (
                    <div key={key} className="component-group">
                      <div
                        className="component-group-header"
                        onClick={() => toggleGroup(currentSubstation.id, tipo)}
                      >
                        <strong>{instances[0].nomeEquipamento}</strong>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span className="equipamento-badge-count">
                            {instances.length}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="component-instances-list">
                          {instances.map((instance, index) => {
                            // 2. VERIFICA se o componente é novo
                            const isNewComponent = !isUUID(instance.id);
                            
                            return (
                            <div
                              key={instance.id}
                              className="component-instance-item"
                            >
                              {isOsForm ? (
                                isEditMode ? (
                                  <div className="component-selector non-clickable">
                                    <CheckSquare
                                      size={20}
                                      className="checkbox-icon checked"
                                    />
                                    <span>Unidade {index + 1}</span>
                                  </div>
                                ) : (
                                  <div
                                    className="component-selector"
                                    onClick={() =>
                                      handleToggleComponent(
                                        currentSubstation.id,
                                        instance.id
                                      )
                                    }
                                  >
                                    {instance.selecionado ? (
                                      <CheckSquare
                                        size={20}
                                        className="checkbox-icon checked"
                                      />
                                    ) : (
                                      <Square
                                        size={20}
                                        className="checkbox-icon"
                                      />
                                    )}
                                    <span>Unidade {index + 1}</span>
                                  </div>
                                )
                              ) : (
                                <span>Unidade {index + 1}</span>
                              )}

                              <div className="component-actions">
                                {isOsForm ? (
                                  <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => onOpenMeasurementModal(instance)}
                                  >
                                    Medições
                                  </Button>
                                ) : (
                                  <>
                                    {/* 3. APLICA a lógica de desabilitar e a dica */}
                                    <Button
                                      size="sm"
                                      type="button"
                                      onClick={() =>
                                        onOpenInfoModal(
                                          instance,
                                          currentSubstation.id
                                        )
                                      }
                                      disabled={isNewComponent}
                                      title={isNewComponent ? "Salve o cliente para poder editar os detalhes deste novo componente." : "Editar informações do componente"}
                                    >
                                      Editar Info
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="danger-outline"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveComponentUnit(
                                          currentSubstation.id,
                                          instance.id
                                        )
                                      }
                                    >
                                      Remover
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          )})}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="hint-details">
                  Nenhum componente nesta subestação.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {substations.length === 0 && (
        <p className="hint">Nenhuma subestação associada a este cliente.</p>
      )}
    </div>
  );
}

export default SubstationsForm;