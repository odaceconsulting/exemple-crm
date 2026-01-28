import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Textarea } from '@/app/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Plus,
  DollarSign,
  Calendar,
  Building2,
  User,
  MoreVertical,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  FileUp,
  MessageSquare,
  Users,
  BarChart3,
  Zap,
  Settings,
  Clock,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  company: string;
  value: number;
  probability: number;
  stage: string;
  contact: string;
  closeDate: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  assignedTo?: string[];
  notes?: Note[];
  attachments?: Attachment[];
  activities?: Activity[];
  score?: number;
  conversionRate?: number;
  salesCycleDuration?: number;
}

interface Note {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

interface Attachment {
  id: number;
  name: string;
  type: string;
  size: number;
}

interface Activity {
  id: number;
  type: string;
  description: string;
  author: string;
  createdAt: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  editable?: boolean;
}

interface AutomationRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

const INITIAL_STAGES: PipelineStage[] = [
  { id: 'prospection', name: 'Prospection', color: 'bg-blue-500' },
  { id: 'qualification', name: 'Qualification', color: 'bg-purple-500' },
  { id: 'proposition', name: 'Proposition', color: 'bg-orange-500' },
  { id: 'negotiation', name: 'Négociation', color: 'bg-yellow-500' },
  { id: 'closed', name: 'Gagné', color: 'bg-green-500' }
];

// ===== OPPORTUNITY CARD COMPONENT =====
const OpportunityCard = ({ 
  opportunity, 
  onMove, 
  onDelete, 
  onShowDetails, 
  onShowEdit 
}: { 
  opportunity: Opportunity; 
  onMove: (id: number, stage: string) => void;
  onDelete: (id: number) => void;
  onShowDetails: (opp: Opportunity) => void;
  onShowEdit: (opp: Opportunity) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'opportunity',
    item: { id: opportunity.id, stage: opportunity.stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
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

  return (
    <div
      ref={drag}
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{opportunity.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onShowDetails(opportunity)}>
              <Eye className="h-4 w-4 mr-2" />
              Détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShowEdit(opportunity)}>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(opportunity.id)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Building2 className="h-3 w-3" />
          <span>{opportunity.company}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span>{opportunity.contact}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="font-semibold text-gray-900 text-xs">
              €{opportunity.value.toLocaleString()}
            </span>
          </div>
          <Badge className={getPriorityColor(opportunity.priority)}>
            {getPriorityLabel(opportunity.priority)}
          </Badge>
        </div>

        {/* Scoring Badge */}
        {opportunity.score && (
          <div className="flex items-center gap-1 text-xs">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="text-gray-600">Score: {opportunity.score}/100</span>
          </div>
        )}

        {/* Notes and Attachments indicators */}
        <div className="flex gap-1 text-xs text-gray-500">
          {opportunity.notes && opportunity.notes.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {opportunity.notes.length}
            </span>
          )}
          {opportunity.attachments && opportunity.attachments.length > 0 && (
            <span className="flex items-center gap-1">
              <FileUp className="h-3 w-3" />
              {opportunity.attachments.length}
            </span>
          )}
        </div>

        {/* Assigned Team */}
        {opportunity.assignedTo && opportunity.assignedTo.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Users className="h-3 w-3" />
            <span>{opportunity.assignedTo.length} assigné(s)</span>
          </div>
        )}

        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Probabilité</span>
            <span className="font-medium">{opportunity.probability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${opportunity.probability}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== PIPELINE COLUMN COMPONENT =====
const PipelineColumn = ({
  stage,
  opportunities,
  onDrop,
  onDelete,
  onShowDetails,
  onShowEdit
}: {
  stage: PipelineStage;
  opportunities: Opportunity[];
  onDrop: (id: number, stage: string) => void;
  onDelete: (id: number) => void;
  onShowDetails: (opp: Opportunity) => void;
  onShowEdit: (opp: Opportunity) => void;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'opportunity',
    drop: (item: { id: number; stage: string }) => {
      if (item.stage !== stage.id) {
        onDrop(item.id, stage.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  const avgScore = opportunities.length > 0
    ? Math.round(opportunities.reduce((sum, opp) => sum + (opp.score || 0), 0) / opportunities.length)
    : 0;

  return (
    <div className="flex-1 min-w-[320px]">
      <div className={`${stage.color} text-white rounded-t-lg p-4`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          <Badge className="bg-white/20 text-white border-white/30 text-xs">
            {opportunities.length}
          </Badge>
        </div>
        <div className="text-xs opacity-90 space-y-1">
          <p>Total: €{totalValue.toLocaleString()}</p>
          <p>Pondéré: €{Math.round(weightedValue).toLocaleString()}</p>
          {avgScore > 0 && <p>Score moy: {avgScore}</p>}
        </div>
      </div>

      <div
        ref={drop}
        className={`bg-gray-50 rounded-b-lg p-4 min-h-[600px] transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'border-2 border-transparent'
        }`}
      >
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onMove={onDrop}
            onDelete={onDelete}
            onShowDetails={onShowDetails}
            onShowEdit={onShowEdit}
          />
        ))}

        {opportunities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Aucune opportunité</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== ANALYTICS COMPONENT =====
const PipelineAnalytics = ({ opportunities, stages }: { 
  opportunities: Opportunity[]; 
  stages: PipelineStage[];
}) => {
  const calculateForecast = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyForecast = [0, 0, 0];
    opportunities.forEach(opp => {
      if (opp.stage !== 'closed') {
        const closeDate = new Date(opp.closeDate);
        const monthDiff = closeDate.getMonth() - currentMonth;
        const yearDiff = closeDate.getFullYear() - currentYear;
        const totalMonthDiff = yearDiff * 12 + monthDiff;

        if (totalMonthDiff >= 0 && totalMonthDiff < 3) {
          const weighted = (opp.value * opp.probability) / 100;
          monthlyForecast[totalMonthDiff] += weighted;
        }
      }
    });

    return monthlyForecast;
  };

  const calculateConversionRate = () => {
    const total = opportunities.length;
    const won = opportunities.filter(o => o.stage === 'closed').length;
    return total > 0 ? Math.round((won / total) * 100) : 0;
  };

  const calculateAverageCycleDuration = () => {
    const closedOpps = opportunities.filter(o => o.stage === 'closed');
    if (closedOpps.length === 0) return 0;
    const avgDuration = closedOpps.reduce((sum, opp) => sum + (opp.salesCycleDuration || 30), 0) / closedOpps.length;
    return Math.round(avgDuration);
  };

  const forecast = calculateForecast();
  const conversionRate = calculateConversionRate();
  const avgCycleDuration = calculateAverageCycleDuration();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 font-medium">Forecast Mois 1</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">€{Math.round(forecast[0]).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Valeur pondérée</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 font-medium">Taux Conversion</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Opportunités gagnées</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 font-medium">Cycle Vente</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{avgCycleDuration} j</p>
          <p className="text-xs text-gray-500 mt-1">Durée moyenne</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 font-medium">Forecast Q1</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">€{Math.round(forecast.reduce((a, b) => a + b, 0)).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">3 prochains mois</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== OPPORTUNITY DETAILS MODAL =====
const OpportunityDetailsModal = ({
  opportunity,
  isOpen,
  onClose
}: {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'Opportunité</DialogTitle>
        </DialogHeader>
        {opportunity && (
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="notes">Notes ({opportunity.notes?.length || 0})</TabsTrigger>
              <TabsTrigger value="files">Fichiers ({opportunity.attachments?.length || 0})</TabsTrigger>
              <TabsTrigger value="activity">Historique ({opportunity.activities?.length || 0})</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Titre</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.title}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Montant</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">€{opportunity.value.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Entreprise</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.company}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Contact</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.contact}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Probabilité</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.probability}%</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Priorité</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.priority}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Date Clôture</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{new Date(opportunity.closeDate).toLocaleDateString('fr-FR')}</p>
                </div>
                {opportunity.score && (
                  <div>
                    <label className="text-xs font-medium text-gray-600">Score</label>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.score}/100</p>
                  </div>
                )}
              </div>
              {opportunity.description && (
                <div className="pt-4 border-t">
                  <label className="text-xs font-medium text-gray-600">Description</label>
                  <p className="text-sm text-gray-700 mt-2">{opportunity.description}</p>
                </div>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 py-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {opportunity.notes && opportunity.notes.length > 0 ? (
                  opportunity.notes.map(note => (
                    <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-600">{note.author}</span>
                        <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucune note</p>
                )}
              </div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4 py-4">
              <div className="space-y-2">
                {opportunity.attachments && opportunity.attachments.length > 0 ? (
                  opportunity.attachments.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileUp className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Télécharger</Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucun fichier</p>
                )}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4 py-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {opportunity.activities && opportunity.activities.length > 0 ? (
                  opportunity.activities.map(activity => (
                    <div key={activity.id} className="border-l-2 border-blue-300 pl-3 py-1">
                      <p className="text-xs font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.author} - {new Date(activity.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucun historique</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ===== MAIN PIPELINE COMPONENT =====
const PipelineEnhanced = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: 'Projet CRM Enterprise',
      company: 'Acme Corporation',
      value: 125000,
      probability: 70,
      stage: 'negotiation',
      contact: 'Jean Dupont',
      closeDate: '2026-02-15',
      priority: 'high',
      description: 'Implémentation complète d\'un système CRM',
      assignedTo: ['Alice', 'Bob'],
      score: 85,
      conversionRate: 65,
      salesCycleDuration: 90,
      notes: [
        { id: 1, content: 'Client très intéressé', author: 'Alice', createdAt: '2026-01-20' }
      ],
      attachments: [
        { id: 1, name: 'Proposition.pdf', type: 'pdf', size: 2048 }
      ],
      activities: [
        { id: 1, type: 'stage_change', description: 'Passé en Négociation', author: 'Alice', createdAt: '2026-01-18' }
      ]
    },
    {
      id: 2,
      title: 'Solution ERP',
      company: 'TechStart SAS',
      value: 85000,
      probability: 60,
      stage: 'proposition',
      contact: 'Marie Martin',
      closeDate: '2026-03-01',
      priority: 'high',
      assignedTo: ['Charlie'],
      score: 72,
      notes: [
        { id: 2, content: 'Demande de démo jeudi', author: 'Charlie', createdAt: '2026-01-22' }
      ],
      attachments: [],
      activities: []
    }
  ]);

  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStagesDialogOpen, setIsStagesDialogOpen] = useState(false);
  const [isAutomationDialogOpen, setIsAutomationDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Opportunity | null>(null);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);

  const handleDrop = (id: number, newStage: string) => {
    setOpportunities(prev =>
      prev.map(opp => opp.id === id ? { ...opp, stage: newStage } : opp)
    );
  };

  const handleDeleteOpportunity = (id: number) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  const handleShowDetails = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsDetailsDialogOpen(true);
  };

  const handleShowEdit = (opp: Opportunity) => {
    setEditFormData({ ...opp });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      setOpportunities(prev =>
        prev.map(opp => opp.id === editFormData.id ? editFormData : opp)
      );
      setIsEditDialogOpen(false);
      setEditFormData(null);
    }
  };

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const totalPipelineValue = opportunities
    .filter(opp => opp.stage !== 'closed')
    .reduce((sum, opp) => sum + opp.value, 0);

  const weightedPipelineValue = opportunities
    .filter(opp => opp.stage !== 'closed')
    .reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);

  const wonValue = opportunities
    .filter(opp => opp.stage === 'closed')
    .reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Pipeline Commercial</h1>
          <p className="text-gray-500 mt-1">Gestion avancée de vos opportunités</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isStagesDialogOpen} onOpenChange={setIsStagesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Étapes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Étapes Personnalisables</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {stages.map(stage => (
                  <div key={stage.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className={`w-4 h-4 rounded ${stage.color}`}></div>
                    <span className="text-sm font-medium flex-1">{stage.name}</span>
                    <Button variant="ghost" size="sm">Éditer</Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAutomationDialogOpen} onOpenChange={setIsAutomationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Zap className="h-4 w-4" />
                Automatisations
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Règles d'Automatisation</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {automationRules.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune règle configurée</p>
                ) : (
                  automationRules.map(rule => (
                    <div key={rule.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rule.name}</p>
                        <p className="text-xs text-gray-600">Déclencheur: {rule.trigger} → Action: {rule.action}</p>
                      </div>
                      <Badge variant={rule.enabled ? "default" : "secondary"}>{rule.enabled ? "Activé" : "Désactivé"}</Badge>
                    </div>
                  ))
                )}
              </div>
              <Button className="w-full">+ Ajouter une Règle</Button>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle Opportunité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter une Opportunité</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="opp-title">Titre de l'opportunité *</Label>
                  <Input id="opp-title" placeholder="Projet CRM Enterprise" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-company">Entreprise *</Label>
                  <Input id="opp-company" placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-contact">Contact</Label>
                  <Input id="opp-contact" placeholder="Jean Dupont" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-value">Montant (€) *</Label>
                  <Input id="opp-value" type="number" placeholder="125000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-probability">Probabilité (%)</Label>
                  <Input id="opp-probability" type="number" min="0" max="100" placeholder="70" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-stage">Étape</Label>
                  <select id="opp-stage" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {stages.map(stage => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-closedate">Date de clôture</Label>
                  <Input id="opp-closedate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-priority">Priorité</Label>
                  <select id="opp-priority" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="opp-description">Description</Label>
                  <Textarea id="opp-description" placeholder="Détails de l'opportunité..." />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Créer l'opportunité
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Prévisions & Analytics</h2>
        <PipelineAnalytics opportunities={opportunities} stages={stages} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pipeline Total</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{totalPipelineValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {opportunities.filter(o => o.stage !== 'closed').length} opportunités
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Valeur Pondérée</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{Math.round(weightedPipelineValue).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Basée sur probabilité
                </p>
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
                <p className="text-sm text-gray-600 font-medium">Affaires Gagnées</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  €{wonValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {opportunities.filter(o => o.stage === 'closed').length} opportunités
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Vue Kanban</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {stages.map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage}
                opportunities={getOpportunitiesByStage(stage.id)}
                onDrop={handleDrop}
                onDelete={handleDeleteOpportunity}
                onShowDetails={handleShowDetails}
                onShowEdit={handleShowEdit}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <OpportunityDetailsModal
        opportunity={selectedOpportunity}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'Opportunité</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-title">Titre *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Entreprise *</Label>
                <Input
                  id="edit-company"
                  value={editFormData.company}
                  onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact</Label>
                <Input
                  id="edit-contact"
                  value={editFormData.contact}
                  onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Montant (€) *</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editFormData.value}
                  onChange={(e) => setEditFormData({ ...editFormData, value: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-probability">Probabilité (%)</Label>
                <Input
                  id="edit-probability"
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.probability}
                  onChange={(e) => setEditFormData({ ...editFormData, probability: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-score">Score (0-100)</Label>
                <Input
                  id="edit-score"
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.score || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, score: parseInt(e.target.value) || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stage">Étape</Label>
                <select
                  id="edit-stage"
                  value={editFormData.stage}
                  onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priorité</Label>
                <select
                  id="edit-priority"
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineEnhanced;
