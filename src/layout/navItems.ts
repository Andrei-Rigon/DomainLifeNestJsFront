import { CalendarDays, LayoutDashboard, StickyNote, Target, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Agendamentos', path: '/agendamentos', icon: CalendarDays },
  { label: 'Notas', path: '/notas', icon: StickyNote },
  { label: 'Objetivos', path: '/objetivos', icon: Target },
];
