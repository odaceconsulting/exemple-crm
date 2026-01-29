import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import {
  BarChart3,
  DollarSign,
  Plus,
  Eye,
  Download,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  FileText,
  Receipt,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownLeft,
  Grid3x3,
  List,
  Kanban,
  Search,
  Edit,
  ChevronDown,
  Calendar,
  Building2,
  CreditCard,
  Wallet,
  BookOpen,
  FileCheck,
  Link as LinkIcon,
  RotateCcw,
  Percent,
  Calculator,
  Archive,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Save,
  Upload,
  Filter
} from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  reference: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface AccountingData {
  sales: Transaction[];
  purchases: Transaction[];
  expenses: Transaction[];
  receipts: Transaction[];
}

const Accounting = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation structure
  const navigationCategories = {
    'JOURNAUX': {
      color: 'blue',
      items: [
        { id: 'sales', label: 'Ventes', icon: ShoppingCart },
        { id: 'purchases', label: 'Achats', icon: ShoppingCart },
        { id: 'bank', label: 'Banque', icon: DollarSign },
        { id: 'cash', label: 'Caisse', icon: DollarSign },
        { id: 'od', label: 'OD', icon: FileText }
      ]
    },
    'ÉTATS': {
      color: 'indigo',
      items: [
        { id: 'grand-livre', label: 'Grand livre', icon: FileText },
        { id: 'balance-generale', label: 'Balance générale', icon: BarChart3 },
        { id: 'balance-auxiliaire', label: 'Balance auxiliaire', icon: BarChart3 },
        { id: 'compte-resultat', label: 'Compte résultat', icon: TrendingUp },
        { id: 'bilan', label: 'Bilan', icon: BarChart3 },
        { id: 'annexes', label: 'Annexes', icon: FileText }
      ]
    },
    'SAISIE': {
      color: 'green',
      items: [
        { id: 'journal', label: 'Journal', icon: FileText },
        { id: 'pieces', label: 'Pièces', icon: FileText },
        { id: 'auto', label: 'Auto', icon: FileText },
        { id: 'lettrage', label: 'Lettrage', icon: FileText },
        { id: 'contre-passation', label: 'Contre-passation', icon: FileText }
      ]
    },
    'FISCALITÉ': {
      color: 'purple',
      items: [
        { id: 'tva', label: 'TVA', icon: MoreVertical },
        { id: 'declaration-tva', label: 'Déclaration TVA', icon: FileText },
        { id: 'acomptes', label: 'Acomptes IS/IR', icon: DollarSign },
        { id: 'liasse', label: 'Liasse', icon: FileText }
      ]
    },
    'PLAN COMPTABLE': {
      color: 'orange',
      items: [
        { id: 'syscohada', label: 'SYSCOHADA', icon: FileText },
        { id: 'pcg', label: 'PCG', icon: FileText },
        { id: 'customs', label: 'Customs', icon: FileText },
        { id: 'analytique', label: 'Analytique', icon: BarChart3 }
      ]
    },
    'CLÔTURE': {
      color: 'red',
      items: [
        { id: 'revisions', label: 'Révisions', icon: FileText },
        { id: 'inventaire', label: 'Inventaire', icon: FileText },
        { id: 'affectation', label: 'Affectation', icon: FileText },
        { id: 'cloture', label: 'Clôture', icon: FileText },
        { id: 'nouveaux', label: 'À-nouveaux', icon: FileText }
      ]
    },
    'AUDIT': {
      color: 'cyan',
      items: [
        { id: 'fec', label: 'FEC', icon: FileText },
        { id: 'piste-audit', label: 'Piste audit', icon: FileText },
        { id: 'archivage', label: 'Archivage', icon: FileText }
      ]
    }
  };

  const [data, setData] = useState<AccountingData>({
    sales: [
      { id: 1, date: '2026-01-20', description: 'Vente logiciel - Acme Corp', amount: 15000, category: 'Software', reference: 'SALE-001', status: 'completed' },
      { id: 2, date: '2026-01-19', description: 'Vente service - TechStart SAS', amount: 8500, category: 'Services', reference: 'SALE-002', status: 'completed' },
      { id: 3, date: '2026-01-18', description: 'Vente produit - Global Industries', amount: 22000, category: 'Products', reference: 'SALE-003', status: 'pending' },
      { id: 4, date: '2026-01-17', description: 'Consultation - Innovation Labs', amount: 5500, category: 'Consulting', reference: 'SALE-004', status: 'completed' }
    ],
    purchases: [
      { id: 101, date: '2026-01-20', description: 'Achat licence logiciel', amount: 2000, category: 'Software', reference: 'PUR-001', status: 'completed' },
      { id: 102, date: '2026-01-19', description: 'Achat fournitures bureau', amount: 500, category: 'Supplies', reference: 'PUR-002', status: 'completed' },
      { id: 103, date: '2026-01-18', description: 'Achat matériel informatique', amount: 5000, category: 'Equipment', reference: 'PUR-003', status: 'pending' },
      { id: 104, date: '2026-01-17', description: 'Achat services externes', amount: 3200, category: 'Services', reference: 'PUR-004', status: 'completed' }
    ],
    expenses: [
      { id: 201, date: '2026-01-20', description: 'Loyer bureau', amount: 3000, category: 'Rent', reference: 'EXP-001', status: 'completed' },
      { id: 202, date: '2026-01-19', description: 'Électricité', amount: 500, category: 'Utilities', reference: 'EXP-002', status: 'completed' },
      { id: 203, date: '2026-01-18', description: 'Assurance responsabilité', amount: 800, category: 'Insurance', reference: 'EXP-003', status: 'pending' },
      { id: 204, date: '2026-01-17', description: 'Frais de déplacement', amount: 450, category: 'Travel', reference: 'EXP-004', status: 'completed' },
      { id: 205, date: '2026-01-16', description: 'Abonnement cloud', amount: 200, category: 'Subscriptions', reference: 'EXP-005', status: 'completed' }
    ],
    receipts: [
      { id: 301, date: '2026-01-20', description: 'Remboursement frais - Jean Martin', amount: 150, category: 'Reimbursement', reference: 'REC-001', status: 'completed' },
      { id: 302, date: '2026-01-19', description: 'Remboursement client - Acme', amount: 1000, category: 'Refund', reference: 'REC-002', status: 'completed' },
      { id: 303, date: '2026-01-18', description: 'Dépôt banque', amount: 5000, category: 'Deposit', reference: 'REC-003', status: 'pending' }
    ]
  });

  // Formulaires spécifiques selon le type de page
  const [journalForm, setJournalForm] = useState({
    date: new Date().toISOString().split('T')[0],
    piece: '',
    compteDebit: '',
    compteCredit: '',
    libelle: '',
    montant: '',
    type: 'debit' // debit ou credit
  });

  const [pieceForm, setPieceForm] = useState({
    numero: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Facture',
    montant: '',
    description: '',
    compte: ''
  });

  const [autoForm, setAutoForm] = useState({
    nom: '',
    frequence: 'Mensuel',
    compteDebit: '',
    compteCredit: '',
    montant: '',
    actif: true
  });

  const [compteForm, setCompteForm] = useState({
    numero: '',
    intitule: '',
    type: 'Actif',
    classe: ''
  });

  const [inventaireForm, setInventaireForm] = useState({
    reference: '',
    designation: '',
    quantiteTheorique: '',
    quantiteReelle: '',
    valeurUnitaire: ''
  });

  const [lettrageForm, setLettrageForm] = useState({
    tiers: '',
    type: 'Client',
    ecritures: [] as number[]
  });

  // Formulaire générique pour les transactions simples (ventes, achats, etc.)
  const [newForm, setNewForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusLabels = {
    completed: 'Complété',
    pending: 'En attente',
    cancelled: 'Annulé'
  };

  // Vérifier si l'onglet actif est dans les données de transactions
  const isTransactionTab = ['sales', 'purchases', 'expenses', 'receipts'].includes(activeTab);
  const currentData = isTransactionTab ? data[activeTab as keyof AccountingData] : [];
  
  const filteredData = isTransactionTab ? currentData.filter(t =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  const totalAmount = filteredData.reduce((sum, t) => sum + t.amount, 0);
  const completedAmount = filteredData
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = filteredData
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAddTransaction = () => {
    if (newForm.description && newForm.amount && newForm.category && isTransactionTab) {
      const newTransaction: Transaction = {
        id: Math.max(...currentData.map(t => t.id), 0) + 1,
        date: newForm.date,
        description: newForm.description,
        amount: parseFloat(newForm.amount),
        category: newForm.category,
        reference: `${activeTab.substring(0, 3).toUpperCase()}-${Date.now()}`,
        status: 'pending'
      };
      
      const newData = { ...data };
      newData[activeTab as keyof AccountingData] = [...currentData, newTransaction];
      setData(newData);
      setShowNewTransaction(false);
      setNewForm({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleEditTransaction = () => {
    if (selectedTransaction && editForm.description && editForm.amount && editForm.category && isTransactionTab) {
      const newData = { ...data };
      const tabData = newData[activeTab as keyof AccountingData];
      const index = tabData.findIndex(t => t.id === selectedTransaction.id);
      
      if (index !== -1) {
        tabData[index] = {
          ...selectedTransaction,
          date: editForm.date,
          description: editForm.description,
          amount: parseFloat(editForm.amount),
          category: editForm.category
        };
        
        setData(newData);
        setIsEditingTransaction(false);
        setShowDetails(false);
        setSelectedTransaction(null);
      }
    }
  };

  const handleViewDetails = (projectId: number) => {
    // Logic to view project details
  };

  const handleDelete = (projectId: number) => {
    // Logic to delete project
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'sales':
        return <TrendingUp className="h-5 w-5" />;
      case 'purchases':
        return <ShoppingCart className="h-5 w-5" />;
      case 'expenses':
        return <TrendingDown className="h-5 w-5" />;
      case 'receipts':
        return <Receipt className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'sales':
        return 'Ventes';
      case 'purchases':
        return 'Achats';
      case 'expenses':
        return 'Dépenses';
      case 'receipts':
        return 'Recettes';
      default:
        return tab;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Comptabilité</h1>
            <p className="text-blue-600 mt-2 font-light">
              {activeCategory ? `${activeCategory}` : 'Module de gestion comptable'}
            </p>
          </div>
          <button
            onClick={() => setShowNewTransaction(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700 font-medium shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Nouvelle transaction
          </button>
        </div>

        {/* Main Category Navigation */}
        {!activeCategory ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(navigationCategories).map(([category, data]) => {
                const colorClasses: Record<string, string> = {
                  'blue': 'bg-white border-l-4 border-l-blue-600 shadow-sm hover:shadow-md hover:border-l-blue-700',
                  'indigo': 'bg-white border-l-4 border-l-blue-600 shadow-sm hover:shadow-md hover:border-l-indigo-700',
                  'green': 'bg-white border-l-4 border-l-blue-600 shadow-sm hover:shadow-md hover:border-l-green-700',
                  'purple': 'bg-white border-l-4 border-l-blue-600 shadow-sm hover:shadow-md hover:border-l-purple-700',
                  'orange': 'bg-white border-l-4 border-l-blue-600 shadow-sm hover:shadow-md hover:border-l-orange-700',
                  'red': 'bg-white border-l-4 border-l-blue-600 shadow-sm hover:shadow-md hover:border-l-red-700',
                  'cyan': 'bg-white border-l-4 border-l-blue-600 shadow-sm hover:shadow-md hover:border-l-cyan-700'
                };
                
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`p-4 rounded-sm border border-gray-200 transition-all text-left ${colorClasses[data.color]}`}
                  >
                    <h3 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">{category}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-300">
              <button
                onClick={() => setActiveCategory(null)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
              >
                ← Retour au menu
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">{activeCategory}</span>
            </div>

            {/* Sub-category Navigation */}
            <div className="flex flex-wrap gap-3">
              {navigationCategories[activeCategory as keyof typeof navigationCategories]?.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 py-2 rounded-sm font-medium transition-all flex items-center gap-2 border text-sm ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Views */}
      {(['sales', 'purchases', 'expenses', 'receipts'] as const).includes(activeTab as any) && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total</p>
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
                    <p className="text-sm text-gray-600 font-medium">Complété</p>
                    <p className="text-3xl font-semibold text-green-600 mt-2">€{completedAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
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
                    <ArrowDownLeft className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and View Mode */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher une transaction..."
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
              {filteredData.map((transaction) => (
                <Card key={transaction.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-gray-900 truncate">{transaction.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.reference}</p>
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {statusLabels[transaction.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold text-gray-900">€{transaction.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetails(true);
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
                <CardTitle>{getTabLabel(activeTab)} ({filteredData.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Catégorie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Référence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.map(transaction => (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.description}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {transaction.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">€{transaction.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{transaction.reference}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(transaction.status)}>
                              {statusLabels[transaction.status as keyof typeof statusLabels]}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setShowDetails(true);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Voir détails"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger">
                                <Download className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData.length === 0 && (
                  <div className="p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune transaction trouvée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* View Mode: Kanban */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['pending', 'completed', 'cancelled'].map((status) => {
                const statusTransactions = filteredData.filter(t => t.status === status as any);
                return (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`h-3 w-3 rounded-full ${status === 'pending' ? 'bg-orange-400' : status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <h3 className="font-semibold text-gray-900">
                        {status === 'pending' ? 'En attente' : status === 'completed' ? 'Complété' : 'Annulé'}
                      </h3>
                      <span className="ml-auto bg-white px-2 py-1 rounded text-xs font-medium text-gray-600">
                        {statusTransactions.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {statusTransactions.map((transaction) => (
                        <Card key={transaction.id} className="border-0 shadow-sm bg-white cursor-move hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{transaction.category}</p>
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-sm font-semibold text-gray-900">€{transaction.amount.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
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
        </div>
      )}

      {/* Grand Livre Page */}
      {activeTab === 'grand-livre' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Grand livre
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Compte</th>
                      <th className="text-right py-2 px-4">Débit</th>
                      <th className="text-right py-2 px-4">Crédit</th>
                      <th className="text-left py-2 px-4">Libellé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sales.map(item => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3 px-4">701 - Ventes</td>
                        <td className="py-3 px-4 text-right font-semibold">{item.amount.toLocaleString()}€</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Balance Générale Page */}
      {activeTab === 'balance-generale' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Balance générale
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-4">Compte</th>
                      <th className="text-left py-2 px-4">Intitulé</th>
                      <th className="text-right py-2 px-4">Débit</th>
                      <th className="text-right py-2 px-4">Crédit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">701</td>
                      <td className="py-3 px-4">Ventes</td>
                      <td className="py-3 px-4 text-right">{data.sales.reduce((s, t) => s + t.amount, 0).toLocaleString()}€</td>
                      <td className="py-3 px-4 text-right">-</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">801</td>
                      <td className="py-3 px-4">Achats</td>
                      <td className="py-3 px-4 text-right">-</td>
                      <td className="py-3 px-4 text-right">{data.purchases.reduce((s, t) => s + t.amount, 0).toLocaleString()}€</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">602</td>
                      <td className="py-3 px-4">Dépenses</td>
                      <td className="py-3 px-4 text-right">-</td>
                      <td className="py-3 px-4 text-right">{data.expenses.reduce((s, t) => s + t.amount, 0).toLocaleString()}€</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compte Résultat Page */}
      {activeTab === 'compte-resultat' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Compte de résultat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-medium">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{data.sales.reduce((s, t) => s + t.amount, 0).toLocaleString()}€</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-600 font-medium">Charges</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">{(data.purchases.reduce((s, t) => s + t.amount, 0) + data.expenses.reduce((s, t) => s + t.amount, 0)).toLocaleString()}€</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 font-medium">Résultat net</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{(data.sales.reduce((s, t) => s + t.amount, 0) - data.purchases.reduce((s, t) => s + t.amount, 0) - data.expenses.reduce((s, t) => s + t.amount, 0)).toLocaleString()}€</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* JOURNAUX: Banque Page */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Journal de Banque
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Rechercher..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Nouvelle écriture
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Pièce</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Libellé</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Débit</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Crédit</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Solde</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: 1, date: '2026-01-20', piece: 'BQ-001', libelle: 'Virement reçu - Acme Corp', debit: 15000, credit: 0, solde: 15000 },
                      { id: 2, date: '2026-01-19', piece: 'BQ-002', libelle: 'Prélèvement fournisseur', debit: 0, credit: 5000, solde: 10000 },
                      { id: 3, date: '2026-01-18', piece: 'BQ-003', libelle: 'Virement reçu - TechStart', debit: 8500, credit: 0, solde: 18500 }
                    ].map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-3 font-medium">{entry.piece}</td>
                        <td className="px-4 py-3">{entry.libelle}</td>
                        <td className="px-4 py-3 text-right">{entry.debit > 0 ? `${entry.debit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3 text-right">{entry.credit > 0 ? `${entry.credit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3 font-semibold">{entry.solde.toLocaleString()}€</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* JOURNAUX: Caisse Page */}
      {activeTab === 'cash' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Journal de Caisse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Rechercher..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Nouvelle écriture
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Solde initial</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">500€</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Total encaissements</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">1,250€</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Total décaissements</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">800€</p>
                  </CardContent>
                </Card>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Pièce</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Libellé</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Débit</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Crédit</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: 1, date: '2026-01-20', piece: 'CA-001', libelle: 'Encaissement espèces - Client A', debit: 500, credit: 0 },
                      { id: 2, date: '2026-01-19', piece: 'CA-002', libelle: 'Décaissement - Frais divers', debit: 0, credit: 200 },
                      { id: 3, date: '2026-01-18', piece: 'CA-003', libelle: 'Encaissement espèces - Client B', debit: 750, credit: 0 }
                    ].map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-3 font-medium">{entry.piece}</td>
                        <td className="px-4 py-3">{entry.libelle}</td>
                        <td className="px-4 py-3 text-right">{entry.debit > 0 ? `${entry.debit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3 text-right">{entry.credit > 0 ? `${entry.credit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* JOURNAUX: OD (Opérations Diverses) Page */}
      {activeTab === 'od' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Journal des Opérations Diverses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Rechercher..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Nouvelle écriture
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Pièce</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Compte</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Libellé</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Débit</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Crédit</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: 1, date: '2026-01-20', piece: 'OD-001', compte: '411', libelle: 'Avoir client', debit: 0, credit: 500 },
                      { id: 2, date: '2026-01-19', piece: 'OD-002', compte: '401', libelle: 'Avoir fournisseur', debit: 300, credit: 0 },
                      { id: 3, date: '2026-01-18', piece: 'OD-003', compte: '512', libelle: 'Virement interne', debit: 2000, credit: 0 }
                    ].map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-3 font-medium">{entry.piece}</td>
                        <td className="px-4 py-3">{entry.compte}</td>
                        <td className="px-4 py-3">{entry.libelle}</td>
                        <td className="px-4 py-3 text-right">{entry.debit > 0 ? `${entry.debit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3 text-right">{entry.credit > 0 ? `${entry.credit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ÉTATS: Balance auxiliaire Page */}
      {activeTab === 'balance-auxiliaire' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Balance auxiliaire
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex gap-4">
                <div>
                  <Label>Période</Label>
                  <Input type="date" defaultValue="2026-01-01" className="mt-1" />
                </div>
                <div>
                  <Label>Au</Label>
                  <Input type="date" defaultValue="2026-01-31" className="mt-1" />
                </div>
                <div className="flex items-end">
                  <Button><Search className="h-4 w-4 mr-2" />Générer</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Tiers</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Solde initial</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Débit</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Crédit</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Solde final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { tiers: 'Acme Corporation', type: 'Client', soldeInit: 5000, debit: 15000, credit: 0, soldeFinal: 20000 },
                      { tiers: 'TechStart SAS', type: 'Client', soldeInit: 2000, debit: 8500, credit: 0, soldeFinal: 10500 },
                      { tiers: 'Fournisseur A', type: 'Fournisseur', soldeInit: -3000, debit: 0, credit: 5000, soldeFinal: 2000 },
                      { tiers: 'Fournisseur B', type: 'Fournisseur', soldeInit: -1500, debit: 0, credit: 3200, soldeFinal: 1700 }
                    ].map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{entry.tiers}</td>
                        <td className="px-4 py-3">
                          <Badge className={entry.type === 'Client' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                            {entry.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">{entry.soldeInit.toLocaleString()}€</td>
                        <td className="px-4 py-3 text-right">{entry.debit > 0 ? `${entry.debit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3 text-right">{entry.credit > 0 ? `${entry.credit.toLocaleString()}€` : '-'}</td>
                        <td className={`px-4 py-3 text-right font-semibold ${entry.soldeFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.soldeFinal.toLocaleString()}€
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button><Download className="h-4 w-4 mr-2" />Exporter (PDF)</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ÉTATS: Bilan Page */}
      {activeTab === 'bilan' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Bilan comptable
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex gap-4">
                <div>
                  <Label>Date de clôture</Label>
                  <Input type="date" defaultValue="2026-12-31" className="mt-1" />
                </div>
                <div className="flex items-end">
                  <Button><Search className="h-4 w-4 mr-2" />Générer</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ACTIF */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-blue-600">ACTIF</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="font-semibold text-sm">ACTIF IMMOBILISÉ</p>
                      <div className="mt-2 space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Immobilisations incorporelles</span>
                          <span className="font-semibold">15,000€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Immobilisations corporelles</span>
                          <span className="font-semibold">45,000€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Immobilisations financières</span>
                          <span className="font-semibold">10,000€</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="font-semibold text-sm">ACTIF CIRCULANT</p>
                      <div className="mt-2 space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Stocks</span>
                          <span className="font-semibold">25,000€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Créances clients</span>
                          <span className="font-semibold">30,500€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Disponibilités</span>
                          <span className="font-semibold">18,500€</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border-2 border-blue-300">
                      <div className="flex justify-between font-bold">
                        <span>TOTAL ACTIF</span>
                        <span className="text-blue-600">144,000€</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PASSIF */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-green-600">PASSIF</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="font-semibold text-sm">CAPITAUX PROPRES</p>
                      <div className="mt-2 space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Capital social</span>
                          <span className="font-semibold">50,000€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Réserves</span>
                          <span className="font-semibold">25,000€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Résultat de l'exercice</span>
                          <span className="font-semibold text-green-600">19,000€</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="font-semibold text-sm">DETTES</p>
                      <div className="mt-2 space-y-1 pl-4">
                        <div className="flex justify-between text-sm">
                          <span>Dettes fournisseurs</span>
                          <span className="font-semibold">20,000€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dettes fiscales</span>
                          <span className="font-semibold">15,000€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dettes sociales</span>
                          <span className="font-semibold">15,000€</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded border-2 border-blue-300">
                      <div className="flex justify-between font-bold">
                        <span>TOTAL PASSIF</span>
                        <span className="text-blue-600">144,000€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button><Download className="h-4 w-4 mr-2" />Exporter (PDF)</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ÉTATS: Annexes Page */}
      {activeTab === 'annexes' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Annexes comptables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 hover:border-blue-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Tableau des immobilisations</h3>
                          <p className="text-sm text-gray-600 mt-1">Détail des immobilisations</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-blue-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Tableau des amortissements</h3>
                          <p className="text-sm text-gray-600 mt-1">Amortissements et dépréciations</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-blue-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Tableau des provisions</h3>
                          <p className="text-sm text-gray-600 mt-1">Provisions pour risques et charges</p>
                        </div>
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-blue-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Échéancier des dettes</h3>
                          <p className="text-sm text-gray-600 mt-1">Dettes à court et long terme</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-4">
                  <Button className="w-full"><Download className="h-4 w-4 mr-2" />Exporter toutes les annexes (PDF)</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAISIE: Journal Page */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Journal général
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Rechercher..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Nouvelle écriture
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Pièce</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Compte</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Libellé</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Débit</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Crédit</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: 1, date: '2026-01-20', piece: 'J-001', compte: '411', libelle: 'Vente client Acme', debit: 15000, credit: 0 },
                      { id: 2, date: '2026-01-20', piece: 'J-001', compte: '701', libelle: 'Vente client Acme', debit: 0, credit: 15000 },
                      { id: 3, date: '2026-01-19', piece: 'J-002', compte: '401', libelle: 'Achat fournisseur', debit: 0, credit: 5000 },
                      { id: 4, date: '2026-01-19', piece: 'J-002', compte: '601', libelle: 'Achat fournisseur', debit: 5000, credit: 0 }
                    ].map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-3 font-medium">{entry.piece}</td>
                        <td className="px-4 py-3">{entry.compte}</td>
                        <td className="px-4 py-3">{entry.libelle}</td>
                        <td className="px-4 py-3 text-right">{entry.debit > 0 ? `${entry.debit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3 text-right">{entry.credit > 0 ? `${entry.credit.toLocaleString()}€` : '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAISIE: Pièces Page */}
      {activeTab === 'pieces' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Pièces comptables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Rechercher une pièce..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Nouvelle pièce
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, numero: 'PIECE-001', date: '2026-01-20', type: 'Facture', montant: 15000, statut: 'validée' },
                  { id: 2, numero: 'PIECE-002', date: '2026-01-19', type: 'Avoir', montant: 500, statut: 'validée' },
                  { id: 3, numero: 'PIECE-003', date: '2026-01-18', type: 'Facture', montant: 8500, statut: 'brouillon' }
                ].map((piece) => (
                  <Card key={piece.id} className="border-2 hover:border-green-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={piece.statut === 'validée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {piece.statut}
                        </Badge>
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{piece.numero}</h3>
                      <p className="text-sm text-gray-600 mb-2">{piece.type}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{new Date(piece.date).toLocaleDateString('fr-FR')}</span>
                        <span className="font-bold text-green-600">{piece.montant.toLocaleString()}€</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1"><Eye className="h-3 w-3 mr-1" />Voir</Button>
                        <Button variant="outline" size="sm" className="flex-1"><Edit className="h-3 w-3 mr-1" />Modifier</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAISIE: Auto (Écritures automatiques) Page */}
      {activeTab === 'auto' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Écritures automatiques
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Créer une écriture automatique
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, nom: 'Amortissement mensuel', frequence: 'Mensuel', compteDebit: '681', compteCredit: '281', montant: 1000, actif: true },
                  { id: 2, nom: 'Provision charges sociales', frequence: 'Mensuel', compteDebit: '641', compteCredit: '425', montant: 5000, actif: true },
                  { id: 3, nom: 'Régularisation TVA', frequence: 'Trimestriel', compteDebit: '44571', compteCredit: '44551', montant: 0, actif: false }
                ].map((auto) => (
                  <Card key={auto.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{auto.nom}</h3>
                            <Badge className={auto.actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {auto.actif ? 'Actif' : 'Inactif'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Fréquence</p>
                              <p className="font-medium">{auto.frequence}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Compte Débit</p>
                              <p className="font-medium">{auto.compteDebit}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Compte Crédit</p>
                              <p className="font-medium">{auto.compteCredit}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Montant</p>
                              <p className="font-medium">{auto.montant > 0 ? `${auto.montant.toLocaleString()}€` : 'Variable'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAISIE: Lettrage Page */}
      {activeTab === 'lettrage' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Lettrage comptable
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Rechercher un tiers..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <LinkIcon className="h-4 w-4 mr-2" />Lettrage automatique
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, tiers: 'Acme Corporation', type: 'Client', solde: 0, statut: 'lettré', dernierLettrage: '2026-01-20' },
                  { id: 2, tiers: 'TechStart SAS', type: 'Client', solde: 8500, statut: 'partiel', dernierLettrage: '2026-01-15' },
                  { id: 3, tiers: 'Fournisseur A', type: 'Fournisseur', solde: -2000, statut: 'non lettré', dernierLettrage: '-' }
                ].map((lettrage) => (
                  <Card key={lettrage.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{lettrage.tiers}</h3>
                            <Badge className={lettrage.type === 'Client' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                              {lettrage.type}
                            </Badge>
                            <Badge className={
                              lettrage.statut === 'lettré' ? 'bg-green-100 text-green-800' :
                              lettrage.statut === 'partiel' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {lettrage.statut}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Solde</p>
                              <p className={`font-semibold ${lettrage.solde === 0 ? 'text-green-600' : lettrage.solde > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {lettrage.solde.toLocaleString()}€
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Dernier lettrage</p>
                              <p className="font-medium">{lettrage.dernierLettrage !== '-' ? new Date(lettrage.dernierLettrage).toLocaleDateString('fr-FR') : '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Statut</p>
                              <p className="font-medium capitalize">{lettrage.statut}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" />Voir</Button>
                          <Button variant="outline" size="sm"><LinkIcon className="h-4 w-4 mr-1" />Lettrer</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SAISIE: Contre-passation Page */}
      {activeTab === 'contre-passation' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Contre-passation d'écritures
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Attention</p>
                      <p className="text-sm text-blue-800 mt-1">La contre-passation annule une écriture en créant une écriture inverse. Cette action est irréversible.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Numéro de pièce à contre-passer..." className="flex-1" />
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Search className="h-4 w-4 mr-2" />Rechercher
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, piece: 'J-001', date: '2026-01-20', libelle: 'Vente client Acme', montant: 15000, statut: 'à contre-passer' },
                  { id: 2, piece: 'J-002', date: '2026-01-19', libelle: 'Achat fournisseur', montant: 5000, statut: 'contre-passée' }
                ].map((entry) => (
                  <Card key={entry.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{entry.piece}</h3>
                            <Badge className={entry.statut === 'contre-passée' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}>
                              {entry.statut}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Date</p>
                              <p className="font-medium">{new Date(entry.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Libellé</p>
                              <p className="font-medium">{entry.libelle}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Montant</p>
                              <p className="font-semibold">{entry.montant.toLocaleString()}€</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {entry.statut === 'à contre-passer' && (
                            <Button variant="destructive" size="sm">
                              <RotateCcw className="h-4 w-4 mr-1" />Contre-passer
                            </Button>
                          )}
                          <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FISCALITÉ: TVA Page */}
      {activeTab === 'tva' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Gestion de la TVA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">TVA collectée</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">3,000€</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">TVA déductible</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">1,200€</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">TVA à payer</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">1,800€</p>
                  </CardContent>
                </Card>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Période</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">TVA collectée</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">TVA déductible</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">TVA à payer</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { periode: 'Janvier 2026', collectee: 3000, deductible: 1200, aPayer: 1800, statut: 'à déclarer' },
                      { periode: 'Décembre 2025', collectee: 2800, deductible: 1100, aPayer: 1700, statut: 'déclarée' }
                    ].map((tva, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{tva.periode}</td>
                        <td className="px-4 py-3 text-right">{tva.collectee.toLocaleString()}€</td>
                        <td className="px-4 py-3 text-right">{tva.deductible.toLocaleString()}€</td>
                        <td className="px-4 py-3 text-right font-semibold">{tva.aPayer.toLocaleString()}€</td>
                        <td className="px-4 py-3">
                          <Badge className={tva.statut === 'déclarée' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {tva.statut}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FISCALITÉ: Déclaration TVA Page */}
      {activeTab === 'declaration-tva' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Déclaration TVA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex gap-4">
                <div>
                  <Label>Période</Label>
                  <Input type="month" defaultValue="2026-01" className="mt-1" />
                </div>
                <div className="flex items-end">
                  <Button><Search className="h-4 w-4 mr-2" />Générer la déclaration</Button>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Déclaration TVA - Janvier 2026</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">TVA collectée (CA3)</Label>
                        <Input value="3000" readOnly className="mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">TVA déductible (CA4)</Label>
                        <Input value="1200" readOnly className="mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">TVA à payer (CA5)</Label>
                        <Input value="1800" readOnly className="mt-1 font-semibold text-blue-600" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Crédit de TVA</Label>
                        <Input value="0" readOnly className="mt-1 font-semibold" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Download className="h-4 w-4 mr-2" />Exporter (PDF)
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />Télédéclarer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FISCALITÉ: Acomptes IS/IR Page */}
      {activeTab === 'acomptes' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Acomptes IS/IR
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Type d'impôt</Label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option>Impôt sur les Sociétés (IS)</option>
                      <option>Impôt sur le Revenu (IR)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Exercice</Label>
                    <Input type="number" defaultValue="2026" className="mt-1" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { echeance: '15/03/2026', montant: 5000, statut: 'à payer', type: '1er acompte IS' },
                  { echeance: '15/06/2026', montant: 5000, statut: 'à venir', type: '2ème acompte IS' },
                  { echeance: '15/09/2026', montant: 5000, statut: 'à venir', type: '3ème acompte IS' },
                  { echeance: '15/12/2026', montant: 5000, statut: 'à venir', type: '4ème acompte IS' }
                ].map((acompte, idx) => (
                  <Card key={idx} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold mb-1">{acompte.type}</h3>
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Échéance: </span>
                              <span className="font-medium">{acompte.echeance}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Montant: </span>
                              <span className="font-semibold text-blue-600">{acompte.montant.toLocaleString()}€</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            acompte.statut === 'payé' ? 'bg-green-100 text-green-800' :
                            acompte.statut === 'à payer' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {acompte.statut}
                          </Badge>
                          {acompte.statut === 'à payer' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Payer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FISCALITÉ: Liasse fiscale Page */}
      {activeTab === 'liasse' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Liasse fiscale
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex gap-4">
                <div>
                  <Label>Exercice</Label>
                  <Input type="number" defaultValue="2026" className="mt-1" />
                </div>
                <div className="flex items-end">
                  <Button><Search className="h-4 w-4 mr-2" />Générer la liasse</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { code: '2050', libelle: 'Bilan (actif)', statut: 'Complété' },
                    { code: '2051', libelle: 'Bilan (passif)', statut: 'Complété' },
                    { code: '2052', libelle: 'Compte de résultat', statut: 'Complété' },
                    { code: '2053', libelle: 'Annexes', statut: 'À compléter' },
                    { code: '2054', libelle: 'Tableau des immobilisations', statut: 'Complété' },
                    { code: '2055', libelle: 'Tableau des amortissements', statut: 'Complété' }
                  ].map((formulaire, idx) => (
                    <Card key={idx} className="border-2 hover:border-purple-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{formulaire.code}</h3>
                            <p className="text-sm text-gray-600 mt-1">{formulaire.libelle}</p>
                          </div>
                          <Badge className={formulaire.statut === 'Complété' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {formulaire.statut}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="pt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />Exporter la liasse complète (PDF)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PLAN COMPTABLE: SYSCOHADA Page */}
      {activeTab === 'syscohada' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Plan Comptable SYSCOHADA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <Input placeholder="Rechercher un compte..." className="w-64" />
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Ajouter un compte
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Compte</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Intitulé</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Solde</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { compte: '101', intitule: 'Capital social', type: 'Passif', solde: 50000, statut: 'Actif' },
                      { compte: '201', intitule: 'Immobilisations incorporelles', type: 'Actif', solde: 15000, statut: 'Actif' },
                      { compte: '211', intitule: 'Terrains', type: 'Actif', solde: 30000, statut: 'Actif' },
                      { compte: '411', intitule: 'Clients', type: 'Actif', solde: 30500, statut: 'Actif' },
                      { compte: '512', intitule: 'Banque', type: 'Actif', solde: 18500, statut: 'Actif' },
                      { compte: '701', intitule: 'Ventes', type: 'Produit', solde: 51000, statut: 'Actif' }
                    ].map((compte, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{compte.compte}</td>
                        <td className="px-4 py-3">{compte.intitule}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            compte.type === 'Actif' ? 'bg-blue-100 text-blue-800' :
                            compte.type === 'Passif' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }>
                            {compte.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{compte.solde.toLocaleString()}€</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-800">{compte.statut}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PLAN COMPTABLE: PCG Page */}
      {activeTab === 'pcg' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Plan Comptable Général (PCG)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Le Plan Comptable Général français est utilisé pour les entreprises françaises.</p>
                <div className="flex gap-2">
                  <Input placeholder="Rechercher un compte..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Compte</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Intitulé</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Classe</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { compte: '101', intitule: 'Capital', classe: 'Classe 1' },
                      { compte: '211', intitule: 'Terrains', classe: 'Classe 2' },
                      { compte: '411', intitule: 'Clients', classe: 'Classe 4' },
                      { compte: '512', intitule: 'Banque', classe: 'Classe 5' },
                      { compte: '701', intitule: 'Ventes', classe: 'Classe 7' }
                    ].map((compte, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{compte.compte}</td>
                        <td className="px-4 py-3">{compte.intitule}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-orange-100 text-orange-800">{compte.classe}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PLAN COMPTABLE: Customs Page */}
      {activeTab === 'customs' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Plan Comptable Personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">Gérez vos comptes comptables personnalisés selon vos besoins spécifiques.</p>
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Créer un compte
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { compte: 'CUST-001', intitule: 'Frais marketing', type: 'Charge', solde: 5000 },
                  { compte: 'CUST-002', intitule: 'Revenus consulting', type: 'Produit', solde: 12000 },
                  { compte: 'CUST-003', intitule: 'Fonds propres', type: 'Passif', solde: 25000 }
                ].map((compte, idx) => (
                  <Card key={idx} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={
                          compte.type === 'Produit' ? 'bg-green-100 text-green-800' :
                          compte.type === 'Charge' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {compte.type}
                        </Badge>
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{compte.compte}</h3>
                      <p className="text-sm text-gray-600 mb-2">{compte.intitule}</p>
                      <p className="font-bold text-blue-600">{compte.solde.toLocaleString()}€</p>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1"><Edit className="h-3 w-3 mr-1" />Modifier</Button>
                        <Button variant="outline" size="sm" className="flex-1"><Trash2 className="h-3 w-3 mr-1" />Supprimer</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PLAN COMPTABLE: Analytique Page */}
      {activeTab === 'analytique' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comptabilité Analytique
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Gérez vos centres de coûts et sections analytiques.</p>
                <div className="flex gap-2">
                  <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />Nouveau centre de coût
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />Rapports analytiques
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { code: 'CC-001', libelle: 'Production', budget: 50000, reel: 48500, ecart: -1500 },
                  { code: 'CC-002', libelle: 'Commercial', budget: 30000, reel: 32000, ecart: 2000 },
                  { code: 'CC-003', libelle: 'Administration', budget: 20000, reel: 19500, ecart: -500 }
                ].map((centre, idx) => (
                  <Card key={idx} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{centre.code}</h3>
                          <p className="text-sm text-gray-600">{centre.libelle}</p>
                        </div>
                        <Badge className={centre.ecart < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {centre.ecart < 0 ? 'Sous budget' : 'Dépassement'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-semibold">{centre.budget.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Réel:</span>
                          <span className="font-semibold">{centre.reel.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Écart:</span>
                          <span className={`font-bold ${centre.ecart < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {centre.ecart.toLocaleString()}€
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CLÔTURE: Révisions Page */}
      {activeTab === 'revisions' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Révisions comptables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">Les révisions permettent de vérifier et corriger les écritures avant la clôture de l'exercice.</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, libelle: 'Vérification des soldes', statut: 'OK', date: '2026-01-20' },
                  { id: 2, libelle: 'Contrôle des écritures', statut: 'En cours', date: '2026-01-20' },
                  { id: 3, libelle: 'Révision des provisions', statut: 'À faire', date: '-' },
                  { id: 4, libelle: 'Vérification des amortissements', statut: 'OK', date: '2026-01-19' }
                ].map((revision) => (
                  <Card key={revision.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{revision.libelle}</h3>
                          <p className="text-sm text-gray-600">Dernière révision: {revision.date !== '-' ? new Date(revision.date).toLocaleDateString('fr-FR') : 'Jamais'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            revision.statut === 'OK' ? 'bg-green-100 text-green-800' :
                            revision.statut === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {revision.statut}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <FileCheck className="h-4 w-4 mr-1" />Réviser
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CLÔTURE: Inventaire Page */}
      {activeTab === 'inventaire' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Inventaire
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Input placeholder="Rechercher un article..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
                <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />Nouvel article
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Référence</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Désignation</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Quantité théorique</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Quantité réelle</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Écart</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Valeur</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { ref: 'ART-001', designation: 'Produit A', qteTheo: 100, qteReel: 98, valeur: 5000 },
                      { ref: 'ART-002', designation: 'Produit B', qteTheo: 50, qteReel: 50, valeur: 3000 },
                      { ref: 'ART-003', designation: 'Produit C', qteTheo: 75, qteReel: 80, valeur: 4000 }
                    ].map((article, idx) => {
                      const ecart = article.qteReel - article.qteTheo;
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{article.ref}</td>
                          <td className="px-4 py-3">{article.designation}</td>
                          <td className="px-4 py-3 text-right">{article.qteTheo}</td>
                          <td className="px-4 py-3 text-right">{article.qteReel}</td>
                          <td className={`px-4 py-3 text-right font-semibold ${ecart === 0 ? 'text-gray-600' : ecart > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {ecart > 0 ? '+' : ''}{ecart}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{article.valeur.toLocaleString()}€</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CLÔTURE: Affectation Page */}
      {activeTab === 'affectation' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Affectation du résultat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-green-900 mb-1">Résultat net de l'exercice</p>
                  <p className="text-2xl font-bold text-green-600">19,000€</p>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="border-2">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Répartition proposée</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Report à nouveau</span>
                        <Input type="number" defaultValue="5000" className="w-32 text-right" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Réserves légales</span>
                        <Input type="number" defaultValue="2000" className="w-32 text-right" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Réserves statutaires</span>
                        <Input type="number" defaultValue="3000" className="w-32 text-right" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Dividendes</span>
                        <Input type="number" defaultValue="9000" className="w-32 text-right" />
                      </div>
                      <div className="pt-3 border-t flex justify-between items-center font-semibold">
                        <span>Total</span>
                        <span className="text-green-600">19,000€</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-2" />Valider l'affectation
                      </Button>
                      <Button variant="outline" className="flex-1">Annuler</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CLÔTURE: Clôture Page */}
      {activeTab === 'cloture' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Clôture de l'exercice
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Attention</p>
                      <p className="text-sm text-red-800 mt-1">La clôture de l'exercice est une opération irréversible. Assurez-vous que toutes les révisions et l'inventaire sont terminés.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="border-2">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Exercice à clôturer: 2026</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Toutes les écritures sont validées</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Lettrage effectué</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span>Révisions terminées</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-yellow-600" />
                        <span>Inventaire en cours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-yellow-600" />
                        <span>Affectation du résultat</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                      <FileCheck className="h-4 w-4 mr-2" />Clôturer l'exercice 2026
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">Veuillez terminer toutes les étapes avant de clôturer</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CLÔTURE: À-nouveaux Page */}
      {activeTab === 'nouveaux' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Report à nouveau
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Le report à nouveau représente le résultat de l'exercice précédent reporté sur l'exercice en cours.</p>
              </div>
              <div className="space-y-4">
                <Card className="border-2">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Report à nouveau - Exercice 2025</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Report à nouveau débiteur</Label>
                        <Input value="0" readOnly className="mt-1 font-semibold" />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Report à nouveau créditeur</Label>
                        <Input value="5000" readOnly className="mt-1 font-semibold text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Détail du report:</p>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm">Résultat exercice 2025: <span className="font-semibold">15,000€</span></p>
                        <p className="text-sm">Dividendes distribués: <span className="font-semibold">-10,000€</span></p>
                        <p className="text-sm font-semibold mt-2 pt-2 border-t">Report à nouveau: <span className="text-green-600">5,000€</span></p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AUDIT: FEC Page */}
      {activeTab === 'fec' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Fichier des Écritures Comptables (FEC)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Le FEC est un fichier standardisé requis par l'administration fiscale française pour les contrôles.</p>
                <div className="flex gap-4">
                  <div>
                    <Label>Exercice</Label>
                    <Input type="number" defaultValue="2026" className="mt-1" />
                  </div>
                  <div className="flex items-end">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />Générer le FEC
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold mb-1">FEC_2026.txt</h3>
                        <p className="text-sm text-gray-600">Dernière génération: {new Date().toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm text-gray-600">Nombre d'écritures: 1,245</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Télécharger</Button>
                        <Button variant="outline"><Eye className="h-4 w-4 mr-2" />Prévisualiser</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AUDIT: Piste audit Page */}
      {activeTab === 'piste-audit' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Piste d'audit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Consultez l'historique de toutes les modifications apportées aux écritures comptables.</p>
                <div className="flex gap-2">
                  <Input placeholder="Rechercher..." className="w-64" />
                  <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filtrer</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Date/Heure</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Utilisateur</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Action</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Pièce</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { date: '2026-01-20 14:30', user: 'admin@example.com', action: 'Création', piece: 'J-001', details: 'Écriture créée' },
                      { date: '2026-01-20 15:45', user: 'comptable@example.com', action: 'Modification', piece: 'J-001', details: 'Montant modifié: 15000€ → 16000€' },
                      { date: '2026-01-19 10:20', user: 'admin@example.com', action: 'Validation', piece: 'J-002', details: 'Écriture validée' },
                      { date: '2026-01-18 16:10', user: 'comptable@example.com', action: 'Suppression', piece: 'J-003', details: 'Écriture supprimée' }
                    ].map((audit, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{audit.date}</td>
                        <td className="px-4 py-3">{audit.user}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            audit.action === 'Création' ? 'bg-green-100 text-green-800' :
                            audit.action === 'Modification' ? 'bg-yellow-100 text-yellow-800' :
                            audit.action === 'Validation' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {audit.action}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium">{audit.piece}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{audit.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AUDIT: Archivage Page */}
      {activeTab === 'archivage' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Archivage comptable
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Archivez vos exercices comptables pour respecter les obligations légales de conservation.</p>
                <div className="flex gap-2">
                  <Button onClick={() => setShowNewTransaction(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Archive className="h-4 w-4 mr-2" />Nouvel archivage
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />Restaurer un exercice
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { exercice: '2025', dateArchivage: '2026-01-15', taille: '2.5 GB', statut: 'Archivé', duree: '10 ans' },
                  { exercice: '2024', dateArchivage: '2025-01-20', taille: '2.1 GB', statut: 'Archivé', duree: '10 ans' },
                  { exercice: '2023', dateArchivage: '2024-01-18', taille: '1.8 GB', statut: 'Archivé', duree: '10 ans' }
                ].map((archive, idx) => (
                  <Card key={idx} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">Exercice {archive.exercice}</h3>
                            <Badge className="bg-green-100 text-green-800">{archive.statut}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Date d'archivage</p>
                              <p className="font-medium">{new Date(archive.dateArchivage).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Taille</p>
                              <p className="font-medium">{archive.taille}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Durée de conservation</p>
                              <p className="font-medium">{archive.duree}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Statut</p>
                              <p className="font-medium capitalize">{archive.statut}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Restaurer</Button>
                          <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Page par défaut pour les onglets non gérés */}
      {!isTransactionTab && 
       !['grand-livre', 'balance-generale', 'balance-auxiliaire', 'compte-resultat', 'bilan', 'annexes',
         'journal', 'pieces', 'auto', 'lettrage', 'contre-passation',
         'tva', 'declaration-tva', 'acomptes', 'liasse',
         'syscohada', 'pcg', 'customs', 'analytique',
         'revisions', 'inventaire', 'affectation', 'cloture', 'nouveaux',
         'fec', 'piste-audit', 'archivage', 'bank', 'cash', 'od'].includes(activeTab) && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {getTabLabel(activeTab)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Page en cours de développement</h3>
                <p className="text-gray-600 mb-6">
                  Cette fonctionnalité sera bientôt disponible.
                </p>
                <Button variant="outline" onClick={() => setActiveCategory(null)}>
                  Retour au menu principal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rapports Page */}
      {activeTab === 'rapports' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Rapports
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Rapport Mensuel */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Rapport mensuel - Janvier 2026</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">Total Ventes</p>
                    <p className="text-xl font-bold text-blue-600 mt-1">{data.sales.reduce((s, t) => s + t.amount, 0).toLocaleString()}€</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">Total Achats</p>
                    <p className="text-xl font-bold text-red-600 mt-1">{data.purchases.reduce((s, t) => s + t.amount, 0).toLocaleString()}€</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">Total Dépenses</p>
                    <p className="text-xl font-bold text-orange-600 mt-1">{data.expenses.reduce((s, t) => s + t.amount, 0).toLocaleString()}€</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">Solde Net</p>
                    <p className="text-xl font-bold text-green-600 mt-1">{(data.sales.reduce((s, t) => s + t.amount, 0) - data.purchases.reduce((s, t) => s + t.amount, 0) - data.expenses.reduce((s, t) => s + t.amount, 0)).toLocaleString()}€</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le rapport (PDF)
                </Button>
              </div>

              {/* Analyse par Catégorie */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Analyse par catégorie</h3>
                <div className="space-y-2 mb-6">
                  {[
                    { label: 'Software', value: 17500 },
                    { label: 'Services', value: 12200 },
                    { label: 'Produits', value: 22000 },
                    { label: 'Consulting', value: 5500 }
                  ].map(cat => (
                    <div key={cat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-white rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${(cat.value / 57200) * 100}%` }}></div>
                        </div>
                        <span className="font-semibold text-gray-900">{cat.value.toLocaleString()}€</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter l'analyse
                </Button>
              </div>

              {/* Tendances */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4">Tendances</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600 uppercase">Croissance</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">+15.3%</p>
                    <p className="text-xs text-gray-600 mt-1">vs période précédente</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600 uppercase">Moyenne quotidienne</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{Math.round((data.sales.reduce((s, t) => s + t.amount, 0) + data.receipts.reduce((s, t) => s + t.amount, 0)) / 29).toLocaleString()}€</p>
                    <p className="text-xs text-gray-600 mt-1">par jour</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600 uppercase">Transactions</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{data.sales.length + data.purchases.length + data.expenses.length + data.receipts.length}</p>
                    <p className="text-xs text-gray-600 mt-1">total du mois</p>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger les tendances
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Paramétrages Page */}
      {activeTab === 'parametrages' && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MoreVertical className="h-5 w-5" />
                Paramétrages comptables
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Plans comptables */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Plans comptables</h3>
                    <p className="text-sm text-gray-600 mt-1">Gérez vos comptes comptables</p>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">701 - Ventes</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Actif</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">801 - Achats</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Actif</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">602 - Dépenses</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Actif</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Ajouter un compte</Button>
              </div>

              {/* Catégories */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Catégories de transactions</h3>
                    <p className="text-sm text-gray-600 mt-1">Définissez vos catégories</p>
                  </div>
                  <ShoppingCart className="h-5 w-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {['Software', 'Services', 'Produits', 'Consulting', 'Equipment', 'Supplies', 'Utilities', 'Travel'].map(cat => (
                    <div key={cat} className="p-2 bg-gray-50 rounded border border-gray-200 text-center">
                      <p className="text-xs font-medium text-gray-700">{cat}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">Gérer les catégories</Button>
              </div>

              {/* TVA et taxes */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">TVA et taxes</h3>
                    <p className="text-sm text-gray-600 mt-1">Paramétrez les taux applicables</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">TVA standard</span>
                    <Input type="number" defaultValue="20" className="w-20 text-right" min="0" max="100" />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">TVA réduite</span>
                    <Input type="number" defaultValue="5.5" className="w-20 text-right" min="0" max="100" />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium">TVA super réduite</span>
                    <Input type="number" defaultValue="2.1" className="w-20 text-right" min="0" max="100" />
                    <span className="text-sm font-medium">%</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Enregistrer les taux</Button>
              </div>

              {/* Exercices comptables */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Exercices comptables</h3>
                    <p className="text-sm text-gray-600 mt-1">Gérez les périodes comptables</p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Exercice 2026</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Actif</span>
                    </div>
                    <p className="text-xs text-gray-600">01/01/2026 - 31/12/2026</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Exercice 2025</span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Fermé</span>
                    </div>
                    <p className="text-xs text-gray-600">01/01/2025 - 31/12/2025</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Ajouter un exercice</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Formulaires contextuels selon l'onglet actif */}
      <Dialog open={showNewTransaction} onOpenChange={setShowNewTransaction}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'bank' && 'Nouvelle écriture - Journal de Banque'}
              {activeTab === 'cash' && 'Nouvelle écriture - Journal de Caisse'}
              {activeTab === 'od' && 'Nouvelle écriture - Opérations Diverses'}
              {activeTab === 'journal' && 'Nouvelle écriture - Journal Général'}
              {activeTab === 'pieces' && 'Nouvelle pièce comptable'}
              {activeTab === 'auto' && 'Nouvelle écriture automatique'}
              {activeTab === 'syscohada' && 'Nouveau compte - SYSCOHADA'}
              {activeTab === 'pcg' && 'Nouveau compte - PCG'}
              {activeTab === 'customs' && 'Nouveau compte personnalisé'}
              {activeTab === 'inventaire' && 'Nouvel article d\'inventaire'}
              {activeTab === 'lettrage' && 'Nouveau lettrage'}
              {!['bank', 'cash', 'od', 'journal', 'pieces', 'auto', 'syscohada', 'pcg', 'customs', 'inventaire', 'lettrage'].includes(activeTab) && `Nouvelle transaction - ${getTabLabel(activeTab)}`}
            </DialogTitle>
          </DialogHeader>

          {/* Formulaire Journal (Banque, Caisse, OD, Journal Général) */}
          {['bank', 'cash', 'od', 'journal'].includes(activeTab) && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="journal-date" className="text-sm font-medium">Date *</Label>
                  <Input
                    id="journal-date"
                    type="date"
                    value={journalForm.date}
                    onChange={(e) => setJournalForm({...journalForm, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="journal-piece" className="text-sm font-medium">Numéro de pièce *</Label>
                  <Input
                    id="journal-piece"
                    placeholder="Ex: BQ-001"
                    value={journalForm.piece}
                    onChange={(e) => setJournalForm({...journalForm, piece: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="journal-compte-debit" className="text-sm font-medium">Compte Débit *</Label>
                  <Input
                    id="journal-compte-debit"
                    placeholder="Ex: 512"
                    value={journalForm.compteDebit}
                    onChange={(e) => setJournalForm({...journalForm, compteDebit: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="journal-compte-credit" className="text-sm font-medium">Compte Crédit *</Label>
                  <Input
                    id="journal-compte-credit"
                    placeholder="Ex: 411"
                    value={journalForm.compteCredit}
                    onChange={(e) => setJournalForm({...journalForm, compteCredit: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="journal-libelle" className="text-sm font-medium">Libellé *</Label>
                <Textarea
                  id="journal-libelle"
                  placeholder="Description de l'écriture"
                  value={journalForm.libelle}
                  onChange={(e) => setJournalForm({...journalForm, libelle: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="journal-montant" className="text-sm font-medium">Montant (€) *</Label>
                <Input
                  id="journal-montant"
                  type="number"
                  placeholder="5000"
                  value={journalForm.montant}
                  onChange={(e) => setJournalForm({...journalForm, montant: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewTransaction(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={() => {
                  // Logique d'ajout d'écriture journal
                  console.log('Ajout écriture journal:', journalForm);
                  setShowNewTransaction(false);
                  setJournalForm({
                    date: new Date().toISOString().split('T')[0],
                    piece: '',
                    compteDebit: '',
                    compteCredit: '',
                    libelle: '',
                    montant: '',
                    type: 'debit'
                  });
                }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Enregistrer
                </Button>
              </div>
            </div>
          )}

          {/* Formulaire Pièce comptable */}
          {activeTab === 'pieces' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="piece-numero" className="text-sm font-medium">Numéro de pièce *</Label>
                  <Input
                    id="piece-numero"
                    placeholder="Ex: PIECE-001"
                    value={pieceForm.numero}
                    onChange={(e) => setPieceForm({...pieceForm, numero: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="piece-date" className="text-sm font-medium">Date *</Label>
                  <Input
                    id="piece-date"
                    type="date"
                    value={pieceForm.date}
                    onChange={(e) => setPieceForm({...pieceForm, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="piece-type" className="text-sm font-medium">Type *</Label>
                  <Select value={pieceForm.type} onValueChange={(value) => setPieceForm({...pieceForm, type: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facture">Facture</SelectItem>
                      <SelectItem value="Avoir">Avoir</SelectItem>
                      <SelectItem value="Bon de commande">Bon de commande</SelectItem>
                      <SelectItem value="Reçu">Reçu</SelectItem>
                      <SelectItem value="Note de crédit">Note de crédit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="piece-montant" className="text-sm font-medium">Montant (€) *</Label>
                  <Input
                    id="piece-montant"
                    type="number"
                    placeholder="5000"
                    value={pieceForm.montant}
                    onChange={(e) => setPieceForm({...pieceForm, montant: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="piece-compte" className="text-sm font-medium">Compte comptable</Label>
                <Input
                  id="piece-compte"
                  placeholder="Ex: 411"
                  value={pieceForm.compte}
                  onChange={(e) => setPieceForm({...pieceForm, compte: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="piece-description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="piece-description"
                  placeholder="Description de la pièce"
                  value={pieceForm.description}
                  onChange={(e) => setPieceForm({...pieceForm, description: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewTransaction(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={() => {
                  console.log('Ajout pièce:', pieceForm);
                  setShowNewTransaction(false);
                  setPieceForm({
                    numero: '',
                    date: new Date().toISOString().split('T')[0],
                    type: 'Facture',
                    montant: '',
                    description: '',
                    compte: ''
                  });
                }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Enregistrer
                </Button>
              </div>
            </div>
          )}

          {/* Formulaire Écriture automatique */}
          {activeTab === 'auto' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="auto-nom" className="text-sm font-medium">Nom de l'écriture *</Label>
                <Input
                  id="auto-nom"
                  placeholder="Ex: Amortissement mensuel"
                  value={autoForm.nom}
                  onChange={(e) => setAutoForm({...autoForm, nom: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="auto-frequence" className="text-sm font-medium">Fréquence *</Label>
                <Select value={autoForm.frequence} onValueChange={(value) => setAutoForm({...autoForm, frequence: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quotidien">Quotidien</SelectItem>
                    <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                    <SelectItem value="Mensuel">Mensuel</SelectItem>
                    <SelectItem value="Trimestriel">Trimestriel</SelectItem>
                    <SelectItem value="Semestriel">Semestriel</SelectItem>
                    <SelectItem value="Annuel">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="auto-compte-debit" className="text-sm font-medium">Compte Débit *</Label>
                  <Input
                    id="auto-compte-debit"
                    placeholder="Ex: 681"
                    value={autoForm.compteDebit}
                    onChange={(e) => setAutoForm({...autoForm, compteDebit: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="auto-compte-credit" className="text-sm font-medium">Compte Crédit *</Label>
                  <Input
                    id="auto-compte-credit"
                    placeholder="Ex: 281"
                    value={autoForm.compteCredit}
                    onChange={(e) => setAutoForm({...autoForm, compteCredit: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="auto-montant" className="text-sm font-medium">Montant (€) - Laisser vide si variable</Label>
                <Input
                  id="auto-montant"
                  type="number"
                  placeholder="1000"
                  value={autoForm.montant}
                  onChange={(e) => setAutoForm({...autoForm, montant: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewTransaction(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={() => {
                  console.log('Ajout écriture auto:', autoForm);
                  setShowNewTransaction(false);
                  setAutoForm({
                    nom: '',
                    frequence: 'Mensuel',
                    compteDebit: '',
                    compteCredit: '',
                    montant: '',
                    actif: true
                  });
                }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Créer
                </Button>
              </div>
            </div>
          )}

          {/* Formulaire Plan Comptable */}
          {['syscohada', 'pcg', 'customs'].includes(activeTab) && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="compte-numero" className="text-sm font-medium">Numéro de compte *</Label>
                <Input
                  id="compte-numero"
                  placeholder={activeTab === 'customs' ? 'Ex: CUST-001' : 'Ex: 411'}
                  value={compteForm.numero}
                  onChange={(e) => setCompteForm({...compteForm, numero: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="compte-intitule" className="text-sm font-medium">Intitulé *</Label>
                <Input
                  id="compte-intitule"
                  placeholder="Ex: Clients"
                  value={compteForm.intitule}
                  onChange={(e) => setCompteForm({...compteForm, intitule: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="compte-type" className="text-sm font-medium">Type *</Label>
                  <Select value={compteForm.type} onValueChange={(value) => setCompteForm({...compteForm, type: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Passif">Passif</SelectItem>
                      <SelectItem value="Charge">Charge</SelectItem>
                      <SelectItem value="Produit">Produit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {activeTab === 'pcg' && (
                  <div>
                    <Label htmlFor="compte-classe" className="text-sm font-medium">Classe</Label>
                    <Select value={compteForm.classe} onValueChange={(value) => setCompteForm({...compteForm, classe: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Classe 1">Classe 1 - Financement permanent</SelectItem>
                        <SelectItem value="Classe 2">Classe 2 - Actif immobilisé</SelectItem>
                        <SelectItem value="Classe 3">Classe 3 - Stocks</SelectItem>
                        <SelectItem value="Classe 4">Classe 4 - Tiers</SelectItem>
                        <SelectItem value="Classe 5">Classe 5 - Trésorerie</SelectItem>
                        <SelectItem value="Classe 6">Classe 6 - Charges</SelectItem>
                        <SelectItem value="Classe 7">Classe 7 - Produits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewTransaction(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={() => {
                  console.log('Ajout compte:', compteForm);
                  setShowNewTransaction(false);
                  setCompteForm({
                    numero: '',
                    intitule: '',
                    type: 'Actif',
                    classe: ''
                  });
                }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Ajouter
                </Button>
              </div>
            </div>
          )}

          {/* Formulaire Inventaire */}
          {activeTab === 'inventaire' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inv-reference" className="text-sm font-medium">Référence *</Label>
                  <Input
                    id="inv-reference"
                    placeholder="Ex: ART-001"
                    value={inventaireForm.reference}
                    onChange={(e) => setInventaireForm({...inventaireForm, reference: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="inv-valeur" className="text-sm font-medium">Valeur unitaire (€)</Label>
                  <Input
                    id="inv-valeur"
                    type="number"
                    placeholder="100"
                    value={inventaireForm.valeurUnitaire}
                    onChange={(e) => setInventaireForm({...inventaireForm, valeurUnitaire: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="inv-designation" className="text-sm font-medium">Désignation *</Label>
                <Input
                  id="inv-designation"
                  placeholder="Nom de l'article"
                  value={inventaireForm.designation}
                  onChange={(e) => setInventaireForm({...inventaireForm, designation: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inv-qte-theo" className="text-sm font-medium">Quantité théorique *</Label>
                  <Input
                    id="inv-qte-theo"
                    type="number"
                    placeholder="100"
                    value={inventaireForm.quantiteTheorique}
                    onChange={(e) => setInventaireForm({...inventaireForm, quantiteTheorique: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="inv-qte-reel" className="text-sm font-medium">Quantité réelle *</Label>
                  <Input
                    id="inv-qte-reel"
                    type="number"
                    placeholder="98"
                    value={inventaireForm.quantiteReelle}
                    onChange={(e) => setInventaireForm({...inventaireForm, quantiteReelle: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewTransaction(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={() => {
                  console.log('Ajout inventaire:', inventaireForm);
                  setShowNewTransaction(false);
                  setInventaireForm({
                    reference: '',
                    designation: '',
                    quantiteTheorique: '',
                    quantiteReelle: '',
                    valeurUnitaire: ''
                  });
                }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Ajouter
                </Button>
              </div>
            </div>
          )}

          {/* Formulaire générique pour les autres pages (ventes, achats, etc.) */}
          {!['bank', 'cash', 'od', 'journal', 'pieces', 'auto', 'syscohada', 'pcg', 'customs', 'inventaire', 'lettrage'].includes(activeTab) && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newForm.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewForm({...newForm, date: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Input
                  id="description"
                  placeholder="Ex: Vente logiciel"
                  value={newForm.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewForm({...newForm, description: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-medium">Catégorie *</Label>
                <Input
                  id="category"
                  placeholder="Ex: Software, Services"
                  value={newForm.category}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewForm({...newForm, category: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">Montant (€) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  value={newForm.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewForm({...newForm, amount: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewTransaction(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleAddTransaction} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Ajouter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog open={showDetails} onOpenChange={(open) => {
          setShowDetails(open);
          if (!open) {
            setIsEditingTransaction(false);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditingTransaction ? 'Modifier la transaction' : 'Détails de la transaction'}
              </DialogTitle>
            </DialogHeader>
            
            {isEditingTransaction ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-date" className="text-sm font-medium">Date *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editForm.date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description" className="text-sm font-medium">Description *</Label>
                  <Input
                    id="edit-description"
                    placeholder="Ex: Vente logiciel"
                    value={editForm.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, description: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category" className="text-sm font-medium">Catégorie *</Label>
                  <Input
                    id="edit-category"
                    placeholder="Ex: Software, Services"
                    value={editForm.category}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, category: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-amount" className="text-sm font-medium">Montant (€) *</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    placeholder="5000"
                    value={editForm.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, amount: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditingTransaction(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button onClick={handleEditTransaction} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Date</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{new Date(selectedTransaction.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Montant</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">€{selectedTransaction.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Description</p>
                  <p className="text-gray-900 mt-1">{selectedTransaction.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Catégorie</p>
                  <p className="text-gray-900 mt-1">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {selectedTransaction.category}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Référence</p>
                  <p className="text-gray-900 mt-1">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Statut</p>
                  <Badge className={`${getStatusColor(selectedTransaction.status)} mt-1`}>
                    {statusLabels[selectedTransaction.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditForm({
                        date: selectedTransaction.date,
                        description: selectedTransaction.description,
                        amount: selectedTransaction.amount.toString(),
                        category: selectedTransaction.category
                      });
                      setIsEditingTransaction(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Télécharger
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Accounting;
