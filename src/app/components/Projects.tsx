import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { 
  Briefcase, 
  Plus, 
  Search,
  Users,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Calendar,
  Zap,
  Target,
  PieChart,
  Clock,
  GitBranch,
  Eye,
  Trash,
  MoreVertical,
  Edit2
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
  type: 'forfait' | 'régie' | 'centre-services';
  margin?: number;
  tasks?: number;
  completedTasks?: number;
}

interface Resource {
  id: number;
  name: string;
  role: string;
  hours: number;
  rate: number;
  utilization: number;
  projects: string[];
}

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Project | null>(null);
  const [newTeamMember, setNewTeamMember] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isResourceDetailsOpen, setIsResourceDetailsOpen] = useState(false);
  const [isResourceEditOpen, setIsResourceEditOpen] = useState(false);
  const [isAddProjectToResourceOpen, setIsAddProjectToResourceOpen] = useState(false);
  const [editResourceData, setEditResourceData] = useState<Resource | null>(null);
  const [newProjectForResource, setNewProjectForResource] = useState<string>('');

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
      priority: 'high',
      type: 'forfait',
      margin: 27,
      tasks: 24,
      completedTasks: 18
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
      priority: 'high',
      type: 'régie',
      margin: 45,
      tasks: 32,
      completedTasks: 14
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
      priority: 'medium',
      type: 'forfait',
      margin: 3,
      tasks: 28,
      completedTasks: 28
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
      priority: 'high',
      type: 'centre-services',
      margin: 35,
      tasks: 20,
      completedTasks: 12
    },
  ];

  const resources: Resource[] = [
    {
      id: 1,
      name: 'Marie Dupont',
      role: 'Développeuse Senior',
      hours: 160,
      rate: 85,
      utilization: 85,
      projects: ['Refonte Site Web', 'Système CRM']
    },
    {
      id: 2,
      name: 'Jean Martin',
      role: 'Architecte Solutions',
      hours: 140,
      rate: 95,
      utilization: 75,
      projects: ['Refonte Site Web', 'Système CRM']
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      role: 'Développeuse Mobile',
      hours: 120,
      rate: 80,
      utilization: 90,
      projects: ['Application Mobile']
    },
    {
      id: 4,
      name: 'Alice Rousseau',
      role: 'Cheffe de Projet',
      hours: 100,
      rate: 75,
      utilization: 95,
      projects: ['Migration Cloud']
    },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'on-hold': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'planning': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'forfait': return 'bg-indigo-100 text-indigo-800';
      case 'régie': return 'bg-cyan-100 text-cyan-800';
      case 'centre-services': return 'bg-violet-100 text-violet-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const totalRevenue = totalBudget;
  const totalMargin = totalRevenue - totalSpent;
  const avgMarginPercent = ((totalMargin / totalRevenue) * 100).toFixed(1);

  const projectsByType = {
    forfait: projects.filter(p => p.type === 'forfait').reduce((sum, p) => sum + p.budget, 0),
    régie: projects.filter(p => p.type === 'régie').reduce((sum, p) => sum + p.budget, 0),
    'centre-services': projects.filter(p => p.type === 'centre-services').reduce((sum, p) => sum + p.budget, 0),
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setEditFormData({ ...project });
    setNewTeamMember('');
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      // TODO: Implement actual delete logic
      console.log('Deleting project:', projectToDelete);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleSaveChanges = () => {
    if (editFormData) {
      // TODO: Implement actual save logic
      console.log('Saving changes for project:', editFormData);
      setIsDetailsDialogOpen(false);
    }
  };

  const handleAddTeamMember = () => {
    if (editFormData && newTeamMember && !editFormData.team.includes(newTeamMember)) {
      setEditFormData({
        ...editFormData,
        team: [...editFormData.team, newTeamMember]
      });
      setNewTeamMember('');
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        team: editFormData.team.filter(m => m !== member)
      });
    }
  };

  const handleResourceDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setIsResourceDetailsOpen(true);
  };

  const handleResourceEdit = (resource: Resource) => {
    setEditResourceData({ ...resource });
    setIsResourceEditOpen(true);
  };

  const handleSaveResourceChanges = () => {
    if (editResourceData) {
      // TODO: Implement actual save logic
      console.log('Saving resource changes:', editResourceData);
      setIsResourceEditOpen(false);
    }
  };

  const handleAddProjectToResource = () => {
    if (editResourceData && newProjectForResource && !editResourceData.projects.includes(newProjectForResource)) {
      setEditResourceData({
        ...editResourceData,
        projects: [...editResourceData.projects, newProjectForResource]
      });
      setNewProjectForResource('');
    }
  };

  const handleRemoveProjectFromResource = (project: string) => {
    if (editResourceData) {
      setEditResourceData({
        ...editResourceData,
        projects: editResourceData.projects.filter(p => p !== project)
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              Gestion de Projets
            </h1>
            <p className="text-gray-600 mt-2">Suivi complet des projets, ressources et rentabilité</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 border-2 border-indigo-700 shadow-lg hover:shadow-xl">
                <Plus className="h-5 w-5" />
                <span className="font-semibold">Nouveau Projet</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg md:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Créer un nouveau projet</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nom du projet *</Label>
                  <Input id="project-name" placeholder="Ex: Refonte site web" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input id="client" placeholder="Ex: Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (€) *</Label>
                  <Input id="budget" type="number" placeholder="125000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type de prestation</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>Forfait</option>
                    <option>Régie</option>
                    <option>Centre de services</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="team">Assigner des membres de l'équipe *</Label>
                  <select id="team" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Sélectionner des membres...</option>
                    {resources.map(resource => (
                      <option key={resource.id} value={resource.name}>
                        {resource.name} - {resource.role}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Vous pouvez ajouter plusieurs membres via le formulaire de détails après création</p>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" rows={3} placeholder="Description du projet..."></textarea>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700" onClick={() => setIsAddDialogOpen(false)}>Créer le projet</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un projet ou client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-2 border-gray-200 focus:border-indigo-500 h-11"
          />
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 my-6 sm:my-8 mb-12 sm:mb-16 md:mb-20 bg-transparent border-0 p-0">
          <TabsTrigger 
            value="overview" 
            className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="inline">Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
          >
            <Briefcase className="h-4 w-4" />
            <span className="inline">Projets</span>
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
          >
            <Users className="h-4 w-4" />
            <span className="inline">Ressources</span>
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
          >
            <GitBranch className="h-4 w-4" />
            <span className="inline">Prestations</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
          >
            <Target className="h-4 w-4" />
            <span className="inline">Tâches</span>
          </TabsTrigger>
          <TabsTrigger 
            value="finance" 
            className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
          >
            <DollarSign className="h-4 w-4" />
            <span className="inline">Finance</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Revenus Totaux</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{(totalRevenue / 1000).toFixed(0)}K€</p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Dépenses</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{(totalSpent / 1000).toFixed(0)}K€</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Marge Totale</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{(totalMargin / 1000).toFixed(0)}K€</p>
                    <p className="text-xs text-gray-500 mt-1">{avgMarginPercent}% de marge</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Projets Actifs</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{projects.filter(p => p.status === 'active').length}</p>
                    <p className="text-xs text-gray-500 mt-1">En cours</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="border-b border-gray-200 pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  Revenus par Type de Prestation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Forfait</span>
                    <span className="text-sm font-bold text-indigo-600">{(projectsByType.forfait / 1000).toFixed(0)}K€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all" style={{ width: `${(projectsByType.forfait / totalBudget) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Régie</span>
                    <span className="text-sm font-bold text-cyan-600">{(projectsByType.régie / 1000).toFixed(0)}K€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all" style={{ width: `${(projectsByType.régie / totalBudget) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Centre de services</span>
                    <span className="text-sm font-bold text-violet-600">{(projectsByType['centre-services'] / 1000).toFixed(0)}K€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full transition-all" style={{ width: `${(projectsByType['centre-services'] / totalBudget) * 100}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="border-b border-gray-200 pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Budget vs Dépenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Budget Total:</span>
                    <span className="font-bold text-gray-900">{(totalBudget / 1000).toFixed(0)}K€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm mt-4">
                    <span className="text-gray-700">Dépenses:</span>
                    <span className="font-bold text-orange-600">{(totalSpent / 1000).toFixed(0)}K€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all" style={{ width: `${(totalSpent / totalBudget) * 100}%` }}></div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Disponible:</span>
                      <span className="font-bold text-emerald-600">{((totalBudget - totalSpent) / 1000).toFixed(0)}K€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. PROJECTS TAB */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 bg-white">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Aucun projet trouvé</p>
                </CardContent>
              </Card>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg">
                              <Briefcase className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                              <p className="text-sm text-gray-600">{project.client}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status === 'active' ? '🟢 Actif' : 
                             project.status === 'completed' ? '✅ Complété' :
                             project.status === 'on-hold' ? '⏸️ En attente' : '📋 Planification'}
                          </Badge>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getTypeColor(project.type)}>
                            {project.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Avancement</p>
                          <div className="mt-2 space-y-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <p className="text-sm font-bold text-indigo-600">{project.progress}%</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Tâches</p>
                          <p className="text-sm font-bold text-gray-900 mt-2">{project.completedTasks}/{project.tasks}</p>
                          <p className="text-xs text-gray-600">complétées</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Budget</p>
                          <p className="text-sm font-bold text-gray-900 mt-2">{(project.budget / 1000).toFixed(0)}K€</p>
                          <p className="text-xs text-gray-600">alloué</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Marge</p>
                          <p className={`text-sm font-bold mt-2 ${project.margin! >= 20 ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {project.margin}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                        <Users className="h-4 w-4 text-gray-500" />
                        <div className="flex flex-wrap gap-2">
                          {project.team.map((member, idx) => (
                            <Badge key={idx} variant="outline" className="bg-gray-50">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Project Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-200 justify-end relative z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-center h-9 w-9 px-2 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewDetails(project)}>
                              <Eye className="h-4 w-4 mr-2" />
                              <span>Voir les détails</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(project.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                              <Trash className="h-4 w-4 mr-2" />
                              <span>Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* 3. RESOURCES TAB */}
        <TabsContent value="resources" className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 font-medium mb-2">Charge Moyenne</p>
                <p className="text-3xl font-bold text-indigo-600">{(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length).toFixed(0)}%</p>
                <p className="text-xs text-gray-500 mt-1">Équipe</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 font-medium mb-2">Revenu Collaborateurs</p>
                <p className="text-3xl font-bold text-emerald-600">{(resources.reduce((sum, r) => sum + (r.rate * r.hours), 0) / 1000).toFixed(0)}K€</p>
                <p className="text-xs text-gray-500 mt-1">/mois</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 font-medium mb-2">Heures Totales</p>
                <p className="text-3xl font-bold text-blue-600">{resources.reduce((sum, r) => sum + r.hours, 0)}h</p>
                <p className="text-xs text-gray-500 mt-1">/mois</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 font-medium mb-2">Taux Moyen</p>
                <p className="text-3xl font-bold text-purple-600">{(resources.reduce((sum, r) => sum + r.rate, 0) / resources.length).toFixed(0)}€/h</p>
                <p className="text-xs text-gray-500 mt-1">Tarif horaire</p>
              </CardContent>
            </Card>
          </div>

          {/* Resources Detail Cards */}
          <div className="grid grid-cols-1 gap-4">
            {resources.map((resource) => {
              const monthlyRevenue = resource.rate * resource.hours;
              const performanceScore = Math.min(100, resource.utilization + (resource.hours > 140 ? 10 : 0));
              
              return (
                <Card key={resource.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header with Name and Actions */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{resource.name}</h3>
                          <p className="text-sm text-gray-600">{resource.role}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                            onClick={() => handleResourceDetails(resource)}
                          >
                            Détails
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => handleResourceEdit(resource)}
                          >
                            Modifier
                          </Button>
                        </div>
                      </div>

                      {/* Time and Billing Information */}
                      <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Heures</p>
                          <p className="text-xl font-bold text-indigo-600 mt-1">{resource.hours}h</p>
                          <p className="text-xs text-gray-600">/mois</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Taux</p>
                          <p className="text-xl font-bold text-blue-600 mt-1">{resource.rate}€</p>
                          <p className="text-xs text-gray-600">/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Revenu</p>
                          <p className="text-xl font-bold text-emerald-600 mt-1">{(monthlyRevenue / 1000).toFixed(0)}K€</p>
                          <p className="text-xs text-gray-600">/mois</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Charge</p>
                          <p className={`text-xl font-bold mt-1 ${resource.utilization >= 80 ? 'text-emerald-600' : resource.utilization >= 60 ? 'text-amber-600' : 'text-orange-600'}`}>
                            {resource.utilization}%
                          </p>
                          <p className="text-xs text-gray-600">Utilisation</p>
                        </div>
                      </div>

                      {/* Utilization Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">Taux d'utilisation</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${resource.utilization >= 80 ? 'text-emerald-600' : resource.utilization >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                              {resource.utilization}%
                            </span>
                            {resource.utilization >= 80 && <Badge className="bg-emerald-100 text-emerald-800 text-xs">✓ Optimal</Badge>}
                            {resource.utilization < 80 && resource.utilization >= 60 && <Badge className="bg-amber-100 text-amber-800 text-xs">⚠ À adapter</Badge>}
                            {resource.utilization < 60 && <Badge className="bg-red-100 text-red-800 text-xs">✗ Sous-utilisé</Badge>}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all" style={{ width: `${resource.utilization}%` }}></div>
                        </div>
                      </div>

                      {/* Performance Score */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">Score de Performance</span>
                          <span className="text-sm font-bold text-indigo-600">{performanceScore.toFixed(0)}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all" style={{ width: `${performanceScore}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {performanceScore >= 90 ? '⭐ Excellent' : performanceScore >= 75 ? '⭐ Très bon' : performanceScore >= 60 ? '⭐ Bon' : 'À améliorer'}
                        </p>
                      </div>

                      {/* Projects Assignment */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Affectation aux projets</p>
                        <div className="flex flex-wrap gap-2">
                          {resource.projects.map((proj, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200">
                              <span className="text-sm font-medium text-indigo-900">{proj}</span>
                              <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">×</button>
                            </div>
                          ))}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => {
                              setEditResourceData({ ...resource });
                              setIsAddProjectToResourceOpen(true);
                            }}
                          >
                            + Ajouter projet
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add Resource Button */}
          {/* <div className="flex justify-center pt-4">
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-2 border-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une ressource
            </Button>
          </div> */}
        </TabsContent>

        {/* 4. SERVICES TAB */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: 'Forfait', revenue: projectsByType.forfait, count: projects.filter(p => p.type === 'forfait').length, color: 'from-indigo-600 to-indigo-700', icon: '📦' },
              { type: 'Régie', revenue: projectsByType.régie, count: projects.filter(p => p.type === 'régie').length, color: 'from-cyan-600 to-cyan-700', icon: '⏱️' },
              { type: 'Centre de services', revenue: projectsByType['centre-services'], count: projects.filter(p => p.type === 'centre-services').length, color: 'from-violet-600 to-violet-700', icon: '🎯' },
            ].map((service) => (
              <Card key={service.type} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{service.type}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{(service.revenue / 1000).toFixed(0)}K€</p>
                    </div>
                    <div className="text-3xl">{service.icon}</div>
                  </div>
                  <p className="text-sm text-gray-600">{service.count} projet{service.count > 1 ? 's' : ''}</p>
                  <div className={`mt-4 p-3 rounded-lg bg-gradient-to-r ${service.color}`}>
                    <p className="text-white text-xs font-semibold">Type de facturation clé</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 5. TASKS TAB */}
        <TabsContent value="tasks" className="space-y-4">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" />
                Avancement des Tâches par Projet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{project.name}</h4>
                      <span className="text-sm font-bold text-indigo-600">
                        {project.completedTasks}/{project.tasks} tâches
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all" style={{ width: `${(project.completedTasks! / project.tasks!) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {Math.round((project.completedTasks! / project.tasks!) * 100)}% complété
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. FINANCE TAB */}
        <TabsContent value="finance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="border-b border-gray-200 pb-4">
                <CardTitle className="text-base font-bold text-gray-900">Revenus Totaux</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-indigo-600">{(totalRevenue / 1000).toFixed(0)}K€</p>
                <p className="text-sm text-gray-600 mt-2">Tous les projets</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="border-b border-gray-200 pb-4">
                <CardTitle className="text-base font-bold text-gray-900">Coûts Totaux</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-orange-600">{(totalSpent / 1000).toFixed(0)}K€</p>
                <p className="text-sm text-gray-600 mt-2">{((totalSpent / totalRevenue) * 100).toFixed(1)}% des revenus</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="border-b border-gray-200 pb-4">
                <CardTitle className="text-base font-bold text-gray-900">Rentabilité</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-4xl font-bold text-emerald-600">{avgMarginPercent}%</p>
                <p className="text-sm text-gray-600 mt-2">Marge moyenne</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Analyse Financière par Projet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b-2 border-gray-300">
                    <tr>
                      <th className="text-left py-3 px-2 font-bold text-gray-900">Projet</th>
                      <th className="text-right py-3 px-2 font-bold text-gray-900">Budget</th>
                      <th className="text-right py-3 px-2 font-bold text-gray-900">Dépenses</th>
                      <th className="text-right py-3 px-2 font-bold text-gray-900">Marge</th>
                      <th className="text-right py-3 px-2 font-bold text-gray-900">Marge %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="py-3 px-2 font-semibold text-gray-900">{project.name}</td>
                        <td className="text-right py-3 px-2 font-bold text-indigo-600">{(project.budget / 1000).toFixed(0)}K€</td>
                        <td className="text-right py-3 px-2 font-bold text-orange-600">{(project.spent / 1000).toFixed(0)}K€</td>
                        <td className="text-right py-3 px-2 font-bold text-emerald-600">{((project.budget - project.spent) / 1000).toFixed(0)}K€</td>
                        <td className={`text-right py-3 px-2 font-bold ${project.margin! >= 20 ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {project.margin}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Détails du Projet</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-6 py-4">
              {/* Project Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-semibold">Nom du projet</Label>
                  <Input 
                    id="edit-name" 
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-client" className="text-sm font-semibold">Client</Label>
                  <Input 
                    id="edit-client" 
                    value={editFormData.client}
                    onChange={(e) => setEditFormData({...editFormData, client: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-sm font-semibold">Statut</Label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value as any})}
                  >
                    <option value="planning">Planification</option>
                    <option value="active">Actif</option>
                    <option value="on-hold">En attente</option>
                    <option value="completed">Complété</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority" className="text-sm font-semibold">Priorité</Label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value as any})}
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-sm font-semibold">Type de prestation</Label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({...editFormData, type: e.target.value as any})}
                  >
                    <option value="forfait">Forfait</option>
                    <option value="régie">Régie</option>
                    <option value="centre-services">Centre de services</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-progress" className="text-sm font-semibold">Avancement (%)</Label>
                  <Input 
                    id="edit-progress" 
                    type="number" 
                    value={editFormData.progress}
                    onChange={(e) => setEditFormData({...editFormData, progress: parseInt(e.target.value) || 0})}
                    min="0" 
                    max="100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budget" className="text-sm font-semibold">Budget (€)</Label>
                  <Input 
                    id="edit-budget" 
                    type="number" 
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({...editFormData, budget: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-spent" className="text-sm font-semibold">Dépenses (€)</Label>
                  <Input 
                    id="edit-spent" 
                    type="number" 
                    value={editFormData.spent}
                    onChange={(e) => setEditFormData({...editFormData, spent: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-start" className="text-sm font-semibold">Date de début</Label>
                  <Input 
                    id="edit-start" 
                    type="date" 
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end" className="text-sm font-semibold">Date de fin</Label>
                  <Input 
                    id="edit-end" 
                    type="date" 
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tasks" className="text-sm font-semibold">Nombre de tâches</Label>
                  <Input 
                    id="edit-tasks" 
                    type="number" 
                    value={editFormData.tasks}
                    onChange={(e) => setEditFormData({...editFormData, tasks: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-completed" className="text-sm font-semibold">Tâches complétées</Label>
                  <Input 
                    id="edit-completed" 
                    type="number" 
                    value={editFormData.completedTasks}
                    onChange={(e) => setEditFormData({...editFormData, completedTasks: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* Team Members Assignment */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Label className="text-sm font-semibold">Assigner un membre de l'équipe</Label>
                <div className="flex gap-2">
                  <select 
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Sélectionner un membre...</option>
                    {resources.map(resource => (
                      <option key={resource.id} value={resource.name}>
                        {resource.name} - {resource.role}
                      </option>
                    ))}
                  </select>
                  <Button 
                    onClick={handleAddTeamMember}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Current Team Members */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Label className="text-sm font-semibold">Membres de l'équipe actuels</Label>
                <div className="flex flex-wrap gap-2">
                  {editFormData.team.map((member, idx) => (
                    <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">
                      {member}
                      <button 
                        onClick={() => handleRemoveTeamMember(member)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Label htmlFor="edit-description" className="text-sm font-semibold">Description</Label>
                <textarea 
                  id="edit-description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" 
                  rows={4} 
                  placeholder="Description du projet..."
                ></textarea>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 pt-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Marge</p>
                  <p className={`text-lg font-bold mt-1 ${(editFormData.budget - editFormData.spent) > 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {editFormData.budget - editFormData.spent}€
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Marge %</p>
                  <p className={`text-lg font-bold mt-1 ${editFormData.margin! >= 20 ? 'text-emerald-600' : 'text-orange-600'}`}>
                    {editFormData.margin}%
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Annuler</Button>
                <Button 
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 my-4">
            <p className="text-sm text-red-800">
              <strong>Attention :</strong> La suppression d'un projet supprimera également tous les détails, tâches et ressources associées.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer le projet
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resource Details Dialog */}
      <Dialog open={isResourceDetailsOpen} onOpenChange={setIsResourceDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Détails de la Ressource</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nom</Label>
                  <p className="text-gray-900 font-medium">{selectedResource.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Poste</Label>
                  <p className="text-gray-900 font-medium">{selectedResource.role}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Heures/mois</Label>
                  <p className="text-gray-900 font-medium">{selectedResource.hours}h</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Taux horaire</Label>
                  <p className="text-gray-900 font-medium">{selectedResource.rate}€/h</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Label className="text-sm font-semibold">Taux d'utilisation</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all" style={{ width: `${selectedResource.utilization}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 min-w-fit">{selectedResource.utilization}%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Label className="text-sm font-semibold">Projets assignés</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.projects.map((proj, idx) => (
                    <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">
                      {proj}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsResourceDetailsOpen(false)}>Fermer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resource Edit Dialog */}
      <Dialog open={isResourceEditOpen} onOpenChange={setIsResourceEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Modifier la Ressource</DialogTitle>
          </DialogHeader>
          {editResourceData && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="res-name" className="text-sm font-semibold">Nom</Label>
                  <Input 
                    id="res-name"
                    value={editResourceData.name}
                    onChange={(e) => setEditResourceData({...editResourceData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-role" className="text-sm font-semibold">Poste</Label>
                  <Input 
                    id="res-role"
                    value={editResourceData.role}
                    onChange={(e) => setEditResourceData({...editResourceData, role: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-hours" className="text-sm font-semibold">Heures/mois</Label>
                  <Input 
                    id="res-hours"
                    type="number"
                    value={editResourceData.hours}
                    onChange={(e) => setEditResourceData({...editResourceData, hours: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-rate" className="text-sm font-semibold">Taux horaire (€/h)</Label>
                  <Input 
                    id="res-rate"
                    type="number"
                    value={editResourceData.rate}
                    onChange={(e) => setEditResourceData({...editResourceData, rate: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="res-utilization" className="text-sm font-semibold">Taux d'utilisation (%)</Label>
                  <Input 
                    id="res-utilization"
                    type="number"
                    value={editResourceData.utilization}
                    onChange={(e) => setEditResourceData({...editResourceData, utilization: parseInt(e.target.value) || 0})}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsResourceEditOpen(false)}>Annuler</Button>
                <Button 
                  onClick={handleSaveResourceChanges}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Project to Resource Dialog */}
      <Dialog open={isAddProjectToResourceOpen} onOpenChange={setIsAddProjectToResourceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Assigner un projet</DialogTitle>
          </DialogHeader>
          {editResourceData && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-select" className="text-sm font-semibold">Sélectionner un projet</Label>
                <select 
                  id="project-select"
                  value={newProjectForResource}
                  onChange={(e) => setNewProjectForResource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Choisir un projet...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.name}>
                      {project.name} ({project.client})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Label className="text-sm font-semibold">Projets actuels</Label>
                <div className="flex flex-wrap gap-2">
                  {editResourceData.projects.map((proj, idx) => (
                    <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">
                      {proj}
                      <button 
                        onClick={() => handleRemoveProjectFromResource(proj)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsAddProjectToResourceOpen(false)}>Annuler</Button>
                <Button 
                  onClick={handleAddProjectToResource}
                  disabled={!newProjectForResource}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                >
                  Ajouter le projet
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
