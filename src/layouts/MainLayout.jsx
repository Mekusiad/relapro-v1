import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { Menu } from 'lucide-react';

function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <div className="content-wrapper">
        {/* O header mobile agora fica fora do "main" para ocupar a largura total */}
        <header className="mobile-header">
          <button onClick={toggleSidebar} className="sidebar-toggle-btn">
            <Menu size={28} />
          </button>
          <div className="mobile-logo">Nexus Control</div>
        </header>
        
        {/* O Outlet (conteúdo da página) agora está dentro de "main" */}
        <main id="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;