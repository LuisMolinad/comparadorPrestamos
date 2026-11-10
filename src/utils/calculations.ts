import type { LoanOffer, CalculatedLoan, AmortizationRow } from '../types/loan';

export function calculateLoanMetrics(loan: LoanOffer): CalculatedLoan {
  const principal = loan.amount;
  const annualRate = loan.interestRate;
  const totalMonths = Math.round(loan.termYears * 12);
  const monthlyRate = annualRate / 100 / 12;

  let baseMonthlyPayment = 0;
  if (monthlyRate === 0) {
    baseMonthlyPayment = totalMonths > 0 ? principal / totalMonths : 0;
  } else {
    baseMonthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  let totalInterest = 0;
  let totalInsurance = 0;
  let balance = principal;

  // Approximate simulation for total interest and insurance across months
  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate;
    let principalPaid = baseMonthlyPayment - interest;
    if (month === totalMonths || principalPaid > balance) {
      principalPaid = balance;
    }
    const endingBalance = Math.max(0, balance - principalPaid);

    // Seguro de deuda typically calculated on beginning balance (saldo deudor)
    const debtIns = (balance * (loan.debtInsuranceRate || 0)) / 100;
    const propIns = loan.propertyInsurance || 0;

    totalInterest += interest;
    totalInsurance += (debtIns + propIns);
    balance = endingBalance;
  }

  const totalFees = loan.upfrontFees + (loan.monthlyFees * totalMonths);
  const totalCost = principal + totalInterest + totalInsurance + totalFees;

  // Average monthly insurance for display
  const avgMonthlyInsurance = totalMonths > 0 ? totalInsurance / totalMonths : 0;
  const totalMonthlyPayment = baseMonthlyPayment + avgMonthlyInsurance + loan.monthlyFees;

  // Tasa de Interés Efectiva (TIE) approximation considering upfront fees and insurance impact in El Salvador
  const feeImpact = loan.upfrontFees > 0 ? (loan.upfrontFees / principal / loan.termYears) * 100 : 0;
  const insuranceImpact = loan.debtInsuranceRate * 12; // annualized insurance rate effect
  const effectiveAPR = loan.interestRate + feeImpact + insuranceImpact;

  return {
    ...loan,
    monthlyPayment: isNaN(baseMonthlyPayment) ? 0 : baseMonthlyPayment,
    totalMonthlyInsurance: isNaN(avgMonthlyInsurance) ? 0 : avgMonthlyInsurance,
    totalMonthlyPayment: isNaN(totalMonthlyPayment) ? 0 : totalMonthlyPayment,
    totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
    totalInsurance: isNaN(totalInsurance) ? 0 : totalInsurance,
    totalFees: isNaN(totalFees) ? 0 : totalFees,
    totalCost: isNaN(totalCost) ? 0 : totalCost,
    effectiveAPR: isNaN(effectiveAPR) ? loan.interestRate : effectiveAPR,
  };
}

export function generateAmortizationSchedule(loan: LoanOffer): AmortizationRow[] {
  const principal = loan.amount;
  const annualRate = loan.interestRate;
  const totalMonths = Math.round(loan.termYears * 12);
  const monthlyRate = annualRate / 100 / 12;

  let baseMonthlyPayment = 0;
  if (monthlyRate === 0) {
    baseMonthlyPayment = totalMonths > 0 ? principal / totalMonths : 0;
  } else {
    baseMonthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate;
    let principalPaid = baseMonthlyPayment - interest;
    
    if (month === totalMonths || principalPaid > balance) {
      principalPaid = balance;
    }
    
    const endingBalance = Math.max(0, balance - principalPaid);
    const debtInsurance = (balance * (loan.debtInsuranceRate || 0)) / 100;
    const propertyInsurance = loan.propertyInsurance || 0;
    const payment = baseMonthlyPayment + debtInsurance + propertyInsurance + loan.monthlyFees;

    schedule.push({
      month,
      beginningBalance: balance,
      payment,
      principal: principalPaid,
      interest,
      debtInsurance,
      propertyInsurance,
      fees: loan.monthlyFees,
      endingBalance,
    });

    balance = endingBalance;
    if (balance <= 0) break;
  }

  return schedule;
}
