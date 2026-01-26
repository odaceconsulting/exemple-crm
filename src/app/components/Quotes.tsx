import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import {
  FileText,
  Plus,
  Eye,
  Send,
  Download,
  MoreVertical,
  TrendingUp,
  Calendar,
  Building2,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Edit2,
  PenTool,
  Bell,
  ArrowRight,
  X,
  Grid3x3,
  List,
  Kanban,
  Search,
  Edit,
  Trash2
} from 'lucide-react';

interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: number;
  quoteNumber: string;
  company: string;
  contact: string;
  date: string;
  expiryDate: string;
  items: QuoteItem[];
  totalAmount: number;
  taxRate: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes: string;
  customization: {
    colors: string;
    logo: string;
    terms: string;
  };
}

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 1,
      quoteNumber: 'DEVIS-2026-001',
      company: 'Acme Corporation',
      contact: 'Marie Dupont',
      date: '2026-01-20',
      expiryDate: '2026-02-20',
      items: [
        { id: 1, description: 'Licence logiciel premium', quantity: 5, unitPrice: 2000, total: 10000 },
        { id: 2, description: 'Support technique 1 an', quantity: 5, unitPrice: 500, total: 2500 }
      ],
      totalAmount: 12500,
      taxRate: 20,
      status: 'sent',
      notes: 'Devis valide 1 mois',
      customization: { colors: '#3b82f6', logo: '', terms: 'Paiement à 30 jours' }
    },
    {
      id: 2,
      quoteNumber: 'DEVIS-2026-002',
      company: 'TechStart SAS',
      contact: 'Jean Martin',
      date: '2026-01-19',
      expiryDate: '2026-02-19',
      items: [
        { id: 1, description: 'Développement custom', quantity: 1, unitPrice: 15000, total: 15000 },
        { id: 2, description: 'Formation utilisateurs', quantity: 2, unitPrice: 1000, total: 2000 }
      ],
      totalAmount: 17000,
      taxRate: 20,
      status: 'accepted',
      notes: 'Accepté le 21/01/2026',
      customization: { colors: '#8b5cf6', logo: '', terms: 'Paiement 50% acompte' }
    },
    {
      id: 3,
      quoteNumber: 'DEVIS-2026-003',
      company: 'Global Industries',
      contact: 'Sophie Bernard',
      date: '2026-01-18',
      expiryDate: '2026-02-18',
      items: [
        { id: 1, description: 'Conseil en stratégie', quantity: 3, unitPrice: 3000, total: 9000 }
      ],
      totalAmount: 9000,
      taxRate: 20,
      status: 'draft',
      notes: 'En cours de rédaction',
      customization: { colors: '#f59e0b', logo: '', terms: 'Devis à confirmer' }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [openActionsFor, setOpenActionsFor] = useState<number | null>(null);
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showConvertToSignature, setShowConvertToSignature] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'>('all');
  const [newQuoteForm, setNewQuoteForm] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    expiryDays: '30',
    taxRate: '20',
    notes: '',
    items: [
      { id: 1, description: '', quantity: 1, unitPrice: 0 }
    ]
  });

  const [editQuoteForm, setEditQuoteForm] = useState({
    company: '',
    contact: '',
    expiryDate: '',
    taxRate: '20',
    notes: '',
    items: [] as QuoteItem[]
  });

  const [customForm, setCustomForm] = useState({
    colors: '#3b82f6',
    terms: 'Paiement à 30 jours'
  });

  const [followUpForm, setFollowUpForm] = useState({
    message: '',
    date: new Date().toISOString().split('T')[0]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusLabels = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    accepted: 'Accepté',
    rejected: 'Rejeté',
    expired: 'Expiré'
  };

  const statusIcons = {
    draft: <Edit2 className="h-4 w-4" />,
    sent: <Send className="h-4 w-4" />,
    accepted: <CheckCircle className="h-4 w-4" />,
    rejected: <XCircle className="h-4 w-4" />,
    expired: <Clock className="h-4 w-4" />
  };

  const filteredQuotes = filterStatus === 'all'
    ? quotes
    : quotes.filter(q => q.status === filterStatus);

  const draftQuotes = quotes.filter(q => q.status === 'draft').length;
  const sentQuotes = quotes.filter(q => q.status === 'sent').length;
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
  const totalValue = quotes
    .filter(q => q.status !== 'rejected' && q.status !== 'expired')
    .reduce((sum, q) => sum + (q.totalAmount * (1 + q.taxRate / 100)), 0);

  const handleDeleteQuote = (id: number) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      setQuotes(quotes.filter(q => q.id !== deleteTarget));
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setShowQuoteDetails(false);
    }
  };

  const handleEditQuote = () => {
    if (selectedQuote && editQuoteForm.company && editQuoteForm.contact) {
      setQuotes(quotes.map(q =>
        q.id === selectedQuote.id ? {
          ...q,
          company: editQuoteForm.company,
          contact: editQuoteForm.contact,
          expiryDate: editQuoteForm.expiryDate,
          taxRate: parseInt(editQuoteForm.taxRate),
          notes: editQuoteForm.notes,
          items: editQuoteForm.items,
          totalAmount: editQuoteForm.items.reduce((sum, i) => sum + i.total, 0)
        } : q
      ));
      setIsEditingQuote(false);
      setShowQuoteDetails(false);
      setSelectedQuote(null);
    }
  };

  const handleCreateQuote = () => {
    if (newQuoteForm.company && newQuoteForm.contact && newQuoteForm.items.some(i => i.description)) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(newQuoteForm.expiryDays));

      // Calculer le total des articles
      const items = newQuoteForm.items
        .filter(i => i.description)
        .map(i => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.quantity * i.unitPrice
        }));

      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

      const newQuote: Quote = {
        id: Math.max(...quotes.map(q => q.id), 0) + 1,
        quoteNumber: `DEVIS-2026-${String(quotes.length + 1).padStart(3, '0')}`,
        company: newQuoteForm.company,
        contact: newQuoteForm.contact,
        date: new Date().toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0],
        items: items,
        totalAmount: totalAmount,
        taxRate: parseInt(newQuoteForm.taxRate),
        status: 'draft',
        notes: newQuoteForm.notes,
        customization: { colors: '#3b82f6', logo: '', terms: 'Paiement à 30 jours' }
      };
      setQuotes([...quotes, newQuote]);
      setShowNewQuote(false);
      setNewQuoteForm({ 
        company: '', 
        contact: '', 
        email: '', 
        phone: '', 
        expiryDays: '30', 
        taxRate: '20',
        notes: '',
        items: [{ id: 1, description: '', quantity: 1, unitPrice: 0 }]
      });
    } else {
      alert('Veuillez remplir les champs requis et ajouter au moins un article');
    }
  };

  const handleSendQuote = (quoteId: number) => {
    setQuotes(quotes.map(q => q.id === quoteId ? { ...q, status: 'sent' } : q));
  };

  const handleConvertToSignature = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowConvertToSignature(true);
  };

  const handleSendFollowUp = () => {
    if (selectedQuote && followUpForm.message) {
      alert(`Relance envoyée le ${followUpForm.date}\nMessage: ${followUpForm.message}`);
      setShowFollowUp(false);
      setFollowUpForm({ message: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleApplyCustomization = () => {
    if (selectedQuote) {
      setQuotes(quotes.map(q =>
        q.id === selectedQuote.id
          ? {
              ...q,
              customization: {
                ...q.customization,
                colors: customForm.colors,
                terms: customForm.terms
              }
            }
          : q
      ));
      setShowCustomization(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              Devis
            </h1>
            <p className="text-gray-600 mt-2">Création et gestion des devis commerciaux</p>
          </div>
          <button
            onClick={() => setShowNewQuote(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2 border-2 border-blue-700 shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="h-5 w-5" />
            Nouveau devis
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Brouillons</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{draftQuotes}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Edit2 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Envoyés</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{sentQuotes}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Acceptés</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{acceptedQuotes}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Devis</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{quotes.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Valeur totale</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">€{(totalValue / 1000).toFixed(0)}k</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un devis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-2 border-gray-300 focus:border-blue-500 h-11"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white border-2 border-blue-600'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title="Vue grille"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white border-2 border-blue-600'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title="Vue liste"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'kanban'
                ? 'bg-blue-600 text-white border-2 border-blue-600'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title="Vue kanban"
          >
            <Kanban className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-lg transition-all border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{quote.quoteNumber}</h3>
                    <p className="text-sm text-gray-500 mt-1">{quote.company}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedQuote(quote);
                          setShowQuoteDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedQuote(quote);
                          setEditQuoteForm({
                            company: quote.company,
                            contact: quote.contact,
                            expiryDate: quote.expiryDate,
                            taxRate: quote.taxRate.toString(),
                            notes: quote.notes,
                            items: quote.items
                          });
                          setIsEditingQuote(true);
                          setShowQuoteDetails(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteQuote(quote.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contact</span>
                    <span className="font-medium text-gray-900">{quote.contact}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Montant HT</span>
                    <span className="font-medium text-gray-900">€{quote.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Créée le</span>
                    <span className="font-medium text-gray-900">{new Date(quote.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {statusLabels[quote.status as keyof typeof statusLabels]}
                    </span>
                    <span className="text-xs text-gray-500">Expire: {new Date(quote.expiryDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-md border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Devis</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Entreprise</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Montant HT</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date création</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Expiration</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote, index) => (
                  <tr key={quote.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="font-semibold text-gray-900">{quote.quoteNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{quote.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{quote.contact}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">€{quote.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{new Date(quote.date).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{new Date(quote.expiryDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {statusLabels[quote.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu open={openActionsFor === quote.id} onOpenChange={(open) => setOpenActionsFor(open ? quote.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-200 rounded-lg inline-flex">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowQuoteDetails(true);
                              setOpenActionsFor(null);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedQuote(quote);
                              setEditQuoteForm({
                                company: quote.company,
                                contact: quote.contact,
                                expiryDate: quote.expiryDate,
                                taxRate: quote.taxRate.toString(),
                                notes: quote.notes,
                                items: quote.items
                              });
                              setIsEditingQuote(true);
                              setShowQuoteDetails(true);
                              setOpenActionsFor(null);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              handleDeleteQuote(quote.id);
                              setOpenActionsFor(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {['draft', 'sent', 'accepted', 'rejected', 'expired'].map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'draft' ? 'bg-gray-500' :
                  status === 'sent' ? 'bg-blue-500' :
                  status === 'accepted' ? 'bg-green-500' :
                  status === 'rejected' ? 'bg-red-500' :
                  'bg-orange-500'
                }`}></div>
                <h3 className="font-bold text-gray-900">
                  {statusLabels[status as keyof typeof statusLabels]}
                </h3>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                  {quotes.filter(c => c.status === status).length}
                </span>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {quotes.filter(c => c.status === status).map((quote) => (
                  <Card key={quote.id} className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-all bg-white cursor-move">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{quote.quoteNumber}</h4>
                          <p className="text-xs text-gray-500 mt-1">{quote.company}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-gray-100 rounded-lg -mt-1">
                              <MoreVertical className="h-3 w-3 text-gray-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedQuote(quote);
                                setShowQuoteDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedQuote(quote);
                                setEditQuoteForm({
                                  company: quote.company,
                                  contact: quote.contact,
                                  expiryDate: quote.expiryDate,
                                  taxRate: quote.taxRate.toString(),
                                  notes: quote.notes,
                                  items: quote.items
                                });
                                setIsEditingQuote(true);
                                setShowQuoteDetails(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteQuote(quote.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Contact:</span>
                          <span className="text-xs font-medium text-gray-900">{quote.contact}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Montant:</span>
                          <span className="text-xs font-medium text-gray-900">€{quote.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Expiration:</span>
                          <span className="text-xs font-medium text-gray-900">{new Date(quote.expiryDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {quotes.filter(c => c.status === status).length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">Aucun devis</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {quotes.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun devis trouvé</p>
          </CardContent>
        </Card>
      )}

      {/* Quote Details Dialog */}
      {selectedQuote && (
        <Dialog open={showQuoteDetails} onOpenChange={(open) => {
          setShowQuoteDetails(open);
          if (!open) {
            setIsEditingQuote(false);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditingQuote ? 'Modifier le devis' : 'Détails du devis'}
              </DialogTitle>
            </DialogHeader>

            {isEditingQuote ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-company" className="text-sm font-medium">Entreprise *</Label>
                    <Input
                      id="edit-company"
                      value={editQuoteForm.company}
                      onChange={(e) => setEditQuoteForm({...editQuoteForm, company: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-contact" className="text-sm font-medium">Contact *</Label>
                    <Input
                      id="edit-contact"
                      value={editQuoteForm.contact}
                      onChange={(e) => setEditQuoteForm({...editQuoteForm, contact: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-expiryDate" className="text-sm font-medium">Date d'expiration</Label>
                    <Input
                      id="edit-expiryDate"
                      type="date"
                      value={editQuoteForm.expiryDate}
                      onChange={(e) => setEditQuoteForm({...editQuoteForm, expiryDate: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-taxRate" className="text-sm font-medium">Taux TVA (%)</Label>
                    <Input
                      id="edit-taxRate"
                      type="number"
                      value={editQuoteForm.taxRate}
                      onChange={(e) => setEditQuoteForm({...editQuoteForm, taxRate: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-notes" className="text-sm font-medium">Notes</Label>
                  <textarea
                    id="edit-notes"
                    value={editQuoteForm.notes}
                    onChange={(e) => setEditQuoteForm({...editQuoteForm, notes: e.target.value})}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditingQuote(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button onClick={handleEditQuote} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Devis</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{selectedQuote.quoteNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Statut</p>
                    <Badge className={`${getStatusColor(selectedQuote.status)} mt-1`}>
                      {statusLabels[selectedQuote.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-3">Informations</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entreprise:</span>
                      <span className="font-medium text-gray-900">{selectedQuote.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium text-gray-900">{selectedQuote.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date création:</span>
                      <span className="font-medium text-gray-900">{new Date(selectedQuote.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiration:</span>
                      <span className="font-medium text-gray-900">{new Date(selectedQuote.expiryDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-3">Montants</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant HT:</span>
                      <span className="font-semibold text-gray-900">€{selectedQuote.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux TVA:</span>
                      <span className="font-medium text-gray-900">{selectedQuote.taxRate}%</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-medium">Total TTC:</span>
                      <span className="font-bold text-gray-900">€{(selectedQuote.totalAmount * (1 + selectedQuote.taxRate / 100)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedQuote.notes && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Notes</p>
                    <p className="text-sm text-gray-700">{selectedQuote.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditQuoteForm({
                        company: selectedQuote.company,
                        contact: selectedQuote.contact,
                        expiryDate: selectedQuote.expiryDate,
                        taxRate: selectedQuote.taxRate.toString(),
                        notes: selectedQuote.notes,
                        items: selectedQuote.items
                      });
                      setIsEditingQuote(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteQuote(selectedQuote.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* New Quote Dialog */}
      <Dialog open={showNewQuote} onOpenChange={setShowNewQuote}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau devis</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section Informations Client */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations Client
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-company" className="text-sm font-medium">Entreprise *</Label>
                  <Input
                    id="new-company"
                    value={newQuoteForm.company}
                    onChange={(e) => setNewQuoteForm({...newQuoteForm, company: e.target.value})}
                    placeholder="Nom de l'entreprise"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-contact" className="text-sm font-medium">Contact *</Label>
                  <Input
                    id="new-contact"
                    value={newQuoteForm.contact}
                    onChange={(e) => setNewQuoteForm({...newQuoteForm, contact: e.target.value})}
                    placeholder="Nom du contact"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newQuoteForm.email}
                    onChange={(e) => setNewQuoteForm({...newQuoteForm, email: e.target.value})}
                    placeholder="email@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-phone" className="text-sm font-medium">Téléphone</Label>
                  <Input
                    id="new-phone"
                    value={newQuoteForm.phone}
                    onChange={(e) => setNewQuoteForm({...newQuoteForm, phone: e.target.value})}
                    placeholder="Téléphone"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Section Articles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Articles du devis
              </h3>
              <div className="space-y-3">
                {newQuoteForm.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`item-desc-${item.id}`} className="text-sm font-medium">Description</Label>
                      <Input
                        id={`item-desc-${item.id}`}
                        value={item.description}
                        onChange={(e) => {
                          const updatedItems = [...newQuoteForm.items];
                          updatedItems[index].description = e.target.value;
                          setNewQuoteForm({...newQuoteForm, items: updatedItems});
                        }}
                        placeholder="Description de l'article"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-qty-${item.id}`} className="text-sm font-medium">Quantité</Label>
                      <Input
                        id={`item-qty-${item.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedItems = [...newQuoteForm.items];
                          updatedItems[index].quantity = parseInt(e.target.value) || 1;
                          setNewQuoteForm({...newQuoteForm, items: updatedItems});
                        }}
                        min="1"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`item-price-${item.id}`} className="text-sm font-medium">Prix unitaire</Label>
                      <Input
                        id={`item-price-${item.id}`}
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updatedItems = [...newQuoteForm.items];
                          updatedItems[index].unitPrice = parseFloat(e.target.value) || 0;
                          setNewQuoteForm({...newQuoteForm, items: updatedItems});
                        }}
                        min="0"
                        step="0.01"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        onClick={() => {
                          if (newQuoteForm.items.length > 1) {
                            const updatedItems = newQuoteForm.items.filter((_, i) => i !== index);
                            setNewQuoteForm({...newQuoteForm, items: updatedItems});
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                        disabled={newQuoteForm.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  const newId = Math.max(...newQuoteForm.items.map(i => i.id), 0) + 1;
                  setNewQuoteForm({
                    ...newQuoteForm,
                    items: [...newQuoteForm.items, { id: newId, description: '', quantity: 1, unitPrice: 0 }]
                  });
                }}
                variant="outline"
                className="mt-3 w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un article
              </Button>
            </div>

            {/* Section Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Conditions financières
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-expiryDays" className="text-sm font-medium">Validité du devis (jours)</Label>
                  <Input
                    id="new-expiryDays"
                    type="number"
                    value={newQuoteForm.expiryDays}
                    onChange={(e) => setNewQuoteForm({...newQuoteForm, expiryDays: e.target.value})}
                    min="1"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-taxRate" className="text-sm font-medium">Taux TVA (%)</Label>
                  <Input
                    id="new-taxRate"
                    type="number"
                    value={newQuoteForm.taxRate}
                    onChange={(e) => setNewQuoteForm({...newQuoteForm, taxRate: e.target.value})}
                    min="0"
                    max="100"
                    step="0.01"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="new-notes" className="text-sm font-medium">Notes / Conditions particulières</Label>
                <textarea
                  id="new-notes"
                  value={newQuoteForm.notes}
                  onChange={(e) => setNewQuoteForm({...newQuoteForm, notes: e.target.value})}
                  placeholder="Notes ou conditions spéciales..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Montants Récapitulatifs */}
            {newQuoteForm.items.some(i => i.description) && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant HT:</span>
                    <span className="font-semibold text-gray-900">
                      €{newQuoteForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA ({newQuoteForm.taxRate}%):</span>
                    <span className="font-semibold text-gray-900">
                      €{(newQuoteForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * (parseFloat(newQuoteForm.taxRate) / 100)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="text-gray-700 font-bold">Total TTC:</span>
                    <span className="font-bold text-lg text-blue-600">
                      €{(newQuoteForm.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * (1 + parseFloat(newQuoteForm.taxRate) / 100)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewQuote(false);
                  setNewQuoteForm({
                    company: '',
                    contact: '',
                    email: '',
                    phone: '',
                    expiryDays: '30',
                    taxRate: '20',
                    notes: '',
                    items: [{ id: 1, description: '', quantity: 1, unitPrice: 0 }]
                  });
                }}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateQuote}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer le devis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le devis</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce devis ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Quotes;
