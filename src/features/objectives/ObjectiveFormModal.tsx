import { useState, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import '../../components/forms.css';
import { PRIORITY_OPTIONS } from './objectivesUi';
import type { Objective, ObjectivePayload } from '../../api/objectives';

interface ObjectiveFormModalProps {
  objective?: Objective;
  onClose: () => void;
  onSubmit: (payload: ObjectivePayload) => Promise<unknown>;
}

export function ObjectiveFormModal({ objective, onClose, onSubmit }: ObjectiveFormModalProps) {
  const [titulo, setTitulo] = useState(objective?.titulo ?? '');
  const [descricao, setDescricao] = useState(objective?.descricao ?? '');
  const [prazo, setPrazo] = useState(objective?.prazo?.slice(0, 10) ?? '');
  const [valorGuardado, setValorGuardado] = useState(objective?.valor_guardado ?? '');
  const [valorObjetivo, setValorObjetivo] = useState(objective?.valor_objetivo ?? '');
  const [prioridade, setPrioridade] = useState(objective?.prioridade ?? 'media');
  const [idCategoria, setIdCategoria] = useState(objective ? String(objective.id_categoria) : '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(objective);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!titulo.trim() || !idCategoria.trim()) {
      setError('Preencha ao menos o título e a categoria.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        prazo: prazo || undefined,
        valor_guardado: valorGuardado || undefined,
        valor_objetivo: valorObjetivo || undefined,
        prioridade,
        id_categoria: idCategoria.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o objetivo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEditing ? 'Editar objetivo' : 'Novo objetivo'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="objective-form" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvando…' : 'Salvar'}
          </button>
        </>
      }
    >
      <form id="objective-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ex.: Viagem pra praia"
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            rows={4}
            placeholder="Detalhes do objetivo"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="valor_guardado">Valor guardado</label>
            <input
              id="valor_guardado"
              type="number"
              step="0.01"
              min="0"
              value={valorGuardado}
              onChange={(event) => setValorGuardado(event.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="field">
            <label htmlFor="valor_objetivo">Valor objetivo</label>
            <input
              id="valor_objetivo"
              type="number"
              step="0.01"
              min="0"
              value={valorObjetivo}
              onChange={(event) => setValorObjetivo(event.target.value)}
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="prazo">Prazo</label>
            <input id="prazo" type="date" value={prazo} onChange={(event) => setPrazo(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="prioridade">Prioridade</label>
            <select id="prioridade" value={prioridade} onChange={(event) => setPrioridade(event.target.value)}>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="id_categoria">Categoria (ID)</label>
          <input
            id="id_categoria"
            type="number"
            min="1"
            value={idCategoria}
            onChange={(event) => setIdCategoria(event.target.value)}
            placeholder="Ex.: 1"
          />
        </div>
      </form>
    </Modal>
  );
}
