import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { 
  Building2, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Filter,
  MoreVertical,
  Grid3x3,
  List,
  Kanban,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';

interface Company {
  id: number;
  name: string;
  industry: string;
  revenue: string;
  employees: string;
  status: 'active' | 'prospect' | 'inactive';
  phone: string;
  email: string;
  website: string;
  address: string;
  contactPerson: string;
  lastContact: string;
}

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [openActionsFor, setOpenActionsFor] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    industry: '',
    revenue: '',
    employees: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    contactPerson: '',
    status: 'prospect' as 'active' | 'prospect' | 'inactive'
  });

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Acme Corporation',
      industry: 'Technologie',
      revenue: '€5.2M',
      employees: '120',
      status: 'active',
      phone: '+33 1 23 45 67 89',
      email: 'contact@acme-corp.fr',
      website: 'www.acme-corp.fr',
      address: '15 Avenue des Champs-Élysées, 75008 Paris',
      contactPerson: 'Jean Dupont',
      lastContact: '2026-01-20'
    },
    {
      id: 2,
      name: 'TechStart SAS',
      industry: 'Logiciel',
      revenue: '€2.8M',
      employees: '45',
      status: 'active',
      phone: '+33 1 34 56 78 90',
      email: 'info@techstart.fr',
      website: 'www.techstart.fr',
      address: '28 Rue de Rivoli, 75004 Paris',
      contactPerson: 'Marie Martin',
      lastContact: '2026-01-18'
    },
    {
      id: 3,
      name: 'Global Industries',
      industry: 'Manufacturing',
      revenue: '€15.6M',
      employees: '350',
      status: 'active',
      phone: '+33 2 45 67 89 01',
      email: 'contact@global-ind.fr',
      website: 'www.global-industries.fr',
      address: '42 Boulevard Haussmann, 75009 Paris',
      contactPerson: 'Pierre Leclerc',
      lastContact: '2026-01-15'
    },
    {
      id: 4,
      name: 'Innovation Labs',
      industry: 'R&D',
      revenue: '€3.4M',
      employees: '75',
      status: 'prospect',
      phone: '+33 3 56 78 90 12',
      email: 'hello@innolabs.fr',
      website: 'www.innovation-labs.fr',
      address: '89 Rue de la Paix, 75002 Paris',
      contactPerson: 'Sophie Bernard',
      lastContact: '2026-01-10'
    },
    {
      id: 5,
      name: 'Digital Solutions',
      industry: 'Conseil',
      revenue: '€8.1M',
      employees: '180',
      status: 'active',
      phone: '+33 4 67 89 01 23',
      email: 'contact@digitalsol.fr',
      website: 'www.digital-solutions.fr',
      address: '56 Avenue Montaigne, 75008 Paris',
      contactPerson: 'Luc Dubois',
      lastContact: '2026-01-21'
    },
    {
      id: 6,
      name: 'Smart Tech SARL',
      industry: 'IoT',
      revenue: '€1.9M',
      employees: '32',
      status: 'prospect',
      phone: '+33 5 78 90 12 34',
      email: 'info@smarttech.fr',
      website: 'www.smart-tech.fr',
      address: '123 Rue de Vaugirard, 75015 Paris',
      contactPerson: 'Alice Rousseau',
      lastContact: '2026-01-08'
    }
  ]);

  const handleDeleteCompany = (id: number) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      setCompanies(companies.filter(c => c.id !== deleteTarget));
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setShowCompanyDetails(false);
    }
  };

  const handleEditCompany = () => {
    if (selectedCompany && editForm.name && editForm.email) {
      const updatedCompanies = companies.map(c =>
        c.id === selectedCompany.id
          ? {
              ...c,
              ...editForm,
            }
          : c
      );
      setCompanies(updatedCompanies);
      setIsEditingCompany(false);
      setShowCompanyDetails(false);
      setSelectedCompany(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              Compagnies
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos entreprises clientes et prospects</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 border-2 border-blue-700 shadow-lg hover:shadow-xl font-semibold">
                <Plus className="h-5 w-5" />
                <span>Nouvelle Compagnie</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg md:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Ajouter une Compagnie</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise *</Label>
                  <Input id="company-name" placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Secteur d'activité</Label>
                  <Input id="industry" placeholder="Technologie" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Chiffre d'affaires</Label>
                  <Input id="revenue" placeholder="€5M" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Nombre d'employés</Label>
                  <Input id="employees" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+33 1 23 45 67 89" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@entreprise.fr" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input id="website" placeholder="www.entreprise.fr" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="123 Avenue des Champs-Élysées, Paris" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-person">Contact principal</Label>
                  <Input id="contact-person" placeholder="Jean Dupont" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select id="status" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="prospect">Prospect</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Créer la compagnie
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Compagnies</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{companies.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Actifs</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{companies.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Globe className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Prospects</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{companies.filter(c => c.status === 'prospect').length}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Search className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Inactifs</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{companies.filter(c => c.status === 'inactive').length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Filter className="h-6 w-6 text-red-600" />
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
            placeholder="Rechercher une compagnie par nom ou secteur..."
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
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-all border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowCompanyDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedCompany(company);
                          setEditForm({
                            name: company.name,
                            industry: company.industry,
                            revenue: company.revenue,
                            employees: company.employees,
                            phone: company.phone,
                            email: company.email,
                            website: company.website,
                            address: company.address,
                            contactPerson: company.contactPerson,
                            status: company.status
                          });
                          setIsEditingCompany(true);
                          setShowCompanyDetails(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteCompany(company.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Secteur</span>
                    <span className="font-medium text-gray-900">{company.industry}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Chiffre d'affaires</span>
                    <span className="font-medium text-gray-900">{company.revenue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Employés</span>
                    <span className="font-medium text-gray-900">{company.employees}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">{company.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{company.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    company.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    company.status === 'prospect' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {company.status === 'active' ? '🟢 Actif' : 
                     company.status === 'prospect' ? '🟡 Prospect' : 
                     '🔴 Inactif'}
                  </span>
                  {company.lastContact && (
                    <span className="text-xs text-gray-500">Contacté: {company.lastContact}</span>
                  )}
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
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Compagnie</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Secteur</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Chiffre d'affaires</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Employés</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={company.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{company.name}</p>
                          <p className="text-xs text-gray-500">{company.website}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{company.industry}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{company.revenue}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{company.employees}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{company.contactPerson}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{company.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        company.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        company.status === 'prospect' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {company.status === 'active' ? '🟢 Actif' : 
                         company.status === 'prospect' ? '🟡 Prospect' : 
                         '🔴 Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu open={openActionsFor === company.id} onOpenChange={(open) => setOpenActionsFor(open ? company.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-200 rounded-lg inline-flex">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedCompany(company);
                              setShowCompanyDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedCompany(company);
                              setEditForm({
                                name: company.name,
                                industry: company.industry,
                                revenue: company.revenue,
                                employees: company.employees,
                                phone: company.phone,
                                email: company.email,
                                website: company.website,
                                address: company.address,
                                contactPerson: company.contactPerson,
                                status: company.status
                              });
                              setIsEditingCompany(true);
                              setShowCompanyDetails(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Éditer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCompany(company.id)}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['active', 'prospect', 'inactive'].map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'active' ? 'bg-emerald-500' :
                  status === 'prospect' ? 'bg-amber-500' :
                  'bg-gray-500'
                }`}></div>
                <h3 className="font-bold text-gray-900">
                  {status === 'active' ? '🟢 Actifs' :
                   status === 'prospect' ? '🟡 Prospects' :
                   '🔴 Inactifs'}
                </h3>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                  {companies.filter(c => c.status === status).length}
                </span>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {companies.filter(c => c.status === status).map((company) => (
                  <Card key={company.id} className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-all bg-white cursor-move">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{company.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{company.industry}</p>
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
                                setSelectedCompany(company);
                                setShowCompanyDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedCompany(company);
                                setEditForm({
                                  name: company.name,
                                  industry: company.industry,
                                  revenue: company.revenue,
                                  employees: company.employees,
                                  phone: company.phone,
                                  email: company.email,
                                  website: company.website,
                                  address: company.address,
                                  contactPerson: company.contactPerson,
                                  status: company.status
                                });
                                setIsEditingCompany(true);
                                setShowCompanyDetails(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Éditer
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCompany(company.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">CA:</span>
                          <span className="text-xs font-medium text-gray-900">{company.revenue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Employés:</span>
                          <span className="text-xs font-medium text-gray-900">{company.employees}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600 truncate">{company.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {companies.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune compagnie trouvée</p>
          </CardContent>
        </Card>
      )}

      {/* COMPANY DETAILS DIALOG */}
      <Dialog open={showCompanyDetails} onOpenChange={setShowCompanyDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditingCompany ? 'Modifier la compagnie' : 'Détails de la compagnie'}
            </DialogTitle>
          </DialogHeader>

          {!isEditingCompany && selectedCompany ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
                  <p className="text-gray-600">{selectedCompany.industry}</p>
                  <Badge className={`mt-2 ${
                    selectedCompany.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    selectedCompany.status === 'prospect' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedCompany.status === 'active' ? '🟢 Actif' : 
                     selectedCompany.status === 'prospect' ? '🟡 Prospect' : 
                     '🔴 Inactif'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold">Chiffre d'affaires</p>
                  <p className="text-gray-900 font-medium">{selectedCompany.revenue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold">Employés</p>
                  <p className="text-gray-900 font-medium">{selectedCompany.employees}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold">Contact principal</p>
                  <p className="text-gray-900 font-medium">{selectedCompany.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold">Secteur</p>
                  <p className="text-gray-900 font-medium">{selectedCompany.industry}</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedCompany.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedCompany.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedCompany.website}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedCompany.address}</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
                <Button variant="outline" onClick={() => setShowCompanyDetails(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setEditForm({
                    name: selectedCompany.name,
                    industry: selectedCompany.industry,
                    revenue: selectedCompany.revenue,
                    employees: selectedCompany.employees,
                    phone: selectedCompany.phone,
                    email: selectedCompany.email,
                    website: selectedCompany.website,
                    address: selectedCompany.address,
                    contactPerson: selectedCompany.contactPerson,
                    status: selectedCompany.status
                  });
                  setIsEditingCompany(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Nom de l'entreprise</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Secteur d'activité</Label>
                  <Input
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Chiffre d'affaires</Label>
                  <Input
                    value={editForm.revenue}
                    onChange={(e) => setEditForm({ ...editForm, revenue: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre d'employés</Label>
                  <Input
                    value={editForm.employees}
                    onChange={(e) => setEditForm({ ...editForm, employees: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Contact principal</Label>
                  <Input
                    value={editForm.contactPerson}
                    onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Site web</Label>
                <Input
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Adresse</Label>
                <Input
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Statut</Label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'active' | 'prospect' | 'inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-white"
                >
                  <option value="active">Actif</option>
                  <option value="prospect">Prospect</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditingCompany(false);
                  setShowCompanyDetails(false);
                }}>
                  Annuler
                </Button>
                <Button onClick={handleEditCompany}>
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette compagnie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La compagnie sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Companies;
