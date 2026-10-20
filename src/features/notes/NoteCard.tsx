import type { CSSProperties } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import { ActionMenu } from '../../components/ActionMenu';
import { MarkdownContent } from '../../components/MarkdownContent';
import { formatClockTime } from '../../lib/date';
import { DEFAULT_NOTE_COLOR } from './noteColors';
import type { NotesViewMode } from './useNotesViewMode';
import type { Note } from '../../api/notes';
import './NoteCard.css';

interface NoteCardProps {
  note: Note;
  variant: NotesViewMode;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleTask: (taskIndex: number) => void;
}

export function NoteCard({ note, variant, onAdd, onEdit, onDelete, onToggleTask }: NoteCardProps) {
  const style = { '--note-color': note.cor ?? DEFAULT_NOTE_COLOR } as CSSProperties;
  const time = formatClockTime(note.updatedAt ?? note.createdAt);

  if (variant === 'postit') {
    return (
      <div className="note-postit" style={style}>
        <div className="note-postit-bar">
          <button type="button" className="note-postit-icon" aria-label="Nova nota" onClick={onAdd}>
            <Plus size={15} />
          </button>
          <div className="note-postit-bar-right">
            <ActionMenu onEdit={onEdit} onDelete={onDelete} />
            <button type="button" className="note-postit-icon" aria-label="Excluir nota" onClick={onDelete}>
              <X size={15} />
            </button>
          </div>
        </div>
        <div className="note-postit-body">
          <h3 className="note-title">{note.titulo}</h3>
          {note.descricao && <MarkdownContent source={note.descricao} onToggleTask={onToggleTask} />}
          {time && (
            <span className="note-time">
              <Clock size={12} /> {time}
            </span>
          )}
        </div>
        <span className="note-postit-fold" />
      </div>
    );
  }

  return (
    <div className="note-minimal" style={style}>
      <div className="note-minimal-header">
        <h3 className="note-title">{note.titulo}</h3>
        <ActionMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
      {note.descricao && <MarkdownContent source={note.descricao} onToggleTask={onToggleTask} />}
      {time && (
        <span className="note-time">
          <Clock size={12} /> {time}
        </span>
      )}
    </div>
  );
}
