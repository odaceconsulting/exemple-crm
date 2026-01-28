import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
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
  Eye,
  Upload,
  FileDown,
  Zap
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
  address: string;
  linkedIn?: string;
  photo?: string;
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
    address: '',
    linkedIn: '',
    photo: '',
    status: 'lead' as const
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Communication Modals States
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showEmailsModal, setShowEmailsModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);

  // Templates Form
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Bienvenue', category: 'email', content: 'Bienvenue dans notre CRM...' },
    { id: 2, name: 'Suivi', category: 'email', content: 'Nous avons remarqué...' },
    { id: 3, name: 'Promotion SMS', category: 'sms', content: 'Profitez de notre offre spéciale...' }
  ]);
  const [newTemplate, setNewTemplate] = useState({ name: '', category: 'email', content: '' });

  // Email Campaign Form
  const [emailCampaign, setEmailCampaign] = useState({
    campaignName: '',
    template: '',
    subject: '',
    recipients: 'all',
    scheduledDate: '',
    scheduledTime: ''
  });

  // SMS Form
  const [smsMessage, setSmsMessage] = useState({
    message: '',
    recipients: 'selected',
    scheduledDate: '',
    scheduledTime: ''
  });

  // Selected contacts for campaigns
  const [selectedEmailContacts, setSelectedEmailContacts] = useState<number[]>([]);
  const [selectedSmsContacts, setSelectedSmsContacts] = useState<number[]>([]);

  // Followup History
  const [followupHistory, setFollowupHistory] = useState([
    { id: 1, type: 'Email', subject: 'Suivi commercial', date: '2026-01-25 14:30', status: 'Envoyé' },
    { id: 2, type: 'SMS', subject: 'Rappel meeting', date: '2026-01-24 10:15', status: 'Envoyé' },
    { id: 3, type: 'Email', subject: 'Devis', date: '2026-01-23 09:00', status: 'Ouvert' }
  ]);

  // Import/Export States
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [csvImportData, setCsvImportData] = useState('');
  const [deduplicationStats, setDeduplicationStats] = useState({ duplicates: 0, merged: 0 });

  // Export contacts to CSV
  const exportToCSV = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Mobile', 'Poste', 'Entreprise', 'Adresse', 'Statut'];
    const rows = contacts.map(c => [
      c.firstName,
      c.lastName,
      c.email,
      c.phone,
      c.mobile,
      c.position,
      c.company,
      c.address,
      c.status
    ]);
    const csv = [headers, ...rows].map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Import from CSV
  const importFromCSV = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return;
      const newContacts = lines.slice(1).map((line, idx) => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        return {
          id: Math.max(...contacts.map(c => c.id)) + idx + 1,
          firstName: values[0],
          lastName: values[1],
          email: values[2],
          phone: values[3],
          mobile: values[4],
          position: values[5],
          company: values[6],
          address: values[7],
          status: (values[8] || 'lead') as 'lead' | 'client' | 'partner',
          lastContact: new Date().toISOString().split('T')[0],
          score: 50
        };
      });
      setContacts([...contacts, ...newContacts]);
      setCsvImportData('');
      setShowImportExportModal(false);
    } catch (err) {
      alert('Erreur lors de l\'import du CSV');
    }
  };

  // Deduplication
  const deduplicateContacts = () => {
    const seen = new Set();
    const duplicates = contacts.filter(c => {
      const key = `${c.firstName.toLowerCase()}-${c.lastName.toLowerCase()}-${c.email.toLowerCase()}`;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
    const merged = contacts.filter(c => !duplicates.includes(c));
    setContacts(merged);
    setDeduplicationStats({ duplicates: duplicates.length, merged: merged.length });
    setTimeout(() => setShowImportExportModal(false), 2000);
  };

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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                
                {/* INFOS PERSO */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Infos personnelles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Prénom *</Label>
                      <Input id="first-name" placeholder="Jean" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Nom *</Label>
                      <Input id="last-name" placeholder="Dupont" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* COORDONNÉES */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Coordonnées</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="jean.dupont@entreprise.fr" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="+33 1 23 45 67 89" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input id="mobile" placeholder="+33 6 12 34 56 78" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" placeholder="123 Rue de la Paix, 75000 Paris" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="linkedin">Profil LinkedIn</Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/jean-dupont" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* POSTE */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Poste & Entreprise</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Fonction *</Label>
                      <Input id="position" placeholder="Directeur Commercial" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Entreprise *</Label>
                      <Input id="company" placeholder="Acme Corp" className="border-2 border-gray-200 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="status">Statut</Label>
                      <select id="status" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="lead">Lead</option>
                        <option value="client">Client</option>
                        <option value="partner">Partenaire</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PHOTO */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Photo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover rounded" />
                        ) : (
                          <span className="text-gray-400 text-sm">Aucune photo</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="photo" className="block text-sm font-medium mb-2">Télécharger une photo</Label>
                        <Input 
                          id="photo" 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPhotoFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPhotoPreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="border-2 border-gray-200 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG ou GIF (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600">
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

      {/* COMMUNICATION SECTION - GLOBAL */}
      <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            📧 Communication Globale
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button onClick={() => setShowTemplatesModal(true)} className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-all text-left group">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Templates</h3>
            <p className="text-xs text-gray-600 mt-2">Gérer vos modèles</p>
          </button>
          <button onClick={() => setShowEmailsModal(true)} className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:bg-purple-100 transition-all text-left group">
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Emails masse</h3>
            <p className="text-xs text-gray-600 mt-2">Campagnes d'emails</p>
          </button>
          <button onClick={() => setShowSMSModal(true)} className="p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:bg-green-100 transition-all text-left group">
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">SMS</h3>
            <p className="text-xs text-gray-600 mt-2">Envoyer des SMS</p>
          </button>
          <button onClick={() => setShowFollowupModal(true)} className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200 hover:bg-orange-100 transition-all text-left group">
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Suivi</h3>
            <p className="text-xs text-gray-600 mt-2">Historique complet</p>
          </button>
        </div>
      </div>

      {/* TEMPLATES MODAL */}
      <Dialog open={showTemplatesModal} onOpenChange={setShowTemplatesModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des Templates</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Existing Templates */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Templates existants</h3>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {templates.map(template => (
                  <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">Catégorie: {template.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Éditer</button>
                        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Supprimer</button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Template */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ajouter un template</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Nom du template</Label>
                  <Input
                    id="template-name"
                    placeholder="Ex: Bienvenue client"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="template-category">Catégorie</Label>
                  <select
                    id="template-category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value as 'email' | 'sms'})}
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="template-content">Contenu</Label>
                  <textarea
                    id="template-content"
                    placeholder="Écrivez le contenu de votre template..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Ajouter le template</Button>
                  <Button variant="outline">Annuler</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EMAIL CAMPAIGN MODAL */}
      <Dialog open={showEmailsModal} onOpenChange={setShowEmailsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une campagne email</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-name">Nom de la campagne</Label>
                <Input
                  id="campaign-name"
                  placeholder="Ex: Promo Juin 2024"
                  value={emailCampaign.campaignName}
                  onChange={(e) => setEmailCampaign({...emailCampaign, campaignName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="template-select">Sélectionner un template</Label>
                <select
                  id="template-select"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={emailCampaign.template}
                  onChange={(e) => setEmailCampaign({...emailCampaign, template: e.target.value})}
                >
                  <option value="">-- Choisir un template --</option>
                  {templates.filter(t => t.category === 'email').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="email-subject">Sujet de l'email</Label>
              <Input
                id="email-subject"
                placeholder="Sujet de votre email"
                value={emailCampaign.subject}
                onChange={(e) => setEmailCampaign({...emailCampaign, subject: e.target.value})}
              />
            </div>

            <div>
              <Label>Destinataires</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={emailCampaign.recipients === 'all'}
                    onChange={() => setEmailCampaign({...emailCampaign, recipients: 'all'})}
                  />
                  <span className="text-sm">Tous les contacts ({contacts.length})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={emailCampaign.recipients === 'selected'}
                    onChange={() => setEmailCampaign({...emailCampaign, recipients: 'selected'})}
                  />
                  <span className="text-sm">Contacts sélectionnés ({selectedEmailContacts.length})</span>
                </label>
              </div>

              {emailCampaign.recipients === 'selected' && (
                <div className="mt-4 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Sélectionner les contacts :</p>
                  <div className="space-y-2">
                    {contacts.map(contact => (
                      <label key={contact.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedEmailContacts.includes(contact.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmailContacts([...selectedEmailContacts, contact.id]);
                            } else {
                              setSelectedEmailContacts(selectedEmailContacts.filter(id => id !== contact.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{contact.firstName} {contact.lastName}</span>
                        <span className="text-xs text-gray-500">({contact.email})</span>
                      </label>
                    ))}
                  </div>
                  {contacts.length === 0 && (
                    <p className="text-xs text-gray-500 italic">Aucun contact disponible</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email-date">Date d'envoi</Label>
                <Input
                  id="email-date"
                  type="date"
                  value={emailCampaign.scheduledDate}
                  onChange={(e) => setEmailCampaign({...emailCampaign, scheduledDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email-time">Heure d'envoi</Label>
                <Input
                  id="email-time"
                  type="time"
                  value={emailCampaign.scheduledTime}
                  onChange={(e) => setEmailCampaign({...emailCampaign, scheduledTime: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Aperçu</p>
              <p className="text-sm font-semibold">{emailCampaign.subject || '(Aucun sujet)'}</p>
              <p className="text-xs text-gray-500 mt-1">Envoi le: {emailCampaign.scheduledDate} à {emailCampaign.scheduledTime || '(Pas d\'heure définie)'}</p>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEmailsModal(false)}>Annuler</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Planifier la campagne</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SMS MODAL */}
      <Dialog open={showSMSModal} onOpenChange={setShowSMSModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Envoyer un SMS</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label htmlFor="sms-message">Message SMS</Label>
              <textarea
                id="sms-message"
                placeholder="Écrivez votre message SMS (160 caractères max pour une partie)"
                rows={4}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm resize-none"
                value={smsMessage.message}
                onChange={(e) => setSmsMessage({...smsMessage, message: e.target.value})}
              />
              <div className="text-xs text-gray-500 mt-1">
                {smsMessage.message.length} / 160 caractères
                {smsMessage.message.length > 160 && ` (${Math.ceil(smsMessage.message.length / 160)} SMS)`}
              </div>
            </div>

            <div>
              <Label>Destinataires</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={smsMessage.recipients === 'all'}
                    onChange={() => setSmsMessage({...smsMessage, recipients: 'all'})}
                  />
                  <span className="text-sm">Tous les contacts ({contacts.length})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={smsMessage.recipients === 'selected'}
                    onChange={() => setSmsMessage({...smsMessage, recipients: 'selected'})}
                  />
                  <span className="text-sm">Contacts sélectionnés ({selectedSmsContacts.length})</span>
                </label>
              </div>

              {smsMessage.recipients === 'selected' && (
                <div className="mt-4 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Sélectionner les contacts :</p>
                  <div className="space-y-2">
                    {contacts.map(contact => (
                      <label key={contact.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedSmsContacts.includes(contact.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSmsContacts([...selectedSmsContacts, contact.id]);
                            } else {
                              setSelectedSmsContacts(selectedSmsContacts.filter(id => id !== contact.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{contact.firstName} {contact.lastName}</span>
                        <span className="text-xs text-gray-500">({contact.mobile || contact.phone})</span>
                      </label>
                    ))}
                  </div>
                  {contacts.length === 0 && (
                    <p className="text-xs text-gray-500 italic">Aucun contact disponible</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sms-date">Date d'envoi</Label>
                <Input
                  id="sms-date"
                  type="date"
                  value={smsMessage.scheduledDate}
                  onChange={(e) => setSmsMessage({...smsMessage, scheduledDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sms-time">Heure d'envoi</Label>
                <Input
                  id="sms-time"
                  type="time"
                  value={smsMessage.scheduledTime}
                  onChange={(e) => setSmsMessage({...smsMessage, scheduledTime: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSMSModal(false)}>Annuler</Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Envoyer le SMS</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* IMPORT/EXPORT MODAL */}
      <Dialog open={showImportExportModal} onOpenChange={setShowImportExportModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import / Export / Dédoublonnage</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Import CSV Section */}
            <div className="border-b pb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Importer un CSV
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Format attendu: Prénom, Nom, Email, Téléphone, Mobile, Poste, Entreprise, Adresse, Statut</p>
                <textarea
                  placeholder="Collez votre contenu CSV ici..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
                  value={csvImportData}
                  onChange={(e) => setCsvImportData(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => importFromCSV(csvImportData)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setCsvImportData('')}
                  >
                    Effacer
                  </Button>
                </div>
              </div>
            </div>

            {/* Export CSV Section */}
            <div className="border-b pb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileDown className="h-5 w-5 text-green-600" />
                Exporter en CSV
              </h3>
              <p className="text-sm text-gray-600 mb-4">Exportez tous vos {contacts.length} contacts au format CSV</p>
              <Button 
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Télécharger CSV
              </Button>
            </div>

            {/* Deduplication Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Dédoublonnage
              </h3>
              <p className="text-sm text-gray-600 mb-4">Détecte et supprime les contacts en doublon basé sur Prénom + Nom + Email</p>
              {deduplicationStats.duplicates > 0 ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <p className="text-sm font-semibold text-green-800">✓ Dédoublonnage effectué!</p>
                  <p className="text-sm text-green-700 mt-1">{deduplicationStats.duplicates} doublon(s) supprimé(s)</p>
                  <p className="text-sm text-green-700">{deduplicationStats.merged} contact(s) conservé(s)</p>
                </div>
              ) : (
                <Button 
                  onClick={deduplicateContacts}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Lancer le dédoublonnage
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FOLLOWUP HISTORY MODAL */}
      <Dialog open={showFollowupModal} onOpenChange={setShowFollowupModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historique des interactions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Sujet</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {followupHistory.map(interaction => (
                    <tr key={interaction.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          interaction.type === 'Email' ? 'bg-blue-500' :
                          interaction.type === 'SMS' ? 'bg-green-500' :
                          interaction.type === 'Appel' ? 'bg-red-500' :
                          'bg-purple-500'
                        }`}>
                          {interaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{interaction.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{interaction.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                          interaction.status === 'Envoyé' ? 'bg-yellow-100 text-yellow-800' :
                          interaction.status === 'Ouvert' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {interaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {followupHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune interaction enregistrée
              </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowFollowupModal(false)}>Fermer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

          {/* Import/Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700 font-medium">
                <Download className="h-4 w-4" />
                Import/Export
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowImportExportModal(true)} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Import CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV} className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                <span>Export CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowImportExportModal(true)} className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Dédoublonnage</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <div className="flex items-center gap-2 pt-2">
                    <a href={`https://wa.me/${contact.mobile.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
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
                      <a href={`https://wa.me/${contact.mobile.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-green-100 rounded-lg transition-colors inline-flex text-green-600 hover:text-green-700" title="Ouvrir WhatsApp">
                        <MessageCircle className="h-5 w-5" />
                      </a>
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
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                          <a href={`https://wa.me/${contact.mobile.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors text-xs">
                            <MessageCircle className="h-3 w-3" />
                            <span>WhatsApp</span>
                          </a>
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
              {/* HEADER WITH PHOTO AND BASIC INFO */}
              <div className="flex items-start gap-6">
                <div>
                  {selectedContact.photo ? (
                    <img src={selectedContact.photo} alt={`${selectedContact.firstName} ${selectedContact.lastName}`} className="w-32 h-32 rounded-lg object-cover border-2 border-blue-200" />
                  ) : (
                    <Avatar className="h-32 w-32">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-4xl">
                        {getInitials(selectedContact.firstName, selectedContact.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedContact.firstName} {selectedContact.lastName}</h2>
                  <p className="text-gray-600 mt-1">{selectedContact.position}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedContact.company}</p>
                  <Badge className={`mt-3 ${
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

              {/* TABS SECTION */}
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 gap-0">
                  <TabsTrigger value="general" className="rounded-l-lg">Général</TabsTrigger>
                  <TabsTrigger value="rattachement">Rattachement</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="qualification" className="rounded-r-lg">Qualification</TabsTrigger>
                </TabsList>

                {/* TAB 1: GENERAL */}
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-bold">Dernier contact</p>
                      <p className="text-gray-900 font-medium">{selectedContact.lastContact}</p>
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
                    <p className="text-xs text-gray-600 uppercase font-bold mb-3">Coordonnées</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedContact.mobile}</span>
                    </div>
                  </div>

                  {selectedContact.address && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-xs text-gray-600 uppercase font-bold mb-2">Adresse</p>
                      <p className="text-sm text-gray-900">{selectedContact.address}</p>
                    </div>
                  )}

                  {selectedContact.linkedIn && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-xs text-gray-600 uppercase font-bold mb-2">LinkedIn</p>
                      <a href={selectedContact.linkedIn} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 underline">
                        Voir le profil →
                      </a>
                    </div>
                  )}
                </TabsContent>

                {/* TAB 2: RATTACHEMENT */}
                <TabsContent value="rattachement" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Liaison compagnie</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {selectedContact.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Historique</span>
                      <span className="ml-auto text-xs text-gray-500">
                        Dernier contact: {selectedContact.lastContact}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Multi-entreprises</span>
                      <span className="ml-auto text-xs text-gray-500">
                        Voir relations
                      </span>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 3: INTERACTIONS */}
                <TabsContent value="interactions" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Emails</span>
                      <span className="ml-auto text-xs text-gray-500">
                        0 emails
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Appels</span>
                      <span className="ml-auto text-xs text-gray-500">
                        0 appels
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200 hover:bg-cyan-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Réunions</span>
                      <span className="ml-auto text-xs text-gray-500">
                        0 réunions
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Notes</span>
                      <span className="ml-auto text-xs text-gray-500">
                        0 notes
                      </span>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 4: QUALIFICATION */}
                <TabsContent value="qualification" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Lead scoring</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {selectedContact.score}/100
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Statut</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {selectedContact.status === 'client' ? '🟢 Client' : 
                         selectedContact.status === 'lead' ? '🔵 Lead' : 
                         '🟠 Partenaire'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Source</span>
                      <span className="ml-auto text-xs text-gray-500">
                        Non définie
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Intérêts</span>
                      <span className="ml-auto text-xs text-gray-500">
                        Ajouter des intérêts
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

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
                    address: selectedContact.address || '',
                    linkedIn: selectedContact.linkedIn || '',
                    photo: selectedContact.photo || '',
                    status: selectedContact.status
                  });
                  setIsEditingContact(true);
                }} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* INFOS PERSO */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Infos personnelles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prénom *</Label>
                    <Input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label>Nom *</Label>
                    <Input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* COORDONNÉES */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Coordonnées</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Téléphone</Label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label>Mobile/WhatsApp</Label>
                      <Input
                        value={editForm.mobile}
                        onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                        className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <Input
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label>Profil LinkedIn</Label>
                    <Input
                      value={editForm.linkedIn}
                      onChange={(e) => setEditForm({ ...editForm, linkedIn: e.target.value })}
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* POSTE & ENTREPRISE */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Poste & Entreprise</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Fonction *</Label>
                    <Input
                      value={editForm.position}
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label>Entreprise *</Label>
                    <Input
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      className="mt-1 border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'lead' | 'client' | 'partner' })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="lead">Lead</option>
                      <option value="client">Client</option>
                      <option value="partner">Partenaire</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PHOTO */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Photo</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover rounded" />
                      ) : selectedContact?.photo ? (
                        <img src={selectedContact.photo} alt="Photo" className="w-full h-full object-cover rounded" />
                      ) : (
                        <span className="text-gray-400 text-xs text-center px-2">Aucune photo</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="photo" className="block text-sm font-medium mb-2">Télécharger une photo</Label>
                      <Input 
                        id="photo" 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPhotoFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPhotoPreview(reader.result as string);
                              setEditForm({ ...editForm, photo: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG ou GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditingContact(false);
                  setShowContactDetails(false);
                }}>
                  Annuler
                </Button>
                <Button onClick={handleEditContact} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600">
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
