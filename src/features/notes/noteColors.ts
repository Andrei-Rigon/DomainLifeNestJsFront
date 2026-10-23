export const NOTE_COLOR_OPTIONS = [
  { value: '#7c3aed', label: 'Roxo' },
  { value: '#6366f1', label: 'Índigo' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#14b8a6', label: 'Turquesa' },
  { value: '#10b981', label: 'Verde' },
  { value: '#84cc16', label: 'Lima' },
  { value: '#f59e0b', label: 'Âmbar' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#6b7280', label: 'Cinza' },
];

export const NOTE_COLORS = NOTE_COLOR_OPTIONS.map((option) => option.value);

export const DEFAULT_NOTE_COLOR = NOTE_COLOR_OPTIONS[0].value;

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
}
