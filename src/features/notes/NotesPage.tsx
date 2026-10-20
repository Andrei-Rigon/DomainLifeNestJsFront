import { useMemo, useState } from 'react';
import { LayoutGrid, Plus, Rows3, Search } from 'lucide-react';
import { NoteCard } from './NoteCard';
import { NoteFormModal } from './NoteFormModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useNotes } from './useNotes';
import { useNotesViewMode } from './useNotesViewMode';
import { toggleTaskInMarkdown } from '../../lib/markdownTasks';
import type { Note } from '../../api/notes';
import './NotesPage.css';

function matchesSearch(note: Note, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return [note.titulo, note.descricao]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(term));
}

export function NotesPage() {
  const { notes, error, create, update, updateOptimistic, remove } = useNotes();
  const { mode, setMode } = useNotesViewMode();
  const [search, setSearch] = useState('');
  const [formNote, setFormNote] = useState<Note | 'new' | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const filteredNotes = useMemo(
    () => notes.filter((note) => matchesSearch(note, search)),
    [notes, search],
  );

  async function handleSubmit(payload: Parameters<typeof create>[0]) {
    if (formNote && formNote !== 'new') {
      await update(formNote.id, payload);
    } else {
      await create(payload);
    }
  }

  function handleToggleTask(note: Note, taskIndex: number) {
    if (!note.descricao) return;
    const next = toggleTaskInMarkdown(note.descricao, taskIndex);
    if (next !== note.descricao) {
      void updateOptimistic(note.id, { descricao: next });
    }
  }

  return (
    <div className="notes-page">
      <h1>Notas</h1>
      <p className="notes-page-subtitle">Suas anotações rápidas.</p>

      <div className="notes-toolbar">
        <label className="notes-search-field">
          <Search size={15} />
          <input
            type="text"
            placeholder="Pesquisar nota"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="notes-view-toggle" role="group" aria-label="Estilo de visualização">
          <button
            type="button"
            className={['notes-view-btn', mode === 'postit' ? 'notes-view-btn--active' : ''].filter(Boolean).join(' ')}
            onClick={() => setMode('postit')}
          >
            <LayoutGrid size={15} /> Tipo 1
          </button>
          <button
            type="button"
            className={['notes-view-btn', mode === 'minimal' ? 'notes-view-btn--active' : ''].filter(Boolean).join(' ')}
            onClick={() => setMode('minimal')}
          >
            <Rows3 size={15} /> Tipo 2
          </button>
        </div>

        <button type="button" className="btn btn-primary notes-new-btn" onClick={() => setFormNote('new')}>
          <Plus size={16} /> Nova nota
        </button>
      </div>

      {error && <div className="notes-error">{error}</div>}

      <div className={`notes-grid notes-grid--${mode}`}>
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            variant={mode}
            onAdd={() => setFormNote('new')}
            onEdit={() => setFormNote(note)}
            onDelete={() => setDeleteTarget(note)}
            onToggleTask={(taskIndex) => handleToggleTask(note, taskIndex)}
          />
        ))}

        <button type="button" className="notes-add-card" onClick={() => setFormNote('new')}>
          <Plus size={18} />
          <span>Adicionar nota</span>
        </button>
      </div>

      {formNote && (
        <NoteFormModal
          note={formNote === 'new' ? undefined : formNote}
          onClose={() => setFormNote(null)}
          onSubmit={handleSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir nota"
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
