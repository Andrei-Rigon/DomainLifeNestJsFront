import { useEffect, useMemo, useState } from 'react';
import { AgendaToolbar } from './AgendaToolbar';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { AppointmentFormModal } from './AppointmentFormModal';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useAppointments } from './useAppointments';
import { formatMonthTitle, getMonthGrid, getWeekDays, toISODate } from '../../lib/date';
import type { Appointment } from '../../api/appointments';
import type { AgendaViewMode } from './types';
import './AgendaPage.css';

type FormModalState = { isoDate: string; appointment?: Appointment };

function matchesSearch(appointment: Appointment, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return [appointment.titulo, appointment.descricao, appointment.localizacao]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(term));
}

export function AgendaPage() {
  const [view, setView] = useState<AgendaViewMode>('month');
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState<FormModalState | null>(null);
  const [detailAppointment, setDetailAppointment] = useState<Appointment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  const { start, end } = useMemo(() => {
    if (view === 'month') {
      const grid = getMonthGrid(referenceDate);
      return { start: toISODate(grid[0]), end: toISODate(grid[grid.length - 1]) };
    }
    if (view === 'week') {
      const week = getWeekDays(referenceDate);
      return { start: toISODate(week[0]), end: toISODate(week[6]) };
    }
    const iso = toISODate(referenceDate);
    return { start: iso, end: iso };
  }, [view, referenceDate]);

  const { appointments, error, create, update, remove } = useAppointments(start, end);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      if (!matchesSearch(appointment, search)) continue;
      const list = map.get(appointment.data_evento) ?? [];
      list.push(appointment);
      map.set(appointment.data_evento, list);
    }
    return map;
  }, [appointments, search]);

  useEffect(() => {
    setExpandedDay(null);
  }, [view, start, end]);

  useEffect(() => {
    if (expandedDay && (appointmentsByDate.get(expandedDay)?.length ?? 0) === 0) {
      setExpandedDay(null);
    }
  }, [appointmentsByDate, expandedDay]);

  function handleMonthDayClick(date: Date) {
    const iso = toISODate(date);
    const outsideMonth = date.getMonth() !== referenceDate.getMonth() || date.getFullYear() !== referenceDate.getFullYear();
    if (outsideMonth) {
      setReferenceDate(date);
      return;
    }

    const hasAppointments = (appointmentsByDate.get(iso)?.length ?? 0) > 0;
    if (!hasAppointments) {
      setFormModal({ isoDate: iso });
      return;
    }
    setExpandedDay((current) => (current === iso ? null : iso));
  }

  function handleAddAppointment(isoDate: string) {
    setFormModal({ isoDate });
  }

  function handleEditAppointment(appointment: Appointment) {
    setFormModal({ isoDate: appointment.data_evento, appointment });
  }

  async function handleFormSubmit(payload: Parameters<typeof create>[0]) {
    if (formModal?.appointment) {
      await update(formModal.appointment.id, payload);
    } else {
      await create(payload);
    }
    setExpandedDay(payload.data_evento);
  }

  return (
    <div className="agenda-page">
      <h1>Agendamentos</h1>
      <p className="agenda-page-subtitle">Acompanhe e gerencie seus agendamentos.</p>

      <div className="agenda-card">
      <AgendaToolbar
        view={view}
        onViewChange={setView}
        selectedDate={toISODate(referenceDate)}
        onDateChange={(iso) => setReferenceDate(new Date(`${iso}T00:00:00`))}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="agenda-month-title">{formatMonthTitle(referenceDate)}</div>

      {error && <div className="agenda-error">{error}</div>}

      <div className="agenda-view-scroll">
        {view === 'month' && (
          <MonthView
            referenceDate={referenceDate}
            appointmentsByDate={appointmentsByDate}
            expandedDay={expandedDay}
            onDayClick={handleMonthDayClick}
            onCloseDay={() => setExpandedDay(null)}
            onAddAppointment={handleAddAppointment}
            onViewAppointment={setDetailAppointment}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={setDeleteTarget}
          />
        )}

        {view === 'week' && (
          <WeekView
            referenceDate={referenceDate}
            appointmentsByDate={appointmentsByDate}
            onAddAppointment={handleAddAppointment}
            onViewAppointment={setDetailAppointment}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={setDeleteTarget}
          />
        )}

        {view === 'day' && (
          <DayView
            referenceDate={referenceDate}
            appointmentsByDate={appointmentsByDate}
            onAddAppointment={handleAddAppointment}
            onViewAppointment={setDetailAppointment}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={setDeleteTarget}
          />
        )}
      </div>

      {formModal && (
        <AppointmentFormModal
          initialDate={formModal.isoDate}
          appointment={formModal.appointment}
          onClose={() => setFormModal(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {detailAppointment && (
        <AppointmentDetailModal
          appointment={detailAppointment}
          onClose={() => setDetailAppointment(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir agendamento"
          message={`Tem certeza que deseja excluir "${deleteTarget.titulo}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await remove(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
      </div>
    </div>
  );
}
