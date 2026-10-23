import { useState, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import '../../components/forms.css';
import { COUNT_TYPES } from './countsUi';
import type { Count, CountPayload, CountType } from '../../api/counts';
import './CountFormModal.css';

interface CountFormModalProps {
  count?: Count;
  onClose: () => void;
  onSubmit: (payload: CountPayload) => Promise<unknown>;
}

function parseMoney(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function hasTooManyDecimals(value: number): boolean {
  return Math.round(value * 100) / 100 !== value;
}

export function CountFormModal({ count, onClose, onSubmit }: CountFormModalProps) {
  const [nome, setNome] = useState(count?.nome ?? '');
  const [descricao, setDescricao] = useState(count?.descricao ?? '');
  const [tipo, setTipo] = useState<CountType>(count?.tipo ?? 'Recorrente');
  const [valorEsperado, setValorEsperado] = useState(count?.valor_esperado ?? '');
  const [valorPago, setValorPago] = useState(count?.valor_pago ?? '');
  const [parcelas, setParcelas] = useState(count?.qtde_parceladas ? String(count.qtde_parceladas) : '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(count);
  const isInstallment = tipo === 'Conta';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nome.trim()) {
      setError('Informe o nome da conta.');
      return;
    }

    const esperado = parseMoney(valorEsperado);
    const pago = parseMoney(valorPago);
    for (const [label, value] of [
      ['Valor esperado', esperado],
      ['Valor pago', pago],
    ] as const) {
      if (value !== undefined && (Number.isNaN(value) || value < 0 || hasTooManyDecimals(value))) {
        setError(`${label} inválido: use um número positivo com no máximo 2 casas decimais.`);
        return;
      }
    }

    let qtde: number | undefined;
    if (isInstallment) {
      qtde = parcelas.trim() ? Number(parcelas) : undefined;
      if (qtde === undefined || !Number.isInteger(qtde) || qtde < 1) {
        setError('Informe em quantas parcelas a conta será paga (mínimo 1).');
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        tipo,
        valor_esperado: esperado,
        valor_pago: pago,
        qtde_parceladas: qtde,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a conta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEditing ? 'Editar conta' : 'Nova conta'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="count-form" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvando…' : 'Salvar'}
          </button>
        </>
      }
    >
      <form id="count-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            value={nome}
            maxLength={255}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Ex.: Conta de luz, Netflix..."
            autoFocus
          />
        </div>

        <div className="field">
          <label>Tipo</label>
          <div className="count-type-picker" role="group" aria-label="Tipo da conta">
            {COUNT_TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                className={['count-type-btn', tipo === option.value ? 'count-type-btn--active' : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setTipo(option.value)}
              >
                <span className="count-type-name">{option.label}</span>
                <span className="count-type-hint">{option.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="valor_esperado">Valor esperado</label>
            <input
              id="valor_esperado"
              type="number"
              step="0.01"
              min="0"
              value={valorEsperado}
              onChange={(event) => setValorEsperado(event.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="field">
            <label htmlFor="valor_pago">Valor pago</label>
            <input
              id="valor_pago"
              type="number"
              step="0.01"
              min="0"
              value={valorPago}
              onChange={(event) => setValorPago(event.target.value)}
              placeholder="0,00"
            />
          </div>
        </div>

        {isInstallment && (
          <div className="field">
            <label htmlFor="parcelas">Quantidade de parcelas</label>
            <input
              id="parcelas"
              type="number"
              min="1"
              step="1"
              value={parcelas}
              onChange={(event) => setParcelas(event.target.value)}
              placeholder="Ex.: 12"
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            maxLength={255}
            onChange={(event) => setDescricao(event.target.value)}
            rows={3}
            placeholder="Detalhes da conta"
          />
        </div>
      </form>
    </Modal>
  );
}
