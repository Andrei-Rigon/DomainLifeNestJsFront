import { Plus, X } from 'lucide-react';
import { AppointmentItem } from './AppointmentItem';
import type { Appointment } from '../../api/appointments';
import './DayAppointmentsPanel.css';

interface DayAppointmentsPanelProps {
  dayNumber: number;
  appointments: Appointment[];
  onClose: () => void;
  onAdd: () => void;
  onView: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

export function DayAppointmentsPanel({
  dayNumber,
  appointments,
  onClose,
  onAdd,
  onView,
  onEdit,
  onDelete,
}: DayAppointmentsPanelProps) {
  return (
    <div className="day-panel">
      <div className="day-panel-header">
        <h3>
          Agendamentos do dia {dayNumber}{' '}
          <span className="day-panel-count">
            ({appointments.length} agendamento{appointments.length === 1 ? '' : 's'})
          </span>
        </h3>
        <div className="day-panel-actions">
          <button type="button" className="icon-btn" aria-label="Novo agendamento" onClick={onAdd}>
            <Plus size={18} />
          </button>
          <button type="button" className="icon-btn" aria-label="Fechar" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="day-panel-list">
        {appointments.map((appointment) => (
          <AppointmentItem
            key={appointment.id}
            appointment={appointment}
            onView={() => onView(appointment)}
            onEdit={() => onEdit(appointment)}
            onDelete={() => onDelete(appointment)}
          />
        ))}
      </div>
    </div>
  );
}
