import { useCallback, useEffect, useState } from 'react';
import {
  type Note,
  type NotePayload,
  createNote,
  deleteNote,
  listNotes,
  updateNote,
} from '../../api/notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return listNotes()
      .then(setNotes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    (payload: NotePayload) => createNote(payload).then((created) => {
      refresh();
      return created;
    }),
    [refresh],
  );

  const update = useCallback(
    (id: number, payload: Partial<NotePayload>) =>
      updateNote(id, payload).then((updated) => {
        refresh();
        return updated;
      }),
    [refresh],
  );

  const remove = useCallback(
    (id: number) =>
      deleteNote(id).then(() => {
        refresh();
      }),
    [refresh],
  );

  return { notes, loading, error, refresh, create, update, remove };
}
