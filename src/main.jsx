// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Estilos (mantidos como estão)
import "./styles/base.css";
import "./styles/buttons.css";
import "./styles/modals.css";
import "./styles/servicos-os.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/os-form.css";
import "./styles/technicians.css";
import "./styles/equipments.css";
import "./styles/clients.css";
import "./styles/faturamento.css";
import "./styles/notifications.css";
import "./styles/responsive.css";

// Componentes
import { Toaster } from "sonner";
import MainLayout from "./layouts/MainLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TechniciansPage from "./pages/TechniciansPage.jsx";
import EquipmentsPage from "./pages/EquipmentsPage.jsx";
import OSFormPage from "./pages/OSFormPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import ClientFormPage from "./pages/ClientFormPage.jsx";
import FaturamentoPage from "./pages/FaturamentoPage.jsx";
import FaturamentoGraficosPage from "./pages/FaturamentoGraficosPage.jsx";
import ServicosOsPage from "./pages/ServicosOsPage.jsx";
import VisitasTecnicasPage from "./pages/VisitasTecnicasPage.jsx";
import { EquipamentoProvider } from "./contexts/EquipamentoContext.jsx";

// PrivateRoute SIMPLIFICADO
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // A lógica de 'loading' foi removida daqui.
  // A rota só será renderizada quando o loading for false.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Componente para gerir as rotas após a verificação de auth
function AppRoutes() {
  const { loading } = useAuth();

  // LÓGICA CENTRALIZADA AQUI
  // Mostra a tela de carregamento para TODA a aplicação
  // enquanto o AuthProvider verifica a sessão.
  // if (loading) {
  //   return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
  // }

  // Quando o loading termina, renderiza as rotas corretas.
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/new" element={<ClientFormPage />} />
        <Route path="clients/edit/:clientId" element={<ClientFormPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="equipments" element={<EquipmentsPage />} />
        <Route path="faturamento" element={<FaturamentoPage />} />
        <Route
          path="faturamento/graficos"
          element={<FaturamentoGraficosPage />}
        />
        <Route path="os/new" element={<OSFormPage />} />
        <Route path="os/edit/:osId" element={<OSFormPage />} />
        <Route path="servicos-os" element={<ServicosOsPage />} />
        <Route path="technicians" element={<TechniciansPage />} />
        <Route path="visitas-tecnicas" element={<VisitasTecnicasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EquipamentoProvider>
          <Toaster richColors position="top-right" />
          <AppRoutes />
        </EquipamentoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
