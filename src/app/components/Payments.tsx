import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
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
  Search
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPaymentForm, setNewPaymentForm] = useState({
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

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Paiements</h1>
          <p className="text-gray-500 mt-1">Gestion des paiements et suivi financier</p>
        </div>
        <button
          onClick={() => setShowNewPayment(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nouveau paiement
        </button>
      </div>

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
        <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Détails du paiement</DialogTitle>
            </DialogHeader>
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
                  <Button variant="outline" onClick={() => setShowPaymentDetails(false)} className="flex-1">
                    Fermer
                  </Button>
                  <Button onClick={() => handleMarkAsPaid(selectedPayment.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                    Marquer comme payé
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Payments;
