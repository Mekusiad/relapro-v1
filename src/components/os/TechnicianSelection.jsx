// src/components/os/TechnicianSelection.jsx

import React, { useState, useEffect, useCallback } from "react";
import { getTechnicians } from "../../services/technicianService.js";
import { CheckCircle2, User, Users, Shield } from "lucide-react";
import "../../styles/os-form.css"; // O estilo será adicionado neste arquivo

function TechnicianSelection({
  osData,
  handleResponsiblesChange,
  userMatricula,
  isDisabled,
}) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTechs = useCallback(async () => {
    if (!userMatricula) return;
    setLoading(true);
    try {
      const data = await getTechnicians({ matricula: userMatricula });
      setTechnicians(data.funcionarios || []);
    } catch (error) {
      console.error("Falha ao carregar técnicos:", error);
    } finally {
      setLoading(false);
    }
  }, [userMatricula]);

  useEffect(() => {
    loadTechs();
  }, [loadTechs]);

  // Handler para seleção única (Engenheiro, Supervisor)
  const handleSingleSelect = (role, matricula) => {
    if (isDisabled) return;
    const currentMatricula = osData[role];
    // Se clicar no mesmo, desmarca. Senão, marca o novo.
    const newMatricula = currentMatricula === matricula ? null : matricula;
    handleResponsiblesChange(role, newMatricula);
  };

  // Handler para seleção múltipla (Técnicos)
  const handleMultiSelect = (matricula) => {
    if (isDisabled) return;
    const currentTecnicos = osData.tecnicos || [];
    const isSelected = currentTecnicos.includes(matricula);

    let newTecnicos;
    if (isSelected) {
      // Remove o técnico se já estiver selecionado
      newTecnicos = currentTecnicos.filter(
        (techMatricula) => techMatricula !== matricula
      );
    } else {
      // Adiciona o técnico se não estiver selecionado
      newTecnicos = [...currentTecnicos, matricula];
    }
    handleResponsiblesChange("tecnicos", newTecnicos);
  };

  const renderTechnicianList = (role, title, icon, isMultiSelect = false) => {
    const filteredTechs = technicians.filter((t) => t.nivelAcesso === role);

    if (filteredTechs.length === 0) return null;
    return (
      <div className="technician-role-group">
        <h4 className="technician-role-title">
          {icon} {title}
        </h4>
        <div className="technician-selection-grid">
          {filteredTechs.map((tech) => {
            const isSelected = isMultiSelect
              ? osData.tecnicos?.includes(tech.matricula)
              : osData[role.toLowerCase() + "Matricula"] === tech.matricula;

            // ==================================================================
            // CORREÇÃO 1: Adicionar uma classe CSS para o estado desabilitado
            // ==================================================================
            const cardClasses = `technician-select-card ${
              isSelected ? "selected" : ""
            } ${isDisabled ? "disabled" : ""}`; // <-- ADICIONADO

            // Ação de clique original
            const baseOnClickAction = isMultiSelect
              ? () => handleMultiSelect(tech.matricula)
              : () =>
                  handleSingleSelect(
                    role.toLowerCase() + "Matricula",
                    tech.matricula
                  );

            // ==================================================================
            // CORREÇÃO 2: Verificar a prop `isDisabled` ANTES de executar a ação
            // ==================================================================
            const onClickAction = isDisabled ? () => {} : baseOnClickAction;

            return (
              <div
                key={tech.matricula}
                className={cardClasses}
                onClick={onClickAction}
                disabled={isDisabled}
              >
                {isSelected && (
                  <CheckCircle2 size={20} className="selection-checkmark" />
                )}
                <div className="technician-avatar-small">
                  {tech.nome.charAt(0)}
                </div>
                <div className="technician-info-small">
                  <span className="technician-name-small">{tech.nome}</span>
                  <span className="technician-role-small">{tech.cargo}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <p>Carregando equipe...</p>;
  }

  return (
    <div className="form-section">
      <h3>
        <Users size={24} /> Equipe Responsável
      </h3>
      {renderTechnicianList(
        "ENGENHEIRO",
        "Engenheiro Responsável",
        <Shield size={18} />
      )}
      {renderTechnicianList(
        "SUPERVISOR",
        "Supervisor Responsável",
        <User size={18} />
      )}
      {renderTechnicianList(
        "TECNICO",
        "Técnicos na Equipe",
        <Users size={18} />,
        true
      )}
    </div>
  );
}

export default TechnicianSelection;
