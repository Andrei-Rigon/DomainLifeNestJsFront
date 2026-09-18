import { Plus } from 'lucide-react';
import { AppointmentItem } from './AppointmentItem';
import { getWeekDays, isToday, toISODate } from '../../lib/date';
import type { Appointment } from '../../api/appointments';
import './WeekView.css';

interface WeekViewProps {
  referenceDate: Date;
  appointmentsByDate: Map<string, Appointment[]>;
  onAddAppointment: (isoDate: string) => void;
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

export function WeekView({
  referenceDate,
  appointmentsByDate,
  onAddAppointment,
  onViewAppointment,
  onEditAppointment,
  onDeleteAppointment,
}: WeekViewProps) {
  const days = getWeekDays(referenceDate);

  return (
    <div className="week-grid">
      {days.map((day) => {
        const iso = toISODate(day);
        const dayAppointments = appointmentsByDate.get(iso) ?? [];

        return (
          <div key={iso} className="week-column">
            <div className={['week-column-header', isToday(day) ? 'week-column-header--today' : ''].join(' ')}>
              <span className="week-column-weekday">
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </span>
              <span className="week-column-day">{day.getDate()}</span>
            </div>

            <div
              className="week-column-body"
              onClick={() => dayAppointments.length === 0 && onAddAppointment(iso)}
            >
              {dayAppointments.length === 0 ? (
                <span className="week-column-empty">Sem agendamentos</span>
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

            <button type="button" className="week-column-add" onClick={() => onAddAppointment(iso)}>
              <Plus size={14} /> Adicionar
            </button>
          </div>
        );
      })}
    </div>
  );
}
