import { useState, type CSSProperties, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import '../../components/forms.css';
import { DEFAULT_NOTE_COLOR, NOTE_COLORS } from './noteColors';
import type { Note, NotePayload } from '../../api/notes';
import './NoteFormModal.css';

interface NoteFormModalProps {
  note?: Note;
  onClose: () => void;
  onSubmit: (payload: NotePayload) => Promise<unknown>;
}

export function NoteFormModal({ note, onClose, onSubmit }: NoteFormModalProps) {
  const [titulo, setTitulo] = useState(note?.titulo ?? '');
  const [descricao, setDescricao] = useState(note?.descricao ?? '');
  const [cor, setCor] = useState(note?.cor ?? DEFAULT_NOTE_COLOR);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(note);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!titulo.trim()) {
      setError('Preencha ao menos o título.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        cor,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a nota.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEditing ? 'Editar nota' : 'Nova nota'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="note-form" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvando…' : 'Salvar'}
          </button>
        </>
      }
    >
      <form
        id="note-form"
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          '--color-accent': cor,
          '--color-accent-soft': `${cor}26`,
        } as CSSProperties}
      >
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ex.: Ideias, lembretes..."
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            rows={8}
            placeholder="Detalhes da nota"
          />
        </div>

        <div className="field">
          <label>Cor</label>
          <div className="note-color-picker">
            {NOTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={['note-color-swatch', cor === color ? 'note-color-swatch--active' : '']
                  .filter(Boolean)
                  .join(' ')}
                style={{ background: color }}
                aria-label={`Selecionar cor ${color}`}
                onClick={() => setCor(color)}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
