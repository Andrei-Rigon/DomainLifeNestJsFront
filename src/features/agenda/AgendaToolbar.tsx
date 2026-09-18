import { Calendar, CalendarDays, Columns3, Filter, List, Search } from 'lucide-react';
import type { AgendaViewMode } from './types';
import './AgendaToolbar.css';

interface AgendaToolbarProps {
  view: AgendaViewMode;
  onViewChange: (view: AgendaViewMode) => void;
  selectedDate: string;
  onDateChange: (isoDate: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const VIEW_OPTIONS: { value: AgendaViewMode; label: string; icon: typeof List }[] = [
  { value: 'day', label: 'Visualização diária', icon: List },
  { value: 'week', label: 'Visualização semanal', icon: Columns3 },
  { value: 'month', label: 'Visualização mensal', icon: CalendarDays },
];

export function AgendaToolbar({
  view,
  onViewChange,
  selectedDate,
  onDateChange,
  search,
  onSearchChange,
}: AgendaToolbarProps) {
  return (
    <div className="agenda-toolbar">
      <div className="agenda-tabs">
        {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            className={['agenda-tab', view === value ? 'agenda-tab--active' : ''].join(' ')}
            onClick={() => onViewChange(value)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="agenda-toolbar-right">
        <label className="agenda-date-field">
          <Calendar size={15} />
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>

        <label className="agenda-search-field">
          <Search size={15} />
          <input
            type="text"
            placeholder="Pesquisar registro"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <button type="button" className="agenda-filter-btn" title="Filtros" aria-label="Filtros">
          <Filter size={16} />
        </button>
      </div>
    </div>
  );
}
