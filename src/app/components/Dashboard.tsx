import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Target,
  Clock,
  Search,
  Filter,
  X,
  BarChart3,
  Award,
  GripVertical
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const [showNewOpportunity, setShowNewOpportunity] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  
  const [opportunityForm, setOpportunityForm] = useState({
    title: '',
    company: '',
    value: '',
    closeDate: ''
  });

  // Filter states
  const [filters, setFilters] = useState({
    searchQuery: '',
    type: 'all',
    status: 'all',
    dateRange: 'all',
    minValue: '',
    maxValue: ''
  });

  const [activeFilters, setActiveFilters] = useState(false);
  const handleCreateOpportunity = () => {
    if (opportunityForm.title && opportunityForm.company) {
      // Store the new opportunity in localStorage for Pipeline to retrieve
      const newOpportunity = {
        id: Date.now(),
        title: opportunityForm.title,
        company: opportunityForm.company,
        value: parseFloat(opportunityForm.value) || 0,
        probability: 20,
        stage: 'prospection',
        contact: '',
        closeDate: opportunityForm.closeDate || new Date().toISOString().split('T')[0],
        priority: 'medium' as const
      };
      
      const existingOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
      existingOpportunities.push(newOpportunity);
      localStorage.setItem('opportunities', JSON.stringify(existingOpportunities));
      
      setShowNewOpportunity(false);
      setOpportunityForm({ title: '', company: '', value: '', closeDate: '' });
      alert('Opportunité créée avec succès !');
    } else {
      alert('Veuillez remplir les champs requis (Titre et Entreprise)');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      type: 'all',
      status: 'all',
      dateRange: 'all',
      minValue: '',
      maxValue: ''
    });
    setActiveFilters(false);
  };

  const hasActiveFilters = filters.searchQuery !== '' || filters.type !== 'all' || filters.status !== 'all' || filters.dateRange !== 'all' || filters.minValue !== '' || filters.maxValue !== '';

  // KPI Data
  const kpiData = [
    {
      title: 'Chiffre d\'Affaires',
      value: '€245,750',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Nouveaux Leads',
      value: '142',
      change: '+8.2%',
      trend: 'up',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Taux de Conversion',
      value: '24.8%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Clients Actifs',
      value: '86',
      change: '+5.4%',
      trend: 'up',
      icon: Building2,
      color: 'bg-orange-500'
    }
  ];

  // Sales Data
  const salesData = [
    { month: 'Jan', value: 45000 },
    { month: 'Fév', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Avr', value: 61000 },
    { month: 'Mai', value: 55000 },
    { month: 'Jun', value: 67000 }
  ];

  // Pipeline Data
  const pipelineData = [
    { name: 'Prospection', value: 35, color: '#3b82f6' },
    { name: 'Qualification', value: 28, color: '#8b5cf6' },
    { name: 'Négociation', value: 22, color: '#f59e0b' },
    { name: 'Conclusion', value: 15, color: '#10b981' }
  ];

  // Activities Data
  const activitiesData = [
    { day: 'Lun', meetings: 8, calls: 15 },
    { day: 'Mar', meetings: 12, calls: 18 },
    { day: 'Mer', meetings: 10, calls: 20 },
    { day: 'Jeu', meetings: 15, calls: 22 },
    { day: 'Ven', meetings: 9, calls: 16 }
  ];

  // Recent Activities
  const recentActivities = [
    { type: 'meeting', client: 'Acme Corp', action: 'Réunion de présentation', time: 'Il y a 2h', user: 'Marie Dupont' },
    { type: 'call', client: 'TechStart SAS', action: 'Appel de suivi', time: 'Il y a 4h', user: 'Jean Martin' },
    { type: 'email', client: 'Global Industries', action: 'Envoi de devis', time: 'Il y a 5h', user: 'Sophie Bernard' },
    { type: 'task', client: 'Innovation Labs', action: 'Validation contrat', time: 'Il y a 1j', user: 'Pierre Leclerc' }
  ];

  // Upcoming Meetings
  const upcomingMeetings = [
    { client: 'Digital Solutions', subject: 'Démonstration produit', time: '14:00', date: 'Aujourd\'hui' },
    { client: 'Smart Tech', subject: 'Négociation contrat', time: '10:30', date: 'Demain' },
    { client: 'Future Corp', subject: 'Suivi projet', time: '15:00', date: 'Demain' }
  ];

  // RH Data - Suivi collaborateurs
  const rhData = [
    { month: 'Jan', actifs: 45, enCongé: 8, inactifs: 2 },
    { month: 'Fév', actifs: 46, enCongé: 7, inactifs: 2 },
    { month: 'Mar', actifs: 47, enCongé: 6, inactifs: 2 },
    { month: 'Avr', actifs: 48, enCongé: 5, inactifs: 2 },
    { month: 'Mai', actifs: 50, enCongé: 4, inactifs: 1 },
    { month: 'Jun', actifs: 52, enCongé: 3, inactifs: 0 }
  ];

  // Clients Distribution
  const clientsDistribution = [
    { name: 'PME', value: 32, color: '#3b82f6' },
    { name: 'ETI', value: 28, color: '#8b5cf6' },
    { name: 'Startups', value: 18, color: '#f59e0b' },
    { name: 'Entreprises', value: 22, color: '#10b981' }
  ];

  // Team Performance Data
  const teamPerformanceData = [
    { name: 'Marie D.', ca: 45000, leads: 24, conversion: 28 },
    { name: 'Jean M.', ca: 38000, leads: 18, conversion: 22 },
    { name: 'Sophie B.', ca: 52000, leads: 31, conversion: 32 },
    { name: 'Pierre L.', ca: 35000, leads: 15, conversion: 20 },
    { name: 'Alice R.', ca: 42000, leads: 22, conversion: 25 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de votre activité commerciale</p>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-blue-50">
        <CardContent className="p-6">
          {/* Main Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, entreprise, contact..."
                value={filters.searchQuery}
                onChange={(e) => {
                  setFilters({...filters, searchQuery: e.target.value});
                  setActiveFilters(true);
                }}
                className="pl-10 bg-white border-2 border-gray-300 focus:border-indigo-500 h-11"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all border-2 ${
                showFilters 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filtres</span>
              {hasActiveFilters && <span className="ml-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">!</span>}
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all">
                <X className="h-4 w-4" />
                <span className="font-medium">Réinitialiser</span>
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              {/* Type Filter */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Type</Label>
                <select
                  value={filters.type}
                  onChange={(e) => {
                    setFilters({...filters, type: e.target.value});
                    setActiveFilters(true);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:outline-none bg-white">
                  <option value="all">Tous les types</option>
                  <option value="companies">Entreprises</option>
                  <option value="contacts">Contacts</option>
                  <option value="opportunities">Opportunités</option>
                  <option value="projects">Projets</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Statut</Label>
                <select
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({...filters, status: e.target.value});
                    setActiveFilters(true);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:outline-none bg-white">
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Complété</option>
                  <option value="on-hold">Suspendu</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Période</Label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => {
                    setFilters({...filters, dateRange: e.target.value});
                    setActiveFilters(true);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:outline-none bg-white">
                  <option value="all">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                </select>
              </div>

              {/* Min Value Filter */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Montant min (€)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minValue}
                  onChange={(e) => {
                    setFilters({...filters, minValue: e.target.value});
                    setActiveFilters(true);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Max Value Filter */}
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">Montant max (€)</Label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={filters.maxValue}
                  onChange={(e) => {
                    setFilters({...filters, maxValue: e.target.value});
                    setActiveFilters(true);
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-indigo-500 rounded">
              <p className="text-sm text-indigo-900">
                <span className="font-semibold">Filtres actifs:</span> 
                {filters.searchQuery && ` Recherche: "${filters.searchQuery}"`}
                {filters.type !== 'all' && ` • Type: ${filters.type}`}
                {filters.status !== 'all' && ` • Statut: ${filters.status}`}
                {filters.dateRange !== 'all' && ` • Période: ${filters.dateRange}`}
                {filters.minValue && ` • Min: ${filters.minValue}€`}
                {filters.maxValue && ` • Max: ${filters.maxValue}€`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Opportunity Dialog */}
      <Dialog open={showNewOpportunity} onOpenChange={setShowNewOpportunity}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle opportunité</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Titre de l'opportunité *</Label>
              <Input
                id="title"
                placeholder="Ex: Vente logiciel X"
                value={opportunityForm.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpportunityForm({...opportunityForm, title: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-sm font-medium">Entreprise *</Label>
              <Input
                id="company"
                placeholder="Ex: Acme Corp"
                value={opportunityForm.company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpportunityForm({...opportunityForm, company: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="value" className="text-sm font-medium">Montant estimé (€)</Label>
              <Input
                id="value"
                type="number"
                placeholder="50000"
                value={opportunityForm.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpportunityForm({...opportunityForm, value: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="closeDate" className="text-sm font-medium">Date de clôture prévue</Label>
              <Input
                id="closeDate"
                type="date"
                value={opportunityForm.closeDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpportunityForm({...opportunityForm, closeDate: e.target.value})}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowNewOpportunity(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleCreateOpportunity} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Créer l'opportunité
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${kpi.color} bg-opacity-90`} aria-hidden>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">{kpi.title}</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-semibold text-gray-900">{kpi.value}</span>
                      <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{kpi.change}</span>
                    </div>
                    <p className="text-xs text-gray-400">vs mois dernier</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <section aria-labelledby="sales-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="sales-heading" className="text-xl font-semibold text-gray-900">Ventes et Pipeline</h2>
            <p className="text-sm text-gray-500">Suivi du chiffre d'affaires et répartition du pipeline</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `€${value.toLocaleString()}`}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Pipeline Commercial</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pipelineData.map((item, index) => (
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
      </section>

      {/* Activities and Meetings Row */}
      <section aria-labelledby="activities-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="activities-heading" className="text-xl font-semibold text-gray-900">Activités & Agenda</h2>
            <p className="text-sm text-gray-500">Réunions, appels et tâches récentes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Activités de la Semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activitiesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="meetings" fill="#3b82f6" name="Réunions" radius={[8, 8, 0, 0]} />
                <Bar dataKey="calls" fill="#8b5cf6" name="Appels" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Rendez-vous à venir</CardTitle>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{meeting.client}</p>
                    <p className="text-sm text-gray-600">{meeting.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{meeting.date} à {meeting.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-lg transition-colors">
                Voir tout l'agenda
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      </section>

      {/* Recent Activities */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Activités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                <div className={`p-3 rounded-lg ${
                  activity.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'call' ? 'bg-green-100 text-green-600' :
                  activity.type === 'email' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {activity.type === 'meeting' && <Users className="h-5 w-5" />}
                  {activity.type === 'call' && <TrendingUp className="h-5 w-5" />}
                  {activity.type === 'email' && <FileText className="h-5 w-5" />}
                  {activity.type === 'task' && <Target className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.client}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.user}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics Section */}
      <section aria-labelledby="analytics-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="analytics-heading" className="text-xl font-semibold text-gray-900">Analytiques Avancées</h2>
            <p className="text-sm text-gray-500">Suivi des RHs, répartition clients et performance équipe</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RH Tracking Chart */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-move" 
            draggable 
            onDragStart={() => setDraggedWidget('rh')}
            onDragEnd={() => setDraggedWidget(null)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Suivi RHs
                </CardTitle>
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rhData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="actifs" stroke="#10b981" strokeWidth={2} name="Actifs" />
                  <Line type="monotone" dataKey="enCongé" stroke="#f59e0b" strokeWidth={2} name="En congé" />
                  <Line type="monotone" dataKey="inactifs" stroke="#ef4444" strokeWidth={2} name="Inactifs" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Clients Distribution */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-move"
            draggable 
            onDragStart={() => setDraggedWidget('clients')}
            onDragEnd={() => setDraggedWidget(null)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Répartition Clients
                </CardTitle>
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientsDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {clientsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {clientsDistribution.map((item, index) => (
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

        {/* Team Performance */}
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-move"
          draggable 
          onDragStart={() => setDraggedWidget('performance')}
          onDragEnd={() => setDraggedWidget(null)}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                Performance Équipe
              </CardTitle>
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Collaborateur</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">CA</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Leads</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamPerformanceData.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="py-4 px-4 text-sm text-right text-gray-600">€{member.ca.toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm text-right text-gray-600">{member.leads}</td>
                      <td className="py-4 px-4 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${member.conversion}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-900 font-semibold">{member.conversion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
