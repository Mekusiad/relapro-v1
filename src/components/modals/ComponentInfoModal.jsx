// src/components/modals/ComponentInfoModal.jsx

import React, { useState, useEffect } from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx";
import Button from "../ui/Button.jsx";

import "../../styles/modals.css";

// Importe TODOS os formulários de informação
import ResistorAterramentoForm from "../forms/info/ResistorAterramentoForm.jsx";
import PararaiosForm from "../forms/info/PararaiosForm.jsx";
import CabosEMuflasForm from "../forms/info/CabosEMuflasForm.jsx";
import ChaveSeccionadoraAltaTensaoForm from "../forms/info/ChaveSeccionadoraAltaTensaoForm.jsx";
import ChaveSeccionadoraMediaTensaoForm from "../forms/info/ChaveSeccionadoraMediaTensaoForm.jsx";
import DisjuntorMediaTensaoForm from "../forms/info/DisjuntorMediaTensaoForm.jsx";
import DisjuntorAltaTensaoForm from "../forms/info/DisjuntorAltaTensaoForm.jsx";
import TransformadorAltaTensaoForm from "../forms/info/TransformadorAltaTensaoForm.jsx";
import TransformadorPotencialForm from "../forms/info/TransformadorPotencialForm.jsx";
import TransformadorCorrenteForm from "../forms/info/TransformadorCorrenteForm.jsx";
import TransformadorMediaTensaoForm from "../forms/info/TransformadorMediaTensaoForm.jsx";
import BancoDeBateriasForm from "../forms/info/BancoDeBateriasForm.jsx";
import MalhaAterramentoForm from "../forms/info/MalhaAterramentoForm.jsx";

function ComponentInfoModal({ isOpen, onRequestClose, component, onSave }) {
  const [infoData, setInfoData] = useState({});

  useEffect(() => {
    if (isOpen && component) {
      // ==================================================================
      // INÍCIO DA CORREÇÃO
      // O estado agora é inicializado com o objeto 'info' de dentro do componente,
      // e não com o componente inteiro. Isso garante que estamos editando
      // apenas os dados corretos.
      // ==================================================================
      setInfoData(component.info || {});
      // ==================================================================
      // FIM DA CORREÇÃO
      // ==================================================================
    }
  }, [isOpen, component]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInfoData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(infoData);
  };

  const renderFormContent = () => {
    if (!component) return null;

    // A lógica de renderização dos formulários continua a mesma
    switch (component.tipo) {
      case "CHAVE_SECCIONADORA_ALTA":
        return (
          <ChaveSeccionadoraAltaTensaoForm
            data={infoData}
            onChange={handleChange}
          />
        );
      case "CHAVE_SECCIONADORA_MEDIA":
        return (
          <ChaveSeccionadoraMediaTensaoForm
            data={infoData}
            onChange={handleChange}
          />
        );
      case "DISJUNTOR_ALTA":
        return (
          <DisjuntorAltaTensaoForm data={infoData} onChange={handleChange} />
        );
      case "DISJUNTOR_MEDIA":
        return (
          <DisjuntorMediaTensaoForm data={infoData} onChange={handleChange} />
        );
      case "TRAFO_ALTA":
        return (
          <TransformadorAltaTensaoForm
            data={infoData}
            onChange={handleChange}
          />
        );
      case "TRAFO_MEDIA":
        return (
          <TransformadorMediaTensaoForm
            data={infoData}
            onChange={handleChange}
          />
        );
      case "TRAFO_POTENCIAL":
        return (
          <TransformadorPotencialForm data={infoData} onChange={handleChange} />
        );
      case "TRAFO_CORRENTE":
        return (
          <TransformadorCorrenteForm data={infoData} onChange={handleChange} />
        );
      case "BATERIA":
        return <BancoDeBateriasForm data={infoData} onChange={handleChange} />;
      case "PARARAIO":
        return <PararaiosForm data={infoData} onChange={handleChange} />;
      case "CABOMUFLA":
        return <CabosEMuflasForm data={infoData} onChange={handleChange} />;
      case "RESISTOR":
        return (
          <ResistorAterramentoForm data={infoData} onChange={handleChange} />
        );
      case "MALHA":
        return <MalhaAterramentoForm data={infoData} onChange={handleChange} />;
      default:
        return (
          <div className="info-form-grid">
            <div className="form-group">
              <label>Localização:</label>
              <input
                type="text"
                id="localizacao"
                name="localizacao"
                className="input"
                value={infoData.localizacao || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Fabricante:</label>
              <input
                type="text"
                id="fabricante"
                name="fabricante"
                className="input"
                value={infoData.fabricante || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <form onSubmit={handleSubmit}>
        <h2 className="main-title">Informações do Componente</h2>
        <p
          style={{
            textAlign: "center",
            marginTop: "-1rem",
            marginBottom: "2rem",
            fontWeight: "500",
          }}
        >
          {component?.nomeEquipamento}
        </p>
        {renderFormContent()}
        <div
          className="form-actions"
          style={{
            justifyContent: "flex-end",
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <Button type="button" variant="cancel" onClick={onRequestClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}

export default ComponentInfoModal;
