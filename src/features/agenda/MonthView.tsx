import { Fragment } from 'react';
import { DayAppointmentsPanel } from './DayAppointmentsPanel';
import { getMonthGrid, isCurrentMonth, isToday, toISODate, WEEKDAY_LABELS } from '../../lib/date';
import type { Appointment } from '../../api/appointments';
import './MonthView.css';

interface MonthViewProps {
  referenceDate: Date;
  appointmentsByDate: Map<string, Appointment[]>;
  expandedDay: string | null;
  onDayClick: (date: Date) => void;
  onCloseDay: () => void;
  onAddAppointment: (isoDate: string) => void;
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

function chunkIntoWeeks(days: Date[]): Date[][] {
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function MonthView({
  referenceDate,
  appointmentsByDate,
  expandedDay,
  onDayClick,
  onCloseDay,
  onAddAppointment,
  onViewAppointment,
  onEditAppointment,
  onDeleteAppointment,
}: MonthViewProps) {
  const weeks = chunkIntoWeeks(getMonthGrid(referenceDate));

  return (
    <div className="month-grid">
      <div className="month-row month-row--header">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="month-weekday">
            {label}
          </div>
        ))}
      </div>

      {weeks.map((week) => {
        const weekKey = toISODate(week[0]);
        const expandedInWeek = expandedDay
          ? week.some((day) => toISODate(day) === expandedDay)
          : false;

        return (
          <Fragment key={weekKey}>
            <div className="month-row">
              {week.map((day) => {
                const iso = toISODate(day);
                const dayAppointments = appointmentsByDate.get(iso) ?? [];
                const inMonth = isCurrentMonth(day, referenceDate);

                return (
                  <button
                    type="button"
                    key={iso}
                    className={[
                      'month-day',
                      inMonth ? '' : 'month-day--outside',
                      isToday(day) ? 'month-day--today' : '',
                      expandedDay === iso ? 'month-day--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onDayClick(day)}
                  >
                    <span className="month-day-number">{day.getDate()}</span>
                    {dayAppointments.length > 0 && <span className="month-day-dot" />}
                  </button>
                );
              })}
            </div>

            {expandedInWeek && expandedDay && (
              <DayAppointmentsPanel
                dayNumber={Number(expandedDay.split('-')[2])}
                appointments={appointmentsByDate.get(expandedDay) ?? []}
                onClose={onCloseDay}
                onAdd={() => onAddAppointment(expandedDay)}
                onView={onViewAppointment}
                onEdit={onEditAppointment}
                onDelete={onDeleteAppointment}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
