import type { CountType } from '../../api/counts';

export const COUNT_TYPES: { value: CountType; label: string; hint: string }[] = [
  { value: 'Recorrente', label: 'Recorrente', hint: 'Todo mês (luz, água, aluguel)' },
  { value: 'Assinatura', label: 'Assinatura', hint: 'Serviços (Netflix, Spotify)' },
  { value: 'Conta', label: 'Conta', hint: 'Avulsa ou parcelada' },
];

const TYPE_STYLE: Record<CountType, { bg: string; text: string }> = {
  Recorrente: { bg: '#dbeafe', text: '#1e40af' },
  Assinatura: { bg: '#ede9fe', text: '#5b21b6' },
  Conta: { bg: '#fef3c7', text: '#92400e' },
};

export function getTypeStyle(tipo: CountType) {
  return TYPE_STYLE[tipo] ?? { bg: '#f3f4f6', text: '#374151' };
}

export function toNumber(value: string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
