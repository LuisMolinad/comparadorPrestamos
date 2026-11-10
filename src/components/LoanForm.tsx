import React, { useState, useEffect } from 'react';
import type { LoanOffer, LoanType } from '../types/loan';
import { X } from 'lucide-react';

interface LoanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (loan: LoanOffer) => void;
  initialData?: LoanOffer | null;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [bankName, setBankName] = useState('');
  const [loanType, setLoanType] = useState<LoanType>('Hipotecario');
  const [amount, setAmount] = useState<number | ''>(120000);
  const [interestRate, setInterestRate] = useState<number | ''>(7.25);
  const [termYears, setTermYears] = useState<number | ''>(25);
  const [upfrontFees, setUpfrontFees] = useState<number | ''>(1500);
  const [monthlyFees, setMonthlyFees] = useState<number | ''>(5);
  const [debtInsuranceRate, setDebtInsuranceRate] = useState<number | ''>(0.05);
  const [propertyInsurance, setPropertyInsurance] = useState<number | ''>(22);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setBankName(initialData.bankName);
      setLoanType(initialData.loanType);
      setAmount(initialData.amount);
      setInterestRate(initialData.interestRate);
      setTermYears(initialData.termYears);
      setUpfrontFees(initialData.upfrontFees);
      setMonthlyFees(initialData.monthlyFees);
      setDebtInsuranceRate(initialData.debtInsuranceRate);
      setPropertyInsurance(initialData.propertyInsurance);
      setNotes(initialData.notes || '');
    } else {
      setBankName('');
      setLoanType('Hipotecario');
      setAmount(100000);
      setInterestRate(7.0);
      setTermYears(20);
      setUpfrontFees(1000);
      setMonthlyFees(0);
      setDebtInsuranceRate(0.05);
      setPropertyInsurance(20);
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || amount === '' || interestRate === '' || termYears === '') return;

    const newOffer: LoanOffer = {
      id: initialData ? initialData.id : Date.now().toString(),
      bankName: bankName.trim(),
      loanType,
      amount: Number(amount),
      interestRate: Number(interestRate),
      termYears: Number(termYears),
      upfrontFees: upfrontFees === '' ? 0 : Number(upfrontFees),
      monthlyFees: monthlyFees === '' ? 0 : Number(monthlyFees),
      debtInsuranceRate: debtInsuranceRate === '' ? 0 : Number(debtInsuranceRate),
      propertyInsurance: propertyInsurance === '' ? 0 : Number(propertyInsurance),
      notes: notes.trim(),
    };

    onSave(newOffer);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Editar Oferta de Préstamo' : 'Agregar Nueva Oferta de Préstamo'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-row">
            <div className="form-group">
              <label>Banco / Institución Financiera *</label>
              <input
                type="text"
                required
                placeholder="ej. Banco Agrícola, BAC"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tipo de Préstamo</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as LoanType)}
              >
                <option value="Hipotecario">Hipotecario (Vivienda)</option>
                <option value="Personal">Préstamo Personal</option>
                <option value="Vehicular">Crédito Vehicular</option>
                <option value="Comercial">Crédito Comercial</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Monto del Préstamo ($) *</label>
              <input
                type="number"
                required
                min="500"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Tasa de Interés Nominal Anual (%) *</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Plazo (Años) *</label>
              <input
                type="number"
                required
                min="1"
                max="40"
                step="1"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Comisión de Apertura / Desembolso ($)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={upfrontFees}
                onChange={(e) => setUpfrontFees(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Seguro de Deuda / Desgravamen (% mensual sobre saldo)</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.001"
                value={debtInsuranceRate}
                onChange={(e) => setDebtInsuranceRate(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Seguro de Daños / Incendio ($ mensual)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={propertyInsurance}
                onChange={(e) => setPropertyInsurance(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Comisión de Manejo Mensual ($)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={monthlyFees}
                onChange={(e) => setMonthlyFees(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Observaciones / Condiciones</label>
              <input
                type="text"
                placeholder="ej. Tasa fija 5 años, sin penalización por pago anticipado"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Guardar Cambios' : 'Agregar Oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
