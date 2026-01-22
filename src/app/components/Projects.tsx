import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { 
  Briefcase, 
  Plus, 
  Search,
  Calendar,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  FileText,
  User,
  CheckCircle,
  Zap
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  team: string[];
  priority: 'low' | 'medium' | 'high';
}

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showTimesheetDialog, setShowTimesheetDialog] = useState(false);
  
  // Données de timesheet (heures par jour)
  const [timesheetData] = useState([
    { day: 'Lun', hours: 8, member: 'Marie D.' },
    { day: 'Mar', hours: 8, member: 'Marie D.' },
    { day: 'Mer', hours: 7, member: 'Marie D.' },
    { day: 'Jeu', hours: 8, member: 'Marie D.' },
    { day: 'Ven', hours: 7, member: 'Marie D.' },
    { day: 'Lun', hours: 8, member: 'Jean M.' },
    { day: 'Mar', hours: 8, member: 'Jean M.' },
    { day: 'Mer', hours: 8, member: 'Jean M.' },
    { day: 'Jeu', hours: 6, member: 'Jean M.' },
    { day: 'Ven', hours: 8, member: 'Jean M.' },
  ]);

  const projects: Project[] = [
    {
      id: 1,
      name: 'Refonte Site Web',
      client: 'Acme Corporation',
      status: 'active',
      progress: 75,
      budget: 125000,
      spent: 98000,
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      team: ['Marie D.', 'Jean M.', 'Pierre L.'],
      priority: 'high'
    },
    {
      id: 2,
      name: 'Application Mobile',
      client: 'TechStart SAS',
      status: 'active',
      progress: 45,
      budget: 85000,
      spent: 42000,
      startDate: '2026-01-15',
      endDate: '2026-05-15',
      team: ['Sophie B.', 'Luc D.'],
      priority: 'high'
    },
    {
      id: 3,
      name: 'Migration Cloud',
      client: 'Global Industries',
      status: 'completed',
      progress: 100,
      budget: 150000,
      spent: 145000,
      startDate: '2025-11-01',
      endDate: '2026-01-15',
      team: ['Alice R.', 'Thomas P.', 'Emma M.'],
      priority: 'medium'
    },
    {
      id: 4,
      name: 'Système CRM',
      client: 'Digital Solutions',
      status: 'active',
      progress: 60,
      budget: 95000,
      spent: 58000,
      startDate: '2025-12-01',
      endDate: '2026-04-30',
      team: ['Jean M.', 'Marie D.'],
      priority: 'high'
    },
    {
      id: 5,
      name: 'Consulting IT',
      client: 'Innovation Labs',
      status: 'planning',
      progress: 10,
      budget: 55000,
      spent: 5000,
      startDate: '2026-02-01',
      endDate: '2026-06-30',
      team: ['Pierre L.'],
      priority: 'medium'
    },
    {
      id: 6,
      name: 'Infrastructure Réseau',
      client: 'Smart Tech SARL',
      status: 'on-hold',
      progress: 30,
      budget: 75000,
      spent: 25000,
      startDate: '2025-12-15',
      endDate: '2026-03-15',
      team: ['Luc D.', 'Sophie B.'],
      priority: 'low'
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'on-hold':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'planning':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'on-hold':
        return 'En pause';
      case 'planning':
        return 'Planification';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Haute';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Basse';
      default:
        return priority;
    }
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Projets</h1>
          <p className="text-gray-500 mt-1">Suivez et gérez vos projets clients</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Projet
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Projet</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="project-name">Nom du projet *</Label>
                <Input id="project-name" placeholder="Refonte Site Web" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <select id="client" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sélectionner un client</option>
                  <option value="acme">Acme Corporation</option>
                  <option value="techstart">TechStart SAS</option>
                  <option value="global">Global Industries</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select id="status" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="planning">Planification</option>
                  <option value="active">En cours</option>
                  <option value="on-hold">En pause</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (€)</Label>
                <Input id="budget" type="number" placeholder="100000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <select id="priority" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin prévue</Label>
                <Input id="end-date" type="date" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description du projet..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Créer le projet
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
                <p className="text-sm text-gray-600 font-medium">Projets Actifs</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{activeProjects}</p>
                <p className="text-sm text-green-600 mt-1">En cours</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Terminés</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{completedProjects}</p>
                <p className="text-sm text-blue-600 mt-1">Complétés</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
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
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
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
                <p className="text-sm text-orange-600 mt-1">
                  {Math.round((totalSpent / totalBudget) * 100)}% du budget
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un projet par nom ou client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{project.client}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status and Priority */}
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {getPriorityLabel(project.priority)}
                </Badge>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Budget */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-semibold text-gray-900">
                    €{project.budget.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Dépensé</p>
                  <p className="text-sm font-semibold text-gray-900">
                    €{project.spent.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Restant</p>
                  <p className="text-sm font-semibold text-gray-900">
                    €{(project.budget - project.spent).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.startDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.endDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Team */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Équipe:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.team.map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium"
                        title={member}
                      >
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    setSelectedProject(project);
                    setShowDetailsDialog(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  Détails
                </button>
                <button 
                  onClick={() => {
                    setSelectedProject(project);
                    setShowTimesheetDialog(true);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                  Timesheet
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun projet trouvé</p>
          </CardContent>
        </Card>
      )}

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedProject.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Client Info */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Client</p>
                    <p className="text-gray-900 mt-1">{selectedProject.client}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Statut</p>
                    <Badge className={`${getStatusColor(selectedProject.status)} mt-1`}>
                      {getStatusLabel(selectedProject.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Priorité</p>
                    <Badge className={`${getPriorityColor(selectedProject.priority)} mt-1`}>
                      {getPriorityLabel(selectedProject.priority)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Progression</p>
                    <p className="text-gray-900 mt-1 font-semibold">{selectedProject.progress}%</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Calendrier</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Date de début</p>
                    <p className="text-gray-900 mt-1">{new Date(selectedProject.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Date de fin prévue</p>
                    <p className="text-gray-900 mt-1">{new Date(selectedProject.endDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Jours restants</p>
                    <p className="text-gray-900 mt-1">
                      {Math.ceil((new Date(selectedProject.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Budget</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 font-medium">Budget total</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">€{selectedProject.budget.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-600 font-medium">Dépensé</p>
                      <p className="text-lg font-bold text-green-600 mt-1">€{selectedProject.spent.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-gray-600 font-medium">Restant</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">€{(selectedProject.budget - selectedProject.spent).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Utilisation du budget</span>
                      <span className="font-semibold">{Math.round((selectedProject.spent / selectedProject.budget) * 100)}%</span>
                    </div>
                    <Progress value={(selectedProject.spent / selectedProject.budget) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="border-b pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Équipe assignée</h3>
                <div className="space-y-2">
                  {selectedProject.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member}</p>
                        <p className="text-xs text-gray-500">Développeur</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tâches du projet</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-900">Analyse des besoins</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-900">Conception</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-900">Développement en cours</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-900">Tests qualité</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-900">Déploiement</span>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowDetailsDialog(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              Fermer
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Timesheet Dialog */}
      {selectedProject && (
        <Dialog open={showTimesheetDialog} onOpenChange={setShowTimesheetDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Feuille de temps - {selectedProject.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Weekly Summary */}
              <div className="grid grid-cols-5 gap-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map((day) => {
                  const dayHours = timesheetData
                    .filter(t => t.day === day)
                    .reduce((sum, t) => sum + t.hours, 0);
                  return (
                    <div key={day} className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-sm font-medium text-gray-600">{day}</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">{dayHours}h</p>
                    </div>
                  );
                })}
              </div>

              {/* Timesheet Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Détail des heures par collaborateur</h3>
                <div className="space-y-4">
                  {['Marie D.', 'Jean M.', 'Pierre L.'].map((member) => {
                    const memberHours = timesheetData
                      .filter(t => t.member === member)
                      .reduce((sum, t) => sum + t.hours, 0);
                    const memberData = timesheetData.filter(t => t.member === member);
                    
                    return (
                      <div key={member} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{member}</p>
                            <p className="text-sm text-gray-600">Total: <span className="font-bold text-blue-600">{memberHours}h</span> cette semaine</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map((day) => {
                            const dayData = memberData.find(t => t.day === day);
                            const hours = dayData?.hours || 0;
                            return (
                              <div key={day} className="bg-white p-2 rounded border border-gray-200">
                                <p className="text-xs text-gray-600 text-center">{day}</p>
                                <p className="text-lg font-bold text-center text-gray-900">{hours}h</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Résumé</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">Heures planifiées</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">40h</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">Heures enregistrées</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {timesheetData.reduce((sum, t) => sum + t.hours, 0)}h
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">Coût estimé</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      €{(timesheetData.reduce((sum, t) => sum + t.hours, 0) * 85).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowTimesheetDialog(false)} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              Fermer
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Projects;
