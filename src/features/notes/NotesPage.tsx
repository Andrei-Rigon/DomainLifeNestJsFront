import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { NoteCard } from './NoteCard';
import { NoteFormModal } from './NoteFormModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useNotes } from './useNotes';
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
  const { notes, error, create, update, remove } = useNotes();
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

        <button type="button" className="btn btn-primary notes-new-btn" onClick={() => setFormNote('new')}>
          <Plus size={16} /> Nova nota
        </button>
      </div>

      {error && <div className="notes-error">{error}</div>}

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => setFormNote(note)}
            onDelete={() => setDeleteTarget(note)}
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
