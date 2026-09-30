import { NavLink } from 'react-router-dom';
import { CalendarClock, Moon, Sun } from 'lucide-react';
import { NAV_ITEMS } from './navItems';
import type { Theme } from '../lib/theme';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Sidebar({ isOpen, onNavigate, theme, onToggleTheme }: SidebarProps) {
  const isDark = theme === 'dark';

  return (
    <aside className={['sidebar', isOpen ? 'sidebar--open' : ''].filter(Boolean).join(' ')}>
      <div className="sidebar-brand">
        <CalendarClock size={22} />
        <span>DomainLife</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              ['sidebar-link', isActive ? 'sidebar-link--active' : ''].filter(Boolean).join(' ')
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-theme-toggle" onClick={onToggleTheme}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDark ? 'Modo claro' : 'Modo escuro'}</span>
        </button>
      </div>
    </aside>
  );
}
