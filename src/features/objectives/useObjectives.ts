import { useCallback, useEffect, useState } from 'react';
import {
  type Objective,
  type ObjectivePayload,
  createObjective,
  deleteObjective,
  listObjectives,
  updateObjective,
} from '../../api/objectives';

export function useObjectives() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return listObjectives()
      .then(setObjectives)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    (payload: ObjectivePayload) => createObjective(payload).then((created) => {
      refresh();
      return created;
    }),
    [refresh],
  );

  const update = useCallback(
    (id: number, payload: Partial<ObjectivePayload>) =>
      updateObjective(id, payload).then((updated) => {
        refresh();
        return updated;
      }),
    [refresh],
  );

  const remove = useCallback(
    (id: number) =>
      deleteObjective(id).then(() => {
        refresh();
      }),
    [refresh],
  );

  return { objectives, loading, error, refresh, create, update, remove };
}
