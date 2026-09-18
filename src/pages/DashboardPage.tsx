import { LayoutDashboard } from 'lucide-react';
import './DashboardPage.css';

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Acompanhe um resumo das suas atividades.</p>

      <div className="dashboard-placeholder">
        <LayoutDashboard size={28} />
        <p>Em breve novos indicadores por aqui.</p>
      </div>
    </div>
  );
}
