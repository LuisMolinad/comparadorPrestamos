import { useState, useEffect } from 'react';
import type { LoanOffer, CalculatedLoan } from './types/loan';
import { INITIAL_LOANS } from './data/initialLoans';
import { calculateLoanMetrics } from './utils/calculations';
import { exportToCSV, exportToPDF } from './utils/exportUtils';
import { Navbar } from './components/Navbar';
import { LoanCard } from './components/LoanCard';
import { ComparisonTable } from './components/ComparisonTable';
import { LoanForm } from './components/LoanForm';
import { AmortizationModal } from './components/AmortizationModal';
import { LayoutGrid, Table, Plus, Landmark } from 'lucide-react';
import type { LoanType } from './types/loan';

export function App() {
  const [loans, setLoans] = useState<LoanOffer[]>(() => {
    const saved = localStorage.getItem('loan_comparator_sv_offers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved loans', e);
      }
    }
    return INITIAL_LOANS;
  });

  const [selectedType, setSelectedType] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LoanOffer | null>(null);
  const [amortizationLoan, setAmortizationLoan] = useState<CalculatedLoan | null>(null);

  useEffect(() => {
    localStorage.setItem('loan_comparator_sv_offers', JSON.stringify(loans));
  }, [loans]);

  const calculatedLoans: CalculatedLoan[] = loans.map(calculateLoanMetrics);

  const filteredLoans = selectedType === 'All'
    ? calculatedLoans
    : calculatedLoans.filter((l) => l.loanType === selectedType);

  let lowestMonthlyId: string | null = null;
  let lowestTotalCostId: string | null = null;

  if (calculatedLoans.length > 0) {
    const sortedByMonthly = [...calculatedLoans].sort((a, b) => a.totalMonthlyPayment - b.totalMonthlyPayment);
    const sortedByCost = [...calculatedLoans].sort((a, b) => a.totalCost - b.totalCost);

    lowestMonthlyId = sortedByMonthly[0].id;
    lowestTotalCostId = sortedByCost[0].id;
  }

  const handleSaveLoan = (loan: LoanOffer) => {
    if (editingLoan) {
      setLoans(loans.map((l) => (l.id === loan.id ? loan : l)));
    } else {
      setLoans([...loans, loan]);
    }
    setEditingLoan(null);
  };

  const handleEditLoan = (loan: LoanOffer) => {
    setEditingLoan(loan);
    setIsFormOpen(true);
  };

  const handleDeleteLoan = (id: string) => {
    setLoans(loans.filter((l) => l.id !== id));
  };

  const handleReset = () => {
    if (window.confirm('¿Restablecer todas las ofertas a los ejemplos predeterminados de El Salvador?')) {
      setLoans(INITIAL_LOANS);
    }
  };

  const loanTypes: LoanType[] = ['Hipotecario', 'Personal', 'Vehicular', 'Comercial', 'Otro'];

  return (
    <div className="app">
      <Navbar
        onAddLoan={() => {
          setEditingLoan(null);
          setIsFormOpen(true);
        }}
        onExportCSV={() => exportToCSV(calculatedLoans)}
        onExportPDF={() => exportToPDF(calculatedLoans)}
        onReset={handleReset}
        loanCount={loans.length}
      />

      <main className="app-container">
        <div className="controls-bar">
          <div className="filter-group">
            <label>Filtrar por Tipo:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">Todos los Tipos ({calculatedLoans.length})</option>
              {loanTypes.map((type) => {
                const count = calculatedLoans.filter((l) => l.loanType === type).length;
                if (count === 0) return null;
                return (
                  <option key={type} value={type}>
                    {type} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid size={16} /> Tarjetas
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              <Table size={16} /> Tabla
            </button>
          </div>
        </div>

        {filteredLoans.length === 0 ? (
          <div className="empty-state">
            <Landmark size={48} className="text-muted" style={{ margin: '0 auto 1rem' }} />
            <h3>No se encontraron ofertas de préstamos</h3>
            <p>Agrega tu primera oferta bancaria para comenzar a comparar.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingLoan(null);
                setIsFormOpen(true);
              }}
            >
              <Plus size={18} /> Agregar Oferta
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="loans-grid">
            {filteredLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                isLowestMonthly={loan.id === lowestMonthlyId}
                isLowestTotalCost={loan.id === lowestTotalCostId}
                onEdit={handleEditLoan}
                onDelete={handleDeleteLoan}
                onViewAmortization={(l) => setAmortizationLoan(l)}
              />
            ))}
          </div>
        ) : (
          <ComparisonTable
            loans={filteredLoans}
            lowestMonthlyId={lowestMonthlyId}
            lowestTotalCostId={lowestTotalCostId}
            onEdit={handleEditLoan}
            onDelete={handleDeleteLoan}
            onViewAmortization={(l) => setAmortizationLoan(l)}
          />
        )}
      </main>

      <LoanForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLoan(null);
        }}
        onSave={handleSaveLoan}
        initialData={editingLoan}
      />

      <AmortizationModal
        loan={amortizationLoan}
        onClose={() => setAmortizationLoan(null)}
      />
    </div>
  );
}

export default App;
