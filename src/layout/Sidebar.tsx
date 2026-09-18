import { NavLink } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import { NAV_ITEMS } from './navItems';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
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
    </aside>
  );
}
