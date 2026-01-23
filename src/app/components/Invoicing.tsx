import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
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
  MoreVertical
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
}

const Invoicing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2026-001',
      company: 'Acme Corporation',
      amount: 125000,
      issueDate: '2026-01-15',
      dueDate: '2026-02-15',
      status: 'paid',
      items: 5
    },
    {
      id: '2',
      number: 'INV-2026-002',
      company: 'TechStart SAS',
      amount: 85000,
      issueDate: '2026-01-18',
      dueDate: '2026-02-18',
      status: 'pending',
      items: 3
    },
    {
      id: '3',
      number: 'INV-2026-003',
      company: 'Global Industries',
      amount: 45000,
      issueDate: '2026-01-10',
      dueDate: '2026-01-25',
      status: 'overdue',
      items: 4
    },
    {
      id: '4',
      number: 'INV-2026-004',
      company: 'Digital Solutions',
      amount: 95000,
      issueDate: '2026-01-20',
      dueDate: '2026-02-20',
      status: 'pending',
      items: 6
    },
    {
      id: '5',
      number: 'INV-2026-005',
      company: 'Innovation Labs',
      amount: 35000,
      issueDate: '2026-01-12',
      dueDate: '2026-02-12',
      status: 'paid',
      items: 2
    },
    {
      id: '6',
      number: 'DRAFT-001',
      company: 'Smart Tech SARL',
      amount: 55000,
      issueDate: '2026-01-22',
      dueDate: '2026-02-22',
      status: 'draft',
      items: 4
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 285000, expenses: 120000 },
    { month: 'Fév', revenue: 320000, expenses: 135000 },
    { month: 'Mar', revenue: 295000, expenses: 128000 },
    { month: 'Avr', revenue: 380000, expenses: 145000 },
    { month: 'Mai', revenue: 410000, expenses: 158000 },
    { month: 'Jun', revenue: 440000, expenses: 165000 }
  ];

  const statusData = [
    { name: 'Payées', value: invoices.filter(i => i.status === 'paid').length, color: '#10b981' },
    { name: 'En attente', value: invoices.filter(i => i.status === 'pending').length, color: '#f59e0b' },
    { name: 'En retard', value: invoices.filter(i => i.status === 'overdue').length, color: '#ef4444' },
    { name: 'Brouillons', value: invoices.filter(i => i.status === 'draft').length, color: '#6b7280' }
  ];

  const filteredInvoices = invoices.filter(invoice =>
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

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueRevenue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

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
                    <Input id="invoice-number" placeholder="INV-2026-007" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Date d'émission</Label>
                    <Input id="invoice-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Date d'échéance</Label>
                    <Input id="due-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <select id="client" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Sélectionner un client</option>
                      <option value="acme">Acme Corporation</option>
                      <option value="techstart">TechStart SAS</option>
                      <option value="global">Global Industries</option>
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
                <Button variant="outline">
                  Sauvegarder brouillon
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Créer et envoyer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                  {invoices.filter(i => i.status === 'paid').length} factures
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
                  {invoices.filter(i => i.status === 'pending').length} factures
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
                  {invoices.filter(i => i.status === 'overdue').length} factures
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
                  {invoices.filter(i => i.status !== 'draft').length} factures
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
                  <button className="flex-1 flex items-center justify-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">
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
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Voir">
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
    </div>
  );
};

export default Invoicing;
