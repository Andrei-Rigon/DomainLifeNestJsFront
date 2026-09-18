import { Plus } from 'lucide-react';
import { AppointmentItem } from './AppointmentItem';
import { formatDayTitle, toISODate } from '../../lib/date';
import type { Appointment } from '../../api/appointments';
import './DayView.css';

interface DayViewProps {
  referenceDate: Date;
  appointmentsByDate: Map<string, Appointment[]>;
  onAddAppointment: (isoDate: string) => void;
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

export function DayView({
  referenceDate,
  appointmentsByDate,
  onAddAppointment,
  onViewAppointment,
  onEditAppointment,
  onDeleteAppointment,
}: DayViewProps) {
  const iso = toISODate(referenceDate);
  const dayAppointments = appointmentsByDate.get(iso) ?? [];

  return (
    <div className="day-view">
      <div className="day-view-header">
        <h3>{formatDayTitle(referenceDate)}</h3>
        <button type="button" className="btn btn-primary" onClick={() => onAddAppointment(iso)}>
          <Plus size={16} /> Novo agendamento
        </button>
      </div>

      <div className="day-view-list">
        {dayAppointments.length === 0 ? (
          <p className="day-view-empty">Nenhum agendamento para este dia.</p>
        ) : (
          dayAppointments.map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              onView={() => onViewAppointment(appointment)}
              onEdit={() => onEditAppointment(appointment)}
              onDelete={() => onDeleteAppointment(appointment)}
            />
          ))
        )}
      </div>
    </div>
  );
}
