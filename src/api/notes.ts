import { api } from './client';

export interface Note {
  id: number;
  titulo: string;
  descricao: string | null;
  cor: string | null;
}

export interface NotePayload {
  titulo: string;
  descricao?: string;
  cor?: string;
}

export function listNotes() {
  return api.get<Note[]>('/notes');
}

export function createNote(payload: NotePayload) {
  return api.post<Note>('/notes', payload);
}

export function updateNote(id: number, payload: Partial<NotePayload>) {
  return api.patch<Note>(`/notes/${id}`, payload);
}

export function deleteNote(id: number) {
  return api.delete<void>(`/notes/${id}`);
}
