import type { CalculatedLoan } from '../types/loan';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToCSV(loans: CalculatedLoan[]) {
  if (loans.length === 0) return;

  const headers = [
    'Banco / Institución',
    'Tipo de Préstamo',
    'Monto ($)',
    'Tasa Nominal (%)',
    'Plazo (Años)',
    'Comisión Apertura ($)',
    'Comisión Mensual ($)',
    'Seguro Deuda (%/mes)',
    'Seguro Daños ($/mes)',
    'Cuota Mensual Total ($)',
    'Total Intereses ($)',
    'Total Seguros ($)',
    'Costo Total ($)',
    'Tasa Efectiva TIE (%)',
    'Notas'
  ];

  const rows = loans.map((l) => [
    `"${l.bankName}"`,
    `"${l.loanType}"`,
    l.amount.toFixed(2),
    l.interestRate.toFixed(2),
    l.termYears,
    l.upfrontFees.toFixed(2),
    l.monthlyFees.toFixed(2),
    l.debtInsuranceRate.toFixed(3),
    l.propertyInsurance.toFixed(2),
    l.totalMonthlyPayment.toFixed(2),
    l.totalInterest.toFixed(2),
    l.totalInsurance.toFixed(2),
    l.totalCost.toFixed(2),
    l.effectiveAPR.toFixed(2),
    `"${l.notes || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `comparacion_prestamos_sv_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(loans: CalculatedLoan[]) {
  if (loans.length === 0) return;

  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text('Reporte Comparativo de Préstamos (El Salvador)', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generado el ${new Date().toLocaleDateString('es-SV')}`, 14, 26);
  doc.text('Cálculos bajo normativa financiera de la Superintendencia del Sistema Financiero (SSF)', 14, 32);

  const tableColumn = [
    'Banco', 
    'Tipo', 
    'Monto', 
    'Tasa', 
    'Plazo', 
    'Cuota Mensual', 
    'Total Intereses', 
    'Costo Total',
    'TIE (APR)'
  ];

  const tableRows = loans.map((l) => [
    l.bankName,
    l.loanType,
    `$${l.amount.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `${l.interestRate.toFixed(2)}%`,
    `${l.termYears} años`,
    `$${l.totalMonthlyPayment.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `$${l.totalInterest.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `$${l.totalCost.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `${l.effectiveAPR.toFixed(2)}%`
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 38,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
  });

  doc.save(`comparacion_prestamos_sv_${new Date().toISOString().slice(0, 10)}.pdf`);
}
