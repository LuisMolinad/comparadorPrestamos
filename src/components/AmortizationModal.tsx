import React, { useState } from 'react';
import type { CalculatedLoan } from '../types/loan';
import { generateAmortizationSchedule } from '../utils/calculations';
import { X } from 'lucide-react';

interface AmortizationModalProps {
  loan: CalculatedLoan | null;
  onClose: () => void;
}

export const AmortizationModal: React.FC<AmortizationModalProps> = ({ loan, onClose }) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  if (!loan) return null;

  const schedule = generateAmortizationSchedule(loan);

  const yearlySchedule = schedule.reduce((acc: any[], row) => {
    const yearIndex = Math.floor((row.month - 1) / 12);
    if (!acc[yearIndex]) {
      acc[yearIndex] = {
        year: yearIndex + 1,
        beginningBalance: row.beginningBalance,
        payment: 0,
        principal: 0,
        interest: 0,
        debtInsurance: 0,
        propertyInsurance: 0,
        fees: 0,
        endingBalance: row.endingBalance,
      };
    }
    acc[yearIndex].payment += row.payment;
    acc[yearIndex].principal += row.principal;
    acc[yearIndex].interest += row.interest;
    acc[yearIndex].debtInsurance += row.debtInsurance;
    acc[yearIndex].propertyInsurance += row.propertyInsurance;
    acc[yearIndex].fees += row.fees;
    acc[yearIndex].endingBalance = row.endingBalance;
    return acc;
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <div>
            <h2>Tabla de Amortización (Normativa El Salvador)</h2>
            <p className="subtitle">
              {loan.bankName} - ${loan.amount.toLocaleString('es-SV')} al {loan.interestRate}% ({loan.termYears} años)
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="amortization-summary-box">
          <div>
            <span>Cuota Mensual Promedio</span>
            <strong>${loan.totalMonthlyPayment.toFixed(2)}</strong>
          </div>
          <div>
            <span>Total Intereses</span>
            <strong>${loan.totalInterest.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</strong>
          </div>
          <div>
            <span>Total Seguros</span>
            <strong>${loan.totalInsurance.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</strong>
          </div>
          <div>
            <span>Costo Total</span>
            <strong>${loan.totalCost.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</strong>
          </div>
          <div className="view-toggle">
            <button
              className={`btn btn-sm ${viewMode === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('monthly')}
            >
              Mensual
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'yearly' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('yearly')}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="table-responsive-container modal-table-scroll">
          {viewMode === 'monthly' ? (
            <table className="comparison-table amortization-table">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Saldo Inicial</th>
                  <th>Cuota Total</th>
                  <th>Capital</th>
                  <th>Intereses</th>
                  <th>Seg. Deuda</th>
                  <th>Seg. Daños</th>
                  <th>Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>${row.beginningBalance.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${row.payment.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-success">${row.principal.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-warning">${row.interest.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${row.debtInsurance.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${row.propertyInsurance.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${row.endingBalance.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="comparison-table amortization-table">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Saldo Inicial</th>
                  <th>Pago Total Anual</th>
                  <th>Capital</th>
                  <th>Intereses</th>
                  <th>Seguros Totales</th>
                  <th>Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {yearlySchedule.map((row) => (
                  <tr key={row.year}>
                    <td>Año {row.year}</td>
                    <td>${row.beginningBalance.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${row.payment.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-success">${row.principal.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="text-warning">${row.interest.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${(row.debtInsurance + row.propertyInsurance).toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${row.endingBalance.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
