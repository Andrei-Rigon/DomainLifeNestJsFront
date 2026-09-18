import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const WEEKDAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getMonthGrid(referenceDate: Date): Date[] {
  const start = startOfWeek(startOfMonth(referenceDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(referenceDate), { weekStartsOn: 1 });

  const days: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function getWeekDays(referenceDate: Date): Date[] {
  const start = startOfWeek(referenceDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function isCurrentMonth(date: Date, referenceDate: Date): boolean {
  return isSameMonth(date, referenceDate);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function formatMonthTitle(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: ptBR });
}

export function formatDayTitle(date: Date): string {
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
}

export function formatTime(value: string | null): string {
  if (!value) return 'Dia todo';
  return value.slice(0, 5);
}
