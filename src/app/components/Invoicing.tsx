import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';

import { mockQuotes, mockInvoices } from '@/app/mockData';
import { Recurrence, Deposit } from '@/app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import PDFTemplateSettings from '@/app/components/PDFTemplateSettings';
import { pdfService } from '@/app/services/pdfService';
import { Badge } from '@/app/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search,
  Download,
  Send,
  Eye,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Grid3x3,
  List,
  Kanban,
  MoreVertical,
  Edit,
  Mail,
  Percent,
  AlertCircle,
  Repeat2,
  Zap,
  CreditCard,
  TrendingUp,
  BarChart3,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Invoice {
  id: string;
  number: string;
  company: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  items: number;
  deposits?: Deposit[];
  recurrence?: Recurrence;
  notes?: string;
  penalty?: number;
  reminderCount?: number;
  paymentMethod?: string;
  paymentDate?: string;
}

const Invoicing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [conversionSourceId, setConversionSourceId] = useState<string | null>(null);
  const [recurrenceForm, setRecurrenceForm] = useState<Recurrence>({ frequency: 'monthly', nextDate: new Date().toISOString().split('T')[0], occurrences: 12 });
  const [depositForm, setDepositForm] = useState<{ invoiceId: string | null; amount: number; date: string; note: string }>({ invoiceId: null, amount: 0, date: new Date().toISOString().split('T')[0], note: '' });
  const [invoicesState, setInvoicesState] = useState<Invoice[]>(() => (
    (mockInvoices as any[] || []).map((inv: any) => ({
      id: inv.id ?? String(inv.number ?? Math.random()),
      number: inv.number ?? inv.number ?? `INV-${inv.id}`,
      company: inv.company ?? inv.companyId ?? 'Client',
      amount: inv.totalAmount ?? inv.amount ?? 0,
      issueDate: (inv.issueDate && typeof inv.issueDate === 'string') ? inv.issueDate : (inv.issueDate instanceof Date ? inv.issueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
      dueDate: (inv.dueDate && typeof inv.dueDate === 'string') ? inv.dueDate : (inv.dueDate instanceof Date ? inv.dueDate.toISOString().split('T')[0] : new Date(Date.now()+30*24*3600*1000).toISOString().split('T')[0]),
      status: inv.status ?? 'draft',
      items: Array.isArray(inv.items) ? inv.items.length : (inv.items ?? 0),
      deposits: inv.deposits,
      recurrence: inv.recurrence
    }))
  ));
  const [showPDFSettings, setShowPDFSettings] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showPenaltyDialog, setShowPenaltyDialog] = useState(false);
  const [activeFollowupInvoice, setActiveFollowupInvoice] = useState<Invoice | null>(null);
  const [penaltyInput, setPenaltyInput] = useState('5');
  const [checkingOverdues, setCheckingOverdues] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<string | null>(null);
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [reportType, setReportType] = useState<'journal' | 'ca' | 'impayés' | 'export' | null>(null);
  // Numérotation modes: 'auto' | 'conformite' | 'archives' | 'avoirs'
  const [numberingMode, setNumberingMode] = useState<'auto' | 'conformite' | 'archives' | 'avoirs'>('auto');

  const generateInvoiceNumber = (id: string | number) => {
    const year = new Date().getFullYear();
    const seq = String(id).padStart(3, '0');
    switch (numberingMode) {
      case 'conformite':
        return `CI-FR-${year}-${seq}`;
      case 'archives':
        return `ARCH-${year}-${seq}`;
      case 'avoirs':
        return `AV-${year}-${seq}`;
      default:
        return `INV-${year}-${seq}`;
    }
  };

  // New invoice form state for manual creation
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    number: '',
    client: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
    items: 1,
    amount: 0,
    status: 'draft' as 'draft' | 'pending' | 'paid'
  });

  React.useEffect(() => {
    if (isAddDialogOpen) {
      const nextId = String((invoicesState.length > 0 ? Math.max(...invoicesState.map(i => parseInt(i.id))) : 0) + 1);
      setNewInvoiceForm(f => ({ ...f, number: generateInvoiceNumber(nextId) }));
    }
  }, [isAddDialogOpen]);

  // Auto-check and mark overdue invoices on mount
  React.useEffect(() => {
    const today = new Date();
    setInvoicesState(prev => prev.map(inv => {
      try {
        const due = new Date(inv.dueDate);
        if (due < today && inv.status !== 'paid' && inv.status !== 'overdue') {
          return { ...inv, status: 'overdue' };
        }
      } catch (e) {
        // ignore parse errors
      }
      return inv;
    }));
  }, []);

  

  const revenueData = [
    { month: 'Jan', revenue: 285000, expenses: 120000 },
    { month: 'Fév', revenue: 320000, expenses: 135000 },
    { month: 'Mar', revenue: 295000, expenses: 128000 },
    { month: 'Avr', revenue: 380000, expenses: 145000 },
    { month: 'Mai', revenue: 410000, expenses: 158000 },
    { month: 'Jun', revenue: 440000, expenses: 165000 }
  ];

  const statusData = [
    { name: 'Payées', value: invoicesState.filter(i => i.status === 'paid').length, color: '#10b981' },
    { name: 'En attente', value: invoicesState.filter(i => i.status === 'pending').length, color: '#f59e0b' },
    { name: 'En retard', value: invoicesState.filter(i => i.status === 'overdue').length, color: '#ef4444' },
    { name: 'Brouillons', value: invoicesState.filter(i => i.status === 'draft').length, color: '#6b7280' }
  ];

  const filteredInvoices = invoicesState.filter(invoice =>
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoicesState = invoicesState.filter(invoice =>
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const totalRevenue = invoicesState.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoicesState.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueRevenue = invoicesState.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  // Création handlers: conversion, recurrent, deposits
  const handleConvertQuote = () => {
    const source = (mockQuotes as any[]).find((q: any) => q.id === (conversionSourceId ?? mockQuotes[0]?.id)) || (mockQuotes as any[])[0];
    if (!source) return;
    const newId = String((invoicesState.length > 0 ? Math.max(...invoicesState.map(i => parseInt(i.id))) : 0) + 1);
    const newInvoice: Invoice = {
      id: newId,
      number: generateInvoiceNumber(newId),
      company: (source as any).company || `Quote ${ (source as any).number || (source as any).quoteNumber || source.id}`,
      amount: (source as any).totalAmount || 0,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
      status: 'draft',
      items: (source as any).items ? (source as any).items.length : 0
    };
    setInvoicesState([newInvoice, ...invoicesState]);
    setShowConversionDialog(false);
    setConversionSourceId(null);
  };

  const handleCreateRecurring = () => {
    const newId = String((invoicesState.length > 0 ? Math.max(...invoicesState.map(i => parseInt(i.id))) : 0) + 1);
    const newInvoice: Invoice = {
      id: newId,
      number: `REC-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`,
      company: 'Client récurrent',
      amount: 0,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30*24*3600*1000).toISOString().split('T')[0],
      status: 'draft',
      items: 0,
      recurrence: recurrenceForm
    };
    setInvoicesState([newInvoice, ...invoicesState]);
    setShowRecurringDialog(false);
  };

  const handleCreateDeposit = () => {
    const targetId = depositForm.invoiceId;
    if (!targetId) return;
    setInvoicesState(invoicesState.map(inv => {
      if (inv.id === targetId) {
        const updated = { ...inv };
        if (!updated.deposits) updated.deposits = [];
        const nid = updated.deposits.length ? Math.max(...updated.deposits.map(d => Number(d.id))) + 1 : 1;
        const newDep: Deposit = { id: nid, amount: depositForm.amount, date: depositForm.date, note: depositForm.note };
        updated.deposits = [...updated.deposits, newDep];
        updated.amount = (updated.amount || 0); // keep total as is
        return updated;
      }
      return inv;
    }));
    setShowDepositDialog(false);
    setDepositForm({ invoiceId: null, amount: 0, date: new Date().toISOString().split('T')[0], note: '' });
  };

  // Suivi helpers: reminders and penalties
  const sendReminder = (invoiceId: string) => {
    setInvoicesState(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const now = new Date().toLocaleString('fr-FR');
        const newCount = (inv.reminderCount || 0) + 1;
        const note = `${inv.notes || ''}\n[Rappel ${newCount} - ${now}] Rappel envoyé au client.`.trim();
        return { ...inv, reminderCount: newCount, notes: note, status: inv.status === 'draft' ? 'pending' : inv.status };
      }
      return inv;
    }));
    setShowReminderDialog(false);
  };

  const applyPenalty = (invoiceId: string, percent: number) => {
    setInvoicesState(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const penaltyAmount = Math.round((inv.amount * (percent / 100)) * 100) / 100;
        const newPenalty = (inv.penalty || 0) + penaltyAmount;
        const note = `${inv.notes || ''}\n[Penalité ${newPenalty}€ - ${percent}%]`.trim();
        return { ...inv, penalty: newPenalty, amount: Math.round((inv.amount + penaltyAmount) * 100) / 100, notes: note };
      }
      return inv;
    }));
    setShowPenaltyDialog(false);
  };

  const checkOverdues = () => {
    setCheckingOverdues(true);
    setTimeout(() => {
      const today = new Date();
      setInvoicesState(prev => prev.map(inv => {
        try {
          const due = new Date(inv.dueDate);
          if (due < today && inv.status !== 'paid' && inv.status !== 'overdue') {
            return { ...inv, status: 'overdue' };
          }
        } catch (e) {}
        return inv;
      }));
      setCheckingOverdues(false);
    }, 800);
  };

  const openReminderDialog = (inv: Invoice) => {
    setActiveFollowupInvoice(inv);
    setShowReminderDialog(true);
  };

  const openPenaltyDialog = (inv: Invoice) => {
    setActiveFollowupInvoice(inv);
    setPenaltyInput('5');
    setShowPenaltyDialog(true);
  };

  const openPaymentDialog = (inv: Invoice) => {
    setActivePaymentInvoice(inv);
    setSelectedPaymentMethod(null);
    setPaymentReference('');
    setShowPaymentDialog(true);
  };

  const openPaymentDialogForMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    setActivePaymentInvoice(null);
    setPaymentReference('');
    setSelectedInvoiceForPayment(null);
    setShowPaymentDialog(true);
  };

  const processPayment = () => {
    if (!activePaymentInvoice || !selectedPaymentMethod) return;
    setInvoicesState(prev => prev.map(inv => {
      if (inv.id === activePaymentInvoice.id) {
        const now = new Date().toLocaleString('fr-FR');
        const note = `${inv.notes || ''}\n[Paiement ${selectedPaymentMethod} - ${now}] ${paymentReference ? 'Ref: ' + paymentReference : 'Paiement reçu'}`.trim();
        return { ...inv, status: 'paid', paymentMethod: selectedPaymentMethod, paymentDate: new Date().toISOString().split('T')[0], notes: note };
      }
      return inv;
    }));
    setShowPaymentDialog(false);
  };

  // Report Generation Functions
  const generateJournalVentes = () => {
    const data = invoicesState.map(inv => ({
      numero: inv.number,
      date: inv.issueDate,
      client: inv.company,
      montant: inv.amount,
      statut: inv.status === 'paid' ? 'Payée' : inv.status === 'pending' ? 'En attente' : inv.status === 'overdue' ? 'En retard' : 'Brouillon',
      methode: inv.paymentMethod || 'N/A'
    }));
    return data;
  };

  const generateCAReport = () => {
    const monthlyData: { [key: string]: { montant: number; payée: number; encours: number } } = {};
    invoicesState.forEach(inv => {
      const month = inv.issueDate.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) monthlyData[month] = { montant: 0, payée: 0, encours: 0 };
      monthlyData[month].montant += inv.amount;
      if (inv.status === 'paid') monthlyData[month].payée += inv.amount;
      else if (inv.status === 'pending' || inv.status === 'overdue') monthlyData[month].encours += inv.amount;
    });
    return monthlyData;
  };

  const generateImpayesReport = () => {
    const data = invoicesState
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .map(inv => {
        const dueDate = new Date(inv.dueDate);
        const today = new Date();
        const daysOverdue = inv.status === 'overdue' ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        return {
          numero: inv.number,
          client: inv.company,
          montant: inv.amount,
          dateEcheance: inv.dueDate,
          jours: daysOverdue,
          statut: inv.status === 'overdue' ? `${daysOverdue} jours` : 'À venir'
        };
      })
      .sort((a, b) => b.jours - a.jours);
    return data;
  };

  const downloadCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Facturation</h1>
          <p className="text-gray-500 mt-1">Gérez vos factures et suivez vos paiements</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                Création
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowConversionDialog(true)}>Conversion devis</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>Création manuelle</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowRecurringDialog(true)}>Récurrentes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDepositDialog(true)}>Acomptes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Numérotation
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setNumberingMode('auto')}>Auto</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNumberingMode('conformite')}>Conformité CI/FR</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNumberingMode('archives')}>Archives</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNumberingMode('avoirs')}>Avoirs</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center px-2 py-1 text-sm text-gray-600">Mode: {numberingMode}</div>
          <Button
            onClick={() => setShowPDFSettings(true)}
            variant="outline"
            className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4" />
            Paramètres PDF
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700">
                <Plus className="h-4 w-4" />
                Nouvelle Facture
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une Facture</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Numéro de facture</Label>
                    <Input id="invoice-number" value={newInvoiceForm.number} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInvoiceForm({ ...newInvoiceForm, number: e.target.value })} placeholder="INV-2026-007" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Date d'émission</Label>
                    <Input id="invoice-date" type="date" value={newInvoiceForm.issueDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInvoiceForm({ ...newInvoiceForm, issueDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Date d'échéance</Label>
                    <Input id="due-date" type="date" value={newInvoiceForm.dueDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <select id="client" value={newInvoiceForm.client} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewInvoiceForm({ ...newInvoiceForm, client: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Sélectionner un client</option>
                      <option value="Acme Corporation">Acme Corporation</option>
                      <option value="TechStart SAS">TechStart SAS</option>
                      <option value="Global Industries">Global Industries</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Articles</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <Input placeholder="Description" />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" placeholder="Quantité" />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" placeholder="Prix unitaire" />
                      </div>
                      <div className="col-span-2">
                        <Input placeholder="TVA %" />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <button className="text-gray-400 hover:text-gray-600">
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700">
                    + Ajouter une ligne
                  </button>
                </div>

                <div className="border-t pt-4">
                  <div className="max-w-xs ml-auto space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-medium">€0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVA (20%):</span>
                      <span className="font-medium">€0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>€0.00</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Conditions de paiement, notes additionnelles..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button variant="outline" onClick={() => {
                  // save as draft
                  const newId = String((invoicesState.length > 0 ? Math.max(...invoicesState.map(i => parseInt(i.id))) : 0) + 1);
                  const number = newInvoiceForm.number || generateInvoiceNumber(newId);
                  const inv: Invoice = {
                    id: newId,
                    number,
                    company: newInvoiceForm.client || 'Client',
                    amount: newInvoiceForm.amount || 0,
                    issueDate: newInvoiceForm.issueDate,
                    dueDate: newInvoiceForm.dueDate,
                    status: 'draft',
                    items: newInvoiceForm.items
                  };
                  setInvoicesState([inv, ...invoicesState]);
                  setIsAddDialogOpen(false);
                  setNewInvoiceForm({ number: '', client: '', issueDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now()+30*24*3600*1000).toISOString().split('T')[0], items:1, amount:0, status:'draft' });
                }}>
                  Sauvegarder brouillon
                </Button>
                <Button onClick={() => {
                  // create and send (status pending)
                  const newId = String((invoicesState.length > 0 ? Math.max(...invoicesState.map(i => parseInt(i.id))) : 0) + 1);
                  const number = newInvoiceForm.number || generateInvoiceNumber(newId);
                  const inv: Invoice = {
                    id: newId,
                    number,
                    company: newInvoiceForm.client || 'Client',
                    amount: newInvoiceForm.amount || 0,
                    issueDate: newInvoiceForm.issueDate,
                    dueDate: newInvoiceForm.dueDate,
                    status: 'pending',
                    items: newInvoiceForm.items
                  };
                  setInvoicesState([inv, ...invoicesState]);
                  setIsAddDialogOpen(false);
                  setNewInvoiceForm({ number: '', client: '', issueDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now()+30*24*3600*1000).toISOString().split('T')[0], items:1, amount:0, status:'draft' });
                }}>
                  Créer et envoyer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
        {/* Dialog: Conversion devis */}
        <Dialog open={showConversionDialog} onOpenChange={setShowConversionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Conversion devis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Sélectionner la source</Label>
                <select className="w-full mt-1 p-2 border rounded" value={conversionSourceId ?? ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setConversionSourceId(e.target.value || null)}>
                  <option value="">-- Choisir un devis --</option>
                  {mockQuotes.map((q: any) => (
                    <option key={q.id} value={q.id}>{q.number || q.quoteNumber} — {q.company || q.companyId || q.id}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowConversionDialog(false)}>Annuler</Button>
                <Button onClick={handleConvertQuote} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">Convertir</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Récurrentes */}
        <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une facture récurrente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Fréquence</Label>
                <select value={recurrenceForm.frequency} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRecurrenceForm({ ...recurrenceForm, frequency: e.target.value as any })} className="w-full mt-1 p-2 border rounded">
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                  <option value="quarterly">Trimestrielle</option>
                  <option value="yearly">Annuel</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Prochaine date</Label>
                <Input type="date" value={recurrenceForm.nextDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecurrenceForm({ ...recurrenceForm, nextDate: e.target.value })} />
              </div>
              <div>
                <Label className="text-sm font-medium">Occurrences</Label>
                <Input type="number" min={1} value={recurrenceForm.occurrences} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecurrenceForm({ ...recurrenceForm, occurrences: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRecurringDialog(false)}>Annuler</Button>
                <Button onClick={handleCreateRecurring} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">Créer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog: Acomptes */}
        <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un acompte</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Facture</Label>
                <select className="w-full mt-1 p-2 border rounded" value={depositForm.invoiceId ?? ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepositForm({ ...depositForm, invoiceId: e.target.value || null })}>
                  <option value="">-- Choisir une facture --</option>
                  {invoicesState.map(q => (
                    <option key={q.id} value={q.id}>{q.number} — {q.company}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Montant</Label>
                <Input type="number" value={depositForm.amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepositForm({ ...depositForm, amount: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label className="text-sm font-medium">Date</Label>
                <Input type="date" value={depositForm.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepositForm({ ...depositForm, date: e.target.value })} />
              </div>
              <div>
                <Label className="text-sm font-medium">Note</Label>
                <textarea className="w-full mt-1 p-2 border rounded" value={depositForm.note} onChange={(e) => setDepositForm({ ...depositForm, note: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDepositDialog(false)}>Annuler</Button>
                <Button onClick={handleCreateDeposit} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">Ajouter</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Encaissé</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {invoicesState.filter(i => i.status === 'paid').length} factures
                </p>
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
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{pendingRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  {invoicesState.filter(i => i.status === 'pending').length} factures
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">En retard</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{overdueRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {invoicesState.filter(i => i.status === 'overdue').length} factures
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{(totalRevenue + pendingRevenue + overdueRevenue).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {invoicesState.filter(i => i.status !== 'draft').length} factures
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Revenus et Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `€${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenus" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Statut des Factures</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SUIVI Section */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-slate-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">SUIVI</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Statuts, échéances, relances et pénalités</p>
              </div>
            </div>
            <Button 
              onClick={checkOverdues} 
              disabled={checkingOverdues}
              className={`${checkingOverdues ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white hover:from-blue-700 hover:to-blue-800 transition-all`}
            >
              {checkingOverdues ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
              {checkingOverdues ? 'Vérification...' : 'Vérifier échéances'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Statuts Card */}
            <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-100 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Statuts</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Payées</span>
                    <span className="font-bold text-green-600">{invoicesState.filter(i => i.status === 'paid').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">En attente</span>
                    <span className="font-bold text-amber-600">{invoicesState.filter(i => i.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">En retard</span>
                    <span className="font-bold text-red-600">{invoicesState.filter(i => i.status === 'overdue').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Brouillons</span>
                    <span className="font-bold text-slate-600">{invoicesState.filter(i => i.status === 'draft').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Échéances Card */}
            <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-amber-100 rounded">
                    <Calendar className="h-4 w-4 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Échéances (14j)</h4>
                </div>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                  {invoicesState
                    .filter(i => {
                      try {
                        const due = new Date(i.dueDate);
                        const today = new Date();
                        const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);
                        return diff >= 0 && diff <= 14;
                      } catch (e) { return false; }
                    })
                    .slice(0,6)
                    .map(inv => (
                      <div key={inv.id} className="p-2 bg-white rounded border border-amber-100">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{inv.number}</div>
                            <div className="text-xs text-slate-500">{inv.company}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">€{inv.amount.toLocaleString()}</div>
                            <div className="text-xs text-amber-600">{new Date(inv.dueDate).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" variant="ghost" onClick={() => openReminderDialog(inv)} className="text-xs h-6 px-2">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openPenaltyDialog(inv)} className="text-xs h-6 px-2">
                            <Percent className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                  ))}
                  {invoicesState.filter(i => {
                    try {
                      const due = new Date(i.dueDate);
                      const today = new Date();
                      const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);
                      return diff >= 0 && diff <= 14;
                    } catch (e) { return false; }
                  }).length === 0 && <p className="text-slate-500 italic">Aucune échéance prévue</p>}
                </div>
              </CardContent>
            </Card>

            {/* Relances Card */}
            <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Relances</h4>
                </div>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                  {invoicesState.filter(i => i.reminderCount && i.reminderCount > 0).slice(0,6).map(inv => (
                    <div key={inv.id} className="p-2 bg-white rounded border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{inv.number}</div>
                          <div className="text-xs text-slate-500">{inv.company}</div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-100 text-blue-700 border-0">{inv.reminderCount || 0} rappel{(inv.reminderCount || 0) > 1 ? 's' : ''}</Badge>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => openReminderDialog(inv)} className="w-full mt-2 text-xs h-6 bg-blue-500 hover:bg-blue-600 text-white">
                        <Repeat2 className="h-3 w-3 mr-1" /> Renvoyer
                      </Button>
                    </div>
                  ))}
                  {invoicesState.filter(i => i.reminderCount && i.reminderCount > 0).length === 0 && <p className="text-slate-500 italic">Aucune relance envoyée</p>}
                </div>
              </CardContent>
            </Card>

            {/* Pénalités Card */}
            <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-red-100 rounded">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Pénalités</h4>
                </div>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                  {invoicesState.filter(i => i.penalty && i.penalty > 0).slice(0,6).map(inv => (
                    <div key={inv.id} className="p-2 bg-white rounded border border-red-100">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{inv.number}</div>
                          <div className="text-xs text-slate-500">{inv.company}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">€{(inv.penalty||0).toLocaleString()}</div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => openPenaltyDialog(inv)} className="w-full mt-2 text-xs h-6 bg-red-500 hover:bg-red-600 text-white">
                        <Percent className="h-3 w-3 mr-1" /> Ajouter
                      </Button>
                    </div>
                  ))}
                  {invoicesState.filter(i => i.penalty && i.penalty > 0).length === 0 && <p className="text-slate-500 italic">Aucune pénalité</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* PAIEMENTS LIGNE Section */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">PAIEMENTS LIGNE</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Orange Money, MTN Money, Virement, Stripe, Réconciliation</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Orange Money */}
            <Button onClick={() => openPaymentDialogForMethod('Orange Money')} className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 rounded-lg shadow-sm">
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Orange Money</span>
              <span className="text-xs opacity-90">{invoicesState.filter(i => i.paymentMethod === 'Orange Money' && i.status === 'paid').length} payées</span>
            </Button>

            {/* MTN Money */}
            <Button onClick={() => openPaymentDialogForMethod('MTN Money')} className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 rounded-lg shadow-sm">
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">MTN Money</span>
              <span className="text-xs opacity-90">{invoicesState.filter(i => i.paymentMethod === 'MTN Money' && i.status === 'paid').length} payées</span>
            </Button>

            {/* Virement */}
            <Button onClick={() => openPaymentDialogForMethod('Virement')} className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-sm">
              <Send className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Virement</span>
              <span className="text-xs opacity-90">{invoicesState.filter(i => i.paymentMethod === 'Virement' && i.status === 'paid').length} payées</span>
            </Button>

            {/* Carte Stripe */}
            <Button onClick={() => openPaymentDialogForMethod('Carte Stripe')} className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 rounded-lg shadow-sm">
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Carte Stripe</span>
              <span className="text-xs opacity-90">{invoicesState.filter(i => i.paymentMethod === 'Carte Stripe' && i.status === 'paid').length} payées</span>
            </Button>

            {/* Réconciliation */}
            <Button onClick={() => openPaymentDialogForMethod('Réconciliation')} className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 rounded-lg shadow-sm">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Réconciliation</span>
              <span className="text-xs opacity-90">{invoicesState.filter(i => i.paymentMethod === 'Réconciliation' && i.status === 'paid').length} payées</span>
            </Button>
          </div>

          {/* Recent Payments */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-100">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Derniers paiements
            </h4>
            <div className="space-y-2">
              {invoicesState.filter(i => i.status === 'paid' && i.paymentMethod).slice(0, 5).map(inv => (
                <div key={inv.id} className="flex justify-between items-center p-2 bg-emerald-50 rounded border border-emerald-100 text-sm">
                  <div>
                    <div className="font-medium text-slate-900">{inv.number}</div>
                    <div className="text-xs text-slate-500">{inv.company} — {inv.paymentDate ? new Date(inv.paymentDate).toLocaleDateString('fr-FR') : 'Date inconnue'}</div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 mb-1">{inv.paymentMethod}</Badge>
                    <div className="font-bold text-emerald-600">€{inv.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
              {invoicesState.filter(i => i.status === 'paid' && i.paymentMethod).length === 0 && <p className="text-slate-500 italic text-sm">Aucun paiement enregistré</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RAPPORTS Section */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">RAPPORTS</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Journal ventes, CA, Impayés, Export compta</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Journal Ventes */}
            <Button 
              onClick={() => {
                setReportType('journal');
                setShowReportsDialog(true);
              }}
              className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 rounded-lg shadow-sm"
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Journal Ventes</span>
              <span className="text-xs opacity-90">{invoicesState.length} factures</span>
            </Button>

            {/* Chiffre d'Affaires */}
            <Button 
              onClick={() => {
                setReportType('ca');
                setShowReportsDialog(true);
              }}
              className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-sm"
            >
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Chiffre d'Affaires</span>
              <span className="text-xs opacity-90">€{invoicesState.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</span>
            </Button>

            {/* Impayés */}
            <Button 
              onClick={() => {
                setReportType('impayés');
                setShowReportsDialog(true);
              }}
              className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-lg shadow-sm"
            >
              <TrendingDown className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Impayés</span>
              <span className="text-xs opacity-90">€{invoicesState.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</span>
            </Button>

            {/* Export Compta */}
            <Button 
              onClick={() => {
                setReportType('export');
                setShowReportsDialog(true);
              }}
              className="flex flex-col items-center justify-center p-4 h-32 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 rounded-lg shadow-sm"
            >
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold text-center">Export Compta</span>
              <span className="text-xs opacity-90">Télécharger en CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Dialog */}
      <Dialog open={showReportsDialog} onOpenChange={setShowReportsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reportType === 'journal' && 'Journal Ventes'}
              {reportType === 'ca' && 'Chiffre d\'Affaires'}
              {reportType === 'impayés' && 'Factures Impayées'}
              {reportType === 'export' && 'Export Comptabilité'}
            </DialogTitle>
          </DialogHeader>

          {reportType === 'journal' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Numéro</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Client</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Statut</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Méthode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateJournalVentes().map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{row.numero}</td>
                        <td className="px-4 py-2 text-gray-600">{new Date(row.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-2 text-gray-600">{row.client}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">€{row.montant.toLocaleString()}</td>
                        <td className="px-4 py-2"><Badge className={row.statut === 'Payée' ? 'bg-green-100 text-green-700' : row.statut === 'En retard' ? 'bg-red-100 text-red-700' : row.statut === 'En attente' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}>{row.statut}</Badge></td>
                        <td className="px-4 py-2 text-gray-600 text-xs">{row.methode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total: €{generateJournalVentes().reduce((sum, r) => sum + r.montant, 0).toLocaleString()}</span>
                <Button onClick={() => downloadCSV(generateJournalVentes(), 'Journal-Ventes.csv')} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger CSV
                </Button>
              </div>
            </div>
          )}

          {reportType === 'ca' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-emerald-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Mois</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Total Facturé</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant Payé</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">En Cours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(generateCAReport()).sort().map(([month, data]) => (
                      <tr key={month} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{new Date(month + '-01').toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">€{data.montant.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-semibold text-emerald-600">€{data.payée.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-semibold text-amber-600">€{data.encours.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  CA Total: €{Object.values(generateCAReport()).reduce((sum, d) => sum + d.montant, 0).toLocaleString()} | 
                  Encaissé: €{Object.values(generateCAReport()).reduce((sum, d) => sum + d.payée, 0).toLocaleString()}
                </span>
                <Button onClick={() => downloadCSV(Object.entries(generateCAReport()).map(([m, d]) => ({ Mois: m, ...d })), 'CA-Report.csv')} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger CSV
                </Button>
              </div>
            </div>
          )}

          {reportType === 'impayés' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-red-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Numéro</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Client</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Montant</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Date Échéance</th>
                      <th className="px-4 py-2 text-center font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateImpayesReport().map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{row.numero}</td>
                        <td className="px-4 py-2 text-gray-600">{row.client}</td>
                        <td className="px-4 py-2 text-right font-semibold text-red-600">€{row.montant.toLocaleString()}</td>
                        <td className="px-4 py-2 text-gray-600">{new Date(row.dateEcheance).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-2 text-center">
                          <Badge className={row.jours > 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                            {row.statut}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total Impayés: €{generateImpayesReport().reduce((sum, r) => sum + r.montant, 0).toLocaleString()} ({generateImpayesReport().length} factures)
                </span>
                <Button onClick={() => downloadCSV(generateImpayesReport(), 'Impayés-Report.csv')} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger CSV
                </Button>
              </div>
            </div>
          )}

          {reportType === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  Exporter les données comptables de toutes les factures. Le fichier CSV contient : numéro, montant, date, client, statut et méthode de paiement.
                </p>
              </div>
              <Button 
                onClick={() => {
                  const data = invoicesState.map(inv => ({
                    'N° Facture': inv.number,
                    'Client': inv.company,
                    'Montant': inv.amount,
                    'Date Émission': new Date(inv.issueDate).toLocaleDateString('fr-FR'),
                    'Date Échéance': new Date(inv.dueDate).toLocaleDateString('fr-FR'),
                    'Statut': inv.status === 'paid' ? 'Payée' : inv.status === 'pending' ? 'En attente' : inv.status === 'overdue' ? 'En retard' : 'Brouillon',
                    'Méthode': inv.paymentMethod || '',
                    'Pénalité': inv.penalty || ''
                  }));
                  downloadCSV(data, 'Export-Compta-' + new Date().toLocaleDateString('fr-FR') + '.csv');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Exporter les données comptables (CSV)
              </Button>
              <div className="text-xs text-gray-500 text-center">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Search and View Mode */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une facture par numéro ou client..."
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
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{invoice.number}</p>
                      <p className="text-xs text-gray-500">{invoice.items} articles</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>{invoice.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-gray-900">€{invoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <button 
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowInvoiceDetails(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    Voir
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm">
                    <Send className="h-4 w-4" />
                    Envoyer
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
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'émission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'échéance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{invoice.number}</p>
                            <p className="text-sm text-gray-500">{invoice.items} articles</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{invoice.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          €{invoice.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(invoice.status)}
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowInvoiceDetails(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Envoyer">
                            <Send className="h-4 w-4" />
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

            {filteredInvoices.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune facture trouvée</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Mode: Kanban */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['draft', 'pending', 'overdue', 'paid'].map((status) => {
            const statusInvoices = filteredInvoices.filter(i => i.status === status as any);
            return (
              <div key={status} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-3 w-3 rounded-full ${status === 'draft' ? 'bg-gray-400' : status === 'pending' ? 'bg-orange-400' : status === 'overdue' ? 'bg-red-400' : 'bg-green-400'}`}></div>
                  <h3 className="font-semibold text-gray-900">
                    {status === 'draft' ? 'Brouillons' : status === 'pending' ? 'En attente' : status === 'overdue' ? 'En retard' : 'Payées'}
                  </h3>
                  <span className="ml-auto bg-white px-2 py-1 rounded text-xs font-medium text-gray-600">
                    {statusInvoices.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {statusInvoices.map((invoice) => (
                    <Card key={invoice.id} className="border-0 shadow-sm bg-white cursor-move hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{invoice.number}</p>
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{invoice.company}</p>
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">€{invoice.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
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

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <Dialog open={showInvoiceDetails} onOpenChange={(open: boolean) => {
          setShowInvoiceDetails(open);
          if (!open) {
            setIsEditingInvoice(false);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditingInvoice ? 'Modifier la facture' : 'Détails de la facture'}
              </DialogTitle>
            </DialogHeader>
            
            {!isEditingInvoice ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Facture</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedInvoice.number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Montant</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">€{selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Client</p>
                  <p className="text-gray-900 mt-1">{selectedInvoice.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Articles</p>
                  <p className="text-gray-900 mt-1">{selectedInvoice.items} articles</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Date d'émission</p>
                    <p className="text-gray-900 mt-1">{new Date(selectedInvoice.issueDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Date d'échéance</p>
                    <p className="text-gray-900 mt-1">{new Date(selectedInvoice.dueDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Statut</p>
                  <Badge className={`${getStatusColor(selectedInvoice.status)} mt-1`}>
                    {getStatusIcon(selectedInvoice.status)}
                    {getStatusLabel(selectedInvoice.status)}
                  </Badge>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingInvoice(true)}
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm">Modifier</span>
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-1" onClick={() => selectedInvoice && openReminderDialog(selectedInvoice)}>
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Rappeler</span>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-1" onClick={() => selectedInvoice && openPenaltyDialog(selectedInvoice)}>
                      <Percent className="h-4 w-4" />
                      <span className="text-sm">Pénalité</span>
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1" onClick={() => {
                      // map invoice to quote-like object for pdf generation
                      const inv = selectedInvoice;
                      if (!inv) return;
                      const quoteLike: any = {
                        quoteNumber: inv.number,
                        company: inv.company,
                        contact: '',
                        email: '',
                        phone: '',
                        date: inv.issueDate,
                        expiryDate: inv.dueDate,
                        items: [],
                        totalAmount: inv.amount,
                        taxRate: 20,
                        status: inv.status,
                        notes: inv.notes || ''
                      };
                      pdfService.generateStandardPDF(quoteLike);
                    }}>
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Télécharger</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-invoice-number" className="text-sm font-medium">Numéro de facture</Label>
                  <Input
                    id="edit-invoice-number"
                    value={selectedInvoice.number}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-company" className="text-sm font-medium">Client</Label>
                  <Input
                    id="edit-company"
                    value={selectedInvoice.company}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-amount" className="text-sm font-medium">Montant (€)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={selectedInvoice.amount}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-issueDate" className="text-sm font-medium">Date d'émission</Label>
                  <Input
                    id="edit-issueDate"
                    type="date"
                    value={selectedInvoice.issueDate}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dueDate" className="text-sm font-medium">Date d'échéance</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={selectedInvoice.dueDate}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditingInvoice(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button disabled className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
      <PDFTemplateSettings open={showPDFSettings} onOpenChange={setShowPDFSettings} />
      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer un rappel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Facture</p>
              <p className="font-semibold">{activeFollowupInvoice?.number} — {activeFollowupInvoice?.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Notes</p>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{activeFollowupInvoice?.notes || 'Aucune note'}</div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowReminderDialog(false)}>Annuler</Button>
              <Button onClick={() => { if (activeFollowupInvoice) sendReminder(activeFollowupInvoice.id); }} className="bg-blue-600 text-white">Envoyer le rappel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Penalty Dialog */}
      <Dialog open={showPenaltyDialog} onOpenChange={setShowPenaltyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appliquer une pénalité</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Facture</p>
              <p className="font-semibold">{activeFollowupInvoice?.number} — {activeFollowupInvoice?.company}</p>
            </div>
            <div>
              <Label>Pourcentage (%)</Label>
              <Input value={penaltyInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPenaltyInput(e.target.value)} type="number" min={0} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPenaltyDialog(false)}>Annuler</Button>
              <Button onClick={() => {
                if (!activeFollowupInvoice) return;
                const pct = parseFloat(penaltyInput);
                if (isNaN(pct) || pct <= 0) return alert('Pourcentage invalide');
                applyPenalty(activeFollowupInvoice.id, pct);
              }} className="bg-blue-600 text-white">Appliquer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement {selectedPaymentMethod && `— ${selectedPaymentMethod}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Facture Selection */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Sélectionner la facture</Label>
              <select 
                value={selectedInvoiceForPayment || ''} 
                onChange={(e) => {
                  setSelectedInvoiceForPayment(e.target.value);
                  const inv = invoicesState.find(i => i.id === e.target.value);
                  if (inv) setActivePaymentInvoice(inv);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choisir une facture --</option>
                {invoicesState.filter(i => i.status !== 'paid' && i.status !== 'draft').map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.number} — {inv.company} — €{inv.amount.toLocaleString()}</option>
                ))}
              </select>
            </div>

            {/* Invoice Details */}
            {activePaymentInvoice && (
              <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                <p className="text-sm font-medium">Facture</p>
                <p className="font-semibold">{activePaymentInvoice.number} — {activePaymentInvoice.company}</p>
                <p className="text-lg font-bold text-emerald-600 mt-1">€{activePaymentInvoice.amount.toLocaleString()}</p>
              </div>
            )}

            {/* Payment Method Selection */}
            {!selectedPaymentMethod ? (
              <div>
                <Label className="text-sm font-medium mb-2 block">Méthode de paiement</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Orange Money', 'MTN Money', 'Virement', 'Carte Stripe', 'Réconciliation'].map(method => (
                    <Button
                      key={method}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {method}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm font-medium">Méthode sélectionnée</p>
                <p className="font-semibold">{selectedPaymentMethod}</p>
                <Button onClick={() => setSelectedPaymentMethod(null)} className="text-xs mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
                  Changer
                </Button>
              </div>
            )}

            {/* Payment Reference */}
            {selectedPaymentMethod && (
              <div>
                <Label htmlFor="payment-ref" className="text-sm font-medium">Référence (optionnel)</Label>
                <Input
                  id="payment-ref"
                  value={paymentReference}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentReference(e.target.value)}
                  placeholder="Numéro de transaction, cheque, etc."
                  className="mt-1"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => {
                setShowPaymentDialog(false);
                setSelectedPaymentMethod(null);
                setSelectedInvoiceForPayment(null);
                setActivePaymentInvoice(null);
              }}>Annuler</Button>
              <Button 
                onClick={processPayment} 
                disabled={!selectedPaymentMethod || !activePaymentInvoice} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmer paiement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoicing;
