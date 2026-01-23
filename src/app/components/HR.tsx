import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { 
  UserSquare2, 
  Plus, 
  Search,
  Phone,
  Mail,
  Calendar,
  FileText,
  Briefcase,
  Award,
  Clock,
  MapPin,
  Zap,
  CheckCircle,
  AlertCircle,
  Grid3x3,
  List,
  Kanban
} from 'lucide-react';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  skills: string[];
  availability: number;
}

const HR = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeCard, setShowEmployeeCard] = useState(false);

  const employees: Employee[] = [
    {
      id: 1,
      firstName: 'Marie',
      lastName: 'Dupont',
      position: 'Responsable Commercial',
      department: 'Commercial',
      email: 'marie.dupont@entreprise.fr',
      phone: '+33 6 12 34 56 78',
      hireDate: '2023-03-15',
      status: 'active',
      skills: ['Vente', 'Négociation', 'CRM'],
      availability: 100
    },
    {
      id: 2,
      firstName: 'Jean',
      lastName: 'Martin',
      position: 'Développeur Full Stack',
      department: 'IT',
      email: 'jean.martin@entreprise.fr',
      phone: '+33 6 23 45 67 89',
      hireDate: '2022-06-01',
      status: 'active',
      skills: ['React', 'Node.js', 'MongoDB'],
      availability: 80
    },
    {
      id: 3,
      firstName: 'Sophie',
      lastName: 'Bernard',
      position: 'Chef de Projet',
      department: 'Management',
      email: 'sophie.bernard@entreprise.fr',
      phone: '+33 6 34 56 78 90',
      hireDate: '2021-09-10',
      status: 'active',
      skills: ['Gestion de projet', 'Agile', 'Scrum'],
      availability: 90
    },
    {
      id: 4,
      firstName: 'Pierre',
      lastName: 'Leclerc',
      position: 'Designer UX/UI',
      department: 'Design',
      email: 'pierre.leclerc@entreprise.fr',
      phone: '+33 6 45 67 89 01',
      hireDate: '2023-01-20',
      status: 'active',
      skills: ['Figma', 'Adobe XD', 'Prototypage'],
      availability: 100
    },
    {
      id: 5,
      firstName: 'Luc',
      lastName: 'Dubois',
      position: 'Directeur Technique',
      department: 'IT',
      email: 'luc.dubois@entreprise.fr',
      phone: '+33 6 56 78 90 12',
      hireDate: '2020-04-15',
      status: 'active',
      skills: ['Architecture', 'DevOps', 'Cloud'],
      availability: 70
    },
    {
      id: 6,
      firstName: 'Alice',
      lastName: 'Rousseau',
      position: 'Responsable Marketing',
      department: 'Marketing',
      email: 'alice.rousseau@entreprise.fr',
      phone: '+33 6 67 89 01 23',
      hireDate: '2022-11-01',
      status: 'active',
      skills: ['Marketing Digital', 'SEO', 'Réseaux sociaux'],
      availability: 100
    },
    {
      id: 7,
      firstName: 'Thomas',
      lastName: 'Petit',
      position: 'Comptable',
      department: 'Finance',
      email: 'thomas.petit@entreprise.fr',
      phone: '+33 6 78 90 12 34',
      hireDate: '2021-07-15',
      status: 'on-leave',
      skills: ['Comptabilité', 'Fiscalité', 'Audit'],
      availability: 0
    },
    {
      id: 8,
      firstName: 'Emma',
      lastName: 'Moreau',
      position: 'Développeur Frontend',
      department: 'IT',
      email: 'emma.moreau@entreprise.fr',
      phone: '+33 6 89 01 23 45',
      hireDate: '2023-08-01',
      status: 'active',
      skills: ['React', 'TypeScript', 'CSS'],
      availability: 100
    }
  ];

  const departments = [
    { name: 'Commercial', count: employees.filter(e => e.department === 'Commercial').length, color: 'bg-blue-500' },
    { name: 'IT', count: employees.filter(e => e.department === 'IT').length, color: 'bg-purple-500' },
    { name: 'Management', count: employees.filter(e => e.department === 'Management').length, color: 'bg-green-500' },
    { name: 'Design', count: employees.filter(e => e.department === 'Design').length, color: 'bg-pink-500' },
    { name: 'Marketing', count: employees.filter(e => e.department === 'Marketing').length, color: 'bg-orange-500' },
    { name: 'Finance', count: employees.filter(e => e.department === 'Finance').length, color: 'bg-yellow-500' }
  ];

  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'on-leave':
        return 'bg-orange-100 text-orange-700 border-orange-200';
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
      case 'on-leave':
        return 'En congé';
      case 'inactive':
        return 'Inactif';
      default:
        return status;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 80) return 'text-green-600';
    if (availability >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'on-leave').length;
  const averageAvailability = Math.round(
    employees.reduce((sum, e) => sum + e.availability, 0) / employees.length
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Ressources Humaines</h1>
          <p className="text-gray-500 mt-1">Gérez vos collaborateurs et ressources</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700">
              <Plus className="h-4 w-4" />
              Nouveau Collaborateur
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un Collaborateur</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Prénom *</Label>
                <Input id="first-name" placeholder="Marie" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Nom *</Label>
                <Input id="last-name" placeholder="Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Poste *</Label>
                <Input id="position" placeholder="Responsable Commercial" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <select id="department" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sélectionner</option>
                  <option value="Commercial">Commercial</option>
                  <option value="IT">IT</option>
                  <option value="Management">Management</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="marie.dupont@entreprise.fr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+33 6 12 34 56 78" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire-date">Date d'embauche</Label>
                <Input id="hire-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select id="status" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="active">Actif</option>
                  <option value="on-leave">En congé</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="skills">Compétences</Label>
                <Input id="skills" placeholder="React, Node.js, MongoDB (séparées par des virgules)" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Effectif Total</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{employees.length}</p>
                <p className="text-sm text-gray-600 mt-1">Collaborateurs</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserSquare2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Actifs</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{activeEmployees}</p>
                <p className="text-sm text-green-600 mt-1">En poste</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <UserSquare2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">En Congé</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{onLeaveEmployees}</p>
                <p className="text-sm text-orange-600 mt-1">Absents</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Disponibilité Moy.</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{averageAvailability}%</p>
                <p className="text-sm text-gray-600 mt-1">Capacité</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departments */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Répartition par Département</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((dept, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 ${dept.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-lg">{dept.count}</p>
                <p className="text-sm text-gray-600">{dept.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and View Mode */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un collaborateur par nom, poste ou département..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Vue grille"
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Vue liste"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Vue kanban"
              >
                <Kanban className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-medium">
                    {getInitials(employee.firstName, employee.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                  <Badge variant="outline" className="mt-2">
                    {employee.department}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Depuis {new Date(employee.hireDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Disponibilité</span>
                  <span className={`font-medium ${getAvailabilityColor(employee.availability)}`}>
                    {employee.availability}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      employee.availability >= 80 ? 'bg-green-500' :
                      employee.availability >= 50 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${employee.availability}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Award className="h-4 w-4" />
                  <span>Compétences:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {employee.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Badge className={getStatusColor(employee.status)}>
                  {getStatusLabel(employee.status)}
                </Badge>
                <button 
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowEmployeeCard(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Fiche
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Employees List View */}
      {viewMode === 'list' && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                              {getInitials(employee.firstName, employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><Badge variant="outline">{employee.department}</Badge></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getAvailabilityColor(employee.availability)}`}>
                          {employee.availability}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(employee.status)}>
                          {getStatusLabel(employee.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEmployeeCard(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmployees.length === 0 && (
              <div className="p-12 text-center">
                <UserSquare2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun collaborateur trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Employees Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['active', 'on-leave', 'inactive'].map((status) => {
            const statusEmployees = filteredEmployees.filter(e => e.status === status as any);
            const statusLabels = {
              active: 'Actifs',
              'on-leave': 'En Congé',
              inactive: 'Inactifs'
            };
            const statusColors = {
              active: 'bg-green-50 border-green-200',
              'on-leave': 'bg-orange-50 border-orange-200',
              inactive: 'bg-gray-50 border-gray-200'
            };
            const iconColors = {
              active: 'text-green-600',
              'on-leave': 'text-orange-600',
              inactive: 'text-gray-600'
            };

            return (
              <div key={status} className={`${statusColors[status as keyof typeof statusColors]} border-2 rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-4">
                  {status === 'active' && <CheckCircle className={`h-5 w-5 ${iconColors[status]}`} />}
                  {status === 'on-leave' && <Clock className={`h-5 w-5 ${iconColors[status]}`} />}
                  {status === 'inactive' && <AlertCircle className={`h-5 w-5 ${iconColors[status]}`} />}
                  <h3 className="font-bold text-gray-900">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </h3>
                  <span className="ml-auto bg-white px-2 py-1 rounded text-xs font-bold text-gray-700">
                    {statusEmployees.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusEmployees.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucun collaborateur
                    </div>
                  ) : (
                    statusEmployees.map((employee) => (
                      <Card key={employee.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white cursor-move">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                                {getInitials(employee.firstName, employee.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">{employee.position}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1 py-2 border-t border-b border-gray-200 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Département:</span>
                              <span className="font-medium text-gray-900">{employee.department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Disponibilité:</span>
                              <span className={`font-medium ${getAvailabilityColor(employee.availability)}`}>
                                {employee.availability}%
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowEmployeeCard(true);
                            }}
                            className="w-full mt-3 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
                            Voir fiche
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

        {/* Employee Card Dialog */}
        {selectedEmployee && (
          <Dialog open={showEmployeeCard} onOpenChange={setShowEmployeeCard}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Fiche Collaborateur</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Profile Header */}
                <div className="flex items-start gap-6 pb-6 border-b">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                      {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h2>
                    <p className="text-lg text-gray-600 mt-1">{selectedEmployee.position}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline" className="text-sm">
                        {selectedEmployee.department}
                      </Badge>
                      <Badge className={`${getStatusColor(selectedEmployee.status)} text-sm`}>
                        {getStatusLabel(selectedEmployee.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Informations de contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Email</p>
                        <p className="text-gray-900">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Téléphone</p>
                        <p className="text-gray-900">{selectedEmployee.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Informations d'emploi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Date d'embauche</p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {new Date(selectedEmployee.hireDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Ancienneté</p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {Math.floor((new Date().getTime() - new Date(selectedEmployee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} ans
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Compétences
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Disponibilité
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700 font-medium">Taux de disponibilité</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedEmployee.availability}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          selectedEmployee.availability >= 80 ? 'bg-green-500' :
                          selectedEmployee.availability >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedEmployee.availability}%` }}
                      ></div>
                    </div>
                    {selectedEmployee.availability < 100 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {100 - selectedEmployee.availability}% occupé sur d'autres projets
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Summary */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Résumé du statut</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-900">
                        {selectedEmployee.status === 'active' 
                          ? 'Actuellement actif et disponible' 
                          : selectedEmployee.status === 'on-leave'
                          ? 'En congé'
                          : 'Inactif'}
                      </span>
                    </div>
                    {selectedEmployee.availability < 50 && (
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <span className="text-gray-900">
                          Disponibilité limitée - Consulter avant d'assigner des tâches
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowEmployeeCard(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Fermer
              </Button>
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
};

export default HR;
