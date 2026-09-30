import { api } from './client';

export interface Objective {
  id: number;
  titulo: string;
  descricao: string | null;
  prazo: string | null;
  valor_guardado: string | null;
  valor_objetivo: string | null;
  porcentagem: number | null;
  checked: boolean;
  prioridade: string | null;
  id_categoria: number;
}

export interface ObjectivePayload {
  titulo: string;
  descricao?: string;
  prazo?: string;
  valor_guardado?: string;
  valor_objetivo?: string;
  porcentagem?: string;
  checked?: string;
  prioridade: string;
  id_categoria: string;
}

export function listObjectives() {
  return api.get<Objective[]>('/objectives');
}

export function createObjective(payload: ObjectivePayload) {
  return api.post<Objective>('/objectives', payload);
}

export function updateObjective(id: number, payload: Partial<ObjectivePayload>) {
  return api.patch<Objective>(`/objectives/${id}`, payload);
}

export function deleteObjective(id: number) {
  return api.delete<void>(`/objectives/${id}`);
}
