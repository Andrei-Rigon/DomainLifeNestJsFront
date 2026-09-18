import { Clock, MapPin, FileText } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { formatDayTitle, formatTime, parseISODate } from '../../lib/date';
import type { Appointment } from '../../api/appointments';
import './AppointmentDetailModal.css';

interface AppointmentDetailModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export function AppointmentDetailModal({ appointment, onClose }: AppointmentDetailModalProps) {
  return (
    <Modal
      title={appointment.titulo}
      onClose={onClose}
      footer={
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Fechar
        </button>
      }
    >
      <p className="detail-day">{formatDayTitle(parseISODate(appointment.data_evento))}</p>

      <div className="detail-row">
        <Clock size={16} />
        <span>{formatTime(appointment.hora_evento)}</span>
      </div>

      {appointment.localizacao && (
        <div className="detail-row">
          <MapPin size={16} />
          <span>{appointment.localizacao}</span>
        </div>
      )}

      {appointment.descricao && (
        <div className="detail-row detail-row--top">
          <FileText size={16} />
          <span>{appointment.descricao}</span>
        </div>
      )}
    </Modal>
  );
}
