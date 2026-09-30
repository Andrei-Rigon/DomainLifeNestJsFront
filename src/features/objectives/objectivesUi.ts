import type { Objective } from '../../api/objectives';

export type Priority = 'alta' | 'media' | 'baixa';

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

const PRIORITY_STYLE: Record<Priority, { bg: string; text: string; label: string }> = {
  alta: { bg: '#fee2e2', text: '#991b1b', label: 'Alta' },
  media: { bg: '#fef3c7', text: '#92400e', label: 'Média' },
  baixa: { bg: '#f3f4f6', text: '#374151', label: 'Baixa' },
};

export function getPriorityStyle(prioridade: string | null) {
  const key = (prioridade ?? '').toLowerCase() as Priority;
  return PRIORITY_STYLE[key] ?? { bg: '#f3f4f6', text: '#374151', label: prioridade ?? 'Sem prioridade' };
}

export function getProgress(objective: Objective): number {
  const guardado = Number(objective.valor_guardado ?? 0);
  const alvo = Number(objective.valor_objetivo ?? 0);
  if (alvo > 0) {
    return Math.min(100, Math.round((guardado / alvo) * 100));
  }
  return objective.porcentagem ?? 0;
}

export function formatCurrency(value: string | null): string {
  const number = Number(value ?? 0);
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(value: string | null): string {
  if (!value) return 'Sem prazo';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sem prazo';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
