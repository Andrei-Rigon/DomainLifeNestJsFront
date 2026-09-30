import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ObjectiveCard } from './ObjectiveCard';
import { ObjectiveFormModal } from './ObjectiveFormModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useObjectives } from './useObjectives';
import type { Objective } from '../../api/objectives';
import './ObjectivesPage.css';

type Filter = 'todos' | 'andamento' | 'concluidos';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'andamento', label: 'Em andamento' },
  { value: 'concluidos', label: 'Concluídos' },
];

function matchesSearch(objective: Objective, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return [objective.titulo, objective.descricao]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(term));
}

export function ObjectivesPage() {
  const { objectives, error, create, update, remove } = useObjectives();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('todos');
  const [formObjective, setFormObjective] = useState<Objective | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Objective | null>(null);

  const filteredObjectives = useMemo(() => {
    return objectives
      .filter((objective) => matchesSearch(objective, search))
      .filter((objective) => {
        if (filter === 'andamento') return !objective.checked;
        if (filter === 'concluidos') return objective.checked;
        return true;
      });
  }, [objectives, search, filter]);

  async function handleSubmit(payload: Parameters<typeof create>[0]) {
    if (formObjective && formObjective !== 'new') {
      await update(formObjective.id, payload);
    } else {
      await create(payload);
    }
  }

  return (
    <div className="objectives-page">
      <h1>Objetivos</h1>
      <p className="objectives-page-subtitle">Suas metas e quanto falta pra chegar lá.</p>

      <div className="objectives-toolbar">
        <label className="objectives-search-field">
          <Search size={15} />
          <input
            type="text"
            placeholder="Pesquisar objetivo"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <button
          type="button"
          className="btn btn-primary objectives-new-btn"
          onClick={() => setFormObjective('new')}
        >
          <Plus size={16} /> Novo objetivo
        </button>
      </div>

      <div className="objectives-filters">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={['objectives-filter', filter === value ? 'objectives-filter--active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="objectives-error">{error}</div>}

      {filteredObjectives.length === 0 ? (
        <p className="objectives-empty">Nenhum objetivo encontrado.</p>
      ) : (
        <div className="objectives-grid">
          {filteredObjectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onToggleChecked={() => update(objective.id, { checked: String(!objective.checked) })}
              onEdit={() => setFormObjective(objective)}
              onDelete={() => setDeleteTarget(objective)}
            />
          ))}
        </div>
      )}

      {formObjective && (
        <ObjectiveFormModal
          objective={formObjective === 'new' ? undefined : formObjective}
          onClose={() => setFormObjective(null)}
          onSubmit={handleSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir objetivo"
          message={`Tem certeza que deseja excluir "${deleteTarget.titulo}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await remove(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
