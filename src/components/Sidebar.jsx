import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Building2,
  Receipt,
  ClipboardList,
  LogOut,
  MapPin,
  KanbanSquare,
} from "lucide-react";

// Recebe a função toggleSidebar para fechar o menu ao navegar
function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const { logout, user } = useAuth();
  const isTecnico = user?.nivelAcesso === "TECNICO";
  const logoWords = ["Nexus", "Control"];

  const sidebarClasses = `sidebar ${
    isSidebarOpen ? "sidebar-mobile-open" : ""
  }`;

  const handleLinkClick = () => {
    // Se a sidebar estiver aberta (modo mobile), fecha ao clicar no link
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <aside className={sidebarClasses}>
      <div className="sidebar-main-content">
        <NavLink
          to="/servicos-os"
          className="logo-container-split"
          onClick={handleLinkClick}
        >
          <motion.div
            className="logo-animation-wrapper"
            whileHover={{ scale: 1.05 }}
          >
            <KanbanSquare size={36} strokeWidth={2.5} />
            <div className="logo-text-split">
              {logoWords.map((word, index) => (
                <span key={index}>{word}</span>
              ))}
            </div>
          </motion.div>
        </NavLink>

        <nav className="nav-links">
          {/* Adicionamos onClick e um <span> para o texto */}
          {/* <NavLink to="/dashboard" className="nav-button" onClick={handleLinkClick}>
            <LayoutDashboard size={20} /> <span className="nav-text">Dashboard</span>
          </NavLink> */}
          <NavLink
            to="/servicos-os"
            className="nav-button"
            onClick={handleLinkClick}
          >
            <ClipboardList size={20} />{" "}
            <span className="nav-text">Serviços OS</span>
          </NavLink>
          {!isTecnico && (
            <NavLink
              to="/clients"
              className="nav-button"
              onClick={handleLinkClick}
            >
              <Building2 size={20} /> <span className="nav-text">Clientes</span>
            </NavLink>
          )}
          <NavLink
            to="/equipments"
            className="nav-button"
            onClick={handleLinkClick}
          >
            <Wrench size={20} /> <span className="nav-text">Equipamentos</span>
          </NavLink>
          {/* <NavLink
            to="/faturamento"
            className="nav-button"
            onClick={handleLinkClick}
          >
            <Receipt size={20} /> <span className="nav-text">Faturamento</span>
          </NavLink> */}

          {!isTecnico && (
            <NavLink
              to="/technicians"
              className="nav-button"
              onClick={handleLinkClick}
            >
              <Users size={20} /> <span className="nav-text">Técnicos</span>
            </NavLink>
          )}
          {/* <NavLink
            to="/visitas-tecnicas"
            className="nav-button"
            onClick={handleLinkClick}
          >
            <MapPin size={20} />{" "}
            <span className="nav-text">Visitas Técnicas</span>
          </NavLink> */}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button onClick={logout} className="nav-button logout-button">
          <LogOut size={20} /> <span className="nav-text">Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
