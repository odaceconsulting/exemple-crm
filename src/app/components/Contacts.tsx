import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
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
  Calendar
} from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'lead':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'partner':
        return 'bg-purple-100 text-purple-700 border-purple-200';
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
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">Gérez vos contacts et interlocuteurs</p>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700">
                <Plus className="h-4 w-4" />
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

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un contact par nom, entreprise ou poste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <Users className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{contacts.length}</p>
            <p className="text-purple-100 text-sm">Contacts totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {getInitials(contact.firstName, contact.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Dernier contact: {new Date(contact.lastContact).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{contact.position}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{contact.company}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{contact.mobile}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(contact.status)}>
                        {getStatusLabel(contact.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Message">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Planifier">
                          <Calendar className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun contact trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
