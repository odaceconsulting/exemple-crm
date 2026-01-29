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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
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
  Edit2,
  FileText,
  UserCheck,
  Calendar as CalendarIcon,
  GanttChart,
  Flag,
  MessageSquare,
  Bell,
  FileCheck,
  Download,
  TrendingDown,
  Link as LinkIcon,
  CheckSquare,
  ListChecks,
  Timer,
  CreditCard,
  RefreshCw,
  Activity,
  ArrowRight,
  ArrowLeft,
  Filter,
  Save,
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Interfaces
interface Project {
  id: number;
  name: string;
  client: string;
  clientId?: number;
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
  description?: string;
  milestones?: Milestone[];
  deadlines?: Deadline[];
}

interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string[];
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  parentTaskId?: number;
  dependencies?: number[];
  wbsCode?: string;
  raciRole?: 'R' | 'A' | 'C' | 'I';
}

interface Milestone {
  id: number;
  projectId: number;
  name: string;
  date: string;
  status: 'upcoming' | 'achieved' | 'delayed';
}

interface Deadline {
  id: number;
  projectId: number;
  name: string;
  date: string;
  type: 'deliverable' | 'review' | 'payment';
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  projectId: number;
  raciRole?: 'R' | 'A' | 'C' | 'I';
  availability: number; // pourcentage
  tjm: number; // Taux Journalier Moyen
  hours: number;
}

interface TimesheetEntry {
  id: number;
  projectId: number;
  taskId?: number;
  userId: number;
  userName: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface BudgetEntry {
  id: number;
  projectId: number;
  category: string;
  budgeted: number;
  consumed: number;
  variance: number;
  profitability: number;
}

interface Discussion {
  id: number;
  projectId: number;
  author: string;
  content: string;
  date: string;
  replies?: Discussion[];
}

interface MeetingNote {
  id: number;
  projectId: number;
  title: string;
  date: string;
  attendees: string[];
  notes: string;
}

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<string>('fiche');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTimesheetDialogOpen, setIsTimesheetDialogOpen] = useState(false);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isDeadlineDialogOpen, setIsDeadlineDialogOpen] = useState(false);
  const [isCRDialogOpen, setIsCRDialogOpen] = useState(false);
  
  // Navigation structure selon l'image fournie
  const navigationCategories = {
    'CRÉATION': {
      icon: FileText,
      items: [
        { id: 'fiche', label: 'Fiche', icon: FileText },
        { id: 'client-lie', label: 'Client lié', icon: UserCheck },
        { id: 'budget', label: 'Budget', icon: DollarSign },
        { id: 'echeances', label: 'Échéances', icon: CalendarIcon }
      ]
    },
    'ÉQUIPE': {
      icon: Users,
      items: [
        { id: 'assignation', label: 'Assignation', icon: UserCheck },
        { id: 'raci', label: 'Rôles RACI', icon: CheckSquare },
        { id: 'disponibilites', label: 'Disponibilités', icon: Calendar },
        { id: 'couts-tjm', label: 'Coûts TJM', icon: DollarSign }
      ]
    },
    'TÂCHES': {
      icon: Target,
      items: [
        { id: 'wbs', label: 'WBS', icon: GitBranch },
        { id: 'sous-taches', label: 'Sous-tâches', icon: ListChecks },
        { id: 'assignation-taches', label: 'Assignation', icon: UserCheck },
        { id: 'priorites', label: 'Priorités', icon: AlertCircle },
        { id: 'dependances', label: 'Dépendances', icon: LinkIcon }
      ]
    },
    'PLANNING': {
      icon: Calendar,
      items: [
        { id: 'gantt', label: 'Gantt', icon: GanttChart },
        { id: 'chemin-critique', label: 'Chemin critique', icon: Activity },
        { id: 'jalons', label: 'Jalons', icon: Flag },
        { id: 'calendrier', label: 'Calendrier', icon: CalendarIcon }
      ]
    },
    'TEMPS': {
      icon: Clock,
      items: [
        { id: 'timesheet', label: 'Timesheet', icon: Timer },
        { id: 'approbation', label: 'Approbation', icon: CheckCircle2 },
        { id: 'facturable', label: 'Facturable', icon: CreditCard },
        { id: 'exports-paie', label: 'Exports paie', icon: Download }
      ]
    },
    'BUDGETS': {
      icon: DollarSign,
      items: [
        { id: 'consomme', label: 'Consommé', icon: TrendingDown },
        { id: 'ecarts', label: 'Écarts', icon: AlertCircle },
        { id: 'rentabilite', label: 'Rentabilité', icon: TrendingUp },
        { id: 'refacturation', label: 'Refacturation', icon: RefreshCw }
      ]
    },
    'COMMUNICATION': {
      icon: MessageSquare,
      items: [
        { id: 'discussion', label: 'Fil discussion', icon: MessageSquare },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'cr-reunions', label: 'CR réunions', icon: FileCheck }
      ]
    },
    'REPORTING': {
      icon: BarChart3,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'avancement', label: 'Avancement', icon: TrendingUp },
        { id: 'burndown', label: 'Burndown', icon: Activity },
        { id: 'exports', label: 'Exports', icon: Download }
      ]
    }
  };

  // Données de démonstration
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'Refonte Site Web',
      client: 'Acme Corporation',
      clientId: 1,
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
      completedTasks: 18,
      description: 'Refonte complète du site web avec nouvelle interface',
      milestones: [
        { id: 1, projectId: 1, name: 'Lancement', date: '2026-01-01', status: 'achieved' },
        { id: 2, projectId: 1, name: 'Phase 1', date: '2026-02-15', status: 'achieved' },
        { id: 3, projectId: 1, name: 'Livraison', date: '2026-03-31', status: 'upcoming' }
      ],
      deadlines: [
        { id: 1, projectId: 1, name: 'Livraison Phase 1', date: '2026-02-15', type: 'deliverable' },
        { id: 2, projectId: 1, name: 'Paiement 50%', date: '2026-02-20', type: 'payment' }
      ]
    },
    {
      id: 2,
      name: 'Application Mobile',
      client: 'TechStart SAS',
      clientId: 2,
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
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      projectId: 1,
      title: 'Conception UI/UX',
      description: 'Créer les maquettes et prototypes',
      status: 'done',
      priority: 'high',
      assignedTo: ['Marie D.'],
      dueDate: '2026-01-15',
      estimatedHours: 40,
      actualHours: 38,
      wbsCode: '1.1',
      raciRole: 'R'
    },
    {
      id: 2,
      projectId: 1,
      title: 'Développement Frontend',
      description: 'Implémenter l\'interface utilisateur',
      status: 'in-progress',
      priority: 'high',
      assignedTo: ['Jean M.', 'Pierre L.'],
      dueDate: '2026-02-28',
      estimatedHours: 120,
      actualHours: 85,
      parentTaskId: 1,
      dependencies: [1],
      wbsCode: '1.2',
      raciRole: 'A'
    }
  ]);

  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([
    {
      id: 1,
      projectId: 1,
      taskId: 1,
      userId: 1,
      userName: 'Marie D.',
      date: '2026-01-20',
      hours: 8,
      description: 'Conception maquettes',
      billable: true,
      status: 'approved'
    }
  ]);

  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      projectId: 1,
      author: 'Marie D.',
      content: 'Les maquettes sont prêtes pour review',
      date: '2026-01-20',
      replies: [
        { id: 2, projectId: 1, author: 'Jean M.', content: 'Parfait, je commence le dev', date: '2026-01-21' }
      ]
    }
  ]);

  // États pour les formulaires
  const [projectForm, setProjectForm] = useState({
    name: '',
    client: '',
    clientId: '',
    budget: '',
    type: 'forfait',
    startDate: '',
    endDate: '',
    description: '',
    priority: 'medium'
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    assignedTo: [] as string[],
    dueDate: '',
    estimatedHours: '',
    parentTaskId: '',
    dependencies: [] as number[],
    wbsCode: '',
    raciRole: 'R' as 'R' | 'A' | 'C' | 'I'
  });

  const [timesheetForm, setTimesheetForm] = useState({
    projectId: '',
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: '',
    billable: true
  });

  const [milestoneForm, setMilestoneForm] = useState({
    projectId: '',
    name: '',
    date: '',
    status: 'upcoming' as 'upcoming' | 'achieved' | 'delayed'
  });

  const [budgetForm, setBudgetForm] = useState({
    projectId: '',
    category: '',
    budgeted: '',
    consumed: ''
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planning': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              Gestion de Projets
            </h1>
            <p className="text-gray-600 mt-2">Suivi complet des projets, équipes et budgets</p>
          </div>
          <Button 
            onClick={() => {
              setProjectForm({
                name: '',
                client: '',
                clientId: '',
                budget: '',
                type: 'forfait',
                startDate: '',
                endDate: '',
                description: '',
                priority: 'medium'
              });
              setIsProjectDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-2 border-gray-200 focus:border-blue-500 h-11"
          />
        </div>
      </div>

      {/* Main Navigation */}
      {!activeCategory ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(navigationCategories).map(([category, data]) => {
              const Icon = data.icon;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSubTab(data.items[0].id);
                  }}
                  className="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{category}</h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 mt-2 group-hover:text-blue-600 transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Liste des projets */}
          <Card className="border-0 shadow-md bg-white mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Projets ({filteredProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.client}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status === 'active' ? 'Actif' : 
                             project.status === 'completed' ? 'Complété' :
                             project.status === 'on-hold' ? 'En attente' : 'Planification'}
                          </Badge>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Avancement</p>
                        <p className="text-2xl font-bold text-blue-600">{project.progress}%</p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-300">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
            >
              ← Retour au menu
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
              {activeCategory}
            </span>
          </div>

          {/* Sub-tabs Navigation */}
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 bg-transparent border-0 p-0">
              {navigationCategories[activeCategory as keyof typeof navigationCategories]?.items.map((item) => {
                const Icon = item.icon;
                return (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* CRÉATION: Fiche */}
            {activeCategory === 'CRÉATION' && activeSubTab === 'fiche' && (
              <TabsContent value="fiche" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Fiche Projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Nom du projet</Label>
                            <p className="text-lg font-bold text-gray-900 mt-1">{selectedProject.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Client</Label>
                            <p className="text-lg font-bold text-gray-900 mt-1">{selectedProject.client}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Statut</Label>
                            <Badge className={`${getStatusColor(selectedProject.status)} mt-1`}>
                              {selectedProject.status}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Priorité</Label>
                            <Badge className={`${getPriorityColor(selectedProject.priority)} mt-1`}>
                              {selectedProject.priority}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Budget</Label>
                            <p className="text-lg font-bold text-blue-600 mt-1">{selectedProject.budget.toLocaleString()}€</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Dépenses</Label>
                            <p className="text-lg font-bold text-orange-600 mt-1">{selectedProject.spent.toLocaleString()}€</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Date de début</Label>
                            <p className="text-gray-900 mt-1">{new Date(selectedProject.startDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Date de fin</Label>
                            <p className="text-gray-900 mt-1">{new Date(selectedProject.endDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        {selectedProject.description && (
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Description</Label>
                            <p className="text-gray-900 mt-1">{selectedProject.description}</p>
                          </div>
                        )}
                        <Button 
                          onClick={() => setIsProjectDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Modifier la fiche
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir sa fiche</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* CRÉATION: Client lié */}
            {activeCategory === 'CRÉATION' && activeSubTab === 'client-lie' && (
              <TabsContent value="client-lie" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Client lié au projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{selectedProject.client}</p>
                              <p className="text-sm text-gray-600 mt-1">Client principal</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Lier un autre client
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les clients liés</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* CRÉATION: Budget */}
            {activeCategory === 'CRÉATION' && activeSubTab === 'budget' && (
              <TabsContent value="budget" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Budget du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Budget alloué</p>
                              <p className="text-2xl font-bold text-blue-600 mt-2">{selectedProject.budget.toLocaleString()}€</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Dépenses</p>
                              <p className="text-2xl font-bold text-orange-600 mt-2">{selectedProject.spent.toLocaleString()}€</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Reste disponible</p>
                              <p className="text-2xl font-bold text-green-600 mt-2">{(selectedProject.budget - selectedProject.spent).toLocaleString()}€</p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Utilisation du budget</span>
                            <span className="font-semibold">{Math.round((selectedProject.spent / selectedProject.budget) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all ${
                                (selectedProject.spent / selectedProject.budget) > 0.9 ? 'bg-red-600' :
                                (selectedProject.spent / selectedProject.budget) > 0.7 ? 'bg-yellow-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min((selectedProject.spent / selectedProject.budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setIsBudgetDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une ligne budgétaire
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer le budget</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* CRÉATION: Échéances */}
            {activeCategory === 'CRÉATION' && activeSubTab === 'echeances' && (
              <TabsContent value="echeances" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Échéances du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {selectedProject.deadlines && selectedProject.deadlines.length > 0 ? (
                          selectedProject.deadlines.map((deadline) => (
                            <div key={deadline.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{deadline.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {new Date(deadline.date).toLocaleDateString('fr-FR')} - {deadline.type}
                                  </p>
                                </div>
                                <Badge className={new Date(deadline.date) < new Date() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                                  {new Date(deadline.date) < new Date() ? 'Échue' : 'À venir'}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600 text-center py-4">Aucune échéance définie</p>
                        )}
                        <Button 
                          onClick={() => setIsDeadlineDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une échéance
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les échéances</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ÉQUIPE: Assignation */}
            {activeCategory === 'ÉQUIPE' && activeSubTab === 'assignation' && (
              <TabsContent value="assignation" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Assignation de l'équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">Membres assignés au projet</p>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Assigner un membre
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {selectedProject.team.map((member, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{member}</p>
                                  <p className="text-xs text-gray-600">Membre de l'équipe</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer l'assignation</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ÉQUIPE: Rôles RACI */}
            {activeCategory === 'ÉQUIPE' && activeSubTab === 'raci' && (
              <TabsContent value="raci" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      Rôles RACI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-900 font-semibold mb-2">Légende RACI:</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div><span className="font-bold">R</span> = Responsable</div>
                            <div><span className="font-bold">A</span> = Approbateur</div>
                            <div><span className="font-bold">C</span> = Consulté</div>
                            <div><span className="font-bold">I</span> = Informé</div>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Membre</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Rôle</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedProject.team.map((member, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-3 font-medium">{member}</td>
                                  <td className="px-4 py-3 text-center">
                                    <Select defaultValue="R">
                                      <SelectTrigger className="w-20">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="R">R</SelectItem>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="C">C</SelectItem>
                                        <SelectItem value="I">I</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button variant="outline" size="sm">
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CheckSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les rôles RACI</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ÉQUIPE: Disponibilités */}
            {activeCategory === 'ÉQUIPE' && activeSubTab === 'disponibilites' && (
              <TabsContent value="disponibilites" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Disponibilités de l'équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {selectedProject.team.map((member, idx) => (
                          <Card key={idx} className="border-2">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-semibold text-gray-900">{member}</p>
                                  <p className="text-sm text-gray-600">Disponibilité mensuelle</p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">85%</Badge>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Heures disponibles</p>
                                  <p className="font-bold text-blue-600">136h</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Heures allouées</p>
                                  <p className="font-bold text-gray-900">115h</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir les disponibilités</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ÉQUIPE: Coûts TJM */}
            {activeCategory === 'ÉQUIPE' && activeSubTab === 'couts-tjm' && (
              <TabsContent value="couts-tjm" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Coûts TJM (Taux Journalier Moyen)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Membre</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">TJM (€)</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Jours</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Total (€)</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedProject.team.map((member, idx) => {
                                const tjm = 500;
                                const jours = 20;
                                return (
                                  <tr key={idx}>
                                    <td className="px-4 py-3 font-medium">{member}</td>
                                    <td className="px-4 py-3 text-right">{tjm}€</td>
                                    <td className="px-4 py-3 text-right">{jours}</td>
                                    <td className="px-4 py-3 text-right font-bold text-blue-600">{tjm * jours}€</td>
                                    <td className="px-4 py-3 text-center">
                                      <Button variant="outline" size="sm">
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="bg-blue-50">
                              <tr>
                                <td colSpan={3} className="px-4 py-3 font-bold text-right">Total projet:</td>
                                <td className="px-4 py-3 text-right font-bold text-blue-600">
                                  {selectedProject.team.length * 500 * 20}€
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un membre avec TJM
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les coûts TJM</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TÂCHES: WBS */}
            {activeCategory === 'TÂCHES' && activeSubTab === 'wbs' && (
              <TabsContent value="wbs" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      WBS (Work Breakdown Structure)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-900 font-semibold mb-2">Structure hiérarchique des tâches</p>
                          <p className="text-xs text-blue-800">Le WBS organise les tâches en niveaux hiérarchiques</p>
                        </div>
                        <div className="space-y-2">
                          {tasks.filter(t => t.projectId === selectedProject.id).map((task) => (
                            <div key={task.id} className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-blue-100 text-blue-800">{task.wbsCode || '1.1'}</Badge>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{task.title}</p>
                                  <p className="text-xs text-gray-600">{task.description}</p>
                                </div>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button 
                          onClick={() => setIsTaskDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une tâche WBS
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <GitBranch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le WBS</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TÂCHES: Sous-tâches */}
            {activeCategory === 'TÂCHES' && activeSubTab === 'sous-taches' && (
              <TabsContent value="sous-taches" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5" />
                      Sous-tâches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {tasks.filter(t => t.projectId === selectedProject.id && !t.parentTaskId).map((parentTask) => {
                          const subTasks = tasks.filter(t => t.parentTaskId === parentTask.id);
                          return (
                            <div key={parentTask.id} className="border-2 border-gray-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                <p className="font-semibold text-gray-900">{parentTask.title}</p>
                              </div>
                              {subTasks.length > 0 && (
                                <div className="ml-7 space-y-2 border-l-2 border-blue-200 pl-4">
                                  {subTasks.map((subTask) => (
                                    <div key={subTask.id} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                      <p className="text-sm text-gray-700">{subTask.title}</p>
                                      <Badge className={getPriorityColor(subTask.priority)}>
                                        {subTask.priority}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <Button variant="outline" size="sm" className="mt-2 ml-7">
                                <Plus className="h-3 w-3 mr-1" />
                                Ajouter sous-tâche
                              </Button>
                            </div>
                          );
                        })}
                        <Button 
                          onClick={() => setIsTaskDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une nouvelle tâche
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ListChecks className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les sous-tâches</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TÂCHES: Assignation */}
            {activeCategory === 'TÂCHES' && activeSubTab === 'assignation-taches' && (
              <TabsContent value="assignation-taches" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Assignation des tâches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Tâche</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Assigné à</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Échéance</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {tasks.filter(t => t.projectId === selectedProject.id).map((task) => (
                                <tr key={task.id}>
                                  <td className="px-4 py-3 font-medium">{task.title}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                      {task.assignedTo.map((user, idx) => (
                                        <Badge key={idx} className="bg-blue-100 text-blue-800">{user}</Badge>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge className={
                                      task.status === 'done' ? 'bg-green-100 text-green-800' :
                                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                      task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }>
                                      {task.status === 'done' ? 'Terminé' :
                                       task.status === 'in-progress' ? 'En cours' :
                                       task.status === 'blocked' ? 'Bloqué' : 'À faire'}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3">{new Date(task.dueDate).toLocaleDateString('fr-FR')}</td>
                                  <td className="px-4 py-3 text-center">
                                    <Button variant="outline" size="sm">
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer l'assignation des tâches</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TÂCHES: Priorités */}
            {activeCategory === 'TÂCHES' && activeSubTab === 'priorites' && (
              <TabsContent value="priorites" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Priorités des tâches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {['high', 'medium', 'low'].map((priority) => {
                          const priorityTasks = tasks.filter(t => t.projectId === selectedProject.id && t.priority === priority);
                          return (
                            <div key={priority} className="border-2 border-gray-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className={getPriorityColor(priority)}>
                                  {priority.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-600">({priorityTasks.length} tâches)</span>
                              </div>
                              <div className="space-y-2">
                                {priorityTasks.map((task) => (
                                  <div key={task.id} className="p-2 bg-gray-50 rounded flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir les priorités</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TÂCHES: Dépendances */}
            {activeCategory === 'TÂCHES' && activeSubTab === 'dependances' && (
              <TabsContent value="dependances" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5" />
                      Dépendances entre tâches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {tasks.filter(t => t.projectId === selectedProject.id && t.dependencies && t.dependencies.length > 0).map((task) => (
                          <div key={task.id} className="p-4 border-2 border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <p className="font-semibold text-gray-900">{task.title}</p>
                              <Badge className="bg-blue-100 text-blue-800">Dépend de</Badge>
                            </div>
                            <div className="ml-4 space-y-2">
                              {task.dependencies?.map((depId) => {
                                const depTask = tasks.find(t => t.id === depId);
                                return depTask ? (
                                  <div key={depId} className="flex items-center gap-2 text-sm">
                                    <ArrowRight className="h-4 w-4 text-blue-600" />
                                    <span className="text-gray-700">{depTask.title}</span>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        ))}
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une dépendance
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <LinkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les dépendances</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* PLANNING: Gantt */}
            {activeCategory === 'PLANNING' && activeSubTab === 'gantt' && (
              <TabsContent value="gantt" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <GanttChart className="h-5 w-5" />
                      Diagramme de Gantt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-900">Visualisation temporelle des tâches du projet</p>
                        </div>
                        <div className="space-y-3">
                          {tasks.filter(t => t.projectId === selectedProject.id).map((task) => (
                            <div key={task.id} className="flex items-center gap-4">
                              <div className="w-48 text-sm font-medium">{task.title}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                <div 
                                  className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                  style={{ width: '60%' }}
                                >
                                  {task.status === 'done' ? '✓' : task.status === 'in-progress' ? '...' : ''}
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 w-24">{new Date(task.dueDate).toLocaleDateString('fr-FR')}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Exporter
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <GanttChart className="h-4 w-4 mr-2" />
                            Vue détaillée
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <GanttChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le Gantt</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* PLANNING: Chemin critique */}
            {activeCategory === 'PLANNING' && activeSubTab === 'chemin-critique' && (
              <TabsContent value="chemin-critique" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Chemin critique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-red-900 font-semibold mb-2">Tâches critiques</p>
                          <p className="text-xs text-red-800">Ces tâches déterminent la durée minimale du projet</p>
                        </div>
                        <div className="space-y-2">
                          {tasks.filter(t => t.projectId === selectedProject.id && t.priority === 'high').map((task, idx) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{task.title}</p>
                                <p className="text-xs text-gray-600">Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}</p>
                              </div>
                              {idx < tasks.filter(t => t.projectId === selectedProject.id && t.priority === 'high').length - 1 && (
                                <ArrowRight className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le chemin critique</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* PLANNING: Jalons */}
            {activeCategory === 'PLANNING' && activeSubTab === 'jalons' && (
              <TabsContent value="jalons" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Flag className="h-5 w-5" />
                      Jalons du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {selectedProject.milestones && selectedProject.milestones.length > 0 ? (
                          selectedProject.milestones.map((milestone) => (
                            <div key={milestone.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    milestone.status === 'achieved' ? 'bg-green-100' :
                                    milestone.status === 'delayed' ? 'bg-red-100' : 'bg-blue-100'
                                  }`}>
                                    <Flag className={`h-6 w-6 ${
                                      milestone.status === 'achieved' ? 'text-green-600' :
                                      milestone.status === 'delayed' ? 'text-red-600' : 'text-blue-600'
                                    }`} />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{milestone.name}</p>
                                    <p className="text-sm text-gray-600">{new Date(milestone.date).toLocaleDateString('fr-FR')}</p>
                                  </div>
                                </div>
                                <Badge className={
                                  milestone.status === 'achieved' ? 'bg-green-100 text-green-800' :
                                  milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }>
                                  {milestone.status === 'achieved' ? 'Atteint' :
                                   milestone.status === 'delayed' ? 'Retardé' : 'À venir'}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600 text-center py-4">Aucun jalon défini</p>
                        )}
                        <Button 
                          onClick={() => setIsMilestoneDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un jalon
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Flag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les jalons</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* PLANNING: Calendrier */}
            {activeCategory === 'PLANNING' && activeSubTab === 'calendrier' && (
              <TabsContent value="calendrier" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Calendrier du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                            <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
                              {day}
                            </div>
                          ))}
                          {Array.from({ length: 35 }).map((_, idx) => (
                            <div key={idx} className="h-16 border border-gray-200 rounded p-1 text-xs">
                              <div className="font-semibold">{idx + 1}</div>
                              {idx === 19 && (
                                <div className="mt-1 bg-blue-600 text-white rounded px-1">Tâche</div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Vue mensuelle
                          </Button>
                          <Button variant="outline">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Vue hebdomadaire
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le calendrier</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TEMPS: Timesheet */}
            {activeCategory === 'TEMPS' && activeSubTab === 'timesheet' && (
              <TabsContent value="timesheet" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Timesheet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">Saisie des heures travaillées</p>
                        <Button 
                          onClick={() => setIsTimesheetDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nouvelle entrée
                        </Button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Utilisateur</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Tâche</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Heures</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Facturable</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Statut</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {timesheets.filter(t => t.projectId === selectedProject.id).map((entry) => (
                                <tr key={entry.id}>
                                  <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                                  <td className="px-4 py-3 font-medium">{entry.userName}</td>
                                  <td className="px-4 py-3">
                                    {tasks.find(t => t.id === entry.taskId)?.title || 'N/A'}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold">{entry.hours}h</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{entry.description}</td>
                                  <td className="px-4 py-3 text-center">
                                    {entry.billable ? (
                                      <Badge className="bg-green-100 text-green-800">Oui</Badge>
                                    ) : (
                                      <Badge className="bg-gray-100 text-gray-800">Non</Badge>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Badge className={
                                      entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                                      entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                      entry.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }>
                                      {entry.status === 'approved' ? 'Approuvé' :
                                       entry.status === 'rejected' ? 'Rejeté' :
                                       entry.status === 'submitted' ? 'Soumis' : 'Brouillon'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Timer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le timesheet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TEMPS: Approbation */}
            {activeCategory === 'TEMPS' && activeSubTab === 'approbation' && (
              <TabsContent value="approbation" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Approbation des temps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {timesheets.filter(t => t.projectId === selectedProject.id && t.status === 'submitted').map((entry) => (
                          <Card key={entry.id} className="border-2">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{entry.userName}</p>
                                  <p className="text-sm text-gray-600">{new Date(entry.date).toLocaleDateString('fr-FR')} - {entry.hours}h</p>
                                  <p className="text-xs text-gray-500 mt-1">{entry.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Approuver
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                                    <X className="h-4 w-4 mr-1" />
                                    Rejeter
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {timesheets.filter(t => t.projectId === selectedProject.id && t.status === 'submitted').length === 0 && (
                          <p className="text-center text-gray-600 py-8">Aucune demande d'approbation en attente</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer les approbations</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TEMPS: Facturable */}
            {activeCategory === 'TEMPS' && activeSubTab === 'facturable' && (
              <TabsContent value="facturable" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Temps facturable
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Total facturable</p>
                              <p className="text-2xl font-bold text-blue-600 mt-2">
                                {timesheets.filter(t => t.projectId === selectedProject.id && t.billable && t.status === 'approved').reduce((sum, e) => sum + e.hours, 0)}h
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Total non facturable</p>
                              <p className="text-2xl font-bold text-gray-600 mt-2">
                                {timesheets.filter(t => t.projectId === selectedProject.id && !t.billable && t.status === 'approved').reduce((sum, e) => sum + e.hours, 0)}h
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Montant facturable</p>
                              <p className="text-2xl font-bold text-green-600 mt-2">
                                {timesheets.filter(t => t.projectId === selectedProject.id && t.billable && t.status === 'approved').reduce((sum, e) => sum + e.hours, 0) * 50}€
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Utilisateur</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Heures</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Montant</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {timesheets.filter(t => t.projectId === selectedProject.id && t.billable && t.status === 'approved').map((entry) => (
                                <tr key={entry.id}>
                                  <td className="px-4 py-3">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                                  <td className="px-4 py-3 font-medium">{entry.userName}</td>
                                  <td className="px-4 py-3 text-right">{entry.hours}h</td>
                                  <td className="px-4 py-3 text-right font-semibold text-green-600">{entry.hours * 50}€</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir les temps facturables</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* TEMPS: Exports paie */}
            {activeCategory === 'TEMPS' && activeSubTab === 'exports-paie' && (
              <TabsContent value="exports-paie" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Exports paie
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-900 font-semibold mb-2">Exports disponibles</p>
                          <p className="text-xs text-blue-800">Générez les fichiers pour la paie</p>
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV - Janvier 2026
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Export Excel - Janvier 2026
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF - Janvier 2026
                          </Button>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Générer un nouvel export
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Download className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour générer les exports</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* BUDGETS: Consommé */}
            {activeCategory === 'BUDGETS' && activeSubTab === 'consomme' && (
              <TabsContent value="consomme" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />
                      Budget consommé
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Budget initial</p>
                              <p className="text-2xl font-bold text-blue-600 mt-2">{selectedProject.budget.toLocaleString()}€</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Budget consommé</p>
                              <p className="text-2xl font-bold text-orange-600 mt-2">{selectedProject.spent.toLocaleString()}€</p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Taux de consommation</span>
                            <span className="font-semibold">{Math.round((selectedProject.spent / selectedProject.budget) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className={`h-4 rounded-full transition-all ${
                                (selectedProject.spent / selectedProject.budget) > 0.9 ? 'bg-red-600' :
                                (selectedProject.spent / selectedProject.budget) > 0.7 ? 'bg-yellow-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min((selectedProject.spent / selectedProject.budget) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Catégorie</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Budget</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Consommé</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Reste</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {[
                                { category: 'Développement', budget: 80000, consumed: 65000 },
                                { category: 'Design', budget: 20000, consumed: 18000 },
                                { category: 'Tests', budget: 15000, consumed: 10000 },
                                { category: 'Gestion projet', budget: 10000, consumed: 5000 }
                              ].map((item, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-3 font-medium">{item.category}</td>
                                  <td className="px-4 py-3 text-right">{item.budget.toLocaleString()}€</td>
                                  <td className="px-4 py-3 text-right font-semibold text-orange-600">{item.consumed.toLocaleString()}€</td>
                                  <td className="px-4 py-3 text-right font-semibold text-green-600">{(item.budget - item.consumed).toLocaleString()}€</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <TrendingDown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le budget consommé</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* BUDGETS: Écarts */}
            {activeCategory === 'BUDGETS' && activeSubTab === 'ecarts' && (
              <TabsContent value="ecarts" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Écarts budgétaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {[
                          { category: 'Développement', budget: 80000, consumed: 85000, variance: -5000 },
                          { category: 'Design', budget: 20000, consumed: 18000, variance: 2000 },
                          { category: 'Tests', budget: 15000, consumed: 10000, variance: 5000 }
                        ].map((item, idx) => (
                          <Card key={idx} className={`border-2 ${item.variance < 0 ? 'border-red-300' : 'border-green-300'}`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-900">{item.category}</p>
                                <Badge className={item.variance < 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                  {item.variance < 0 ? `-${Math.abs(item.variance).toLocaleString()}€` : `+${item.variance.toLocaleString()}€`}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Budget</p>
                                  <p className="font-semibold">{item.budget.toLocaleString()}€</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Consommé</p>
                                  <p className="font-semibold">{item.consumed.toLocaleString()}€</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir les écarts</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* BUDGETS: Rentabilité */}
            {activeCategory === 'BUDGETS' && activeSubTab === 'rentabilite' && (
              <TabsContent value="rentabilite" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Rentabilité du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Revenus</p>
                              <p className="text-2xl font-bold text-blue-600 mt-2">{selectedProject.budget.toLocaleString()}€</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Coûts</p>
                              <p className="text-2xl font-bold text-red-600 mt-2">{selectedProject.spent.toLocaleString()}€</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Marge</p>
                              <p className={`text-2xl font-bold mt-2 ${
                                (selectedProject.budget - selectedProject.spent) > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {(selectedProject.budget - selectedProject.spent).toLocaleString()}€
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {selectedProject.margin}% de marge
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-blue-900">Taux de rentabilité</p>
                              <p className="text-sm text-blue-800 mt-1">Marge nette / Revenus</p>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">
                              {((selectedProject.budget - selectedProject.spent) / selectedProject.budget * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir la rentabilité</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* BUDGETS: Refacturation */}
            {activeCategory === 'BUDGETS' && activeSubTab === 'refacturation' && (
              <TabsContent value="refacturation" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Refacturation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-900 font-semibold mb-2">Lignes de refacturation</p>
                          <p className="text-xs text-blue-800">Gérez les coûts à refacturer au client</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-700">Montant</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Statut</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {[
                                { id: 1, date: '2026-01-15', description: 'Heures développement', amount: 5000, status: 'facturé' },
                                { id: 2, date: '2026-01-20', description: 'Heures design', amount: 2000, status: 'à facturer' }
                              ].map((item) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-3">{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                                  <td className="px-4 py-3">{item.description}</td>
                                  <td className="px-4 py-3 text-right font-semibold">{item.amount.toLocaleString()}€</td>
                                  <td className="px-4 py-3 text-center">
                                    <Badge className={item.status === 'facturé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                      {item.status === 'facturé' ? 'Facturé' : 'À facturer'}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une ligne de refacturation
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <RefreshCw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour gérer la refacturation</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* COMMUNICATION: Fil discussion */}
            {activeCategory === 'COMMUNICATION' && activeSubTab === 'discussion' && (
              <TabsContent value="discussion" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Fil de discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {discussions.filter(d => d.projectId === selectedProject.id).map((discussion) => (
                          <div key={discussion.id} className="p-4 border-2 border-gray-200 rounded-lg">
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-gray-900">{discussion.author}</p>
                                  <span className="text-xs text-gray-500">{new Date(discussion.date).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <p className="text-gray-700">{discussion.content}</p>
                                {discussion.replies && discussion.replies.length > 0 && (
                                  <div className="mt-3 ml-4 space-y-2 border-l-2 border-blue-200 pl-4">
                                    {discussion.replies.map((reply) => (
                                      <div key={reply.id} className="flex items-start gap-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                          <Users className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-gray-900">{reply.author}</p>
                                          <p className="text-sm text-gray-700">{reply.content}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="ml-12">
                              Répondre
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input placeholder="Écrire un message..." className="flex-1" />
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir les discussions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* COMMUNICATION: Notifications */}
            {activeCategory === 'COMMUNICATION' && activeSubTab === 'notifications' && (
              <TabsContent value="notifications" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-3">
                        {[
                          { id: 1, type: 'info', message: 'Nouvelle tâche assignée', date: '2026-01-20', read: false },
                          { id: 2, type: 'warning', message: 'Échéance approchante', date: '2026-01-19', read: false },
                          { id: 3, type: 'success', message: 'Tâche complétée', date: '2026-01-18', read: true }
                        ].map((notif) => (
                          <div key={notif.id} className={`p-3 border-2 rounded-lg flex items-center justify-between ${
                            notif.read ? 'border-gray-200 bg-gray-50' : 'border-blue-300 bg-blue-50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <Bell className={`h-5 w-5 ${
                                notif.type === 'info' ? 'text-blue-600' :
                                notif.type === 'warning' ? 'text-yellow-600' :
                                'text-green-600'
                              }`} />
                              <div>
                                <p className="font-medium text-gray-900">{notif.message}</p>
                                <p className="text-xs text-gray-600">{new Date(notif.date).toLocaleDateString('fr-FR')}</p>
                              </div>
                            </div>
                            {!notif.read && (
                              <Badge className="bg-blue-600 text-white">Nouveau</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir les notifications</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* COMMUNICATION: CR réunions */}
            {activeCategory === 'COMMUNICATION' && activeSubTab === 'cr-reunions' && (
              <TabsContent value="cr-reunions" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Comptes-rendus de réunions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        {[
                          { id: 1, title: 'Réunion kick-off', date: '2026-01-05', attendees: ['Marie D.', 'Jean M.', 'Client'] },
                          { id: 2, title: 'Point d\'avancement', date: '2026-01-20', attendees: ['Marie D.', 'Jean M.'] }
                        ].map((cr) => (
                          <Card key={cr.id} className="border-2">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{cr.title}</p>
                                  <p className="text-sm text-gray-600 mt-1">{new Date(cr.date).toLocaleDateString('fr-FR')}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {cr.attendees.map((attendee, idx) => (
                                      <Badge key={idx} className="bg-blue-100 text-blue-800">{attendee}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button 
                          onClick={() => setIsCRDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer un CR de réunion
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir les CR de réunions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* REPORTING: Dashboard */}
            {activeCategory === 'REPORTING' && activeSubTab === 'dashboard' && (
              <TabsContent value="dashboard" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Avancement</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">{selectedProject?.progress || 0}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Tâches complétées</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {selectedProject ? `${selectedProject.completedTasks}/${selectedProject.tasks}` : '0/0'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Budget utilisé</p>
                      <p className="text-2xl font-bold text-orange-600 mt-2">
                        {selectedProject ? Math.round((selectedProject.spent / selectedProject.budget) * 100) : 0}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Marge</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {selectedProject?.margin || 0}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Vue d'ensemble du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Avancement global</span>
                            <span className="font-semibold">{selectedProject.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-600">Date de début</p>
                            <p className="font-semibold">{new Date(selectedProject.startDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date de fin prévue</p>
                            <p className="font-semibold">{new Date(selectedProject.endDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le dashboard</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* REPORTING: Avancement */}
            {activeCategory === 'REPORTING' && activeSubTab === 'avancement' && (
              <TabsContent value="avancement" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Rapport d'avancement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Tâches totales</p>
                              <p className="text-2xl font-bold text-blue-600 mt-2">{selectedProject.tasks || 0}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Tâches complétées</p>
                              <p className="text-2xl font-bold text-green-600 mt-2">{selectedProject.completedTasks || 0}</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <p className="text-sm text-gray-600">Taux de complétion</p>
                              <p className="text-2xl font-bold text-blue-600 mt-2">
                                {selectedProject.tasks ? Math.round((selectedProject.completedTasks! / selectedProject.tasks) * 100) : 0}%
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="space-y-3">
                          {tasks.filter(t => t.projectId === selectedProject.id).map((task) => (
                            <div key={task.id} className="p-3 border-2 border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-900">{task.title}</p>
                                <Badge className={
                                  task.status === 'done' ? 'bg-green-100 text-green-800' :
                                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {task.status === 'done' ? 'Terminé' : task.status === 'in-progress' ? 'En cours' : 'À faire'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Estimé: {task.estimatedHours}h</span>
                                <span>Réel: {task.actualHours}h</span>
                                <span>Écart: {task.actualHours - task.estimatedHours}h</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Download className="h-4 w-4 mr-2" />
                          Exporter le rapport
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir l'avancement</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* REPORTING: Burndown */}
            {activeCategory === 'REPORTING' && activeSubTab === 'burndown' && (
              <TabsContent value="burndown" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Graphique Burndown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-900 font-semibold mb-2">Évolution des tâches restantes</p>
                          <p className="text-xs text-blue-800">Visualisation de la vélocité du projet</p>
                        </div>
                        <div className="h-64 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Graphique Burndown</p>
                            <p className="text-sm text-gray-500">Visualisation des tâches restantes au fil du temps</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Exporter
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Vue détaillée
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour voir le burndown</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* REPORTING: Exports */}
            {activeCategory === 'REPORTING' && activeSubTab === 'exports' && (
              <TabsContent value="exports" className="space-y-6 mt-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Exports de rapports
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedProject ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-2 hover:border-blue-500 cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">Rapport d'avancement</p>
                                  <p className="text-sm text-gray-600 mt-1">PDF</p>
                                </div>
                                <Download className="h-8 w-8 text-blue-600" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-2 hover:border-blue-500 cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">Rapport financier</p>
                                  <p className="text-sm text-gray-600 mt-1">Excel</p>
                                </div>
                                <Download className="h-8 w-8 text-green-600" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-2 hover:border-blue-500 cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">Rapport des tâches</p>
                                  <p className="text-sm text-gray-600 mt-1">CSV</p>
                                </div>
                                <Download className="h-8 w-8 text-purple-600" />
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-2 hover:border-blue-500 cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">Rapport complet</p>
                                  <p className="text-sm text-gray-600 mt-1">PDF</p>
                                </div>
                                <Download className="h-8 w-8 text-orange-600" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Générer un export personnalisé
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Download className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Sélectionnez un projet pour générer les exports</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}

      {/* Dialog: Nouveau/Modifier Projet */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedProject ? 'Modifier le projet' : 'Nouveau projet'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name" className="text-sm font-medium">Nom du projet *</Label>
                <Input
                  id="project-name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  placeholder="Ex: Refonte Site Web"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="project-client" className="text-sm font-medium">Client *</Label>
                <Input
                  id="project-client"
                  value={projectForm.client}
                  onChange={(e) => setProjectForm({...projectForm, client: e.target.value})}
                  placeholder="Ex: Acme Corporation"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="project-budget" className="text-sm font-medium">Budget (€) *</Label>
                <Input
                  id="project-budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
                  placeholder="125000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="project-type" className="text-sm font-medium">Type de prestation *</Label>
                <Select value={projectForm.type} onValueChange={(value) => setProjectForm({...projectForm, type: value as any})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forfait">Forfait</SelectItem>
                    <SelectItem value="régie">Régie</SelectItem>
                    <SelectItem value="centre-services">Centre de services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project-start" className="text-sm font-medium">Date de début *</Label>
                <Input
                  id="project-start"
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="project-end" className="text-sm font-medium">Date de fin *</Label>
                <Input
                  id="project-end"
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="project-priority" className="text-sm font-medium">Priorité</Label>
                <Select value={projectForm.priority} onValueChange={(value) => setProjectForm({...projectForm, priority: value as any})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="project-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="project-description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                placeholder="Description du projet..."
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  console.log('Saving project:', projectForm);
                  setIsProjectDialogOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nouvelle Tâche */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Nouvelle tâche</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="task-title" className="text-sm font-medium">Titre *</Label>
              <Input
                id="task-title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                placeholder="Ex: Conception UI/UX"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="task-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="task-description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                placeholder="Description de la tâche..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-priority" className="text-sm font-medium">Priorité</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({...taskForm, priority: value as any})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due" className="text-sm font-medium">Date d'échéance</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="task-hours" className="text-sm font-medium">Heures estimées</Label>
                <Input
                  id="task-hours"
                  type="number"
                  value={taskForm.estimatedHours}
                  onChange={(e) => setTaskForm({...taskForm, estimatedHours: e.target.value})}
                  placeholder="40"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="task-wbs" className="text-sm font-medium">Code WBS</Label>
                <Input
                  id="task-wbs"
                  value={taskForm.wbsCode}
                  onChange={(e) => setTaskForm({...taskForm, wbsCode: e.target.value})}
                  placeholder="Ex: 1.1"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="task-raci" className="text-sm font-medium">Rôle RACI</Label>
              <Select value={taskForm.raciRole} onValueChange={(value) => setTaskForm({...taskForm, raciRole: value as any})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R">R - Responsable</SelectItem>
                  <SelectItem value="A">A - Approbateur</SelectItem>
                  <SelectItem value="C">C - Consulté</SelectItem>
                  <SelectItem value="I">I - Informé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  console.log('Saving task:', taskForm);
                  setIsTaskDialogOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nouvelle entrée Timesheet */}
      <Dialog open={isTimesheetDialogOpen} onOpenChange={setIsTimesheetDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Nouvelle entrée timesheet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ts-date" className="text-sm font-medium">Date *</Label>
                <Input
                  id="ts-date"
                  type="date"
                  value={timesheetForm.date}
                  onChange={(e) => setTimesheetForm({...timesheetForm, date: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ts-hours" className="text-sm font-medium">Heures *</Label>
                <Input
                  id="ts-hours"
                  type="number"
                  value={timesheetForm.hours}
                  onChange={(e) => setTimesheetForm({...timesheetForm, hours: e.target.value})}
                  placeholder="8"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ts-task" className="text-sm font-medium">Tâche</Label>
              <Select value={timesheetForm.taskId} onValueChange={(value) => setTimesheetForm({...timesheetForm, taskId: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner une tâche" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.filter(t => t.projectId === (selectedProject?.id || 0)).map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()}>{task.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ts-description" className="text-sm font-medium">Description *</Label>
              <Textarea
                id="ts-description"
                value={timesheetForm.description}
                onChange={(e) => setTimesheetForm({...timesheetForm, description: e.target.value})}
                placeholder="Description du travail effectué..."
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ts-billable"
                checked={timesheetForm.billable}
                onChange={(e) => setTimesheetForm({...timesheetForm, billable: e.target.checked})}
                className="w-4 h-4"
              />
              <Label htmlFor="ts-billable" className="text-sm font-medium cursor-pointer">Temps facturable</Label>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsTimesheetDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  console.log('Saving timesheet:', timesheetForm);
                  setIsTimesheetDialogOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nouveau Jalon */}
      <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Nouveau jalon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="milestone-name" className="text-sm font-medium">Nom du jalon *</Label>
              <Input
                id="milestone-name"
                value={milestoneForm.name}
                onChange={(e) => setMilestoneForm({...milestoneForm, name: e.target.value})}
                placeholder="Ex: Livraison Phase 1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="milestone-date" className="text-sm font-medium">Date *</Label>
              <Input
                id="milestone-date"
                type="date"
                value={milestoneForm.date}
                onChange={(e) => setMilestoneForm({...milestoneForm, date: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="milestone-status" className="text-sm font-medium">Statut</Label>
              <Select value={milestoneForm.status} onValueChange={(value) => setMilestoneForm({...milestoneForm, status: value as any})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">À venir</SelectItem>
                  <SelectItem value="achieved">Atteint</SelectItem>
                  <SelectItem value="delayed">Retardé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  console.log('Saving milestone:', milestoneForm);
                  setIsMilestoneDialogOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nouvelle échéance */}
      <Dialog open={isDeadlineDialogOpen} onOpenChange={setIsDeadlineDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Nouvelle échéance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="deadline-name" className="text-sm font-medium">Nom *</Label>
              <Input
                id="deadline-name"
                placeholder="Ex: Livraison Phase 1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="deadline-date" className="text-sm font-medium">Date *</Label>
              <Input
                id="deadline-date"
                type="date"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="deadline-type" className="text-sm font-medium">Type</Label>
              <Select defaultValue="deliverable">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deliverable">Livrable</SelectItem>
                  <SelectItem value="review">Revue</SelectItem>
                  <SelectItem value="payment">Paiement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDeadlineDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => setIsDeadlineDialogOpen(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Nouvelle ligne budgétaire */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Nouvelle ligne budgétaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="budget-category" className="text-sm font-medium">Catégorie *</Label>
              <Input
                id="budget-category"
                value={budgetForm.category}
                onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                placeholder="Ex: Développement"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget-budgeted" className="text-sm font-medium">Budget alloué (€) *</Label>
                <Input
                  id="budget-budgeted"
                  type="number"
                  value={budgetForm.budgeted}
                  onChange={(e) => setBudgetForm({...budgetForm, budgeted: e.target.value})}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="budget-consumed" className="text-sm font-medium">Consommé (€)</Label>
                <Input
                  id="budget-consumed"
                  type="number"
                  value={budgetForm.consumed}
                  onChange={(e) => setBudgetForm({...budgetForm, consumed: e.target.value})}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  console.log('Saving budget:', budgetForm);
                  setIsBudgetDialogOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: CR de réunion */}
      <Dialog open={isCRDialogOpen} onOpenChange={setIsCRDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Compte-rendu de réunion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="cr-title" className="text-sm font-medium">Titre *</Label>
              <Input
                id="cr-title"
                placeholder="Ex: Réunion kick-off"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cr-date" className="text-sm font-medium">Date *</Label>
              <Input
                id="cr-date"
                type="date"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cr-attendees" className="text-sm font-medium">Participants</Label>
              <Input
                id="cr-attendees"
                placeholder="Séparés par des virgules"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cr-notes" className="text-sm font-medium">Notes *</Label>
              <Textarea
                id="cr-notes"
                placeholder="Points discutés, décisions prises, actions à suivre..."
                className="mt-1"
                rows={8}
              />
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCRDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => setIsCRDialogOpen(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
