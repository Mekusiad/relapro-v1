// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // A fonte da verdade para autenticação
import { User, Lock, ArrowRight } from "lucide-react";
import "../styles/login.css";

function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Pegamos a função de login diretamente do nosso contexto

  // Define para onde o usuário deve ser redirecionado após o login.
  // Se ele tentou acessar uma página privada antes, será enviado para lá.
  // Caso contrário, vai para o dashboard.
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Impede múltiplos envios

    setLoading(true);
    setError("");

    try {
      // Chama a função de login do AuthContext
      await login(usuario, senha);
      // Navega para a rota de destino em caso de sucesso
      navigate(from, { replace: true });
    } catch (err) {
      // Captura e exibe o erro retornado pelo contexto
      setError(err.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      // Garante que o estado de loading seja desativado, mesmo se der erro
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-sidebar">
        <div className="sidebar-content">
          <h1>Nexus Control</h1>
          <p>Gestão Inteligente de Ordens de Serviço e Ativos Elétricos.</p>
        </div>
      </div>

      <main className="login-main">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Bem-vindo de volta!</h2>
            <p>Faça login para acessar seu painel de controle.</p>
          </div>

          <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
            <div className="form-group-icon">
              <User className="input-icon" size={20} />
              <input
                type="text"
                id="usuario"
                placeholder="Usuário"
                autoComplete="username"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group-icon">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" /> Lembrar-me
              </label>
              <a href="#" className="forgot-password-link">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
