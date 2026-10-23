import { lazy, Suspense, useState, type CSSProperties, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import '../../components/forms.css';
import { Pipette } from 'lucide-react';
import { DEFAULT_NOTE_COLOR, NOTE_COLORS, NOTE_COLOR_OPTIONS, isHexColor } from './noteColors';
import type { Note, NotePayload } from '../../api/notes';
import './NoteFormModal.css';

const RichTextEditor = lazy(() =>
  import('../../components/RichTextEditor').then((module) => ({ default: module.RichTextEditor })),
);

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

  const [hexText, setHexText] = useState(cor);

  const isEditing = Boolean(note);
  const isCustomColor = !NOTE_COLORS.includes(cor.toLowerCase());

  function selectColor(value: string) {
    setCor(value);
    setHexText(value);
  }

  function handleHexChange(raw: string) {
    const text = raw.startsWith('#') ? raw : `#${raw}`;
    setHexText(text);
    if (isHexColor(text)) setCor(text.toLowerCase());
  }

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
          <label>Descrição</label>
          <Suspense fallback={<div className="note-editor-loading">Carregando editor…</div>}>
            <RichTextEditor
              value={descricao}
              onChange={setDescricao}
              placeholder="Detalhes da nota. Selecione o texto para formatar."
            />
          </Suspense>
        </div>

        <div className="field">
          <label>Cor</label>
          <div className="note-color-picker">
            {NOTE_COLOR_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={['note-color-swatch', cor.toLowerCase() === value ? 'note-color-swatch--active' : '']
                  .filter(Boolean)
                  .join(' ')}
                style={{ background: value }}
                title={label}
                aria-label={`Selecionar cor ${label}`}
                onClick={() => selectColor(value)}
              />
            ))}
          </div>
          <div className="note-color-custom-row">
            <label
              className={['note-color-custom', isCustomColor ? 'note-color-custom--active' : '']
                .filter(Boolean)
                .join(' ')}
              style={isCustomColor ? { background: cor } : undefined}
              title="Escolher outra cor"
            >
              {!isCustomColor && <Pipette size={14} />}
              <input
                type="color"
                value={isHexColor(cor) ? cor : DEFAULT_NOTE_COLOR}
                onChange={(event) => selectColor(event.target.value)}
                aria-label="Escolher cor personalizada"
              />
            </label>
            <span className="note-color-custom-label">Personalizada</span>
            <input
              className="note-color-hex"
              value={hexText}
              maxLength={7}
              spellCheck={false}
              onChange={(event) => handleHexChange(event.target.value)}
              aria-label="Código da cor em hexadecimal"
              placeholder="#7c3aed"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
