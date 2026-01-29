import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
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
  Calendar
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

  const currentData = data[activeTab as keyof AccountingData];
  
  const filteredData = currentData.filter(t =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalAmount = filteredData.reduce((sum, t) => sum + t.amount, 0);
  const completedAmount = filteredData
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = filteredData
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAddTransaction = () => {
    if (newForm.description && newForm.amount && newForm.category) {
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
    if (selectedTransaction && editForm.description && editForm.amount && editForm.category) {
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
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
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
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
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
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
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
                          <div className="h-full bg-purple-600" style={{ width: `${(cat.value / 57200) * 100}%` }}></div>
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
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
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
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
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

      {/* New Transaction Dialog */}
      <Dialog open={showNewTransaction} onOpenChange={setShowNewTransaction}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle transaction - {getTabLabel(activeTab)}</DialogTitle>
          </DialogHeader>
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
