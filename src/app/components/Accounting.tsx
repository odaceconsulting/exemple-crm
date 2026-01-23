import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
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
  Edit
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
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Comptabilité</h1>
          <p className="text-gray-500 mt-1">Gestion des ventes, achats, dépenses et recettes</p>
        </div>
        <button
          onClick={() => setShowNewTransaction(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nouveau
        </button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-transparent border-0 p-0">
          {(['sales', 'purchases', 'expenses', 'receipts'] as const).map(tab => (
            <TabsTrigger 
              key={tab} 
              value={tab} 
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <div className="h-4 w-4">
                {getTabIcon(tab)}
              </div>
              <span className="text-xs sm:text-sm">{getTabLabel(tab)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {(['sales', 'purchases', 'expenses', 'receipts'] as const).map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-6">
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
                  <CardTitle>{getTabLabel(tab)} ({filteredData.length})</CardTitle>
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
          </TabsContent>
        ))}
      </Tabs>

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
                    Exporter
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
