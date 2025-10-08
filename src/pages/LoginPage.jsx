import React, { useState, useRef, useEffect } from "react"; // Adicionado useRef e useEffect
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Lock,
  ArrowRight,
  ClipboardList,
  Eye,
  EyeOff,
} from "lucide-react";

import "../styles/login.css";

function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // ==================================
  // INÍCIO DA MUDANÇA (Efeito de Brilho)
  // ==================================
  const sidebarRef = useRef(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleMouseMove = (e) => {
      const rect = sidebar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      sidebar.style.setProperty('--x', `${x}px`);
      sidebar.style.setProperty('--y', `${y}px`);
    };

    sidebar.addEventListener('mousemove', handleMouseMove);

    return () => {
      sidebar.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  // ==================================
  // FIM DA MUDANÇA
  // ==================================

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await login(usuario, senha);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card">
        <aside className="login-sidebar" ref={sidebarRef}> {/* Adicionado ref aqui */}
          <div className="sidebar-content">
            <h1 className="logo">
              <ClipboardList size={40} />
              <span>Nexus Control</span>
            </h1>
            <p className="subtitle">
              Gestão Inteligente de Ordens de Serviço e Ativos Elétricos.
            </p>
          </div>
        </aside>

        <main className="login-content">
          <div className="login-box">
            <h2 className="title">Bem-vindo de volta!</h2>
            <p className="welcome-message">
              Faça login para acessar seu painel de controle.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group-icon">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  placeholder="Usuário"
                  autoComplete="username"
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group-icon">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                />
                <div
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
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

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;