import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
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
  X
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

  const [showNewQuote, setShowNewQuote] = useState(false);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
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
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Devis</h1>
          <p className="text-gray-500 mt-1">Création et gestion des devis commerciaux</p>
        </div>
        <button
          onClick={() => setShowNewQuote(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nouveau devis
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Brouillons</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{draftQuotes}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Edit2 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Envoyés</p>
                <p className="text-3xl font-semibold text-blue-600 mt-2">{sentQuotes}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Acceptés</p>
                <p className="text-3xl font-semibold text-green-600 mt-2">{acceptedQuotes}</p>
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
                <p className="text-sm text-gray-600 font-medium">Valeur totale</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">€{(totalValue / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto">
        {(['all', 'draft', 'sent', 'accepted', 'rejected', 'expired'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Tous' : statusLabels[status as keyof typeof statusLabels]}
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Liste des devis ({filteredQuotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Devis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Entreprise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Montant TTC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuotes.map(quote => {
                  const totalTTC = quote.totalAmount * (1 + quote.taxRate / 100);
                  const isExpired = new Date(quote.expiryDate) < new Date();
                  return (
                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{quote.quoteNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{quote.company}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{quote.contact}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">€{totalTTC.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(quote.expiryDate).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(isExpired && quote.status !== 'accepted' && quote.status !== 'rejected' ? 'expired' : quote.status)}>
                          <span className="flex items-center gap-1">
                            {statusIcons[quote.status as keyof typeof statusIcons]}
                            {statusLabels[quote.status as keyof typeof statusLabels]}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowQuotePreview(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Aperçu"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                          {quote.status === 'draft' && (
                            <button
                              onClick={() => handleSendQuote(quote.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Envoyer"
                            >
                              <Send className="h-4 w-4 text-blue-600" />
                            </button>
                          )}
                          {quote.status === 'sent' && (
                            <button
                              onClick={() => {
                                setSelectedQuote(quote);
                                setShowFollowUp(true);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Relance"
                            >
                              <Bell className="h-4 w-4 text-orange-600" />
                            </button>
                          )}
                          {quote.status === 'accepted' && (
                            <button
                              onClick={() => handleConvertToSignature(quote)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Convertir en signature"
                            >
                              <PenTool className="h-4 w-4 text-green-600" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowCustomization(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Personnaliser"
                          >
                            <Edit2 className="h-4 w-4 text-purple-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Quote Dialog */}
      <Dialog open={showNewQuote} onOpenChange={setShowNewQuote}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau devis</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Infos Client */}
            <div className="border-b pb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informations du client</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">Entreprise *</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    value={newQuoteForm.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuoteForm({...newQuoteForm, company: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact" className="text-sm font-medium">Contact *</Label>
                  <Input
                    id="contact"
                    placeholder="Jean Dupont"
                    value={newQuoteForm.contact}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuoteForm({...newQuoteForm, contact: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@acme.com"
                    value={newQuoteForm.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuoteForm({...newQuoteForm, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
                  <Input
                    id="phone"
                    placeholder="+33 1 23 45 67 89"
                    value={newQuoteForm.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuoteForm({...newQuoteForm, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Articles/Articles */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Articles *</h3>
                <button
                  onClick={() => {
                    const newId = Math.max(...newQuoteForm.items.map(i => i.id), 0) + 1;
                    setNewQuoteForm({
                      ...newQuoteForm,
                      items: [...newQuoteForm.items, { id: newId, description: '', quantity: 1, unitPrice: 0 }]
                    });
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              </div>
              <div className="space-y-3">
                {newQuoteForm.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end bg-gray-50 p-3 rounded-lg">
                    <div className="col-span-5">
                      <Label className="text-xs font-medium text-gray-600">Description</Label>
                      <Input
                        placeholder="Ex: Licence logiciel"
                        value={item.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newItems = [...newQuoteForm.items];
                          newItems[index].description = e.target.value;
                          setNewQuoteForm({...newQuoteForm, items: newItems});
                        }}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs font-medium text-gray-600">Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newItems = [...newQuoteForm.items];
                          newItems[index].quantity = parseInt(e.target.value) || 1;
                          setNewQuoteForm({...newQuoteForm, items: newItems});
                        }}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs font-medium text-gray-600">Prix unitaire (€)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newItems = [...newQuoteForm.items];
                          newItems[index].unitPrice = parseFloat(e.target.value) || 0;
                          setNewQuoteForm({...newQuoteForm, items: newItems});
                        }}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2 flex items-end justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900 text-sm mt-1">
                          €{(item.quantity * item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                      {newQuoteForm.items.length > 1 && (
                        <button
                          onClick={() => {
                            setNewQuoteForm({
                              ...newQuoteForm,
                              items: newQuoteForm.items.filter((_, i) => i !== index)
                            });
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Montants */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">
                    €{newQuoteForm.items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">TVA</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={newQuoteForm.taxRate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuoteForm({...newQuoteForm, taxRate: e.target.value})}
                      className="w-20 text-right"
                    />
                    <span className="text-gray-600">%</span>
                    <span className="font-semibold">
                      €{((newQuoteForm.items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0) * parseInt(newQuoteForm.taxRate)) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total TTC</span>
                  <span className="font-bold text-lg text-blue-600">
                    €{(newQuoteForm.items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0) * (1 + parseInt(newQuoteForm.taxRate) / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="border-b pb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Conditions</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expiryDays" className="text-sm font-medium">Validité (jours)</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    placeholder="30"
                    value={newQuoteForm.expiryDays}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuoteForm({...newQuoteForm, expiryDays: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">Notes / Conditions spéciales</Label>
                  <textarea
                    id="notes"
                    placeholder="Ex: Paiement à 30 jours net, Délai de livraison 2 semaines..."
                    value={newQuoteForm.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewQuoteForm({...newQuoteForm, notes: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowNewQuote(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleCreateQuote} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Créer le devis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quote Preview Dialog */}
      {selectedQuote && (
        <Dialog open={showQuotePreview} onOpenChange={setShowQuotePreview}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Aperçu du devis {selectedQuote.quoteNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="bg-gray-50 p-4 rounded-lg border-l-4" style={{borderLeftColor: selectedQuote.customization.colors}}>
                <h3 className="font-semibold text-gray-900">{selectedQuote.company}</h3>
                <p className="text-sm text-gray-600">{selectedQuote.contact}</p>
              </div>

              {/* Quote Details */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Devis #</p>
                  <p className="text-gray-900 font-semibold">{selectedQuote.quoteNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Date</p>
                  <p className="text-gray-900">{new Date(selectedQuote.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Expiration</p>
                  <p className="text-gray-900">{new Date(selectedQuote.expiryDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700">Description</th>
                      <th className="px-4 py-2 text-center text-gray-700">Qté</th>
                      <th className="px-4 py-2 text-right text-gray-700">Prix</th>
                      <th className="px-4 py-2 text-right text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.description}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">€{item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">€{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-semibold">€{selectedQuote.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>TVA ({selectedQuote.taxRate}%)</span>
                  <span>€{((selectedQuote.totalAmount * selectedQuote.taxRate) / 100).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total TTC</span>
                  <span style={{color: selectedQuote.customization.colors}}>
                    €{(selectedQuote.totalAmount * (1 + selectedQuote.taxRate / 100)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="text-gray-600 font-medium mb-2">Conditions de paiement</p>
                <p className="text-gray-700">{selectedQuote.customization.terms}</p>
              </div>

              {selectedQuote.notes && (
                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <p className="text-gray-600 font-medium mb-2">Notes</p>
                  <p className="text-gray-700">{selectedQuote.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowQuotePreview(false)} className="flex-1">
                Fermer
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Télécharger PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Customization Dialog */}
      {selectedQuote && (
        <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Personnaliser le devis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="colors" className="text-sm font-medium">Couleur principale</Label>
                <div className="mt-2 flex gap-2">
                  {['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'].map(color => (
                    <button
                      key={color}
                      onClick={() => setCustomForm({...customForm, colors: color})}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        customForm.colors === color ? 'border-gray-800' : 'border-gray-200'
                      }`}
                      style={{backgroundColor: color}}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="terms" className="text-sm font-medium">Conditions de paiement</Label>
                <textarea
                  id="terms"
                  placeholder="Ex: Paiement à 30 jours net"
                  value={customForm.terms}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomForm({...customForm, terms: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowCustomization(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleApplyCustomization} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Appliquer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Follow-up Dialog */}
      {selectedQuote && (
        <Dialog open={showFollowUp} onOpenChange={setShowFollowUp}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Relance - {selectedQuote.quoteNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <p className="text-gray-600 font-medium">Devis envoyé à:</p>
                <p className="text-gray-900 font-semibold mt-1">{selectedQuote.company} - {selectedQuote.contact}</p>
              </div>
              <div>
                <Label htmlFor="date" className="text-sm font-medium">Date de relance</Label>
                <Input
                  id="date"
                  type="date"
                  value={followUpForm.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowUpForm({...followUpForm, date: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium">Message de relance</Label>
                <textarea
                  id="message"
                  placeholder="Bonjour, vous trouverez ci-joint le devis..."
                  value={followUpForm.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFollowUpForm({...followUpForm, message: e.target.value})}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowFollowUp(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handleSendFollowUp} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Envoyer relance
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Convert to Signature Dialog */}
      {selectedQuote && (
        <Dialog open={showConvertToSignature} onOpenChange={setShowConvertToSignature}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Convertir en signature</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Dévis accepté</p>
                <p className="text-gray-900 font-semibold mt-1">{selectedQuote.quoteNumber}</p>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Créer un contrat de signature</p>
                    <p className="text-sm text-gray-600">Le devis sera converti en document signable</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <PenTool className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Signature électronique</p>
                    <p className="text-sm text-gray-600">Client et prestataire signent en ligne</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contrat validé</p>
                    <p className="text-sm text-gray-600">Archivage automatique dans les documents</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowConvertToSignature(false)} className="flex-1">
                  Annuler
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Convertir en signature
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Quotes;
