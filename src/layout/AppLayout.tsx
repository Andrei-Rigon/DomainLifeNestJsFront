import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CalendarClock, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useTheme } from '../lib/theme';
import './AppLayout.css';

export function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <header className="mobile-topbar">
        <button
          type="button"
          className="mobile-topbar-menu"
          aria-label="Abrir menu"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className="mobile-topbar-brand">
          <CalendarClock size={18} />
          <span>DomainLife</span>
        </div>
      </header>

      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
