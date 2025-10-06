// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getServiceOrdersPageData } from "../services/osService.js";
import { translateStatus } from "../utils/helpers.js";

import Button from "../components/ui/Button.jsx";
import PerformanceChart from "../components/ui/PerformanceChart.jsx";
import {
  FolderOpen,
  Hourglass,
  CheckCircle2,
  CircleDollarSign,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import "../styles/dashboard.css";

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    estatisticasOS: { abertas: 0, andamento: 0, finalizadas: 0 },
    ordens: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recentes");
  const { user } = useAuth(); // 1. Pega o usuário logado do contexto

  // 2. Ajusta a função para buscar dados reais da API
  const loadData = useCallback(async () => {
    if (!user) return; // Aguarda o usuário estar disponível

    setLoading(true);
    try {
      // Busca as ordens de serviço (ex: as 50 mais recentes para o dashboard)
      const data = await getServiceOrdersPageData(user.matricula, {
        page: 1,
        limit: 50,
      });

      // O backend deve enviar o total de OS por status.
      // Por enquanto, calculamos as estatísticas com base nos dados carregados.
      const stats = data.ordens.reduce(
        (acc, os) => {
          if (os.status === "ABERTA") acc.abertas += 1;
          if (os.status === "EM_ANDAMENTO") acc.andamento += 1;
          if (os.status === "FINALIZADA") acc.finalizadas += 1;
          return acc;
        },
        { abertas: 0, andamento: 0, finalizadas: 0 }
      );

      setDashboardData({
        estatisticasOS: stats,
        ordens: data.ordens,
      });
    } catch (error) {
      toast.error(error.message || "Falha ao carregar dados do dashboard.");
    } finally {
      setLoading(false);
    }
  }, [user]); // A função agora depende do usuário

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredOs = useMemo(() => {
    switch (activeTab) {
      case "andamento":
        return dashboardData.ordens.filter(
          (os) => os.status === "EM_ANDAMENTO"
        );
      case "concluidas":
        return dashboardData.ordens.filter((os) => os.status === "FINALIZADA");
      case "recentes":
      default:
        // Ordena por data e pega os 5 mais recentes da lista já carregada
        return [...dashboardData.ordens]
          .sort(
            (a, b) => new Date(b.previsaoInicio) - new Date(a.previsaoInicio)
          )
          .slice(0, 5);
    }
  }, [activeTab, dashboardData.ordens]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const { estatisticasOS } = dashboardData;

  return (
    <div className="dashboard-container">
      <div className="screen-header">
          <h1><LayoutDashboard className="header-icon" /> Dashboard</h1>
          <Link to="/os/new">
            <Button variant="primary">
              <Plus size={20} /> Nova OS
            </Button>
          </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card-v2">
          <div className="stat-icon-v2 abertas">
            <FolderOpen size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-value">{estatisticasOS.abertas}</p>
            <p className="stat-label">OS Abertas</p>
          </div>
        </div>
        <div className="stat-card-v2">
          <div className="stat-icon-v2 andamento">
            <Hourglass size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-value">{estatisticasOS.andamento}</p>
            <p className="stat-label">Em Andamento</p>
          </div>
        </div>
        <div className="stat-card-v2">
          <div className="stat-icon-v2 finalizadas">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-value">{estatisticasOS.finalizadas}</p>
            <p className="stat-label">Finalizadas</p>
          </div>
        </div>
        {/* <div className="stat-card-v2">
          <div className="stat-icon-v2 faturamento">
            <CircleDollarSign size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-value">R$ 25.400</p>
            <p className="stat-label">Faturamento (Mês)</p>
          </div>
        </div> */}
      </div>

      <div className="dashboard-main-content">
        <div className="content-card recent-os-container">
          <div className="card-header">
            <h2>Ordens de Serviço Recentes</h2>
            <div className="tabs">
              <button
                className={`tab-button ${
                  activeTab === "recentes" ? "active" : ""
                }`}
                onClick={() => setActiveTab("recentes")}
              >
                Recentes
              </button>
              <button
                className={`tab-button ${
                  activeTab === "andamento" ? "active" : ""
                }`}
                onClick={() => setActiveTab("andamento")}
              >
                Em Andamento
              </button>
              <button
                className={`tab-button ${
                  activeTab === "concluidas" ? "active" : ""
                }`}
                onClick={() => setActiveTab("concluidas")}
              >
                Concluídas
              </button>
            </div>
          </div>
          <div className="os-table-container">
            <table className="os-list-table">
              <thead>
                <tr>
                  <th>Nº OS</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOs.length > 0 ? (
                  filteredOs.map((os) => (
                    <tr key={os.id}>
                      <td>
                        <strong>#{os.numeroOs}</strong>
                      </td>
                      <td className="os-client-info">{os.clienteNome}</td>
                      <td>
                        <span
                          className={`os-status status-${os.status.toLowerCase()}`}
                        >
                          {translateStatus(os.status)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/os/edit/${os.id}`}>
                          <Button variant="secondary" size="sm">
                            Ver
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      Nenhuma OS encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* <div className="chart-container">
          <h2>Desempenho Mensal</h2>
          <PerformanceChart />
        </div> */}
      </div>
    </div>
  );
}

export default DashboardPage;