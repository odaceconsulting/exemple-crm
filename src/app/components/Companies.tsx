import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Building2, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Globe,
  Edit,
  Trash2,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react';

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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({} as Partial<Company>);

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

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [openActionsFor, setOpenActionsFor] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'prospect':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'prospect':
        return 'Prospect';
      case 'inactive':
        return 'Inactif';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Compagnies</h1>
          <p className="text-gray-500 mt-1">Gérez vos entreprises clientes et prospects</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700">
                <Plus className="h-4 w-4" />
                Nouvelle Compagnie
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

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher une compagnie par nom ou secteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <Building2 className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{companies.length}</p>
            <p className="text-blue-100 text-sm">Compagnies totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionsFor(openActionsFor === company.id ? null : company.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-expanded={openActionsFor === company.id}
                      aria-controls={`company-actions-${company.id}`}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>

                    {openActionsFor === company.id && (
                      <div id={`company-actions-${company.id}`} className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md z-20 py-1">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setEditForm(company);
                            setShowEditDialog(true);
                            setOpenActionsFor(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4 text-gray-600" /> Modifier
                        </button>
                        <button
                          onClick={() => {
                            setCompanies(prev => prev.filter(c => c.id !== company.id));
                            setOpenActionsFor(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 text-sm flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(company.status)}>
                  {getStatusLabel(company.status)}
                </Badge>
                <span className="text-sm font-semibold text-gray-900">{company.revenue}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{company.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span className="truncate">{company.website}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{company.address}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3">
                  Contact: <span className="font-medium text-gray-700">{company.contactPerson}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Edit Company Dialog */}
        {selectedCompany && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-lg md:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Modifier la Compagnie</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="edit-company-name">Nom de l'entreprise *</Label>
                  <Input id="edit-company-name" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-industry">Secteur d'activité</Label>
                  <Input id="edit-industry" value={editForm.industry || ''} onChange={(e) => setEditForm({...editForm, industry: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-revenue">Chiffre d'affaires</Label>
                  <Input id="edit-revenue" value={editForm.revenue || ''} onChange={(e) => setEditForm({...editForm, revenue: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-employees">Nombre d'employés</Label>
                  <Input id="edit-employees" value={editForm.employees || ''} onChange={(e) => setEditForm({...editForm, employees: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input id="edit-phone" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-website">Site web</Label>
                  <Input id="edit-website" value={editForm.website || ''} onChange={(e) => setEditForm({...editForm, website: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-address">Adresse</Label>
                  <Input id="edit-address" value={editForm.address || ''} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-person">Contact principal</Label>
                  <Input id="edit-contact-person" value={editForm.contactPerson || ''} onChange={(e) => setEditForm({...editForm, contactPerson: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Statut</Label>
                  <select id="edit-status" value={editForm.status || 'prospect'} onChange={(e) => setEditForm({...editForm, status: e.target.value as Company['status']})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="prospect">Prospect</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Annuler</Button>
                <Button onClick={() => {
                  // Save changes
                  setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...(c), ...(editForm as Company) } : c));
                  setShowEditDialog(false);
                  setSelectedCompany(null);
                }}>Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      {filteredCompanies.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune compagnie trouvée</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Companies;
