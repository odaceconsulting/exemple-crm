import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
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
  Trash2,
  X,
  Network,
  ChevronDown,
  ChevronUp,
  Tag,
  Settings,
  List as ListIcon
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
  logo?: string;
  subsidiaries?: string[];
  partners?: string[];
  orgChart?: string;
  opportunities?: number;
  quotes?: number;
  invoices?: number;
  projects?: number;
  sirenSiret?: string;
  scoringValue?: number;
  watchlist?: boolean;
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newSubsidiary, setNewSubsidiary] = useState('');
  const [newPartner, setNewPartner] = useState('');
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customCriteria, setCustomCriteria] = useState('');
  const [dynamicLists, setDynamicLists] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newDynamicList, setNewDynamicList] = useState('');
  const [allTags, setAllTags] = useState(['Premium', 'VIP', 'Startup', 'Enterprise', 'PME', 'Secteur Public']);
  const [availableLists, setAvailableLists] = useState(['Clients Actifs', 'Prospects Chauds', 'À Relancer', 'En Négociation', 'Partenaires Clés']);
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
    status: 'prospect' as 'active' | 'prospect' | 'inactive',
    logo: '',
    subsidiaries: [] as string[],
    partners: [] as string[],
    orgChart: '',
    opportunities: 0,
    quotes: 0,
    invoices: 0,
    projects: 0,
    sirenSiret: '',
    scoringValue: 0,
    watchlist: false
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
      lastContact: '2026-01-20',
      subsidiaries: ['Acme France', 'Acme Digital'],
      partners: ['Microsoft', 'Amazon'],
      orgChart: 'https://example.com/orgchart-acme.png',
      opportunities: 12,
      quotes: 8,
      invoices: 15,
      projects: 5,
      sirenSiret: '123 456 789 00012',
      scoringValue: 85,
      watchlist: true
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
      lastContact: '2026-01-18',
      subsidiaries: [],
      partners: ['Google Cloud'],
      orgChart: '',
      opportunities: 7,
      quotes: 4,
      invoices: 10,
      projects: 2,
      sirenSiret: '234 567 890 00023',
      scoringValue: 62,
      watchlist: false
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
      lastContact: '2026-01-15',
      subsidiaries: ['Global Asia', 'Global Americas', 'Global Europe'],
      partners: ['Siemens', 'Bosch', 'ABB'],
      orgChart: 'https://example.com/orgchart-global.png',
      opportunities: 25,
      quotes: 18,
      invoices: 32,
      projects: 9,
      sirenSiret: '345 678 901 00034',
      scoringValue: 92,
      watchlist: true
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
      lastContact: '2026-01-10',
      subsidiaries: ['InnoLabs Startup Hub'],
      partners: [],
      orgChart: '',
      opportunities: 5,
      quotes: 2,
      invoices: 1,
      projects: 0,
      sirenSiret: '456 789 012 00045',
      scoringValue: 45,
      watchlist: false
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
      lastContact: '2026-01-21',
      opportunities: 10,
      quotes: 6,
      invoices: 12,
      projects: 3,
      sirenSiret: '567 890 123 00056',
      scoringValue: 75,
      watchlist: true
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
      lastContact: '2026-01-08',
      opportunities: 3,
      quotes: 1,
      invoices: 2,
      projects: 0,
      sirenSiret: '678 901 234 00067',
      scoringValue: 55,
      watchlist: false
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
              <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all flex items-center gap-2 border-2 border-blue-500 shadow-lg hover:shadow-xl font-semibold">
                <Plus className="h-5 w-5" />
                <span>Nouvelle Compagnie</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg md:max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Ajouter une Compagnie</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
                
                {/* INFOS GÉNÉRALES */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Infos générales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nom de l'entreprise *</Label>
                      <Input id="company-name" placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siren-siret">SIREN/SIRET</Label>
                      <Input id="siren-siret" placeholder="123 456 789" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="logo-upload">Logo (Télécharger)</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="logo-upload" 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setLogoFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setLogoPreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="flex-1"
                        />
                      </div>
                      {logoPreview && (
                        <div className="mt-2 flex items-center gap-2">
                          <img src={logoPreview} alt="Aperçu" className="h-12 w-12 object-contain rounded border border-gray-200" />
                          <span className="text-xs text-gray-600">{logoFile?.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* COORDONNÉES */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Coordonnées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="contact@entreprise.fr" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="+33 1 23 45 67 89" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="website">Site web</Label>
                      <Input id="website" placeholder="www.entreprise.fr" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" placeholder="123 Avenue des Champs-Élysées, Paris" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" placeholder="Paris" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipcode">Code postal</Label>
                      <Input id="zipcode" placeholder="75008" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input id="country" placeholder="France" />
                    </div>
                  </div>
                </div>

                {/* SECTEUR & ACTIVITÉ */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Secteur & activité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Secteur d'activité</Label>
                      <Input id="industry" placeholder="Technologie, Conseil, etc." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="activity-desc">Description d'activité</Label>
                      <Input id="activity-desc" placeholder="Brève description des activités principales" />
                    </div>
                  </div>
                </div>

                {/* EFFECTIF & CA */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Effectif & CA</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employees">Nombre d'employés</Label>
                      <Input id="employees" placeholder="100" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revenue">Chiffre d'affaires</Label>
                      <Input id="revenue" placeholder="€5M" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="contact-person">Contact principal</Label>
                      <Input id="contact-person" placeholder="Jean Dupont" />
                    </div>
                  </div>
                </div>

                {/* STATUT */}
                <div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <select id="status" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="prospect">Prospect</option>
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>

                {/* RELATIONS */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Relations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subsidiaries">Filiales (séparées par virgules)</Label>
                      <Input id="subsidiaries" placeholder="Filiale 1, Filiale 2, Filiale 3" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partners">Partenaires (séparées par virgules)</Label>
                      <Input id="partners" placeholder="Partenaire 1, Partenaire 2" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="orgchart">Organigramme URL</Label>
                      <Input id="orgchart" placeholder="https://exemple.com/organigramme.png" />
                    </div>
                  </div>
                </div>

                {/* HISTORIQUE */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Historique</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opportunities">Opportunités</Label>
                      <Input id="opportunities" type="number" min="0" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quotes">Devis & factures</Label>
                      <Input id="quotes" type="number" min="0" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoices">Factures</Label>
                      <Input id="invoices" type="number" min="0" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projects">Projets</Label>
                      <Input id="projects" type="number" min="0" placeholder="0" />
                    </div>
                  </div>
                </div>

                {/* ENRICHISSEMENT */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Enrichissement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="siren-siret">Import SIREN/SIRET</Label>
                      <Input id="siren-siret" placeholder="123 456 789 00012" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scoring">Scoring (0-100)</Label>
                      <Input id="scoring" type="number" min="0" max="100" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="watchlist" className="rounded" />
                        <span>Ajouter à la veille (watchlist)</span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)} className="bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600">
                  Créer la compagnie
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* SEGMENTATION SECTION */}
      <div className="mb-6">
        <button
          onClick={() => setShowSegmentation(!showSegmentation)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4 hover:from-blue-100 hover:to-blue-150 transition-all"
        >
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Segmentation</span>
            {selectedTags.length > 0 || dynamicLists.length > 0 || customCriteria && (
              <Badge className="bg-blue-600 text-white">{selectedTags.length + dynamicLists.length + (customCriteria ? 1 : 0)}</Badge>
            )}
          </div>
          {showSegmentation ? (
            <ChevronUp className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600" />
          )}
        </button>

        {showSegmentation && (
          <div className="bg-white border-2 border-blue-200 rounded-b-lg p-6 space-y-6">
            {/* TAGS */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {allTags.map((tag) => (
                  <div key={tag} className="relative group">
                    <button
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {tag}
                    </button>
                    <button
                      onClick={() => setAllTags(allTags.filter(t => t !== tag))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold hover:bg-red-600"
                      title="Supprimer ce tag"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un nouveau tag..."
                  className="text-sm"
                />
                <Button
                  onClick={() => {
                    if (newTag.trim() && !allTags.includes(newTag)) {
                      setAllTags([...allTags, newTag]);
                      setNewTag('');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* CRITÈRES PERSONNALISÉS */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Critères personnalisés</h3>
              </div>
              <Textarea
                value={customCriteria}
                onChange={(e) => setCustomCriteria(e.target.value)}
                placeholder="Ex: Secteur = Technologie ET Scoring >= 80 ET CA >= 5M..."
                className="min-h-[80px] text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">Définissez vos critères de filtrage personnalisés</p>
            </div>

            {/* LISTES DYNAMIQUES */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <ListIcon className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Listes dynamiques</h3>
              </div>
              <div className="space-y-3">
                {availableLists.map((list) => (
                  <div key={list} className="relative group">
                    <button
                      onClick={() => {
                        if (dynamicLists.includes(list)) {
                          setDynamicLists(dynamicLists.filter(l => l !== list));
                        } else {
                          setDynamicLists([...dynamicLists, list]);
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        dynamicLists.includes(list)
                          ? 'bg-blue-50 border-blue-400 text-blue-900'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={dynamicLists.includes(list)}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <span className="font-medium">{list}</span>
                    </button>
                    <button
                      onClick={() => setAvailableLists(availableLists.filter(l => l !== list))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold hover:bg-red-600"
                      title="Supprimer cette liste"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  value={newDynamicList}
                  onChange={(e) => setNewDynamicList(e.target.value)}
                  placeholder="Créer une nouvelle liste..."
                  className="text-sm"
                />
                <Button
                  onClick={() => {
                    if (newDynamicList.trim() && !availableLists.includes(newDynamicList)) {
                      setAvailableLists([...availableLists, newDynamicList]);
                      setNewDynamicList('');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 justify-end border-t border-gray-200 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTags([]);
                  setCustomCriteria('');
                  setDynamicLists([]);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button className="bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600">
                <Filter className="h-4 w-4 mr-2" />
                Appliquer les filtres
              </Button>
            </div>
          </div>
        )}
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
            <Card key={company.id} className="hover:shadow-lg transition-all border-0 bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-4">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="h-16 w-16 object-contain mb-3" />
                  ) : (
                    <div className="p-3 bg-blue-100 rounded-lg mb-3">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                </div>
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
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="h-10 w-10 object-contain rounded border border-gray-200" />
                        ) : (
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
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
                      <div className="flex flex-col items-center mb-3">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="h-12 w-12 object-contain mb-2" />
                        ) : (
                          <div className="p-2 bg-blue-100 rounded-lg mb-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <div className="flex items-start justify-between w-full">
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
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* HEADER */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
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

              {/* TABS */}
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general" className="text-xs sm:text-sm">Général</TabsTrigger>
                  <TabsTrigger value="historique" className="text-xs sm:text-sm">Historique</TabsTrigger>
                  <TabsTrigger value="enrichissement" className="text-xs sm:text-sm">Enrichissement</TabsTrigger>
                  <TabsTrigger value="relations" className="text-xs sm:text-sm">Relations</TabsTrigger>
                </TabsList>

                {/* TAB GÉNÉRAL */}
                <TabsContent value="general" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-xs text-gray-600 uppercase font-bold">Coordonnées</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">{selectedCompany.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">{selectedCompany.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">{selectedCompany.website}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">{selectedCompany.address}</span>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB HISTORIQUE */}
                <TabsContent value="historique" className="space-y-4 py-4">
                  {selectedCompany && (selectedCompany.opportunities || selectedCompany.quotes || selectedCompany.invoices || selectedCompany.projects) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-600 font-bold mb-2">Opportunités</p>
                        <p className="text-3xl font-bold text-blue-600">{selectedCompany.opportunities || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-xs text-gray-600 font-bold mb-2">Devis & factures</p>
                        <p className="text-3xl font-bold text-green-600">{(selectedCompany.quotes || 0) + (selectedCompany.invoices || 0)}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-xs text-gray-600 font-bold mb-2">CA généré</p>
                        <p className="text-3xl font-bold text-purple-600">{selectedCompany.revenue}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <p className="text-xs text-gray-600 font-bold mb-2">Projets</p>
                        <p className="text-3xl font-bold text-orange-600">{selectedCompany.projects || 0}</p>
                      </div>
                    </div>
                  )}
                  {!selectedCompany || (!selectedCompany.opportunities && !selectedCompany.quotes && !selectedCompany.invoices && !selectedCompany.projects) && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">Aucune donnée d'historique</p>
                    </div>
                  )}
                </TabsContent>

                {/* TAB ENRICHISSEMENT */}
                <TabsContent value="enrichissement" className="space-y-4 py-4">
                  <div className="space-y-3">
                    {selectedCompany.sirenSiret && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 font-bold mb-2">SIREN/SIRET</p>
                        <p className="text-lg font-mono text-gray-900 font-semibold">{selectedCompany.sirenSiret}</p>
                      </div>
                    )}
                    {selectedCompany.scoringValue !== undefined && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-xs text-gray-600 font-bold mb-3">Scoring</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" 
                                style={{ width: `${selectedCompany.scoringValue}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-gray-900 min-w-fit">{selectedCompany.scoringValue}/100</span>
                        </div>
                      </div>
                    )}
                    {selectedCompany.watchlist && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-xs text-gray-600 font-bold mb-1">✓ Veille active</p>
                        <p className="text-sm text-green-700">Cette compagnie est sous surveillance</p>
                      </div>
                    )}
                    {!selectedCompany.sirenSiret && selectedCompany.scoringValue === undefined && !selectedCompany.watchlist && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">Aucune donnée d'enrichissement</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* TAB RELATIONS */}
                <TabsContent value="relations" className="space-y-4 py-4">
                  {selectedCompany && (selectedCompany.subsidiaries?.length || selectedCompany.partners?.length || selectedCompany.orgChart) ? (
                    <div className="space-y-4">
                      {selectedCompany.subsidiaries && selectedCompany.subsidiaries.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 font-bold mb-3 uppercase">Filiales ({selectedCompany.subsidiaries.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCompany.subsidiaries.map((sub, idx) => (
                              <Badge key={idx} className="bg-blue-100 text-blue-700 text-xs py-1.5 px-3">{sub}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedCompany.partners && selectedCompany.partners.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 font-bold mb-3 uppercase">Partenaires ({selectedCompany.partners.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCompany.partners.map((partner, idx) => (
                              <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs py-1.5 px-3">{partner}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedCompany.orgChart && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 font-bold mb-3 uppercase">Organigramme</p>
                          <a href={selectedCompany.orgChart} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-600 transition">
                            <Network className="h-4 w-4" />
                            Voir l'organigramme
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">Aucune relation enregistrée</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

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
                }} className="bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* INFOS PRINCIPALES */}
              <div>
                <Label>Nom de l'entreprise *</Label>
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

              <Tabs defaultValue="contact" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="contact" className="text-xs sm:text-sm">Infos détaillées</TabsTrigger>
                  <TabsTrigger value="relations" className="text-xs sm:text-sm">Relations</TabsTrigger>
                  <TabsTrigger value="enrichissement" className="text-xs sm:text-sm">Enrichissement</TabsTrigger>
                </TabsList>

                {/* TAB INFOS DÉTAILLÉES */}
                <TabsContent value="contact" className="space-y-4 py-4">
                  <div>
                    <Label>Chiffre d'affaires</Label>
                    <Input
                      value={editForm.revenue}
                      onChange={(e) => setEditForm({ ...editForm, revenue: e.target.value })}
                      className="mt-1"
                    />
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
                </TabsContent>

                {/* TAB RELATIONS */}
                <TabsContent value="relations" className="space-y-4 py-4">
                  <div>
                    <Label>Filiales (séparées par virgules)</Label>
                    <Input
                      value={editForm.subsidiaries?.join(', ') || ''}
                      onChange={(e) => setEditForm({ ...editForm, subsidiaries: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                      placeholder="Filiale 1, Filiale 2"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Partenaires (séparées par virgules)</Label>
                    <Input
                      value={editForm.partners?.join(', ') || ''}
                      onChange={(e) => setEditForm({ ...editForm, partners: e.target.value.split(',').map(p => p.trim()).filter(p => p) })}
                      placeholder="Partenaire 1, Partenaire 2"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>URL Organigramme</Label>
                    <Input
                      value={editForm.orgChart || ''}
                      onChange={(e) => setEditForm({ ...editForm, orgChart: e.target.value })}
                      placeholder="https://exemple.com/organigramme.png"
                      className="mt-1"
                    />
                  </div>
                </TabsContent>

                {/* TAB ENRICHISSEMENT */}
                <TabsContent value="enrichissement" className="space-y-4 py-4">
                  <div>
                    <Label>SIREN/SIRET</Label>
                    <Input
                      value={editForm.sirenSiret || ''}
                      onChange={(e) => setEditForm({ ...editForm, sirenSiret: e.target.value })}
                      placeholder="123 456 789 00012"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Scoring (0-100)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm.scoringValue || 0}
                      onChange={(e) => setEditForm({ ...editForm, scoringValue: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input 
                        type="checkbox" 
                        checked={editForm.watchlist || false}
                        onChange={(e) => setEditForm({ ...editForm, watchlist: e.target.checked })}
                        className="rounded"
                      />
                      <span>Ajouter à la veille (watchlist)</span>
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditingCompany(false);
                  setShowCompanyDetails(false);
                }}>
                  Annuler
                </Button>
                <Button onClick={handleEditCompany} className="bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600">
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
