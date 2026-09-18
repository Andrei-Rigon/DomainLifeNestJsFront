import { Clock, Eye, MapPin } from 'lucide-react';
import { ActionMenu } from '../../components/ActionMenu';
import { formatTime } from '../../lib/date';
import type { Appointment } from '../../api/appointments';
import './AppointmentItem.css';

interface AppointmentItemProps {
  appointment: Appointment;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AppointmentItem({ appointment, onView, onEdit, onDelete }: AppointmentItemProps) {
  return (
    <div className="appointment-item">
      <span className="appointment-dot" />

      <div className="appointment-time">
        <Clock size={14} />
        <span>{formatTime(appointment.hora_evento)}</span>
      </div>

      <div className="appointment-main">
        <span className="appointment-title">{appointment.titulo}</span>
        {appointment.localizacao && (
          <span className="appointment-chip">
            <MapPin size={12} />
            {appointment.localizacao}
          </span>
        )}
      </div>

      <div className="appointment-actions">
        <button type="button" className="icon-btn" aria-label="Ver detalhes" onClick={onView}>
          <Eye size={16} />
        </button>
        <ActionMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
