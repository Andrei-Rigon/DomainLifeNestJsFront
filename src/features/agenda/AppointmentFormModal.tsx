import { useState, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import '../../components/forms.css';
import type { Appointment, AppointmentPayload } from '../../api/appointments';

interface AppointmentFormModalProps {
  initialDate: string;
  appointment?: Appointment;
  onClose: () => void;
  onSubmit: (payload: AppointmentPayload) => Promise<unknown>;
}

export function AppointmentFormModal({
  initialDate,
  appointment,
  onClose,
  onSubmit,
}: AppointmentFormModalProps) {
  const [titulo, setTitulo] = useState(appointment?.titulo ?? '');
  const [dataEvento, setDataEvento] = useState(appointment?.data_evento ?? initialDate);
  const [horaEvento, setHoraEvento] = useState(appointment?.hora_evento?.slice(0, 5) ?? '');
  const [localizacao, setLocalizacao] = useState(appointment?.localizacao ?? '');
  const [descricao, setDescricao] = useState(appointment?.descricao ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(appointment);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!titulo.trim() || !dataEvento) {
      setError('Preencha ao menos o título e a data.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        data_evento: dataEvento,
        hora_evento: horaEvento || undefined,
        localizacao: localizacao.trim() || undefined,
        descricao: descricao.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o agendamento.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEditing ? 'Editar agendamento' : 'Novo agendamento'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="appointment-form" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvando…' : 'Salvar'}
          </button>
        </>
      }
    >
      <form id="appointment-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ex.: Consulta, reunião..."
            autoFocus
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="data_evento">Data</label>
            <input
              id="data_evento"
              type="date"
              value={dataEvento}
              onChange={(event) => setDataEvento(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="hora_evento">Hora</label>
            <input
              id="hora_evento"
              type="time"
              value={horaEvento}
              onChange={(event) => setHoraEvento(event.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="localizacao">Local</label>
          <input
            id="localizacao"
            value={localizacao}
            onChange={(event) => setLocalizacao(event.target.value)}
            placeholder="Ex.: Consultório, endereço..."
          />
        </div>

        <div className="field">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            rows={3}
            placeholder="Observações sobre o agendamento"
          />
        </div>
      </form>
    </Modal>
  );
}
