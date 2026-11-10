import React from 'react';
import { BadgeDollarSign, Plus, FileSpreadsheet, FileText, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onAddLoan: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onReset: () => void;
  loanCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddLoan,
  onExportCSV,
  onExportPDF,
  onReset,
  loanCount,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <BadgeDollarSign size={28} />
        </div>
        <div>
          <h1>Comparador de Préstamos SV</h1>
          <p>Compara ofertas bancarias según la ley financiera de El Salvador</p>
        </div>
      </div>
      <div className="navbar-actions">
        <button className="btn btn-primary" onClick={onAddLoan}>
          <Plus size={18} />
          <span>Nueva Oferta</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={onExportCSV}
          disabled={loanCount === 0}
          title="Exportar a CSV"
        >
          <FileSpreadsheet size={18} />
          <span>CSV</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={onExportPDF}
          disabled={loanCount === 0}
          title="Exportar Reporte PDF"
        >
          <FileText size={18} />
          <span>PDF</span>
        </button>
        <button className="btn btn-outline" onClick={onReset} title="Restablecer ofertas de ejemplo">
          <RotateCcw size={18} />
          <span>Restablecer</span>
        </button>
      </div>
    </header>
  );
};
