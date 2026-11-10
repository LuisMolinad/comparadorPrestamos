export type LoanType = 'Hipotecario' | 'Personal' | 'Vehicular' | 'Comercial' | 'Otro';

export interface LoanOffer {
  id: string;
  bankName: string;
  loanType: LoanType;
  amount: number;             // Capital / Monto del préstamo ($)
  interestRate: number;       // Tasa de interés nominal anual (%)
  termYears: number;          // Plazo en años
  upfrontFees: number;        // Comisión de apertura / desembolso ($)
  monthlyFees: number;        // Comisión de manejo mensual ($)
  debtInsuranceRate: number;  // Seguro de deuda / desgravamen (% mensual sobre saldo o capital)
  propertyInsurance: number;  // Seguro de daños / incendio y terremoto ($ mensual, típicamente para hipotecas)
  notes?: string;
}

export interface CalculatedLoan extends LoanOffer {
  monthlyPayment: number;       // Cuota de capital e intereses
  totalMonthlyInsurance: number;// Seguros mensuales (deuda + daños)
  totalMonthlyPayment: number;  // Cuota total mensual (Capital + Intereses + Seguros + Comisiones)
  totalInterest: number;        // Total de intereses a pagar en el plazo
  totalInsurance: number;       // Total de seguros pagados en el plazo
  totalFees: number;            // Total de comisiones (apertura + manejo)
  totalCost: number;            // Costo total del préstamo
  effectiveAPR: number;         // Tasa de Interés Efectiva (TIE / APR) regulada por SSF
}

export interface AmortizationRow {
  month: number;
  beginningBalance: number;
  payment: number;              // Cuota total del mes
  principal: number;            // Capital amortizado
  interest: number;             // Intereses
  debtInsurance: number;        // Seguro de deuda
  propertyInsurance: number;    // Seguro de daños
  fees: number;                 // Comisiones mensuales
  endingBalance: number;        // Saldo final
}
