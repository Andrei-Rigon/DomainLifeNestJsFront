import { useCallback, useEffect, useState } from 'react';
import {
  type Count,
  type CountPayload,
  createCount,
  deleteCount,
  listCounts,
  updateCount,
} from '../../api/counts';

export function useCounts() {
  const [counts, setCounts] = useState<Count[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return listCounts()
      .then(setCounts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    (payload: CountPayload) =>
      createCount(payload).then((created) => {
        refresh();
        return created;
      }),
    [refresh],
  );

  const update = useCallback(
    (id: number, payload: Partial<CountPayload>) =>
      updateCount(id, payload).then((updated) => {
        refresh();
        return updated;
      }),
    [refresh],
  );

  const remove = useCallback(
    (id: number) =>
      deleteCount(id).then(() => {
        refresh();
      }),
    [refresh],
  );

  return { counts, loading, error, refresh, create, update, remove };
}
