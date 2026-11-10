import React from 'react';
import type { CalculatedLoan } from '../types/loan';
import { Building2, FileText, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

interface LoanCardProps {
  loan: CalculatedLoan;
  isLowestMonthly: boolean;
  isLowestTotalCost: boolean;
  onEdit: (loan: CalculatedLoan) => void;
  onDelete: (id: string) => void;
  onViewAmortization: (loan: CalculatedLoan) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  isLowestMonthly,
  isLowestTotalCost,
  onEdit,
  onDelete,
  onViewAmortization,
}) => {
  return (
    <div className={`loan-card ${isLowestTotalCost ? 'best-overall' : ''}`}>
      <div className="loan-card-header">
        <div className="bank-info">
          <Building2 size={20} className="bank-icon-sm" />
          <h3>{loan.bankName}</h3>
        </div>
        <span className="badge-type">{loan.loanType}</span>
      </div>

      <div className="badge-container">
        {isLowestTotalCost && (
          <span className="badge badge-success">
            <CheckCircle2 size={14} /> Mejor Costo Total
          </span>
        )}
        {isLowestMonthly && !isLowestTotalCost && (
          <span className="badge badge-info">
            <CheckCircle2 size={14} /> Menor Cuota Mensual
          </span>
        )}
      </div>

      <div className="loan-metrics-grid">
        <div className="metric-box highlight">
          <span className="metric-label">Cuota Mensual Total</span>
          <span className="metric-value">
            ${loan.totalMonthlyPayment.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="metric-sub">Incluye capital, intereses y seguros</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Costo Total</span>
          <span className="metric-value">
            ${loan.totalCost.toLocaleString('es-SV', { maximumFractionDigits: 0 })}
          </span>
          <span className="metric-sub">Capital + Intereses + Seguros + Comisiones</span>
        </div>
      </div>

      <div className="loan-details-list">
        <div className="detail-row">
          <span>Monto del Préstamo:</span>
          <strong>${loan.amount.toLocaleString('es-SV')}</strong>
        </div>
        <div className="detail-row">
          <span>Tasa Nominal / TIE:</span>
          <strong>{loan.interestRate.toFixed(2)}% (TIE: {loan.effectiveAPR.toFixed(2)}%)</strong>
        </div>
        <div className="detail-row">
          <span>Plazo:</span>
          <strong>{loan.termYears} años ({loan.termYears * 12} meses)</strong>
        </div>
        <div className="detail-row">
          <span>Total Intereses:</span>
          <strong>${loan.totalInterest.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</strong>
        </div>
        <div className="detail-row">
          <span>Seguros Totales:</span>
          <strong>${loan.totalInsurance.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</strong>
        </div>
        <div className="detail-row">
          <span>Gastos / Comisiones:</span>
          <strong>${loan.totalFees.toLocaleString('es-SV')}</strong>
        </div>
      </div>

      {loan.notes && <p className="loan-notes">"{loan.notes}"</p>}

      <div className="loan-card-actions">
        <button className="btn btn-sm btn-outline" onClick={() => onViewAmortization(loan)}>
          <FileText size={16} /> Tabla de Amortización
        </button>
        <div className="action-icons">
          <button className="icon-btn" onClick={() => onEdit(loan)} title="Editar">
            <Edit2 size={16} />
          </button>
          <button className="icon-btn text-danger" onClick={() => onDelete(loan.id)} title="Eliminar">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
