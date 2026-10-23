import { ActionMenu } from '../../components/ActionMenu';
import { formatMoney, getTypeStyle, toNumber } from './countsUi';
import type { Count } from '../../api/counts';
import './CountRow.css';

interface CountRowProps {
  count: Count;
  onEdit: () => void;
  onDelete: () => void;
}

export function CountRow({ count, onEdit, onDelete }: CountRowProps) {
  const typeStyle = getTypeStyle(count.tipo);
  const expected = toNumber(count.valor_esperado);
  const paid = toNumber(count.valor_pago);
  const hasPaid = paid > 0;
  const difference = paid - expected;
  const showDifference = hasPaid && expected > 0 && Math.abs(difference) >= 0.005;
  const installments = count.tipo === 'Conta' && count.qtde_parceladas ? `${count.qtde_parceladas}x` : '—';

  return (
    <div className="count-row">
      <div className="count-cell count-cell--name">
        <span className="count-name">{count.nome}</span>
        {count.descricao && <span className="count-description">{count.descricao}</span>}
      </div>

      <div className="count-cell count-cell--type">
        <span className="count-chip" style={{ background: typeStyle.bg, color: typeStyle.text }}>
          {count.tipo}
        </span>
      </div>

      <div className="count-cell count-cell--expected" data-label="Esperado">
        {formatMoney(expected)}
      </div>

      <div className="count-cell count-cell--paid" data-label="Pago">
        <span>{hasPaid ? formatMoney(paid) : '—'}</span>
        {showDifference && (
          <span className={difference > 0 ? 'count-diff count-diff--up' : 'count-diff count-diff--down'}>
            {difference > 0 ? '+' : '−'}
            {formatMoney(Math.abs(difference))} {difference > 0 ? 'acima' : 'abaixo'}
          </span>
        )}
      </div>

      <div className="count-cell count-cell--installments" data-label="Parcelas">
        {installments}
      </div>

      <div className="count-cell count-cell--actions">
        <ActionMenu onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
