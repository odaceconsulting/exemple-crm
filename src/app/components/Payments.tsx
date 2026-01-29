import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { 
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
  MoreVertical,
  TrendingUp,
  Grid3x3,
  List,
  Kanban,
  Search,
  Edit,
  FileText,
  CheckSquare,
  AlertTriangle,
  TrendingDown,
  Settings,
  Link as LinkIcon,
  Briefcase,
  ShoppingCart,
  BookOpen
} from 'lucide-react';

interface Payment {
  id: number;
  invoiceNumber: string;
  company: string;
  amount: number;
  method: 'card' | 'bank' | 'check' | 'cash' | 'transfer';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  dueDate: string;
  paidDate?: string;
  reference: string;
  partialAmount?: number;
  partialPaidDate?: string;
  overpaymentAmount?: number;
  reconciliationStatus?: 'pending' | 'matched' | 'unmatched';
  reconciliationDate?: string;
}

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: 'active' | 'inactive';
  paymentTerms: string;
}

interface Invoice {
  id: number;
  number: string;
  supplierName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

interface PaymentOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  amount: number;
  createdDate: string;
  scheduledDate: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
}

interface Schedule {
  id: number;
  invoiceNumber: string;
  supplierName: string;
  totalAmount: number;
  firstPaymentDate: string;
  numberOfInstallments: number;
  installmentAmount: number;
  paidInstallments: number;
  nextPaymentDate: string;
}

interface BankAccount {
  id: number;
  name: string;
  bankName: string;
  accountNumber: string;
  IBAN: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

interface CashRegister {
  id: number;
  name: string;
  location: string;
  currentBalance: number;
  totalTransactions: number;
  lastCounting: string;
  status: 'open' | 'closed';
}

interface RealTimeBalance {
  id: number;
  accountName: string;
  accountType: 'bank' | 'cash';
  balance: number;
  previousBalance: number;
  variation: number;
  lastTransaction: string;
  transactionAmount: number;
  transactionType: 'income' | 'expense';
}

interface Forecast {
  id: number;
  month: string;
  projectedIncome: number;
  projectedExpense: number;
  expectedBalance: number;
  confidence: 'high' | 'medium' | 'low';
  notes: string;
}

interface Statement {
  id: number;
  name: string;
  bankName: string;
  period: string; // e.g. '2026-01'
  importedDate: string;
  status: 'imported' | 'pending' | 'error';
  fileName?: string;
  totalTransactions: number;
  openingBalance: number;
  closingBalance: number;
}

interface Reconciliation {
  id: number;
  statementId: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  matchedAmount: number;
  unmatchedAmount: number;
  lastRun: string;
  status: 'up-to-date' | 'in-progress' | 'issues';
}

interface Discrepancy {
  id: number;
  statementId: number;
  transactionRef: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
  type: 'overpayment' | 'missing' | 'mismatch';
  status: 'open' | 'resolved';
  note?: string;
}

// REPORTING interfaces
interface EncaissementEntry {
  id: number;
  date: string;
  source: string;
  invoiceNumber?: string;
  amount: number;
  method: string;
}

interface DecaissementEntry {
  id: number;
  date: string;
  beneficiary: string;
  reference?: string;
  amount: number;
  account: string;
}

interface AgedBalanceEntry {
  id: number;
  customer: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
}

interface ExportOption {
  id: number;
  name: string;
  format: 'csv' | 'xlsx' | 'pdf';
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      invoiceNumber: 'INV-2026-001',
      company: 'Acme Corporation',
      amount: 15000,
      method: 'transfer',
      status: 'paid',
      dueDate: '2026-01-15',
      paidDate: '2026-01-14',
      reference: 'Transfer-123456'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2026-002',
      company: 'TechStart SAS',
      amount: 8500,
      method: 'card',
      status: 'paid',
      dueDate: '2026-01-20',
      paidDate: '2026-01-18',
      reference: 'CC-789012'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2026-003',
      company: 'Global Industries',
      amount: 22000,
      method: 'bank',
      status: 'pending',
      dueDate: '2026-02-10',
      reference: 'BT-345678'
    },
    {
      id: 4,
      invoiceNumber: 'INV-2026-004',
      company: 'Innovation Labs',
      amount: 5500,
      method: 'check',
      status: 'failed',
      dueDate: '2026-01-25',
      reference: 'CHK-901234'
    }
  ]);

  const [showNewPayment, setShowNewPayment] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Features States
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showPartialPayment, setShowPartialPayment] = useState(false);
  const [showOverpaymentDialog, setShowOverpaymentDialog] = useState(false);
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'enregistrement' | 'modes' | 'rapprochement' | 'partiels' | 'trop-perçus' | 'fournisseurs' | 'factures' | 'ordres' | 'echancier' | 'comptes' | 'caisse' | 'soldes' | 'previsions' | 'releves' | 'report_encaissements' | 'report_decaissements' | 'report_aged' | 'report_export'>('dashboard');
  const [partialAmount, setPartialAmount] = useState('');
  const [reconciliationFilter, setReconciliationFilter] = useState<'all' | 'matched' | 'unmatched'>('all');
  const [relevesView, setRelevesView] = useState<'import' | 'rappro' | 'ecarts'>('import');

  // Reporting state
  const [encaissements, setEncaissements] = useState<EncaissementEntry[]>([
    { id: 1, date: '2026-01-14', source: 'Acme Corporation', invoiceNumber: 'INV-2026-001', amount: 15000, method: 'Virement' },
    { id: 2, date: '2026-01-18', source: 'TechStart SAS', invoiceNumber: 'INV-2026-002', amount: 8500, method: 'CB' }
  ]);

  const [decaissements, setDecaissements] = useState<DecaissementEntry[]>([
    { id: 1, date: '2026-01-20', beneficiary: 'Fournisseur A', reference: 'OP-2026-001', amount: 12000, account: 'Compte Principal' },
    { id: 2, date: '2026-01-22', beneficiary: 'Fournisseur B', reference: 'OP-2026-002', amount: 5000, account: 'Compte Épargne' }
  ]);

  const [agedBalances, setAgedBalances] = useState<AgedBalanceEntry[]>([
    { id: 1, customer: 'Client A', invoiceNumber: 'INV-2025-100', dueDate: '2025-12-01', amount: 2000, daysOverdue: 59 },
    { id: 2, customer: 'Client B', invoiceNumber: 'INV-2025-110', dueDate: '2025-11-15', amount: 4500, daysOverdue: 75 }
  ]);

  const [exportOptions] = useState<ExportOption[]>([
    { id: 1, name: 'Export CSV', format: 'csv' },
    { id: 2, name: 'Export Excel', format: 'xlsx' },
    { id: 3, name: 'Export PDF', format: 'pdf' }
  ]);
  
  // New entities states
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: 'Acme Supplies', email: 'contact@acme.com', phone: '+33123456789', address: '123 Rue de Paris', totalAmount: 50000, status: 'active', paymentTerms: '30 jours' },
    { id: 2, name: 'TechSupply Ltd', email: 'info@techsupply.com', phone: '+33987654321', address: '456 Rue Lyon', totalAmount: 35000, status: 'active', paymentTerms: '45 jours' },
    { id: 3, name: 'Global Materials', email: 'sales@global.com', phone: '+33555123456', address: '789 Rue Marseille', totalAmount: 22000, status: 'inactive', paymentTerms: '60 jours' }
  ]);
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, number: 'FAC-2026-001', supplierName: 'Acme Supplies', amount: 15000, issueDate: '2026-01-10', dueDate: '2026-02-10', status: 'paid' },
    { id: 2, number: 'FAC-2026-002', supplierName: 'TechSupply Ltd', amount: 8500, issueDate: '2026-01-15', dueDate: '2026-03-01', status: 'sent' },
    { id: 3, number: 'FAC-2026-003', supplierName: 'Acme Supplies', amount: 22000, issueDate: '2026-01-05', dueDate: '2026-02-05', status: 'overdue' }
  ]);
  
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([
    { id: 1, orderNumber: 'OP-2026-001', supplierId: 1, supplierName: 'Acme Supplies', amount: 15000, createdDate: '2026-01-20', scheduledDate: '2026-02-10', status: 'approved' },
    { id: 2, orderNumber: 'OP-2026-002', supplierId: 2, supplierName: 'TechSupply Ltd', amount: 8500, createdDate: '2026-01-22', scheduledDate: '2026-02-15', status: 'pending' },
    { id: 3, orderNumber: 'OP-2026-003', supplierId: 1, supplierName: 'Acme Supplies', amount: 22000, createdDate: '2026-01-18', scheduledDate: '2026-01-30', status: 'paid' }
  ]);
  
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 1, invoiceNumber: 'FAC-2026-001', supplierName: 'Acme Supplies', totalAmount: 30000, firstPaymentDate: '2026-02-01', numberOfInstallments: 3, installmentAmount: 10000, paidInstallments: 1, nextPaymentDate: '2026-03-01' },
    { id: 2, invoiceNumber: 'FAC-2026-002', supplierName: 'TechSupply Ltd', totalAmount: 12000, firstPaymentDate: '2026-02-15', numberOfInstallments: 2, installmentAmount: 6000, paidInstallments: 0, nextPaymentDate: '2026-02-15' }
  ]);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 1, name: 'Compte Principal', bankName: 'BNP Paribas', accountNumber: '12345678901234', IBAN: 'FR1420041010050500013M02606', balance: 250000, currency: 'EUR', status: 'active', lastUpdated: '2026-01-29' },
    { id: 2, name: 'Compte Épargne', bankName: 'Crédit Agricole', accountNumber: '98765432109876', IBAN: 'FR1410503000702324518U7160', balance: 150000, currency: 'EUR', status: 'active', lastUpdated: '2026-01-28' },
    { id: 3, name: 'Compte Investissement', bankName: 'Société Générale', accountNumber: '55555555555555', IBAN: 'FR1430003000602000010007089', balance: 500000, currency: 'EUR', status: 'active', lastUpdated: '2026-01-20' }
  ]);

  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([
    { id: 1, name: 'Caisse Siège', location: 'Paris', currentBalance: 5000, totalTransactions: 125, lastCounting: '2026-01-29', status: 'open' },
    { id: 2, name: 'Caisse Succursale', location: 'Lyon', currentBalance: 2500, totalTransactions: 87, lastCounting: '2026-01-28', status: 'open' },
    { id: 3, name: 'Caisse Opérations', location: 'Paris', currentBalance: 1200, totalTransactions: 245, lastCounting: '2026-01-29', status: 'closed' }
  ]);

  const [realTimeBalances, setRealTimeBalances] = useState<RealTimeBalance[]>([
    { id: 1, accountName: 'Compte Principal', accountType: 'bank', balance: 250000, previousBalance: 245000, variation: 5000, lastTransaction: '2026-01-29 14:30', transactionAmount: 5000, transactionType: 'income' },
    { id: 2, accountName: 'Caisse Siège', accountType: 'cash', balance: 5000, previousBalance: 4800, variation: 200, lastTransaction: '2026-01-29 12:15', transactionAmount: 200, transactionType: 'income' },
    { id: 3, accountName: 'Compte Épargne', accountType: 'bank', balance: 150000, previousBalance: 150000, variation: 0, lastTransaction: '2026-01-28 10:00', transactionAmount: 0, transactionType: 'expense' }
  ]);

  const [forecasts, setForecasts] = useState<Forecast[]>([
    { id: 1, month: '2026-02', projectedIncome: 350000, projectedExpense: 200000, expectedBalance: 400000, confidence: 'high', notes: 'Basé sur les commandes confirmées' },
    { id: 2, month: '2026-03', projectedIncome: 320000, projectedExpense: 210000, expectedBalance: 510000, confidence: 'medium', notes: 'Estimations préliminaires' },
    { id: 3, month: '2026-04', projectedIncome: 380000, projectedExpense: 220000, expectedBalance: 670000, confidence: 'low', notes: 'Prévisions indicatives' }
  ]);

  // RELEVÉS (Bank Statements) - sample data
  const [statements, setStatements] = useState<Statement[]>([
    { id: 1, name: 'Relevé Janvier 2026', bankName: 'BNP Paribas', period: '2026-01', importedDate: '2026-01-29', status: 'imported', fileName: 'releve_janvier.csv', totalTransactions: 120, openingBalance: 200000, closingBalance: 250000 },
    { id: 2, name: 'Relevé Février 2026', bankName: 'Crédit Agricole', period: '2026-02', importedDate: '2026-02-28', status: 'pending', fileName: 'releve_fevrier.csv', totalTransactions: 95, openingBalance: 150000, closingBalance: 160000 }
  ]);

  const [reconciliations, setReconciliations] = useState<Reconciliation[]>([
    { id: 1, statementId: 1, matchedTransactions: 110, unmatchedTransactions: 10, matchedAmount: 240000, unmatchedAmount: 1000, lastRun: '2026-01-29 15:00', status: 'up-to-date' },
    { id: 2, statementId: 2, matchedTransactions: 80, unmatchedTransactions: 15, matchedAmount: 155000, unmatchedAmount: 500, lastRun: '2026-02-28 10:30', status: 'issues' }
  ]);

  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([
    { id: 1, statementId: 1, transactionRef: 'TX-123', expectedAmount: 1500, actualAmount: 0, difference: -1500, type: 'missing', status: 'open', note: 'Virement manquant' },
    { id: 2, statementId: 2, transactionRef: 'TX-987', expectedAmount: 2000, actualAmount: 2300, difference: 300, type: 'overpayment', status: 'open', note: 'Trop-perçu possible' }
  ]);

  const [newPaymentForm, setNewPaymentForm] = useState({
    invoiceNumber: '',
    company: '',
    amount: '',
    method: 'transfer' as const,
    dueDate: ''
  });

  const [editPaymentForm, setEditPaymentForm] = useState({
    invoiceNumber: '',
    company: '',
    amount: '',
    method: 'transfer' as const,
    dueDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'card':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'bank':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'check':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cash':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'transfer':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const methodLabels = {
    card: 'Carte Bancaire',
    bank: 'Virement Bancaire',
    check: 'Chèque',
    cash: 'Espèces',
    transfer: 'Transfert'
  };

  const statusLabels = {
    paid: 'Payé',
    pending: 'En attente',
    failed: 'Échoué',
    refunded: 'Remboursé'
  };

  const filteredPayments = (filterStatus === 'all' 
    ? payments 
    : payments.filter(p => p.status === filterStatus))
    .filter(p => 
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayment = () => {
    if (newPaymentForm.invoiceNumber && newPaymentForm.company && newPaymentForm.amount) {
      const newPayment: Payment = {
        id: Math.max(...payments.map(p => p.id), 0) + 1,
        invoiceNumber: newPaymentForm.invoiceNumber,
        company: newPaymentForm.company,
        amount: parseFloat(newPaymentForm.amount),
        method: newPaymentForm.method,
        status: 'pending',
        dueDate: newPaymentForm.dueDate,
        reference: `REF-${Date.now()}`
      };
      setPayments([...payments, newPayment]);
      setShowNewPayment(false);
      setNewPaymentForm({ invoiceNumber: '', company: '', amount: '', method: 'transfer', dueDate: '' });
    }
  };

  const handleMarkAsPaid = (id: number) => {
    setPayments(payments.map(p =>
      p.id === id ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : p
    ));
    setSelectedPayment(null);
  };

  const handleEditPayment = () => {
    if (selectedPayment && editPaymentForm.invoiceNumber && editPaymentForm.company && editPaymentForm.amount) {
      setPayments(payments.map(p =>
        p.id === selectedPayment.id ? {
          ...p,
          invoiceNumber: editPaymentForm.invoiceNumber,
          company: editPaymentForm.company,
          amount: parseFloat(editPaymentForm.amount),
          method: editPaymentForm.method,
          dueDate: editPaymentForm.dueDate
        } : p
      ));
      setIsEditingPayment(false);
      setShowPaymentDetails(false);
      setSelectedPayment(null);
    }
  };

  // PARTIELS - Partial Payment Handler
  const handlePartialPayment = () => {
    if (!selectedPayment || !partialAmount) return;
    const partial = parseFloat(partialAmount);
    if (partial <= 0 || partial >= selectedPayment.amount) return;
    
    setPayments(payments.map(p =>
      p.id === selectedPayment.id 
        ? { 
            ...p, 
            partialAmount: partial,
            partialPaidDate: new Date().toISOString().split('T')[0],
            status: 'pending'
          } 
        : p
    ));
    setPartialAmount('');
    setShowPartialPayment(false);
  };

  // TROP-PERÇUS - Overpayment Handler
  const handleOverpayment = (id: number, overpaidAmount: number) => {
    setPayments(payments.map(p =>
      p.id === id 
        ? { 
            ...p, 
            overpaymentAmount: overpaidAmount,
            status: 'paid'
          } 
        : p
    ));
  };

  // RAPPROCHEMENT - Reconciliation Handler
  const matchPayment = (id: number) => {
    setPayments(payments.map(p =>
      p.id === id 
        ? { 
            ...p, 
            reconciliationStatus: 'matched',
            reconciliationDate: new Date().toISOString().split('T')[0]
          } 
        : p
    ));
  };

  const unmatchPayment = (id: number) => {
    setPayments(payments.map(p =>
      p.id === id 
        ? { 
            ...p, 
            reconciliationStatus: 'unmatched'
          } 
        : p
    ));
  };

  // Calculate totals for new features
  const totalPartialPayments = payments
    .filter(p => p.partialAmount)
    .reduce((sum, p) => sum + (p.partialAmount || 0), 0);

  const totalOverpayments = payments
    .filter(p => p.overpaymentAmount)
    .reduce((sum, p) => sum + (p.overpaymentAmount || 0), 0);

  const matchedPayments = payments.filter(p => p.reconciliationStatus === 'matched').length;
  const unmatchedPayments = payments.filter(p => p.reconciliationStatus === 'unmatched').length;

  // Relevés helpers
  const markDiscrepancyResolved = (id: number) => {
    setDiscrepancies(discrepancies.map(d => d.id === id ? { ...d, status: 'resolved' } : d));
  };

  const runReconciliationForStatement = (statementId: number) => {
    // Very small simulation: mark reconciliation as up-to-date and reduce unmatched counts
    setReconciliations(reconciliations.map(r => r.statementId === statementId ? { ...r, status: 'up-to-date', lastRun: new Date().toISOString() } : r));
    setDiscrepancies(discrepancies.map(d => d.statementId === statementId ? { ...d, status: d.type === 'mismatch' ? 'open' : d.status } : d));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header with Tabs */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Paiements</h1>
          <p className="text-gray-500 mt-1">Gestion des paiements et suivi financier</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Fonctionnalités
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* PAIEMENTS Category */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Paiements</div>
              <DropdownMenuItem onClick={() => setActiveTab('enregistrement')}>Enregistrement</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('modes')}>Modes de paiement</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('rapprochement')}>Rapprochement</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('partiels')}>Paiements partiels</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('trop-perçus')}>Trop-perçus</DropdownMenuItem>

              {/* DÉCAISSEMENTS Category */}
              <div className="my-1 border-t border-gray-200"></div>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Décaissements</div>
              <DropdownMenuItem onClick={() => setActiveTab('fournisseurs')}>Fournisseurs</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('factures')}>Factures</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('ordres')}>Ordres paiement</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('echancier')}>Échéancier</DropdownMenuItem>

              {/* TRÉSORERIE Category */}
              <div className="my-1 border-t border-gray-200"></div>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trésorerie</div>
              <DropdownMenuItem onClick={() => setActiveTab('comptes')}>Comptes bancaires</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('caisse')}>Caisse</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('soldes')}>Soldes temps réel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('previsions')}>Prévisions</DropdownMenuItem>
              <div className="my-1 border-t border-gray-200"></div>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Reporting</div>
              <DropdownMenuItem onClick={() => setActiveTab('report_encaissements')}>Encaissements</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('report_decaissements')}>Décaissements</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('report_aged')}>Balance âgée</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('report_export')}>Export</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('releves')}>Relevés</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => {
              setActiveTab('enregistrement');
              setShowNewPayment(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nouveau paiement
          </button>
          {activeTab !== 'dashboard' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
            >
              ← Tableau de bord
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total des paiements</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">€{totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Montant payé</p>
                <p className="text-3xl font-semibold text-green-600 mt-2">€{paidAmount.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">En attente</p>
                <p className="text-3xl font-semibold text-orange-600 mt-2">€{pendingAmount.toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {(['all', 'paid', 'pending', 'failed'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Tous' : statusLabels[status as keyof typeof statusLabels]}
          </button>
        ))}
      </div>

      {/* Search and View Mode */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un paiement..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Vue grille"
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Vue liste"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Vue kanban"
              >
                <Kanban className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode: Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{payment.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{payment.company}</p>
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {statusLabels[payment.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-gray-900">€{payment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {methodLabels[payment.method as keyof typeof methodLabels]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowPaymentDetails(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    Voir
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Mode: List */}
      {viewMode === 'list' && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Liste des paiements ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Facture</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Entreprise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Méthode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date d'échéance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{payment.company}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">€{payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getMethodColor(payment.method)}`}>
                          {methodLabels[payment.method as keyof typeof methodLabels]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(payment.status)}>
                          {statusLabels[payment.status as keyof typeof statusLabels]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowPaymentDetails(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun paiement trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Mode: Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['pending', 'paid', 'failed', 'refunded'].map((status) => {
            const statusPayments = filteredPayments.filter(p => p.status === status as any);
            return (
              <div key={status} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-3 w-3 rounded-full ${status === 'pending' ? 'bg-orange-400' : status === 'failed' ? 'bg-red-400' : status === 'refunded' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                  <h3 className="font-semibold text-gray-900">
                    {status === 'pending' ? 'En attente' : status === 'failed' ? 'Échoué' : status === 'refunded' ? 'Remboursé' : 'Payés'}
                  </h3>
                  <span className="ml-auto bg-white px-2 py-1 rounded text-xs font-medium text-gray-600">
                    {statusPayments.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {statusPayments.map((payment) => (
                    <Card key={payment.id} className="border-0 shadow-sm bg-white cursor-move hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{payment.invoiceNumber}</p>
                          <CreditCard className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{payment.company}</p>
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">€{payment.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* ENREGISTREMENT TAB */}
      {activeTab === 'enregistrement' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Enregistrement des Paiements</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Enregistrez et tracez tous les paiements reçus</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 font-semibold">Total enregistré</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">€{totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 font-semibold">Paiements confirmés</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{payments.filter(p => p.status === 'paid').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600 font-semibold">En cours de traitement</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">{payments.filter(p => p.status === 'pending').length}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Facture</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Entreprise</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Référence</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Date paiement</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{p.invoiceNumber}</td>
                      <td className="px-4 py-2 text-gray-600">{p.company}</td>
                      <td className="px-4 py-2 text-right font-semibold text-gray-900">€{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{p.reference}</td>
                      <td className="px-4 py-2 text-gray-600">{p.paidDate ? new Date(p.paidDate).toLocaleDateString('fr-FR') : '-'}</td>
                      <td className="px-4 py-2"><Badge className={getStatusColor(p.status)}>{statusLabels[p.status as keyof typeof statusLabels]}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODES PAIEMENT TAB */}
      {activeTab === 'modes' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Modes de Paiement</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Analyse par méthode de paiement</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {['card', 'bank', 'check', 'cash', 'transfer'].map(method => {
                const methodPayments = payments.filter(p => p.method === method);
                const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
                const methodCount = methodPayments.length;
                return (
                  <div key={method} className={`p-4 rounded-lg border-2 ${getMethodColor(method)}`}>
                    <p className="font-semibold text-sm mb-2">{methodLabels[method as keyof typeof methodLabels]}</p>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">€{methodTotal.toLocaleString()}</p>
                      <p className="text-xs opacity-90">{methodCount} paiements</p>
                      <p className="text-xs opacity-75">{methodPayments.filter(p => p.status === 'paid').length} confirmés</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-purple-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Méthode</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Total</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Nombre</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Payés</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">En attente</th>
                  </tr>
                </thead>
                <tbody>
                  {['card', 'bank', 'check', 'cash', 'transfer'].map(method => {
                    const mp = payments.filter(p => p.method === method);
                    const total = mp.reduce((sum, p) => sum + p.amount, 0);
                    const paid = mp.filter(p => p.status === 'paid').length;
                    const pending = mp.filter(p => p.status === 'pending').length;
                    return (
                      <tr key={method} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{methodLabels[method as keyof typeof methodLabels]}</td>
                        <td className="px-4 py-2 text-right font-semibold">€{total.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{mp.length}</td>
                        <td className="px-4 py-2 text-right text-green-600 font-semibold">{paid}</td>
                        <td className="px-4 py-2 text-right text-orange-600 font-semibold">{pending}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RAPPROCHEMENT TAB */}
      {activeTab === 'rapprochement' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Rapprochement des Paiements</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Vérifiez et appariez les paiements avec les factures</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-xs text-gray-600 font-semibold">Appariés</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">{matchedPayments}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <p className="text-xs text-gray-600 font-semibold">Non appariés</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{unmatchedPayments}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold">Taux d'appariement</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{payments.length > 0 ? Math.round((matchedPayments / payments.length) * 100) : 0}%</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Facture</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Entreprise</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut réconciliation</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{p.invoiceNumber}</td>
                      <td className="px-4 py-2 text-gray-600">{p.company}</td>
                      <td className="px-4 py-2 text-right font-semibold">€{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <Badge className={p.reconciliationStatus === 'matched' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                          {p.reconciliationStatus === 'matched' ? 'Apparié' : 'Non apparié'}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {p.reconciliationStatus === 'matched' ? (
                          <button onClick={() => unmatchPayment(p.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Retirer</button>
                        ) : (
                          <button onClick={() => matchPayment(p.id)} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200">Apparier</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PARTIELS TAB */}
      {activeTab === 'partiels' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Paiements Partiels</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Gérez les paiements en plusieurs fois</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600 font-semibold">Montant total des partiels</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">€{totalPartialPayments.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold">Factures avec paiements partiels</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{payments.filter(p => p.partialAmount).length}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-orange-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Facture</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant total</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Partiel payé</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Reste à payer</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(p => p.partialAmount || p.status === 'pending').map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{p.invoiceNumber}</td>
                      <td className="px-4 py-2 text-right">€{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-semibold text-orange-600">€{(p.partialAmount || 0).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-semibold">{p.partialAmount ? `€${(p.amount - p.partialAmount).toLocaleString()}` : `€${p.amount.toLocaleString()}`}</td>
                      <td className="px-4 py-2">
                        {p.partialAmount ? (
                          <Badge className="bg-orange-100 text-orange-700">Partiel</Badge>
                        ) : (
                          <Badge className={getStatusColor(p.status)}>{statusLabels[p.status as keyof typeof statusLabels]}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TROP-PERÇUS TAB */}
      {activeTab === 'trop-perçus' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-rose-50 to-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Trop-Perçus</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Gérez les surpaiements et remboursements</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-rose-200">
                <p className="text-xs text-gray-600 font-semibold">Total des trop-perçus</p>
                <p className="text-2xl font-bold text-rose-600 mt-2">€{totalOverpayments.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold">Factures en trop-perçu</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{payments.filter(p => p.overpaymentAmount).length}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-rose-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Facture</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Entreprise</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant dû</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Trop-perçu</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(p => p.overpaymentAmount).map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{p.invoiceNumber}</td>
                      <td className="px-4 py-2 text-gray-600">{p.company}</td>
                      <td className="px-4 py-2 text-right">€{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-bold text-rose-600">€{(p.overpaymentAmount || 0).toLocaleString()}</td>
                      <td className="px-4 py-2 text-xs"><button className="px-2 py-1 bg-rose-100 text-rose-700 rounded hover:bg-rose-200">Rembourser</button></td>
                    </tr>
                  ))}
                  {payments.filter(p => p.overpaymentAmount).length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucun trop-perçu enregistré</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FOURNISSEURS TAB */}
      {activeTab === 'fournisseurs' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Fournisseurs</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Gestion des fournisseurs et leurs conditions</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 font-semibold">Total des fournisseurs</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{suppliers.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 font-semibold">Fournisseurs actifs</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{suppliers.filter(s => s.status === 'active').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="text-xs text-gray-600 font-semibold">Total dû aux fournisseurs</p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">€{suppliers.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Nom</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Téléphone</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Conditions</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant total</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{s.email}</td>
                      <td className="px-4 py-2 text-gray-600">{s.phone}</td>
                      <td className="px-4 py-2 text-gray-600">{s.paymentTerms}</td>
                      <td className="px-4 py-2 text-right font-semibold">€{s.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-2"><Badge className={s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>{s.status === 'active' ? 'Actif' : 'Inactif'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FACTURES TAB */}
      {activeTab === 'factures' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Factures Fournisseurs</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Suivi des factures reçues des fournisseurs</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 font-semibold">Total factures</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">€{invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 font-semibold">Payées</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{invoices.filter(i => i.status === 'paid').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600 font-semibold">En attente</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">{invoices.filter(i => i.status === 'sent').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-red-200">
                <p className="text-xs text-gray-600 font-semibold">En retard</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{invoices.filter(i => i.status === 'overdue').length}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-purple-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Numéro</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Fournisseur</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Date émission</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Date échéance</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{inv.number}</td>
                      <td className="px-4 py-2 text-gray-600">{inv.supplierName}</td>
                      <td className="px-4 py-2 text-right font-semibold">€{inv.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-gray-600">{new Date(inv.issueDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-2 text-gray-600">{new Date(inv.dueDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-2"><Badge className={inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>{inv.status === 'paid' ? 'Payée' : inv.status === 'overdue' ? 'En retard' : 'Envoyée'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ORDRES PAIEMENT TAB */}
      {activeTab === 'ordres' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Ordres de Paiement</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Autorisation et planification des paiements</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600 font-semibold">Total ordres</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">€{paymentOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-600 font-semibold">En attente</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{paymentOrders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 font-semibold">Approuvés</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{paymentOrders.filter(o => o.status === 'approved').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 font-semibold">Exécutés</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{paymentOrders.filter(o => o.status === 'paid').length}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-orange-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Numéro</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Fournisseur</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Date prévue</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-4 py-2 text-gray-600">{order.supplierName}</td>
                      <td className="px-4 py-2 text-right font-semibold">€{order.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-gray-600">{new Date(order.scheduledDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-2"><Badge className={order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'approved' ? 'bg-blue-100 text-blue-700' : order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{order.status === 'pending' ? 'En attente' : order.status === 'approved' ? 'Approuvé' : order.status === 'paid' ? 'Payé' : 'Annulé'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ÉCHÉANCIER TAB */}
      {activeTab === 'echancier' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Échéancier des Paiements</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Calendrier de paiement par tranches</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-xs text-gray-600 font-semibold">Factures en échéancier</p>
                <p className="text-2xl font-bold text-cyan-600 mt-2">{schedules.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 font-semibold">Total à payer</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">€{schedules.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 font-semibold">Prochaine échéance</p>
                <p className="text-sm font-bold text-green-600 mt-2">{schedules.length > 0 ? new Date(schedules[0].nextPaymentDate).toLocaleDateString('fr-FR') : '-'}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cyan-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Facture</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Fournisseur</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant total</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant/tranche</th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-900">Progression</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Prochaine date</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{schedule.invoiceNumber}</td>
                      <td className="px-4 py-2 text-gray-600">{schedule.supplierName}</td>
                      <td className="px-4 py-2 text-right font-semibold">€{schedule.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-semibold text-blue-600">€{schedule.installmentAmount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-xs font-semibold text-cyan-600">{schedule.paidInstallments}/{schedule.numberOfInstallments}</span>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(schedule.paidInstallments / schedule.numberOfInstallments) * 100}%` }}></div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{new Date(schedule.nextPaymentDate).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMPTES BANCAIRES TAB */}
      {activeTab === 'comptes' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Comptes Bancaires</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Gestion des comptes et soldes</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 font-semibold">Nombre de comptes</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{bankAccounts.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <p className="text-xs text-gray-600 font-semibold">Comptes actifs</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">{bankAccounts.filter(b => b.status === 'active').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 font-semibold">Bilan total</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">€{bankAccounts.reduce((sum, b) => sum + b.balance, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-green-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Nom</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Banque</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">IBAN</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Solde</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Mise à jour</th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.map(account => (
                    <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{account.name}</td>
                      <td className="px-4 py-2 text-gray-600">{account.bankName}</td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{account.IBAN}</td>
                      <td className="px-4 py-2 text-right font-bold text-green-600">€{account.balance.toLocaleString()}</td>
                      <td className="px-4 py-2"><Badge className={account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>{account.status === 'active' ? 'Actif' : 'Inactif'}</Badge></td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{new Date(account.lastUpdated).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CAISSE TAB */}
      {activeTab === 'caisse' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Gestion de Caisse</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Suivi des caisses en espèces</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <p className="text-xs text-gray-600 font-semibold">Nombre de caisses</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{cashRegisters.length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-600 font-semibold">Caisses ouvertes</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{cashRegisters.filter(c => c.status === 'open').length}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600 font-semibold">Solde total</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">€{cashRegisters.reduce((sum, c) => sum + c.currentBalance, 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-amber-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Nom</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Localisation</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Solde</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Transactions</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Dernier comptage</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {cashRegisters.map(register => (
                    <tr key={register.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{register.name}</td>
                      <td className="px-4 py-2 text-gray-600">{register.location}</td>
                      <td className="px-4 py-2 text-right font-bold text-amber-600">€{register.currentBalance.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{register.totalTransactions}</td>
                      <td className="px-4 py-2 text-gray-600 text-xs">{new Date(register.lastCounting).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-2"><Badge className={register.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>{register.status === 'open' ? 'Ouverte' : 'Fermée'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SOLDES TEMPS RÉEL TAB */}
      {activeTab === 'soldes' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Soldes Temps Réel</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Suivi des variations de soldes</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Compte</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Solde actuel</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Variation</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Dernière transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {realTimeBalances.map(balance => (
                    <tr key={balance.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{balance.accountName}</td>
                      <td className="px-4 py-2 text-gray-600"><Badge className={balance.accountType === 'bank' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}>{balance.accountType === 'bank' ? 'Banque' : 'Caisse'}</Badge></td>
                      <td className="px-4 py-2 text-right font-bold text-gray-900">€{balance.balance.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`font-semibold ${balance.variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {balance.variation >= 0 ? '+' : ''}€{balance.variation.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">{balance.lastTransaction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PRÉVISIONS TAB */}
      {activeTab === 'previsions' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Prévisions de Trésorerie</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Projection des flux financiers</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-indigo-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Mois</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Revenus prévus</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Dépenses prévues</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Solde attendu</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Confiance</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Observations</th>
                  </tr>
                </thead>
                <tbody>
                  {forecasts.map(forecast => (
                    <tr key={forecast.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{new Date(forecast.month + '-01').toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</td>
                      <td className="px-4 py-2 text-right font-semibold text-green-600">€{forecast.projectedIncome.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-semibold text-red-600">€{forecast.projectedExpense.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-bold text-indigo-600">€{forecast.expectedBalance.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <Badge className={forecast.confidence === 'high' ? 'bg-green-100 text-green-700' : forecast.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}>
                          {forecast.confidence === 'high' ? 'Haute' : forecast.confidence === 'medium' ? 'Moyenne' : 'Basse'}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">{forecast.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RELEVÉS TAB */}
      {activeTab === 'releves' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-cyan-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Relevés bancaires</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Import, rapprochement et gestion des écarts</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setRelevesView('import')} className={`px-3 py-1 rounded ${relevesView === 'import' ? 'bg-white shadow' : 'bg-gray-100'}`}>Import</button>
              <button onClick={() => setRelevesView('rappro')} className={`px-3 py-1 rounded ${relevesView === 'rappro' ? 'bg-white shadow' : 'bg-gray-100'}`}>Rapprochement bancaire</button>
              <button onClick={() => setRelevesView('ecarts')} className={`px-3 py-1 rounded ${relevesView === 'ecarts' ? 'bg-white shadow' : 'bg-gray-100'}`}>Écarts</button>
            </div>

            {relevesView === 'import' && (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Importer un relevé</p>
                    <p className="text-xs text-gray-500">CSV/MT940 import pour rapprochement automatique</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="file" className="text-sm" />
                    <Button onClick={() => alert('Import simulé')}>Importer</Button>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-cyan-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Fichier</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Banque</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Période</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Transactions</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Solde début / fin</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map(s => (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{s.fileName || s.name}</td>
                        <td className="px-4 py-2 text-gray-600">{s.bankName}</td>
                        <td className="px-4 py-2 text-gray-600">{s.period}</td>
                        <td className="px-4 py-2 text-right text-gray-900">{s.totalTransactions}</td>
                        <td className="px-4 py-2 text-right font-semibold">€{s.openingBalance.toLocaleString()} → €{s.closingBalance.toLocaleString()}</td>
                        <td className="px-4 py-2"> <Badge className={s.status === 'imported' ? 'bg-green-100 text-green-700' : s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>{s.status === 'imported' ? 'Importé' : s.status === 'pending' ? 'En attente' : 'Erreur'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {relevesView === 'rappro' && (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Rapprochement bancaire</p>
                    <p className="text-xs text-gray-500">Exécuter le rapprochement et visualiser l'état</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => runReconciliationForStatement(statements[0]?.id || 0)}>Lancer rapprochement</Button>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-cyan-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Relevé</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Dernier run</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Matchés</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Non matchés</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant non matché</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reconciliations.map(r => {
                      const stmt = statements.find(s => s.id === r.statementId);
                      return (
                        <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-900">{stmt?.name || '—'}</td>
                          <td className="px-4 py-2 text-xs text-gray-600">{new Date(r.lastRun).toLocaleString()}</td>
                          <td className="px-4 py-2 text-right text-gray-900">{r.matchedTransactions}</td>
                          <td className="px-4 py-2 text-right text-gray-900">{r.unmatchedTransactions}</td>
                          <td className="px-4 py-2 text-right font-semibold text-red-600">€{r.unmatchedAmount.toLocaleString()}</td>
                          <td className="px-4 py-2"> <Badge className={r.status === 'up-to-date' ? 'bg-green-100 text-green-700' : r.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>{r.status === 'up-to-date' ? 'À jour' : r.status === 'in-progress' ? 'En cours' : 'Problèmes'}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {relevesView === 'ecarts' && (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Écarts détectés</p>
                    <p className="text-xs text-gray-500">Liste des transactions divergentes</p>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-cyan-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Relevé</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Réf.transaction</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Attendu</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Réel</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Écart</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Type</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discrepancies.map(d => {
                      const stmt = statements.find(s => s.id === d.statementId);
                      return (
                        <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-900">{stmt?.name || '—'}</td>
                          <td className="px-4 py-2 text-gray-600">{d.transactionRef}</td>
                          <td className="px-4 py-2 text-right text-gray-900">€{d.expectedAmount.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right text-gray-900">€{d.actualAmount.toLocaleString()}</td>
                          <td className={`px-4 py-2 text-right font-semibold ${d.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>€{d.difference.toLocaleString()}</td>
                          <td className="px-4 py-2">{d.type}</td>
                          <td className="px-4 py-2">
                            {d.status === 'open' ? (
                              <div className="flex gap-2">
                                <Button onClick={() => markDiscrepancyResolved(d.id)}>Marquer résolu</Button>
                                <Button onClick={() => alert('Ouvrir détail')}>Détails</Button>
                              </div>
                            ) : (
                              <span className="text-sm text-green-700">Résolu</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* REPORTING: Encaissements */}
      {activeTab === 'report_encaissements' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Reporting — Encaissements</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Liste des encaissements enregistrés</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Source</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Facture</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {encaissements.map(e => (
                    <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">{new Date(e.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{e.source}</td>
                      <td className="px-4 py-2 text-gray-600">{e.invoiceNumber || '—'}</td>
                      <td className="px-4 py-2 text-right font-semibold text-green-600">€{e.amount.toLocaleString()}</td>
                      <td className="px-4 py-2">{e.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* REPORTING: Décaissements */}
      {activeTab === 'report_decaissements' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-pink-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Reporting — Décaissements</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Liste des sorties de fonds</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Bénéficiaire</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Réf.</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Compte</th>
                  </tr>
                </thead>
                <tbody>
                  {decaissements.map(d => (
                    <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">{new Date(d.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">{d.beneficiary}</td>
                      <td className="px-4 py-2 text-gray-600">{d.reference || '—'}</td>
                      <td className="px-4 py-2 text-right font-semibold text-red-600">€{d.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-gray-700">{d.account}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* REPORTING: Balance âgée */}
      {activeTab === 'report_aged' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Reporting — Balance âgée</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Clients en retard de paiement</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-yellow-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Client</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Facture</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Echéance</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                    <th className="px-4 py-2 text-right font-semibold text-gray-900">Jours de retard</th>
                  </tr>
                </thead>
                <tbody>
                  {agedBalances.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">{a.customer}</td>
                      <td className="px-4 py-2 text-gray-600">{a.invoiceNumber}</td>
                      <td className="px-4 py-2 text-gray-700">{new Date(a.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-right font-semibold">€{a.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right font-semibold text-red-600">{a.daysOverdue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* REPORTING: Export */}
      {activeTab === 'report_export' && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Reporting — Export</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Exporter les rapports</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">Choisissez un format d'export</p>
                <div className="flex gap-2">
                  {exportOptions.map(opt => (
                    <Button key={opt.id} onClick={() => alert(`Export simulé: ${opt.name}`)}>{opt.name}</Button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">Exporter les filtres actifs</p>
                <Button onClick={() => alert('Export global simulé')}>Exporter tout</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Payment Dialog */}
      <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un nouveau paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoice" className="text-sm font-medium">Numéro de facture *</Label>
              <Input
                id="invoice"
                placeholder="INV-2026-001"
                value={newPaymentForm.invoiceNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPaymentForm({...newPaymentForm, invoiceNumber: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-sm font-medium">Entreprise *</Label>
              <Input
                id="company"
                placeholder="Acme Corp"
                value={newPaymentForm.company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPaymentForm({...newPaymentForm, company: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-sm font-medium">Montant (€) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={newPaymentForm.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPaymentForm({...newPaymentForm, amount: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="method" className="text-sm font-medium">Méthode de paiement</Label>
              <select
                id="method"
                value={newPaymentForm.method}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewPaymentForm({...newPaymentForm, method: e.target.value as any})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="transfer">Transfert</option>
                <option value="card">Carte Bancaire</option>
                <option value="bank">Virement Bancaire</option>
                <option value="check">Chèque</option>
                <option value="cash">Espèces</option>
              </select>
            </div>
            <div>
              <Label htmlFor="dueDate" className="text-sm font-medium">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                value={newPaymentForm.dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPaymentForm({...newPaymentForm, dueDate: e.target.value})}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowNewPayment(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleAddPayment} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Details Dialog */}
      {selectedPayment && (
        <Dialog open={showPaymentDetails} onOpenChange={(open) => {
          setShowPaymentDetails(open);
          if (!open) {
            setIsEditingPayment(false);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditingPayment ? 'Modifier le paiement' : 'Détails du paiement'}
              </DialogTitle>
            </DialogHeader>
            
            {isEditingPayment ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-invoice" className="text-sm font-medium">Numéro de facture *</Label>
                  <Input
                    id="edit-invoice"
                    placeholder="INV-2026-001"
                    value={editPaymentForm.invoiceNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPaymentForm({...editPaymentForm, invoiceNumber: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-company" className="text-sm font-medium">Entreprise *</Label>
                  <Input
                    id="edit-company"
                    placeholder="Acme Corp"
                    value={editPaymentForm.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPaymentForm({...editPaymentForm, company: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-amount" className="text-sm font-medium">Montant (€) *</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    placeholder="15000"
                    value={editPaymentForm.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPaymentForm({...editPaymentForm, amount: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-method" className="text-sm font-medium">Méthode</Label>
                  <select
                    id="edit-method"
                    value={editPaymentForm.method}
                    onChange={(e) => setEditPaymentForm({...editPaymentForm, method: e.target.value as any})}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="card">Carte Bancaire</option>
                    <option value="bank">Virement Bancaire</option>
                    <option value="check">Chèque</option>
                    <option value="cash">Espèces</option>
                    <option value="transfer">Transfert</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-dueDate" className="text-sm font-medium">Date d'échéance *</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editPaymentForm.dueDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPaymentForm({...editPaymentForm, dueDate: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditingPayment(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button onClick={handleEditPayment} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Facture</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedPayment.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Montant</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">€{selectedPayment.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Entreprise</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Méthode</p>
                  <p className={`px-3 py-1 rounded-full text-xs font-medium border inline-block mt-1 ${getMethodColor(selectedPayment.method)}`}>
                    {methodLabels[selectedPayment.method as keyof typeof methodLabels]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Statut</p>
                  <Badge className={`${getStatusColor(selectedPayment.status)} mt-1`}>
                    {statusLabels[selectedPayment.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Échéance</p>
                    <p className="text-gray-900 mt-1">{new Date(selectedPayment.dueDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {selectedPayment.paidDate && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Date de paiement</p>
                      <p className="text-gray-900 mt-1">{new Date(selectedPayment.paidDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Référence</p>
                  <p className="text-gray-900 mt-1">{selectedPayment.reference}</p>
                </div>
                {selectedPayment.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditPaymentForm({
                          invoiceNumber: selectedPayment.invoiceNumber,
                          company: selectedPayment.company,
                          amount: selectedPayment.amount.toString(),
                          method: selectedPayment.method,
                          dueDate: selectedPayment.dueDate
                        });
                        setIsEditingPayment(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button onClick={() => handleMarkAsPaid(selectedPayment.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                      Marquer comme payé
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Payments;
