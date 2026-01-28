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
  Plus, DollarSign, Calendar, Building2, User, MoreVertical, TrendingUp,
  Eye, Pencil, Trash2, FileUp, MessageSquare, Users, BarChart3, Zap,
  Settings, Clock, TrendingDown, AlertCircle, Download, X, CheckCircle,
  AlertTriangle, Bell, Search, Filter, Send, Download as DownloadIcon, Trash
} from 'lucide-react';

// ===== INTERFACES =====
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
  uploadedBy: string;
  uploadedAt: string;
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
}

interface AutomationRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

interface Alert {
  id: number;
  type: 'reminder' | 'alert' | 'scoring';
  title: string;
  description: string;
  oppId: number;
  createdAt: string;
}

const INITIAL_STAGES: PipelineStage[] = [
  { id: 'prospection', name: 'Prospection', color: 'bg-blue-500' },
  { id: 'qualification', name: 'Qualification', color: 'bg-purple-500' },
  { id: 'proposition', name: 'Proposition', color: 'bg-orange-500' },
  { id: 'negotiation', name: 'Négociation', color: 'bg-yellow-500' },
  { id: 'closed', name: 'Gagné', color: 'bg-green-500' }
];

const AVAILABLE_COLORS = [
  { name: 'Bleu', value: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'Pourpre', value: 'bg-purple-500', hex: '#a855f7' },
  { name: 'Orange', value: 'bg-orange-500', hex: '#f97316' },
  { name: 'Jaune', value: 'bg-yellow-500', hex: '#eab308' },
  { name: 'Vert', value: 'bg-green-500', hex: '#22c55e' },
  { name: 'Rose', value: 'bg-pink-500', hex: '#ec4899' },
  { name: 'Indigo', value: 'bg-indigo-500', hex: '#6366f1' },
  { name: 'Cyan', value: 'bg-cyan-500', hex: '#06b6d4' },
  { name: 'Red', value: 'bg-red-500', hex: '#ef4444' },
  { name: 'Gris', value: 'bg-gray-500', hex: '#6b7280' }
];

// ===== OPPORTUNITY CARD COMPONENT =====
const OpportunityCard = ({ opportunity, onMove, onDelete, onShowDetails, onShowEdit }: {
  opportunity: Opportunity;
  onMove: (id: number, stage: string) => void;
  onDelete: (id: number) => void;
  onShowDetails: (opp: Opportunity) => void;
  onShowEdit: (opp: Opportunity) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'opportunity',
    item: { id: opportunity.id, stage: opportunity.stage },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  return (
    <div ref={drag} className={`bg-white border border-gray-200 rounded-lg p-2 sm:p-4 mb-2 sm:mb-3 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3">
        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{opportunity.title}</h3>
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

      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600 truncate">
          <Building2 className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{opportunity.company}</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600 truncate">
          <User className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{opportunity.contact}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-green-600 flex-shrink-0" />
            <span className="font-semibold text-gray-900 text-xs">€{opportunity.value.toLocaleString()}</span>
          </div>
          <Badge className={`${getPriorityColor(opportunity.priority)} text-xs`}>
            {getPriorityLabel(opportunity.priority)}
          </Badge>
        </div>

        {opportunity.score && (
          <div className="flex items-center gap-1 text-xs">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="text-gray-600">Score: {opportunity.score}/100</span>
          </div>
        )}

        <div className="flex gap-2 text-xs text-gray-500">
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
          {opportunity.assignedTo && opportunity.assignedTo.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {opportunity.assignedTo.length}
            </span>
          )}
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span className="hidden sm:inline">Probabilité</span>
            <span className="sm:hidden">Proba</span>
            <span className="font-medium">{opportunity.probability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${opportunity.probability}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== PIPELINE COLUMN COMPONENT =====
const PipelineColumn = ({ stage, opportunities, onDrop, onDelete, onShowDetails, onShowEdit }: {
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
    collect: (monitor) => ({ isOver: monitor.isOver() })
  }));

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  const avgScore = opportunities.length > 0 ? Math.round(opportunities.reduce((sum, opp) => sum + (opp.score || 0), 0) / opportunities.length) : 0;

  return (
    <div className="flex-1 min-w-full sm:min-w-[320px]">
      <div className={`${stage.color} text-white rounded-t-lg p-3 sm:p-4`}>
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="font-semibold text-xs sm:text-sm flex-1 truncate">{stage.name}</h3>
          <Badge className="bg-white/20 text-white border-white/30 text-xs flex-shrink-0">{opportunities.length}</Badge>
        </div>
        <div className="text-xs opacity-90 space-y-0.5 hidden sm:space-y-1 sm:block">
          <p>Total: €{totalValue.toLocaleString()}</p>
          <p>Pondéré: €{Math.round(weightedValue).toLocaleString()}</p>
          {avgScore > 0 && <p>Score moy: {avgScore}</p>}
        </div>
      </div>

      <div ref={drop} className={`bg-gray-50 rounded-b-lg p-2 sm:p-4 min-h-[400px] sm:min-h-[600px] transition-colors ${isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'border-2 border-transparent'}`}>
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
const PipelineAnalytics = ({ opportunities }: { opportunities: Opportunity[] }) => {
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
  const totalPipeline = forecast.reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <p className="text-xs text-blue-600 font-semibold">Forecast Mois 1</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">€{Math.round(forecast[0]).toLocaleString()}</p>
          <p className="text-xs text-blue-600 mt-1">Valeur pondérée</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-4">
          <p className="text-xs text-green-600 font-semibold">Taux Conversion</p>
          <p className="text-2xl font-bold text-green-900 mt-2">{conversionRate}%</p>
          <p className="text-xs text-green-600 mt-1">Opportunités gagnées</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-4">
          <p className="text-xs text-purple-600 font-semibold">Cycle Vente</p>
          <p className="text-2xl font-bold text-purple-900 mt-2">{avgCycleDuration} j</p>
          <p className="text-xs text-purple-600 mt-1">Durée moyenne</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="p-4">
          <p className="text-xs text-orange-600 font-semibold">Forecast Q1</p>
          <p className="text-2xl font-bold text-orange-900 mt-2">€{Math.round(totalPipeline).toLocaleString()}</p>
          <p className="text-xs text-orange-600 mt-1">3 prochains mois</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== OPPORTUNITY DETAILS MODAL =====
const OpportunityDetailsModal = ({ opportunity, isOpen, onClose, onAddNote, onAddAttachment }: {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (oppId: number, content: string) => void;
  onAddAttachment: (oppId: number, name: string, type: string, size: number) => void;
}) => {
  const [newNote, setNewNote] = useState('');
  const [newFile, setNewFile] = useState({ name: '', type: '', size: 0 });

  const handleAddNote = () => {
    if (newNote.trim() && opportunity) {
      onAddNote(opportunity.id, newNote);
      setNewNote('');
    }
  };

  const handleAddAttachment = () => {
    if (newFile.name && opportunity) {
      onAddAttachment(opportunity.id, newFile.name, newFile.type, newFile.size);
      setNewFile({ name: '', type: '', size: 0 });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'Opportunité</DialogTitle>
        </DialogHeader>
        {opportunity && (
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-0">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="notes">Notes ({opportunity.notes?.length || 0})</TabsTrigger>
              <TabsTrigger value="files">Fichiers ({opportunity.attachments?.length || 0})</TabsTrigger>
              <TabsTrigger value="activity">Historique ({opportunity.activities?.length || 0})</TabsTrigger>
              <TabsTrigger value="team">Équipe ({opportunity.assignedTo?.length || 0})</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 py-4 bg-white rounded-lg p-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Titre</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.title}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Montant</label>
                  <p className="text-sm font-semibold text-green-600 mt-1">€{opportunity.value.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Entreprise</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.company}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Contact</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.contact}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Probabilité</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{opportunity.probability}%</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Priorité</label>
                  <Badge className={opportunity.priority === 'high' ? 'bg-red-100 text-red-700' : opportunity.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}>
                    {opportunity.priority === 'high' ? 'Haute' : opportunity.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </Badge>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Date Clôture</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{new Date(opportunity.closeDate).toLocaleDateString('fr-FR')}</p>
                </div>
                {opportunity.score && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600">Score</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${opportunity.score}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold">{opportunity.score}%</span>
                    </div>
                  </div>
                )}
              </div>
              {opportunity.description && (
                <div className="pt-4 border-t">
                  <label className="text-xs font-semibold text-gray-600">Description</label>
                  <p className="text-sm text-gray-700 mt-2">{opportunity.description}</p>
                </div>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 py-4 bg-white rounded-lg p-4 mt-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Textarea placeholder="Ajouter une note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="text-sm" />
                  <Button onClick={handleAddNote} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-fit">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {opportunity.notes && opportunity.notes.length > 0 ? (
                    opportunity.notes.map(note => (
                      <div key={note.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-blue-900">{note.author}</span>
                          <span className="text-xs text-blue-600">{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <p className="text-sm text-gray-700">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Aucune note</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4 py-4 bg-white rounded-lg p-4 mt-4">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Nom fichier" value={newFile.name} onChange={(e) => setNewFile({...newFile, name: e.target.value})} className="text-sm" />
                  <Input placeholder="Type" value={newFile.type} onChange={(e) => setNewFile({...newFile, type: e.target.value})} className="text-sm" />
                  <Button onClick={handleAddAttachment} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    <FileUp className="h-4 w-4 mr-1" />
                    Joindre
                  </Button>
                </div>
                <div className="space-y-2">
                  {opportunity.attachments && opportunity.attachments.length > 0 ? (
                    opportunity.attachments.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <FileUp className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB · {file.uploadedBy}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Aucun fichier</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4 py-4 bg-white rounded-lg p-4 mt-4">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {opportunity.activities && opportunity.activities.length > 0 ? (
                  opportunity.activities.map(activity => (
                    <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 p-3 rounded">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-600 mt-1">{activity.author} · {new Date(activity.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Aucun historique</p>
                )}
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4 py-4 bg-white rounded-lg p-4 mt-4">
              <div className="space-y-2">
                {opportunity.assignedTo && opportunity.assignedTo.length > 0 ? (
                  opportunity.assignedTo.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {member.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{member}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Aucune équipe assignée</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ===== ALERTS & REMINDERS COMPONENT =====
const AlertsPanel = ({ alerts, onDismiss }: {
  alerts: Alert[];
  onDismiss: (id: number) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <Bell className="h-4 w-4" />
          {alerts.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white">{alerts.length}</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rappels & Alertes</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${alert.type === 'alert' ? 'bg-red-50 border-red-500' : alert.type === 'reminder' ? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    {alert.type === 'alert' ? <AlertTriangle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" /> : <Bell className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />}
                    <div>
                      <p className="font-semibold text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(alert.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onDismiss(alert.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Aucune alerte ou rappel</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ===== MAIN PIPELINE CONTENT =====
const PipelineContent = () => {
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
      description: 'Implémentation complète d\'un système CRM avec intégration API',
      assignedTo: ['Alice Martin', 'Bob Rousseau'],
      score: 85,
      conversionRate: 65,
      salesCycleDuration: 90,
      notes: [
        { id: 1, content: 'Client très intéressé par notre solution', author: 'Alice Martin', createdAt: '2026-01-20' },
        { id: 2, content: 'Budget approuvé, signature prévue fin février', author: 'Bob Rousseau', createdAt: '2026-01-22' }
      ],
      attachments: [
        { id: 1, name: 'Proposition_Acme.pdf', type: 'pdf', size: 2048, uploadedBy: 'Alice Martin', uploadedAt: '2026-01-20' },
        { id: 2, name: 'Devis_Final.pdf', type: 'pdf', size: 1536, uploadedBy: 'Bob Rousseau', uploadedAt: '2026-01-22' }
      ],
      activities: [
        { id: 1, type: 'stage_change', description: 'Passé en Négociation', author: 'Alice Martin', createdAt: '2026-01-18' },
        { id: 2, type: 'meeting', description: 'Réunion de présentation CRM', author: 'Alice Martin', createdAt: '2026-01-20' }
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
      assignedTo: ['Charlie Durand'],
      score: 72,
      notes: [
        { id: 3, content: 'Demande de démo jeudi à 14h', author: 'Charlie Durand', createdAt: '2026-01-22' }
      ],
      attachments: [],
      activities: []
    },
    {
      id: 3,
      title: 'Site Web E-commerce',
      company: 'Digital Solutions',
      value: 45000,
      probability: 80,
      stage: 'negotiation',
      contact: 'Luc Dubois',
      closeDate: '2026-01-30',
      priority: 'medium',
      score: 68,
      notes: [],
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
  const [addFormData, setAddFormData] = useState<Partial<Opportunity>>({});
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingStageName, setEditingStageName] = useState('');
  const [editingStageColor, setEditingStageColor] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('bg-blue-500');
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [editingRuleData, setEditingRuleData] = useState({ name: '', trigger: '', action: '' });
  const [newRuleData, setNewRuleData] = useState({ name: '', trigger: '', action: '' });
  const [newReminderData, setNewReminderData] = useState({ title: '', trigger: '' });
  const [newScoringData, setNewScoringData] = useState({ factor: '', weight: 50 });
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    { id: 1, name: 'Auto déplacement qualifiée', trigger: 'score > 75', action: 'Déplacer vers Proposition', enabled: true },
    { id: 2, name: 'Alerte priorité haute', trigger: 'priority = high', action: 'Créer alerte', enabled: true }
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: 'alert', title: 'Opportunité en retard', description: 'Acme Corporation - Date clôture dépassée', oppId: 1, createdAt: new Date().toISOString() },
    { id: 2, type: 'reminder', title: 'Rappel réunion', description: 'TechStart SAS - Démo prévue aujourd\'hui', oppId: 2, createdAt: new Date().toISOString() },
    { id: 3, type: 'scoring', title: 'Score opportunité', description: 'Digital Solutions a atteint 68% de score', oppId: 3, createdAt: new Date().toISOString() }
  ]);

  const handleDrop = (id: number, newStage: string) => {
    setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, stage: newStage } : opp));
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
      setOpportunities(prev => prev.map(opp => opp.id === editFormData.id ? editFormData : opp));
      setIsEditDialogOpen(false);
      setEditFormData(null);
    }
  };

  const handleAddOpportunity = () => {
    if (addFormData.title && addFormData.company && addFormData.value) {
      const newOpp: Opportunity = {
        id: Math.max(...opportunities.map(o => o.id), 0) + 1,
        title: addFormData.title,
        company: addFormData.company,
        value: addFormData.value,
        probability: addFormData.probability || 50,
        stage: addFormData.stage || 'prospection',
        contact: addFormData.contact || '',
        closeDate: addFormData.closeDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        priority: addFormData.priority || 'medium',
        description: addFormData.description,
        assignedTo: [],
        notes: [],
        attachments: [],
        activities: [],
        score: addFormData.score || 50
      };
      setOpportunities(prev => [...prev, newOpp]);
      setIsAddDialogOpen(false);
      setAddFormData({});
    }
  };

  const handleAddNote = (oppId: number, content: string) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === oppId 
        ? { 
            ...opp, 
            notes: [...(opp.notes || []), {
              id: Math.max(...(opp.notes?.map(n => n.id) || []), 0) + 1,
              content,
              author: 'Vous',
              createdAt: new Date().toISOString()
            }]
          }
        : opp
    ));
    if (selectedOpportunity?.id === oppId) {
      setSelectedOpportunity(prev => prev ? { ...prev, notes: [...(prev.notes || []), {
        id: Math.max(...(prev.notes?.map(n => n.id) || []), 0) + 1,
        content,
        author: 'Vous',
        createdAt: new Date().toISOString()
      }]} : null);
    }
  };

  const handleAddAttachment = (oppId: number, name: string, type: string, size: number) => {
    setOpportunities(prev => prev.map(opp =>
      opp.id === oppId
        ? {
            ...opp,
            attachments: [...(opp.attachments || []), {
              id: Math.max(...(opp.attachments?.map(a => a.id) || []), 0) + 1,
              name,
              type,
              size,
              uploadedBy: 'Vous',
              uploadedAt: new Date().toISOString()
            }]
          }
        : opp
    ));
    if (selectedOpportunity?.id === oppId) {
      setSelectedOpportunity(prev => prev ? { ...prev, attachments: [...(prev.attachments || []), {
        id: Math.max(...(prev.attachments?.map(a => a.id) || []), 0) + 1,
        name,
        type,
        size,
        uploadedBy: 'Vous',
        uploadedAt: new Date().toISOString()
      }]} : null);
    }
  };

  const handleAddAutomationRule = (name: string, trigger: string, action: string) => {
    setAutomationRules(prev => [...prev, {
      id: Math.max(...prev.map(r => r.id), 0) + 1,
      name,
      trigger,
      action,
      enabled: true
    }]);
  };

  const handleUpdateStage = (stageId: string, newName: string, newColor: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, name: newName, color: newColor } : s));
    setEditingStageId(null);
    setEditingStageName('');
    setEditingStageColor('');
  };

  const handleAddStage = () => {
    if (newStageName.trim()) {
      setStages(prev => [...prev, {
        id: newStageName.toLowerCase().replace(/\s+/g, '-'),
        name: newStageName,
        color: newStageColor
      }]);
      setNewStageName('');
      setNewStageColor('bg-blue-500');
    }
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(prev => prev.filter(s => s.id !== stageId));
  };

  const handleUpdateAutomationRule = (ruleId: number, name: string, trigger: string, action: string) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, name, trigger, action } : r));
    setEditingRuleId(null);
    setEditingRuleData({ name: '', trigger: '', action: '' });
  };

  const handleDeleteAutomationRule = (ruleId: number) => {
    setAutomationRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleToggleRuleEnabled = (ruleId: number) => {
    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  const handleAddReminder = () => {
    if (newReminderData.title.trim()) {
      setAlerts(prev => [...prev, {
        id: Math.max(...prev.map(a => a.id), 0) + 1,
        type: 'reminder',
        title: newReminderData.title,
        description: `Rappel: ${newReminderData.trigger}`,
        oppId: 0,
        createdAt: new Date().toISOString()
      }]);
      setNewReminderData({ title: '', trigger: '' });
    }
  };

  const handleAddScoringConfig = () => {
    if (newScoringData.factor.trim()) {
      // Configuration du scoring
      setNewScoringData({ factor: '', weight: 50 });
    }
  };

  const handleDismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const totalPipelineValue = opportunities.filter(opp => opp.stage !== 'closed').reduce((sum, opp) => sum + opp.value, 0);
  const weightedPipelineValue = opportunities.filter(opp => opp.stage !== 'closed').reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  const wonValue = opportunities.filter(opp => opp.stage === 'closed').reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pipeline Commercial</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Gestion avancée de vos opportunités</p>
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <AlertsPanel alerts={alerts} onDismiss={handleDismissAlert} />
          
          <Dialog open={isStagesDialogOpen} onOpenChange={setIsStagesDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Settings className="h-4 w-4" />
                Étapes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full sm:max-w-lg md:max-w-3xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Étapes Personnalisables</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Existing Stages */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Étapes existantes</p>
                  {stages.map(stage => (
                    <div key={stage.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                      {editingStageId === stage.id ? (
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <div>
                              <Label className="text-xs font-semibold mb-2 block">Nom de l'étape</Label>
                              <Input
                                value={editingStageName}
                                onChange={(e) => setEditingStageName(e.target.value)}
                                className="text-sm"
                                placeholder={stage.name}
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-semibold mb-2 block">Couleur</Label>
                              <div className="flex gap-2 flex-wrap">
                                {AVAILABLE_COLORS.map(color => (
                                  <button
                                    key={color.value}
                                    onClick={() => setEditingStageColor(color.value)}
                                    className={`w-8 h-8 rounded-full ${color.value} border-2 transition-all ${editingStageColor === color.value ? 'border-gray-900 scale-110' : 'border-gray-300'}`}
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStage(stage.id, editingStageName, editingStageColor || stage.color)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Valider
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingStageId(null);
                                setEditingStageName('');
                                setEditingStageColor('');
                              }}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-semibold flex-1 text-gray-900">{stage.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingStageId(stage.id);
                              setEditingStageName(stage.name);
                              setEditingStageColor(stage.color);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Éditer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStage(stage.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Stage */}
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-900">Ajouter une nouvelle étape</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Nom de l'étape</Label>
                      <Input
                        placeholder="Nom de l'étape..."
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Couleur de l'étape</Label>
                      <div className="flex gap-2 flex-wrap">
                        {AVAILABLE_COLORS.map(color => (
                          <button
                            key={color.value}
                            onClick={() => setNewStageColor(color.value)}
                            className={`w-8 h-8 rounded-full ${color.value} border-2 transition-all ${newStageColor === color.value ? 'border-gray-900 scale-110' : 'border-gray-300'}`}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={handleAddStage}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter l'étape
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAutomationDialogOpen} onOpenChange={setIsAutomationDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                <Zap className="h-4 w-4" />
                Automatisations
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full sm:max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Règles d'Automatisation</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="rules" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-0">
                  <TabsTrigger value="rules">Règles</TabsTrigger>
                  <TabsTrigger value="alerts">Rappels & Alertes</TabsTrigger>
                  <TabsTrigger value="scoring">Scoring</TabsTrigger>
                </TabsList>

                {/* RULES TAB */}
                <TabsContent value="rules" className="space-y-3 sm:space-y-4 py-3 sm:py-4 bg-white rounded-lg p-3 sm:p-4 mt-4">
                  {/* Existing Rules */}
                  <div className="space-y-3">
                    {automationRules.map(rule => (
                      <div key={rule.id} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => handleToggleRuleEnabled(rule.id)}
                          className="w-4 h-4 rounded accent-blue-600 mt-1 flex-shrink-0"
                        />
                        {editingRuleId === rule.id ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Nom de la règle"
                              value={editingRuleData.name}
                              onChange={(e) => setEditingRuleData({...editingRuleData, name: e.target.value})}
                              className="text-sm"
                            />
                            <Input
                              placeholder="Condition déclenchement (ex: score > 75)"
                              value={editingRuleData.trigger}
                              onChange={(e) => setEditingRuleData({...editingRuleData, trigger: e.target.value})}
                              className="text-sm"
                            />
                            <Input
                              placeholder="Action (ex: Déplacer vers Proposition)"
                              value={editingRuleData.action}
                              onChange={(e) => setEditingRuleData({...editingRuleData, action: e.target.value})}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateAutomationRule(rule.id, editingRuleData.name, editingRuleData.trigger, editingRuleData.action)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Valider
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingRuleId(null)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${rule.enabled ? 'text-gray-900' : 'text-gray-500'}`}>{rule.name}</p>
                              <p className={`text-xs ${rule.enabled ? 'text-gray-600' : 'text-gray-400'}`}>Si: {rule.trigger} → Alors: {rule.action}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingRuleId(rule.id);
                                setEditingRuleData({name: rule.name, trigger: rule.trigger, action: rule.action});
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAutomationRule(rule.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Rule */}
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-900">Ajouter une nouvelle règle</p>
                    <Input
                      placeholder="Nom de la règle"
                      value={newRuleData.name}
                      onChange={(e) => setNewRuleData({...newRuleData, name: e.target.value})}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Condition déclenchement (ex: score > 75)"
                      value={newRuleData.trigger}
                      onChange={(e) => setNewRuleData({...newRuleData, trigger: e.target.value})}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Action (ex: Déplacer vers Proposition)"
                      value={newRuleData.action}
                      onChange={(e) => setNewRuleData({...newRuleData, action: e.target.value})}
                      className="text-sm"
                    />
                    <Button
                      onClick={() => {
                        if (newRuleData.name && newRuleData.trigger && newRuleData.action) {
                          handleAddAutomationRule(newRuleData.name, newRuleData.trigger, newRuleData.action);
                          setNewRuleData({name: '', trigger: '', action: ''});
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une règle
                    </Button>
                  </div>
                </TabsContent>

                {/* ALERTS & REMINDERS TAB */}
                <TabsContent value="alerts" className="space-y-4 py-4 bg-white rounded-lg p-4 mt-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-semibold text-yellow-900 mb-3">Rappels configurés</p>
                      {alerts.filter(a => a.type === 'reminder').map(alert => (
                        <div key={alert.id} className="flex items-start gap-2 mb-2 p-2 bg-white rounded border border-yellow-100">
                          <Bell className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-900">{alert.title}</p>
                            <p className="text-xs text-gray-600">{alert.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-sm font-semibold text-gray-900">Configurer un nouveau rappel</p>
                      <Input
                        placeholder="Titre du rappel"
                        value={newReminderData.title}
                        onChange={(e) => setNewReminderData({...newReminderData, title: e.target.value})}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Condition du rappel (ex: avant clôture)"
                        value={newReminderData.trigger}
                        onChange={(e) => setNewReminderData({...newReminderData, trigger: e.target.value})}
                        className="text-sm"
                      />
                      <Button
                        onClick={handleAddReminder}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter un rappel
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* SCORING TAB */}
                <TabsContent value="scoring" className="space-y-4 py-4 bg-white rounded-lg p-4 mt-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-semibold text-purple-900 mb-3">Configuration Scoring Automatique</p>
                    <ul className="text-xs text-purple-800 space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        Score basé sur probabilité (0-40 points)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        Score basé sur montant (0-30 points)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        Score basé sur historique activités (0-30 points)
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-900">Ajouter un facteur de scoring</p>
                    <Input
                      placeholder="Facteur (ex: Engagement client)"
                      value={newScoringData.factor}
                      onChange={(e) => setNewScoringData({...newScoringData, factor: e.target.value})}
                      className="text-sm"
                    />
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Poids du facteur: {newScoringData.weight}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newScoringData.weight}
                        onChange={(e) => setNewScoringData({...newScoringData, weight: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={handleAddScoringConfig}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter facteur
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Plus className="h-4 w-4" />
                Nouvelle Opportunité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full sm:max-w-sm md:max-w-2xl mx-2 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une Opportunité</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label htmlFor="opp-title" className="font-semibold">Titre de l'opportunité *</Label>
                  <Input
                    id="opp-title"
                    placeholder="Projet CRM Enterprise"
                    value={addFormData.title || ''}
                    onChange={(e) => setAddFormData({...addFormData, title: e.target.value})}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-company" className="font-semibold">Entreprise *</Label>
                  <Input
                    id="opp-company"
                    placeholder="Acme Corp"
                    value={addFormData.company || ''}
                    onChange={(e) => setAddFormData({...addFormData, company: e.target.value})}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-contact" className="font-semibold">Contact</Label>
                  <Input
                    id="opp-contact"
                    placeholder="Jean Dupont"
                    value={addFormData.contact || ''}
                    onChange={(e) => setAddFormData({...addFormData, contact: e.target.value})}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-value" className="font-semibold">Montant (€) *</Label>
                  <Input
                    id="opp-value"
                    type="number"
                    placeholder="125000"
                    value={addFormData.value || ''}
                    onChange={(e) => setAddFormData({...addFormData, value: parseInt(e.target.value) || 0})}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-probability" className="font-semibold">Probabilité (%)</Label>
                  <Input
                    id="opp-probability"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="70"
                    value={addFormData.probability || ''}
                    onChange={(e) => setAddFormData({...addFormData, probability: parseInt(e.target.value) || 50})}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-score" className="font-semibold">Score (0-100)</Label>
                  <Input
                    id="opp-score"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="50"
                    value={addFormData.score || ''}
                    onChange={(e) => setAddFormData({...addFormData, score: parseInt(e.target.value) || 50})}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-stage" className="font-semibold">Étape</Label>
                  <select
                    id="opp-stage"
                    value={addFormData.stage || 'prospection'}
                    onChange={(e) => setAddFormData({...addFormData, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {stages.map(stage => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-priority" className="font-semibold">Priorité</Label>
                  <select
                    id="opp-priority"
                    value={addFormData.priority || 'medium'}
                    onChange={(e) => setAddFormData({...addFormData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opp-closedate" className="font-semibold">Date de clôture</Label>
                  <Input
                    id="opp-closedate"
                    type="date"
                    value={addFormData.closeDate || ''}
                    onChange={(e) => setAddFormData({...addFormData, closeDate: e.target.value})}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label htmlFor="opp-description" className="font-semibold">Description</Label>
                  <Textarea
                    id="opp-description"
                    placeholder="Détails de l'opportunité..."
                    value={addFormData.description || ''}
                    onChange={(e) => setAddFormData({...addFormData, description: e.target.value})}
                    className="border-gray-300 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); setAddFormData({});}}>
                  Annuler
                </Button>
                <Button onClick={handleAddOpportunity} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Créer l'opportunité
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Prévisions & Analytics</h2>
        <PipelineAnalytics opportunities={opportunities} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-blue-600">Pipeline Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">€{totalPipelineValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">{opportunities.filter(o => o.stage !== 'closed').length} opportunités</p>
              </div>
              <div className="bg-blue-100 p-3 sm:p-4 rounded-lg">
                <TrendingUp className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-purple-600">Valeur Pondérée</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">€{Math.round(weightedPipelineValue).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Basée sur probabilité</p>
              </div>
              <div className="bg-purple-100 p-3 sm:p-4 rounded-lg">
                <DollarSign className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-green-600">Affaires Gagnées</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">€{wonValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">{opportunities.filter(o => o.stage === 'closed').length} opportunités</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg font-bold text-gray-900"></h2>
        <div className="overflow-x-auto pb-2 sm:pb-4 -mx-3 sm:mx-0 px-3 sm:px-0">
          <div className="flex gap-3 sm:gap-4 min-w-min">
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
        onAddNote={handleAddNote}
        onAddAttachment={handleAddAttachment}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-full sm:max-w-sm md:max-w-2xl mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'Opportunité</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
              <div className="space-y-2 col-span-1 sm:col-span-2">
                <Label htmlFor="edit-title" className="font-semibold">Titre *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company" className="font-semibold">Entreprise *</Label>
                <Input
                  id="edit-company"
                  value={editFormData.company}
                  onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact" className="font-semibold">Contact</Label>
                <Input
                  id="edit-contact"
                  value={editFormData.contact}
                  onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value" className="font-semibold">Montant (€) *</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editFormData.value}
                  onChange={(e) => setEditFormData({ ...editFormData, value: parseInt(e.target.value) })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-probability" className="font-semibold">Probabilité (%)</Label>
                <Input
                  id="edit-probability"
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.probability}
                  onChange={(e) => setEditFormData({ ...editFormData, probability: parseInt(e.target.value) })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-score" className="font-semibold">Score (0-100)</Label>
                <Input
                  id="edit-score"
                  type="number"
                  min="0"
                  max="100"
                  value={editFormData.score || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, score: parseInt(e.target.value) || undefined })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stage" className="font-semibold">Étape</Label>
                <select
                  id="edit-stage"
                  value={editFormData.stage}
                  onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority" className="font-semibold">Priorité</Label>
                <select
                  id="edit-priority"
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div className="space-y-2 col-span-1 sm:col-span-2">
                <Label htmlFor="edit-description" className="font-semibold">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="border-gray-300 text-sm"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Enregistrer les modifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ===== WRAPPER COMPONENT WITH DND =====
const Pipeline = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <PipelineContent />
    </DndProvider>
  );
};

export default Pipeline;
