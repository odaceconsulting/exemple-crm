import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Building2,
  Edit,
  Trash2,
  Filter,
  Download,
  MoreVertical,
  MessageSquare,
  Calendar,
  MessageCircle,
  Grid3x3,
  List,
  Kanban,
  Send,
  Eye
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

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  mobile: string;
  status: 'lead' | 'client' | 'partner';
  lastContact: string;
  score: number;
}

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [openActionsFor, setOpenActionsFor] = useState<number | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    mobile: '',
    status: 'lead' as const
  });

  const contacts: Contact[] = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      position: 'Directeur Commercial',
      company: 'Acme Corporation',
      email: 'jean.dupont@acme-corp.fr',
      phone: '+33 1 23 45 67 89',
      mobile: '+33 6 12 34 56 78',
      status: 'client',
      lastContact: '2026-01-20',
      score: 85
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      position: 'CEO',
      company: 'TechStart SAS',
      email: 'marie.martin@techstart.fr',
      phone: '+33 1 34 56 78 90',
      mobile: '+33 6 23 45 67 89',
      status: 'client',
      lastContact: '2026-01-18',
      score: 92
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Leclerc',
      position: 'Responsable Achats',
      company: 'Global Industries',
      email: 'pierre.leclerc@global-ind.fr',
      phone: '+33 2 45 67 89 01',
      mobile: '+33 6 34 56 78 90',
      status: 'client',
      lastContact: '2026-01-15',
      score: 78
    },
    {
      id: 4,
      firstName: 'Sophie',
      lastName: 'Bernard',
      position: 'Chef de Projet',
      company: 'Innovation Labs',
      email: 'sophie.bernard@innolabs.fr',
      phone: '+33 3 56 78 90 12',
      mobile: '+33 6 45 67 89 01',
      status: 'lead',
      lastContact: '2026-01-10',
      score: 65
    },
    {
      id: 5,
      firstName: 'Luc',
      lastName: 'Dubois',
      position: 'Directeur Technique',
      company: 'Digital Solutions',
      email: 'luc.dubois@digitalsol.fr',
      phone: '+33 4 67 89 01 23',
      mobile: '+33 6 56 78 90 12',
      status: 'client',
      lastContact: '2026-01-21',
      score: 88
    },
    {
      id: 6,
      firstName: 'Alice',
      lastName: 'Rousseau',
      position: 'Responsable Marketing',
      company: 'Smart Tech SARL',
      email: 'alice.rousseau@smarttech.fr',
      phone: '+33 5 78 90 12 34',
      mobile: '+33 6 67 89 01 23',
      status: 'lead',
      lastContact: '2026-01-08',
      score: 72
    },
    {
      id: 7,
      firstName: 'Thomas',
      lastName: 'Petit',
      position: 'Consultant',
      company: 'Business Partners',
      email: 'thomas.petit@bizpartners.fr',
      phone: '+33 1 89 01 23 45',
      mobile: '+33 6 78 90 12 34',
      status: 'partner',
      lastContact: '2026-01-12',
      score: 80
    },
    {
      id: 8,
      firstName: 'Emma',
      lastName: 'Moreau',
      position: 'Directrice Générale',
      company: 'Future Corp',
      email: 'emma.moreau@futurecorp.fr',
      phone: '+33 2 90 12 34 56',
      mobile: '+33 6 89 01 23 45',
      status: 'lead',
      lastContact: '2026-01-05',
      score: 68
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteContact = (id: number) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      // Ici on ferait appel à une API pour supprimer
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setShowContactDetails(false);
      alert('Contact supprimé avec succès');
    }
  };

  const handleEditContact = () => {
    if (selectedContact && editForm.firstName && editForm.lastName && editForm.email) {
      // Ici on ferait appel à une API pour modifier
      setIsEditingContact(false);
      setShowContactDetails(false);
      setSelectedContact(null);
      alert('Contact modifié avec succès');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'lead':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'partner':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'client':
        return 'Client';
      case 'lead':
        return 'Lead';
      case 'partner':
        return 'Partenaire';
      default:
        return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              Contacts
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos contacts et interlocuteurs</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2 border-2 border-blue-700 shadow-lg hover:shadow-xl font-semibold">
                <Plus className="h-5 w-5" />
                Nouveau Contact
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un Contact</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Prénom *</Label>
                  <Input id="first-name" placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Nom *</Label>
                  <Input id="last-name" placeholder="Dupont" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input id="position" placeholder="Directeur Commercial" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input id="company" placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="jean.dupont@entreprise.fr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+33 1 23 45 67 89" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" placeholder="+33 6 12 34 56 78" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select id="status" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="lead">Lead</option>
                    <option value="client">Client</option>
                    <option value="partner">Partenaire</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Créer le contact
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
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Contacts</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{contacts.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Clients</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{contacts.filter(c => c.status === 'client').length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Leads</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{contacts.filter(c => c.status === 'lead').length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Partenaires</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{contacts.filter(c => c.status === 'partner').length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Filter className="h-6 w-6 text-orange-600" />
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
            placeholder="Rechercher un contact par nom, entreprise ou poste..."
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
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-all border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(contact.firstName, contact.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.firstName} {contact.lastName}</h3>
                      <p className="text-sm text-gray-500">{contact.position}</p>
                    </div>
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
                          setSelectedContact(contact);
                          setShowContactDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedContact(contact);
                          setEditForm({
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            position: contact.position,
                            company: contact.company,
                            email: contact.email,
                            phone: contact.phone,
                            mobile: contact.mobile,
                            status: contact.status
                          });
                          setIsEditingContact(true);
                          setShowContactDetails(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.company}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.mobile}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'client' ? 'bg-green-100 text-green-700' :
                      contact.status === 'lead' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {contact.status === 'client' ? '🟢 Client' : 
                       contact.status === 'lead' ? '🔵 Lead' : 
                       '🟠 Partenaire'}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-12">
                        <div
                          className={`h-2 rounded-full ${
                            contact.score >= 80 ? 'bg-green-500' : 
                            contact.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${contact.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">{contact.score}</span>
                    </div>
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
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Poste</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Entreprise</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Téléphone</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">WhatsApp</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Score</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <tr key={contact.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-sm">
                            {getInitials(contact.firstName, contact.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{contact.firstName} {contact.lastName}</p>
                          <p className="text-xs text-gray-500">Dernier contact: {new Date(contact.lastContact).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{contact.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{contact.company}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{contact.mobile}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-green-100 rounded-lg transition-colors inline-flex" title="WhatsApp">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.031 3.256c-2.244-2.255-5.236-3.495-8.41-3.495-6.554 0-11.89 5.335-11.891 11.889 0 2.096.546 4.142 1.588 5.946l-1.691 6.169 6.311-1.653c1.738.948 3.694 1.447 5.684 1.447h.005c6.554 0 11.89-5.335 11.891-11.89 0-3.173-1.24-6.165-3.494-8.411zM11.622 19.215h-.003c-1.77 0-3.506-.476-5.029-1.373l-.362-.217-3.742.979.994-3.625-.234-.373c-1.01-1.602-1.542-3.46-1.542-5.358 0-5.46 4.445-9.903 9.906-9.903 2.644 0 5.13 1.031 6.996 2.897 1.866 1.865 2.896 4.351 2.896 6.995 0 5.46-4.445 9.903-9.907 9.903zm5.445-7.441c-.297-.15-1.758-.867-2.03-.966-.273-.1-.471-.149-.67.15-.197.298-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.474-.883-.788-1.48-1.761-1.654-2.059-.173-.298-.019-.458.131-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.201 5.076 4.487.709.306 1.262.489 1.694.625.712.228 1.36.196 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.125-.272-.198-.57-.347z"/>
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'client' ? 'bg-green-100 text-green-700' :
                        contact.status === 'lead' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {contact.status === 'client' ? '🟢 Client' : 
                         contact.status === 'lead' ? '🔵 Lead' : 
                         '🟠 Partenaire'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div
                            className={`h-2 rounded-full ${
                              contact.score >= 80 ? 'bg-green-500' : 
                              contact.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${contact.score}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(contact.score)}`}>
                          {contact.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu open={openActionsFor === contact.id} onOpenChange={(open) => setOpenActionsFor(open ? contact.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-200 rounded-lg inline-flex">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowContactDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedContact(contact);
                              setEditForm({
                                firstName: contact.firstName,
                                lastName: contact.lastName,
                                position: contact.position,
                                company: contact.company,
                                email: contact.email,
                                phone: contact.phone,
                                mobile: contact.mobile,
                                status: contact.status
                              });
                              setIsEditingContact(true);
                              setShowContactDetails(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Éditer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteContact(contact.id)}
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
          {['lead', 'client', 'partner'].map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'lead' ? 'bg-blue-500' :
                  status === 'client' ? 'bg-green-500' :
                  'bg-orange-500'
                }`}></div>
                <h3 className="font-bold text-gray-900">
                  {status === 'lead' ? '🔵 Leads' :
                   status === 'client' ? '🟢 Clients' :
                   '🟠 Partenaires'}
                </h3>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                  {filteredContacts.filter(c => c.status === status).length}
                </span>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {filteredContacts.filter(c => c.status === status).map((contact) => (
                  <Card key={contact.id} className="border-2 border-gray-200 shadow-sm hover:shadow-md transition-all bg-white cursor-move">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs">
                                {getInitials(contact.firstName, contact.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">{contact.firstName} {contact.lastName}</h4>
                              <p className="text-xs text-gray-500">{contact.position}</p>
                            </div>
                          </div>
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
                                setSelectedContact(contact);
                                setShowContactDetails(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedContact(contact);
                                setEditForm({
                                  firstName: contact.firstName,
                                  lastName: contact.lastName,
                                  position: contact.position,
                                  company: contact.company,
                                  email: contact.email,
                                  phone: contact.phone,
                                  mobile: contact.mobile,
                                  status: contact.status
                                });
                                setIsEditingContact(true);
                                setShowContactDetails(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Éditer
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Entreprise:</span>
                          <span className="text-xs font-medium text-gray-900">{contact.company}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Score:</span>
                          <span className={`text-xs font-medium ${getScoreColor(contact.score)}`}>{contact.score}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600 truncate">{contact.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredContacts.filter(c => c.status === status).length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">Aucun contact</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContacts.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun contact trouvé</p>
          </CardContent>
        </Card>
      )}

      {/* CONTACT DETAILS DIALOG */}
      <Dialog open={showContactDetails} onOpenChange={setShowContactDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditingContact ? 'Modifier le contact' : 'Détails du contact'}
            </DialogTitle>
          </DialogHeader>

          {!isEditingContact && selectedContact ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-lg">
                    {getInitials(selectedContact.firstName, selectedContact.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedContact.firstName} {selectedContact.lastName}</h2>
                  <p className="text-gray-600">{selectedContact.position}</p>
                  <Badge className={`mt-2 ${
                    selectedContact.status === 'client' ? 'bg-green-100 text-green-700' :
                    selectedContact.status === 'lead' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {selectedContact.status === 'client' ? '🟢 Client' : 
                     selectedContact.status === 'lead' ? '🔵 Lead' : 
                     '🟠 Partenaire'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold">Entreprise</p>
                  <p className="text-gray-900 font-medium">{selectedContact.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold">Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                      <div
                        className={`h-2 rounded-full ${
                          selectedContact.score >= 80 ? 'bg-green-500' : 
                          selectedContact.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedContact.score}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(selectedContact.score)}`}>
                      {selectedContact.score}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedContact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedContact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedContact.mobile}</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
                <Button variant="outline" onClick={() => setShowContactDetails(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setEditForm({
                    firstName: selectedContact.firstName,
                    lastName: selectedContact.lastName,
                    position: selectedContact.position,
                    company: selectedContact.company,
                    email: selectedContact.email,
                    phone: selectedContact.phone,
                    mobile: selectedContact.mobile,
                    status: selectedContact.status
                  });
                  setIsEditingContact(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <Input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Poste</Label>
                <Input
                  value={editForm.position}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Entreprise</Label>
                <Input
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  className="mt-1"
                />
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
                <Label>Mobile/WhatsApp</Label>
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Statut</Label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'lead' | 'client' | 'partner' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 bg-white"
                >
                  <option value="lead">Lead</option>
                  <option value="client">Client</option>
                  <option value="partner">Partenaire</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditingContact(false);
                  setShowContactDetails(false);
                }}>
                  Annuler
                </Button>
                <Button onClick={handleEditContact}>
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
            <AlertDialogTitle>Supprimer ce contact ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le contact sera définitivement supprimé.
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

export default Contacts;
