import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { CountRow } from './CountRow';
import { CountFormModal } from './CountFormModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useCounts } from './useCounts';
import { COUNT_TYPES } from './countsUi';
import type { Count, CountType } from '../../api/counts';
import './CountsPage.css';

type Filter = 'todos' | CountType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  ...COUNT_TYPES.map((type) => ({ value: type.value, label: type.label })),
];

function matchesSearch(count: Count, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return [count.nome, count.descricao].filter(Boolean).some((field) => field!.toLowerCase().includes(term));
}

export function CountsPage() {
  const { counts, error, create, update, remove } = useCounts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('todos');
  const [formCount, setFormCount] = useState<Count | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Count | null>(null);

  const filteredCounts = useMemo(
    () =>
      counts
        .filter((count) => matchesSearch(count, search))
        .filter((count) => filter === 'todos' || count.tipo === filter),
    [counts, search, filter],
  );

  async function handleSubmit(payload: Parameters<typeof create>[0]) {
    if (formCount && formCount !== 'new') {
      await update(formCount.id, payload);
    } else {
      await create(payload);
    }
  }

  return (
    <div className="counts-page">
      <h1>Contas</h1>
      <p className="counts-page-subtitle">Contas, assinaturas e gastos que se repetem.</p>

      <div className="counts-toolbar">
        <label className="counts-search-field">
          <Search size={15} />
          <input
            type="text"
            placeholder="Pesquisar conta"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <button type="button" className="btn btn-primary counts-new-btn" onClick={() => setFormCount('new')}>
          <Plus size={16} /> Nova conta
        </button>
      </div>

      <div className="counts-filters">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={['counts-filter', filter === value ? 'counts-filter--active' : ''].filter(Boolean).join(' ')}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="counts-error">{error}</div>}

      {filteredCounts.length === 0 ? (
        <p className="counts-empty">Nenhuma conta encontrada.</p>
      ) : (
        <div className="counts-list">
          <div className="counts-list-header">
            <span style={{ gridArea: 'name' }}>Nome</span>
            <span style={{ gridArea: 'type' }}>Tipo</span>
            <span style={{ gridArea: 'expected' }}>Esperado</span>
            <span style={{ gridArea: 'paid' }}>Pago</span>
            <span style={{ gridArea: 'installments' }}>Parcelas</span>
          </div>
          {filteredCounts.map((count) => (
            <CountRow
              key={count.id}
              count={count}
              onEdit={() => setFormCount(count)}
              onDelete={() => setDeleteTarget(count)}
            />
          ))}
        </div>
      )}

      {formCount && (
        <CountFormModal
          count={formCount === 'new' ? undefined : formCount}
          onClose={() => setFormCount(null)}
          onSubmit={handleSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir conta"
          message={`Tem certeza que deseja excluir "${deleteTarget.nome}"? Essa ação não pode ser desfeita.`}
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
