import { Calendar, Check } from 'lucide-react';
import { ActionMenu } from '../../components/ActionMenu';
import { formatCurrency, formatDate, getPriorityStyle, getProgress } from './objectivesUi';
import type { Objective } from '../../api/objectives';
import './ObjectiveCard.css';

interface ObjectiveCardProps {
  objective: Objective;
  onToggleChecked: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ObjectiveCard({ objective, onToggleChecked, onEdit, onDelete }: ObjectiveCardProps) {
  const priority = getPriorityStyle(objective.prioridade);
  const progress = getProgress(objective);
  const isChecked = objective.checked;

  return (
    <div className={['objective-card', isChecked ? 'objective-card--done' : ''].filter(Boolean).join(' ')}>
      <div className="objective-card-header">
        <span className="objective-chip objective-chip--category">Categoria #{objective.id_categoria}</span>
        <div className="objective-card-header-right">
          <span
            className="objective-chip"
            style={{ background: isChecked ? '#dcfce7' : priority.bg, color: isChecked ? '#166534' : priority.text }}
          >
            {isChecked ? 'Concluído' : priority.label}
          </span>
          <ActionMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="objective-card-title-row">
        <button
          type="button"
          className="objective-check"
          onClick={onToggleChecked}
          aria-label={isChecked ? 'Marcar como não concluído' : 'Marcar como concluído'}
        >
          {isChecked ? <Check size={14} /> : null}
        </button>
        <div>
          <p className="objective-title">{objective.titulo}</p>
          {objective.descricao && <p className="objective-description">{objective.descricao}</p>}
        </div>
      </div>

      <div className="objective-progress">
        <div className="objective-progress-labels">
          <span>
            {formatCurrency(objective.valor_guardado)} de {formatCurrency(objective.valor_objetivo)}
          </span>
          <span className="objective-progress-percent">{progress}%</span>
        </div>
        <div className="objective-progress-track">
          <div
            className="objective-progress-fill"
            style={{ width: `${progress}%`, background: isChecked ? '#10b981' : 'var(--color-accent)' }}
          />
        </div>
      </div>

      <div className="objective-deadline">
        <Calendar size={14} />
        {isChecked ? `Concluído em ${formatDate(objective.prazo)}` : `Prazo: ${formatDate(objective.prazo)}`}
      </div>
    </div>
  );
}
