import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type Appointment,
  type AppointmentPayload,
  createAppointment,
  deleteAppointment,
  listAppointments,
  updateAppointment,
} from '../../api/appointments';

export function useAppointments(start: string, end: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return listAppointments(start, end)
      .then(setAppointments)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [start, end]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const list = map.get(appointment.data_evento) ?? [];
      list.push(appointment);
      map.set(appointment.data_evento, list);
    }
    return map;
  }, [appointments]);

  const create = useCallback(
    (payload: AppointmentPayload) => createAppointment(payload).then((created) => {
      refresh();
      return created;
    }),
    [refresh],
  );

  const update = useCallback(
    (id: number, payload: Partial<AppointmentPayload>) =>
      updateAppointment(id, payload).then((updated) => {
        refresh();
        return updated;
      }),
    [refresh],
  );

  const remove = useCallback(
    (id: number) =>
      deleteAppointment(id).then(() => {
        refresh();
      }),
    [refresh],
  );

  return { appointments, appointmentsByDate, loading, error, refresh, create, update, remove };
}
