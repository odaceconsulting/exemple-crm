import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { 
  Mail, 
  Plus, 
  Search,
  Send,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  Share2,
  BarChart3,
  Target,
  Grid3x3,
  List,
  Kanban,
  Edit2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Campaign {
  id: number;
  name: string;
  type: 'email' | 'social' | 'sms' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  reach: number;
  engagement: number;
  conversions: number;
  roi: number;
}

const Marketing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: 'Lancement Nouveau Produit',
      type: 'email',
      status: 'active',
      startDate: '2026-01-15',
      endDate: '2026-02-15',
      budget: 15000,
      spent: 8500,
      reach: 45000,
      engagement: 3200,
      conversions: 145,
      roi: 285
    },
    {
      id: 2,
      name: 'Campagne LinkedIn Q1',
      type: 'social',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      budget: 25000,
      spent: 12000,
      reach: 125000,
      engagement: 8500,
      conversions: 320,
      roi: 420
    },
    {
      id: 3,
      name: 'Newsletter Mensuelle',
      type: 'email',
      status: 'completed',
      startDate: '2025-12-01',
      endDate: '2025-12-31',
      budget: 5000,
      spent: 4800,
      reach: 35000,
      engagement: 2100,
      conversions: 85,
      roi: 180
    },
    {
      id: 4,
      name: 'WhatsApp Business',
      type: 'whatsapp',
      status: 'active',
      startDate: '2026-01-10',
      budget: 8000,
      spent: 3200,
      reach: 12000,
      engagement: 4500,
      conversions: 95,
      roi: 340
    },
    {
      id: 5,
      name: 'Campagne SMS Promo',
      type: 'sms',
      status: 'scheduled',
      startDate: '2026-02-01',
      endDate: '2026-02-07',
      budget: 6000,
      spent: 0,
      reach: 0,
      engagement: 0,
      conversions: 0,
      roi: 0
    },
    {
      id: 6,
      name: 'Webinar Series',
      type: 'email',
      status: 'draft',
      startDate: '2026-03-01',
      budget: 10000,
      spent: 0,
      reach: 0,
      engagement: 0,
      conversions: 0,
      roi: 0
    }
  ]);

  const handleEditCampaign = () => {
    if (selectedCampaign) {
      setEditFormData({ ...selectedCampaign });
      setEditDialogOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      if (!editFormData.name || !editFormData.budget || !editFormData.startDate) {
        alert('Veuillez remplir tous les champs requis!');
        return;
      }
      setCampaigns(campaigns.map(c => c.id === editFormData.id ? editFormData : c));
      setSelectedCampaign(editFormData);
      console.log('Campaign updated:', editFormData);
      alert('Campagne modifiée avec succès!');
      setEditDialogOpen(false);
      setEditFormData(null);
    }
  };

  const performanceData = [
    { month: 'Jan', reach: 45000, conversions: 145 },
    { month: 'Fév', reach: 52000, conversions: 180 },
    { month: 'Mar', reach: 48000, conversions: 165 },
    { month: 'Avr', reach: 61000, conversions: 210 },
    { month: 'Mai', reach: 55000, conversions: 195 },
    { month: 'Jun', reach: 67000, conversions: 240 }
  ];

  const channelData = [
    { name: 'Email', value: campaigns.filter(c => c.type === 'email').length, color: '#3b82f6' },
    { name: 'Social', value: campaigns.filter(c => c.type === 'social').length, color: '#8b5cf6' },
    { name: 'SMS', value: campaigns.filter(c => c.type === 'sms').length, color: '#f59e0b' },
    { name: 'WhatsApp', value: campaigns.filter(c => c.type === 'whatsapp').length, color: '#10b981' }
  ];

  const roiData = [
    { campaign: 'Email', roi: 285 },
    { campaign: 'Social', roi: 420 },
    { campaign: 'WhatsApp', roi: 340 },
    { campaign: 'SMS', roi: 180 }
  ];

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'scheduled':
        return 'Planifiée';
      case 'completed':
        return 'Terminée';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'social':
        return <Share2 className="h-5 w-5" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600';
      case 'social':
        return 'bg-purple-100 text-purple-600';
      case 'sms':
        return 'bg-orange-100 text-orange-600';
      case 'whatsapp':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const averageROI = campaigns.filter(c => c.roi > 0).length > 0
    ? Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.filter(c => c.roi > 0).length)
    : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Marketing</h1>
          <p className="text-gray-500 mt-1">Gérez vos campagnes et analysez les performances</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700">
              <Plus className="h-4 w-4" />
              Nouvelle Campagne
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg md:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Créer une Campagne</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="campaign-name">Nom de la campagne *</Label>
                <Input id="campaign-name" placeholder="Lancement Nouveau Produit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de campagne *</Label>
                <select id="type" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="email">Email</option>
                  <option value="social">Réseaux Sociaux</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select id="status" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="draft">Brouillon</option>
                  <option value="scheduled">Planifiée</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début *</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin</Label>
                <Input id="end-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (€)</Label>
                <Input id="budget" type="number" placeholder="10000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Audience cible</Label>
                <Input id="target" placeholder="Prospects qualifiés" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Objectifs et détails de la campagne..."
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="message">Message principal</Label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contenu du message à envoyer..."
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
                Créer et lancer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Portée Totale</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {(totalReach / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-600 mt-1">Contacts atteints</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Conversions</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{totalConversions}</p>
                <p className="text-sm text-green-600 mt-1">Leads générés</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">ROI Moyen</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{averageROI}%</p>
                <p className="text-sm text-purple-600 mt-1">Retour investissement</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Budget Total</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{(totalBudget / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-600 mt-1">Alloué</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Dépensé</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{(totalSpent / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round((totalSpent / totalBudget) * 100)}%
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Performance des Campagnes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="reach" stroke="#3b82f6" strokeWidth={2} name="Portée" />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Canaux Marketing</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {channelData.map((item, index) => (
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

      {/* ROI Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>ROI par Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="campaign" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="roi" fill="#8b5cf6" name="ROI (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search and View Toggle */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une campagne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Vue Grille">
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Vue Liste">
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Vue Kanban">
                <Kanban className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`${getTypeColor(campaign.type)} p-2 rounded-lg`}>
                      {getTypeIcon(campaign.type)}
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusLabel(campaign.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Portée</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {campaign.reach > 0 ? `${(campaign.reach / 1000).toFixed(0)}K` : '-'}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Conversions</p>
                  <p className="text-lg font-semibold text-green-900">
                    {campaign.conversions > 0 ? campaign.conversions : '-'}
                  </p>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium text-gray-900">
                    €{campaign.spent.toLocaleString()} / €{campaign.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* ROI */}
              {campaign.roi > 0 && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">ROI</span>
                  </div>
                  <span className="text-lg font-semibold text-purple-900">
                    {campaign.roi}%
                  </span>
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(campaign.startDate).toLocaleDateString('fr-FR')}
                  {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString('fr-FR')}`}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setShowCampaignDialog(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Voir
                </button>
                <button
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setShowSendDialog(true);
                  }}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Envoyer
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
      {viewMode === 'list' && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campagne</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portée</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`${getTypeColor(campaign.type)} p-2 rounded-lg`}>
                            {getTypeIcon(campaign.type)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.type === 'email' && 'Email'}
                        {campaign.type === 'social' && 'Réseaux Sociaux'}
                        {campaign.type === 'sms' && 'SMS'}
                        {campaign.type === 'whatsapp' && 'WhatsApp'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(campaign.status)}>
                          {getStatusLabel(campaign.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        €{campaign.spent.toLocaleString()} / €{campaign.budget.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.reach > 0 ? `${(campaign.reach / 1000).toFixed(0)}K` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.conversions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${campaign.roi > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {campaign.roi > 0 ? `${campaign.roi}%` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowCampaignDialog(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium">
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="p-12 text-center">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune campagne trouvée</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Campaigns Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['draft', 'scheduled', 'active', 'completed'].map((status) => {
            const statusCampaigns = filteredCampaigns.filter(c => c.status === status as any);
            const statusLabels = {
              draft: 'Brouillons',
              scheduled: 'Programmées',
              active: 'Actives',
              completed: 'Complétées'
            };
            const statusColors = {
              draft: 'bg-gray-50 border-gray-200',
              scheduled: 'bg-blue-50 border-blue-200',
              active: 'bg-green-50 border-green-200',
              completed: 'bg-purple-50 border-purple-200'
            };
            const iconColors = {
              draft: 'text-gray-600',
              scheduled: 'text-blue-600',
              active: 'text-green-600',
              completed: 'text-purple-600'
            };

            return (
              <div key={status} className={`${statusColors[status as keyof typeof statusColors]} border-2 rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-3 w-3 rounded-full ${iconColors[status as keyof typeof iconColors]}`}></div>
                  <h3 className="font-bold text-gray-900">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </h3>
                  <span className="ml-auto bg-white px-2 py-1 rounded text-xs font-bold text-gray-700">
                    {statusCampaigns.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusCampaigns.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucune campagne
                    </div>
                  ) : (
                    statusCampaigns.map((campaign) => (
                      <Card key={campaign.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white cursor-move">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`${getTypeColor(campaign.type)} p-2 rounded-lg flex-shrink-0`}>
                              {getTypeIcon(campaign.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                                {campaign.name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 py-2 border-t border-gray-200 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Portée:</span>
                              <span className="font-medium text-gray-900">
                                {campaign.reach > 0 ? `${(campaign.reach / 1000).toFixed(0)}K` : '-'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conversions:</span>
                              <span className="font-medium text-gray-900">{campaign.conversions}</span>
                            </div>
                            {campaign.roi > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">ROI:</span>
                                <span className="font-medium text-green-600">{campaign.roi}%</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Budget:</span>
                              <span className="font-medium text-gray-900">
                                €{campaign.spent.toLocaleString()} / €{campaign.budget.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setShowCampaignDialog(true);
                            }}
                            className="w-full mt-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium">
                            Voir détails
                          </button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

        {/* Campaign Details Dialog */}
        {selectedCampaign && (
          <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
            <DialogContent className="max-w-lg md:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Détails de la campagne</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`${getTypeColor(selectedCampaign.type)} p-2 rounded-lg`}>{getTypeIcon(selectedCampaign.type)}</div>
                      <Badge className={getStatusColor(selectedCampaign.status)}>{getStatusLabel(selectedCampaign.status)}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Budget: €{selectedCampaign.budget.toLocaleString()}</div>
                    <div>Dépensé: €{selectedCampaign.spent.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Portée</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCampaign.reach > 0 ? `${(selectedCampaign.reach / 1000).toFixed(0)}K` : '-'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Conversions</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCampaign.conversions > 0 ? selectedCampaign.conversions : '-'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Engagement</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCampaign.engagement}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">ROI</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedCampaign.roi}%</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Dates</h3>
                  <p className="text-sm text-gray-600 mt-1">{new Date(selectedCampaign.startDate).toLocaleDateString('fr-FR')}{selectedCampaign.endDate ? ` - ${new Date(selectedCampaign.endDate).toLocaleDateString('fr-FR')}` : ''}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Résumé</h3>
                  <p className="text-sm text-gray-600 mt-1">Contenu et objectifs de la campagne (données de démonstration).</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>Fermer</Button>
                <Button onClick={handleEditCampaign} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <Edit2 className="h-4 w-4" />
                  Modifier
                </Button>
                <Button onClick={() => { setShowCampaignDialog(false); setShowSendDialog(true); }}>Envoyer</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Send Campaign Dialog (simulate) */}
        {selectedCampaign && (
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Envoyer la campagne</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <p className="text-sm text-gray-700">Voulez-vous envoyer la campagne "{selectedCampaign.name}" maintenant ?</p>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setShowSendDialog(false)}>Annuler</Button>
                <Button onClick={() => { setShowSendDialog(false); alert(`Campagne '${selectedCampaign.name}' envoyée (simulation)`); }}>Envoyer maintenant</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Campaign Dialog */}
        {editFormData && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-lg md:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Modifier la campagne</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
                <div>
                  <Label htmlFor="edit-campaign-name" className="text-sm mb-1 block">Nom de la campagne</Label>
                  <Input
                    id="edit-campaign-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-campaign-type" className="text-sm mb-1 block">Type</Label>
                    <Select value={editFormData.type} onValueChange={(value) => setEditFormData({ ...editFormData, type: value as any })}>
                      <SelectTrigger id="edit-campaign-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-campaign-status" className="text-sm mb-1 block">Statut</Label>
                    <Select value={editFormData.status} onValueChange={(value) => setEditFormData({ ...editFormData, status: value as any })}>
                      <SelectTrigger id="edit-campaign-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="scheduled">Planifiée</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-campaign-budget" className="text-sm mb-1 block">Budget (€)</Label>
                    <Input
                      id="edit-campaign-budget"
                      type="number"
                      value={editFormData.budget}
                      onChange={(e) => setEditFormData({ ...editFormData, budget: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-campaign-spent" className="text-sm mb-1 block">Dépensé (€)</Label>
                    <Input
                      id="edit-campaign-spent"
                      type="number"
                      value={editFormData.spent}
                      onChange={(e) => setEditFormData({ ...editFormData, spent: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-campaign-startDate" className="text-sm mb-1 block">Date de début</Label>
                    <Input
                      id="edit-campaign-startDate"
                      type="date"
                      value={editFormData.startDate}
                      onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-campaign-endDate" className="text-sm mb-1 block">Date de fin</Label>
                    <Input
                      id="edit-campaign-endDate"
                      type="date"
                      value={editFormData.endDate || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-campaign-reach" className="text-sm mb-1 block">Portée</Label>
                    <Input
                      id="edit-campaign-reach"
                      type="number"
                      value={editFormData.reach}
                      onChange={(e) => setEditFormData({ ...editFormData, reach: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-campaign-engagement" className="text-sm mb-1 block">Engagement</Label>
                    <Input
                      id="edit-campaign-engagement"
                      type="number"
                      value={editFormData.engagement}
                      onChange={(e) => setEditFormData({ ...editFormData, engagement: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-campaign-conversions" className="text-sm mb-1 block">Conversions</Label>
                    <Input
                      id="edit-campaign-conversions"
                      type="number"
                      value={editFormData.conversions}
                      onChange={(e) => setEditFormData({ ...editFormData, conversions: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-campaign-roi" className="text-sm mb-1 block">ROI (%)</Label>
                  <Input
                    id="edit-campaign-roi"
                    type="number"
                    value={editFormData.roi}
                    onChange={(e) => setEditFormData({ ...editFormData, roi: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1">Annuler</Button>
                <Button onClick={handleSaveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
};

export default Marketing;
