import { api } from './client';

export type CountType = 'Recorrente' | 'Conta' | 'Assinatura';

export interface Count {
  id: number;
  nome: string;
  descricao: string | null;
  valor_esperado: string | null;
  valor_pago: string | null;
  tipo: CountType;
  qtde_parceladas: number | null;
  id_categoria_conta: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CountPayload {
  nome: string;
  descricao?: string;
  valor_esperado?: number;
  valor_pago?: number;
  tipo: CountType;
  qtde_parceladas?: number;
}

export function listCounts() {
  return api.get<Count[]>('/counts');
}

export function createCount(payload: CountPayload) {
  return api.post<Count>('/counts', payload);
}

export function updateCount(id: number, payload: Partial<CountPayload>) {
  return api.patch<Count>(`/counts/${id}`, payload);
}

export function deleteCount(id: number) {
  return api.delete<void>(`/counts/${id}`);
}
