// src/components/modals/TechnicianFormModal.jsx
import React, { useState, useEffect } from "react";
import AnimatedModal from "../ui/AnimatedModal.jsx";
import Button from "../ui/Button.jsx";

function TechnicianFormModal({ isOpen, onRequestClose, technician, onSave }) {
  // 1. Adicionar o campo 'senha' ao estado inicial do formulário
  const initialState = {
    nome: "",
    cargo: "",
    matricula: "",
    nivelAcesso: "TECNICO",
    usuario: "",
    senha: "",
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    // Ao abrir o modal, se for edição, preenche com os dados. Se for novo, reseta o estado.
    if (isOpen) {
      if (technician) {
        setFormData({ ...initialState, ...technician, senha: "" }); // Garante que a senha esteja vazia em modo de edição
      } else {
        setFormData(initialState);
      }
    }
  }, [technician, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEditMode = !!technician;

  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2 className="main-title">
        {isEditMode ? "Editar Técnico" : "Cadastrar Novo Técnico"}
      </h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cargo">Cargo</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="matricula">Matrícula</label>
          <input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            required
            disabled={isEditMode}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="usuario">Usuário</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* 2. Adicionar o campo de senha, que só aparece no modo de CADASTRO */}
        {!isEditMode && (
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required={!isEditMode} // Obrigatório apenas ao criar
              className="input"
              autoComplete="new-password" // Ajuda a evitar preenchimento automático
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="nivelAcesso">Nível de Acesso</label>
          <select
            name="nivelAcesso"
            value={formData.nivelAcesso}
            onChange={handleChange}
            className="input"
          >
            <option value="OUTRO">Outros</option>
            <option value="TECNICO">Técnico</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ENGENHEIRO">Engenheiro</option>
            <option value="ADMIN">Administrador</option>
            <option value="GERENTE">Gerente</option>
          </select>
        </div>
        <div
          className="form-actions"
          style={{ justifyContent: "flex-end", display: "flex", gap: "1rem" }}
        >
          <Button type="button" variant="cancel" onClick={onRequestClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? "Salvar Alterações" : "Cadastrar Técnico"}
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}

export default TechnicianFormModal;
