import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Plus, 
  DollarSign, 
  Calendar,
  Building2,
  User,
  MoreVertical,
  TrendingUp
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
}

const STAGES = [
  { id: 'prospection', name: 'Prospection', color: 'bg-blue-500' },
  { id: 'qualification', name: 'Qualification', color: 'bg-purple-500' },
  { id: 'proposition', name: 'Proposition', color: 'bg-orange-500' },
  { id: 'negotiation', name: 'Négociation', color: 'bg-yellow-500' },
  { id: 'closed', name: 'Gagné', color: 'bg-green-500' }
];

const OpportunityCard = ({ opportunity, onMove }: { opportunity: Opportunity; onMove: (id: number, stage: string) => void }) => {
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
        <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="h-4 w-4" />
          <span>{opportunity.company}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{opportunity.contact}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-gray-900">
              €{opportunity.value.toLocaleString()}
            </span>
          </div>
          <Badge className={getPriorityColor(opportunity.priority)}>
            {getPriorityLabel(opportunity.priority)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Clôture: {new Date(opportunity.closeDate).toLocaleDateString('fr-FR')}</span>
        </div>
        
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

const PipelineColumn = ({ 
  stage, 
  opportunities, 
  onDrop 
}: { 
  stage: typeof STAGES[0]; 
  opportunities: Opportunity[]; 
  onDrop: (id: number, stage: string) => void;
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

  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`${stage.color} text-white rounded-t-lg p-4`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">{stage.name}</h3>
          <Badge className="bg-white/20 text-white border-white/30">
            {opportunities.length}
          </Badge>
        </div>
        <div className="text-sm opacity-90">
          <p>Total: €{totalValue.toLocaleString()}</p>
          <p>Pondéré: €{Math.round(weightedValue).toLocaleString()}</p>
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
      priority: 'high'
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
      priority: 'high'
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
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Application Mobile',
      company: 'Innovation Labs',
      value: 95000,
      probability: 50,
      stage: 'qualification',
      contact: 'Sophie Bernard',
      closeDate: '2026-04-15',
      priority: 'high'
    },
    {
      id: 5,
      title: 'Consulting IT',
      company: 'Global Industries',
      value: 35000,
      probability: 40,
      stage: 'prospection',
      contact: 'Pierre Leclerc',
      closeDate: '2026-05-01',
      priority: 'low'
    },
    {
      id: 6,
      title: 'Formation Équipe',
      company: 'Smart Tech SARL',
      value: 15000,
      probability: 90,
      stage: 'closed',
      contact: 'Alice Rousseau',
      closeDate: '2026-01-25',
      priority: 'medium'
    },
    {
      id: 7,
      title: 'Maintenance Annuelle',
      company: 'Future Corp',
      value: 25000,
      probability: 30,
      stage: 'prospection',
      contact: 'Emma Moreau',
      closeDate: '2026-06-01',
      priority: 'low'
    },
    {
      id: 8,
      title: 'Intégration API',
      company: 'Business Partners',
      value: 55000,
      probability: 65,
      stage: 'qualification',
      contact: 'Thomas Petit',
      closeDate: '2026-03-20',
      priority: 'medium'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleDrop = (id: number, newStage: string) => {
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === id ? { ...opp, stage: newStage } : opp
      )
    );
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
          <p className="text-gray-500 mt-1">Suivez vos opportunités en temps réel</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Opportunité
            </button>
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
                  <option value="prospection">Prospection</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposition">Proposition</option>
                  <option value="negotiation">Négociation</option>
                  <option value="closed">Gagné</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opp-closedate">Date de clôture prévue</Label>
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
                  {opportunities.filter(o => o.stage !== 'closed').length} opportunités actives
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
                  Basé sur la probabilité
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
                  {opportunities.filter(o => o.stage === 'closed').length} opportunités fermées
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
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {STAGES.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              opportunities={getOpportunitiesByStage(stage.id)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Pipeline = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <PipelineContent />
    </DndProvider>
  );
};

export default Pipeline;
