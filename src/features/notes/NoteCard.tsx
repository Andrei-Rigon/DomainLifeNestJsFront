import { ActionMenu } from '../../components/ActionMenu';
import { DEFAULT_NOTE_COLOR } from './noteColors';
import type { Note } from '../../api/notes';
import './NoteCard.css';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div className="note-card" style={{ borderTopColor: note.cor ?? DEFAULT_NOTE_COLOR }}>
      <div className="note-card-header">
        <span className="note-card-title">{note.titulo}</span>
        <ActionMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
      {note.descricao && <p className="note-card-description">{note.descricao}</p>}
    </div>
  );
}
