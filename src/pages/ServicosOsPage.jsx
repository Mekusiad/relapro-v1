import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getServiceOrdersPageData,
  deleteOs,
  generateDadosPDF,
} from "../services/osService.js";
import { getTechnicians } from "../services/technicianService.js";
import { formatDate, translateStatus } from "../utils/helpers.js";
import { gerarRelatorioPDF } from "../services/pdfService.jsx";
import { SERVICE_TYPE_NAMES } from "../utils/helpers.js";
import {
  ClipboardList,
  Edit,
  FileText,
  Trash2,
  Loader,
  FolderOpen,
  Hourglass,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Filter,
  X,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import ConfirmationModal from "../components/modals/ConfirmationModal.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

// Função auxiliar para verificar se algum filtro está ativo
const areFiltersActive = (filters) => {
  return Object.entries(filters).some(
    ([key, value]) => key !== "page" && value !== "" && value !== null
  );
};

function ServicosOsPage() {
  const navigate = useNavigate();
  const hoje = new Date();
  const primeiroDiaDoAno = new Date(hoje.getFullYear(), 0, 1);
  const [allOs, setAllOs] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

const [filters, setFilters] = useState({
  clienteId: "",
  tipoServico: "",
  status: "",
  dataInicio: primeiroDiaDoAno.toISOString().split("T")[0], // yyyy-mm-dd
  dataFim: hoje.toISOString().split("T")[0],                 // yyyy-mm-dd
  page: 1,
});

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [osToDelete, setOsToDelete] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(null);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // AJUSTE: Limpa os filtros antes de enviar para o backend
      const cleanFilters = {};
      for (const key in filters) {
        if (filters[key] !== "" && filters[key] !== null) {
          cleanFilters[key] = filters[key];
        }
      }

      // Passa a matrícula do usuário e os filtros limpos
      const data = await getServiceOrdersPageData(user.matricula, cleanFilters);
      setAllOs(data.ordens);
      setClients(data.clientes);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      toast.error(error.message || "Falha ao carregar dados da página.");
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const osStats = useMemo(() => {
    // Esta estatística agora refletirá apenas a página atual.
    // Para estatísticas totais, o backend precisaria enviá-las.
    return allOs.reduce(
      (acc, os) => {
        const statusKey = os.status.toLowerCase().replace(/ /g, "_");
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
      },
      {
        aberta: 0,
        em_andamento: 0,
        finalizada: 0,
        aguardando_pecas: 0,
        cancelada: 0,
      }
    );
  }, [allOs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 })); // Reseta para a página 1 ao mudar um filtro
  };

  const handleClearFilters = () => {
    setFilters({
      clienteId: "",
      tipoServico: "",
      status: "",
      dataInicio: "",
      dataFim: "",
      page: 1,
    });
  };

  const handleDeleteClick = (os) => {
    setOsToDelete(os);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (osToDelete && user) {
      const toastId = toast.loading("Excluindo Ordem de Serviço...");
      try {
        const response = await deleteOs(user.matricula, osToDelete.id);
        if (response.status === true) {
          toast.success(response.message, { id: toastId });
          loadData(); // Recarrega os dados da página atual
        } else {
          toast.error(response.message, { id: toastId });
        }
      } catch (error) {
        toast.error(error.message, { id: toastId });
      } finally {
        setIsConfirmModalOpen(false);
        setOsToDelete(null);
      }
    }
  };

  const handleGeneratePdf = async (os) => {
    if (!user) return;
    setIsGeneratingPdf(os.id);
    const toastId = toast.loading("Gerando relatório PDF...");
    try {
      const [osDetails, allTechnicians] = await Promise.all([
        generateDadosPDF(user.matricula, os.id),
        getTechnicians(user.matricula), // Assumindo que getTechnicians precisa da matrícula
      ]);

      await gerarRelatorioPDF(osDetails.data, allTechnicians.funcionarios);
      toast.success("PDF gerado com sucesso!", { id: toastId });
    } catch (error) {
      console.error("Erro ao preparar dados para o PDF:", error);
      toast.error(error.message || "Não foi possível gerar o PDF.", {
        id: toastId,
      });
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="container">
      <div className="screen-header">
        <h1>
          <ClipboardList size={32} /> Ordens de Serviço
        </h1>
        <Button variant="primary" onClick={() => navigate("/os/new")}>
          <Plus size={20} /> Adicionar OS
        </Button>
      </div>

      <div className="os-stats-grid">
        <div className="os-stat-card">
          <div className="os-stat-icon icon-aberta">
            <FolderOpen size={32} />
          </div>
          <div className="os-stat-info">
            <span className="os-stat-value">{osStats.aberta || 0}</span>
            <span className="os-stat-label">Abertas</span>
          </div>
        </div>
        <div className="os-stat-card">
          <div className="os-stat-icon icon-andamento">
            <Hourglass size={32} />
          </div>
          <div className="os-stat-info">
            <span className="os-stat-value">{osStats.em_andamento || 0}</span>
            <span className="os-stat-label">Em Andamento</span>
          </div>
        </div>
        <div className="os-stat-card">
          <div className="os-stat-icon icon-pendente">
            <Clock size={32} />
          </div>
          <div className="os-stat-info">
            <span className="os-stat-value">
              {osStats.aguardando_pecas || 0}
            </span>
            <span className="os-stat-label">Pendentes</span>
          </div>
        </div>
        <div className="os-stat-card">
          <div className="os-stat-icon icon-finalizada">
            <CheckCircle2 size={32} />
          </div>
          <div className="os-stat-info">
            <span className="os-stat-value">{osStats.finalizada || 0}</span>
            <span className="os-stat-label">Finalizadas</span>
          </div>
        </div>
        <div className="os-stat-card">
          <div className="os-stat-icon icon-cancelada">
            <XCircle size={32} />
          </div>
          <div className="os-stat-info">
            <span className="os-stat-value">{osStats.cancelada || 0}</span>
            <span className="os-stat-label">Canceladas</span>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="clienteId">Cliente</label>
          <select
            name="clienteId"
            id="clienteId"
            value={filters.clienteId}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">Todos</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="tipoServico">Tipo de Serviço</label>
          <select
            name="tipoServico"
            id="tipoServico"
            value={filters.tipoServico}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">Todos</option>
            {Object.entries(SERVICE_TYPE_NAMES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="input"
          >
            <option value="">Todos</option>
            <option value="ABERTA">Aberta</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="AGUARDANDO_PECAS">Aguardando Peças</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="dataInicio">De</label>
          <input
            type="date"
            name="dataInicio"
            id="dataInicio"
            value={filters.dataInicio}
            onChange={handleFilterChange}
            className="input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="dataFim">Até</label>
          <input
            type="date"
            name="dataFim"
            id="dataFim"
            value={filters.dataFim}
            onChange={handleFilterChange}
            className="input"
          />
        </div>
        {areFiltersActive(filters) && (
            <div className="filter-actions">
                <Button variant="cancel" onClick={handleClearFilters}>
                    <X size={16} /> Limpar
                </Button>
            </div>
        )}
      </div>

      <div className="content-card">
        <table className="os-results-table">
          <thead>
            <tr>
              <th>Nº OS</th>
              <th>Cliente</th>
              <th>Tipo de Serviço</th>
              <th>Data Início</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "1.5rem" }}
                >
                  <Loader className="animate-spin" />
                </td>
              </tr>
            ) : allOs.length > 0 ? (
              allOs.map((os) => (
                <tr key={os.id}>
                  <td data-label="Nº OS">
                    <strong>#{os.numeroOs}</strong>
                  </td>
                  <td data-label="Cliente">{os.clienteNome}</td>
                  <td data-label="Tipo de Serviço">
                    {SERVICE_TYPE_NAMES[os.tipoServico] || os.tipoServico}
                  </td>
                  <td data-label="Data Início">{formatDate(os.previsaoInicio)}</td>
                  <td data-label="Status">
                    <span
                      className={`os-status status-${os.status
                        .toLowerCase()
                        .replace(/ /g, "_")}`}
                    >
                      {translateStatus(os.status)}
                    </span>
                  </td>
                  <td data-label="Ações">
                    <div className="table-actions-centered">
                      <Link to={`/os/edit/${os.id}`} title="Ver/Editar">
                        <Button variant="icon" size="sm">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={() => handleGeneratePdf(os)}
                        title="Gerar PDF"
                        disabled={isGeneratingPdf === os.id}
                      >
                        {isGeneratingPdf === os.id ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <FileText size={16} />
                        )}
                      </Button>
                      <Button
                        variant="icon-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(os)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "1.5rem" }}
                >
                  Nenhuma OS encontrada com os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {pagination.totalPages > 1 && (
          <div className="pagination-controls">
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Anterior
            </Button>
            <span>
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Próximo
            </Button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Você tem certeza que deseja excluir a OS #${osToDelete?.numeroOs}?`}
      />
    </div>
  );
}

export default ServicosOsPage;