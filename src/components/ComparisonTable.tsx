import React from 'react';
import type { CalculatedLoan } from '../types/loan';
import { Edit2, Trash2, FileText, CheckCircle2 } from 'lucide-react';

interface ComparisonTableProps {
  loans: CalculatedLoan[];
  lowestMonthlyId: string | null;
  lowestTotalCostId: string | null;
  onEdit: (loan: CalculatedLoan) => void;
  onDelete: (id: string) => void;
  onViewAmortization: (loan: CalculatedLoan) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  loans,
  lowestMonthlyId,
  lowestTotalCostId,
  onEdit,
  onDelete,
  onViewAmortization,
}) => {
  if (loans.length === 0) return null;

  return (
    <div className="table-responsive-container">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Banco / Institución</th>
            <th>Tipo</th>
            <th>Monto ($)</th>
            <th>Tasa (Nom / TIE)</th>
            <th>Plazo</th>
            <th>Comisiones</th>
            <th>Cuota Mensual</th>
            <th>Total Intereses</th>
            <th>Total Seguros</th>
            <th>Costo Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => {
            const isBest = loan.id === lowestTotalCostId;
            const isLowestPmt = loan.id === lowestMonthlyId;

            return (
              <tr key={loan.id} className={isBest ? 'row-best' : ''}>
                <td>
                  <div className="table-bank-name">
                    <strong>{loan.bankName}</strong>
                    {isBest && (
                      <span className="badge badge-success badge-sm">
                        <CheckCircle2 size={12} /> Mejor Costo Total
                      </span>
                    )}
                    {isLowestPmt && !isBest && (
                      <span className="badge badge-info badge-sm">Menor Cuota</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="badge-type-sm">{loan.loanType}</span>
                </td>
                <td>${loan.amount.toLocaleString('es-SV')}</td>
                <td>
                  {loan.interestRate.toFixed(2)}% <br />
                  <small style={{ color: 'var(--text-muted)' }}>TIE: {loan.effectiveAPR.toFixed(2)}%</small>
                </td>
                <td>{loan.termYears} años</td>
                <td>${loan.totalFees.toLocaleString('es-SV')}</td>
                <td className="highlight-cell">
                  ${loan.totalMonthlyPayment.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>${loan.totalInterest.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</td>
                <td>${loan.totalInsurance.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</td>
                <td className="highlight-cost">
                  ${loan.totalCost.toLocaleString('es-SV', { maximumFractionDigits: 0 })}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="icon-btn"
                      onClick={() => onViewAmortization(loan)}
                      title="Ver Tabla de Amortización"
                    >
                      <FileText size={16} />
                    </button>
                    <button className="icon-btn" onClick={() => onEdit(loan)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-btn text-danger"
                      onClick={() => onDelete(loan.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
