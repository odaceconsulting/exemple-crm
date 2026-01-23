import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { 
  Upload, 
  File, 
  FileText, 
  Image as ImageIcon, 
  Search,
  Download,
  Trash2,
  Eye,
  Filter,
  FolderOpen,
  Calendar,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  Clock,
  Share2,
  Lock,
  Unlock,
  History,
  Settings,
  FileCheck,
  Zap,
  Grid3x3,
  List,
  Kanban,
  MoreVertical,
  Copy,
  Archive,
  Folder,
  TrendingUp,
  FileJson
} from 'lucide-react';
import { Document as DocumentType, DocumentVersion, AccessRight, ApprovalWorkflow } from '@/app/types';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isAccessControlOpen, setIsAccessControlOpen] = useState(false);
  const [isApprovalWorkflowOpen, setIsApprovalWorkflowOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface Document {
    id: number;
    name: string;
    type: string;
    category: string;
    size: string;
    uploadDate: string;
    uploadedBy: string;
    company?: string;
    tags: string[];
    status: 'approved' | 'pending' | 'rejected';
    version: number;
    expiryDate?: string;
    ocrText?: string;
  }

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Contrat_Acme_2026.pdf',
      type: 'pdf',
      category: 'Contrats',
      size: '2.4 MB',
      uploadDate: '2026-01-20',
      uploadedBy: 'Marie Dupont',
      company: 'Acme Corporation',
      tags: ['Contrat', 'Signé', 'Important'],
      status: 'approved',
      version: 2,
      expiryDate: '2027-01-20',
      ocrText: 'Contrat commercial entre...'
    },
    {
      id: 2,
      name: 'Devis_TechStart_Q1.pdf',
      type: 'pdf',
      category: 'Devis',
      size: '856 KB',
      uploadDate: '2026-01-19',
      uploadedBy: 'Jean Martin',
      company: 'TechStart SAS',
      tags: ['Devis', 'En attente'],
      status: 'pending',
      version: 1
    },
    {
      id: 3,
      name: 'Facture_Global_12345.pdf',
      type: 'pdf',
      category: 'Factures',
      size: '445 KB',
      uploadDate: '2026-01-18',
      uploadedBy: 'Sophie Bernard',
      company: 'Global Industries',
      tags: ['Facture', 'Payée'],
      status: 'approved',
      version: 1
    },
    {
      id: 4,
      name: 'Presentation_Innovation.pptx',
      type: 'pptx',
      category: 'Présentations',
      size: '5.8 MB',
      uploadDate: '2026-01-17',
      uploadedBy: 'Pierre Leclerc',
      company: 'Innovation Labs',
      tags: ['Présentation', 'Commercial'],
      status: 'approved',
      version: 1
    },
    {
      id: 5,
      name: 'Cahier_des_charges_Digital.docx',
      type: 'docx',
      category: 'Projets',
      size: '1.2 MB',
      uploadDate: '2026-01-16',
      uploadedBy: 'Luc Dubois',
      company: 'Digital Solutions',
      tags: ['CDC', 'Projet'],
      status: 'approved',
      version: 3
    },
    {
      id: 6,
      name: 'Bon_commande_SmartTech.pdf',
      type: 'pdf',
      category: 'Commandes',
      size: '320 KB',
      uploadDate: '2026-01-15',
      uploadedBy: 'Alice Rousseau',
      company: 'Smart Tech SARL',
      tags: ['Bon de commande', 'Validé'],
      status: 'approved',
      version: 1
    },
    {
      id: 7,
      name: 'RH_Recrutement_2026.xlsx',
      type: 'xlsx',
      category: 'RH',
      size: '680 KB',
      uploadDate: '2026-01-14',
      uploadedBy: 'Thomas Petit',
      tags: ['RH', 'Recrutement'],
      status: 'pending',
      version: 1
    },
    {
      id: 8,
      name: 'Marketing_Campaign_Q1.pdf',
      type: 'pdf',
      category: 'Marketing',
      size: '3.1 MB',
      uploadDate: '2026-01-13',
      uploadedBy: 'Emma Moreau',
      tags: ['Marketing', 'Campagne'],
      status: 'approved',
      version: 1
    }
  ] as Document[]);

  const categories = [
    { id: 'all', name: 'Tous', count: documents.length },
    { id: 'Contrats', name: 'Contrats', count: documents.filter(d => d.category === 'Contrats').length },
    { id: 'Devis', name: 'Devis', count: documents.filter(d => d.category === 'Devis').length },
    { id: 'Factures', name: 'Factures', count: documents.filter(d => d.category === 'Factures').length },
    { id: 'Projets', name: 'Projets', count: documents.filter(d => d.category === 'Projets').length },
    { id: 'RH', name: 'RH', count: documents.filter(d => d.category === 'RH').length },
    { id: 'Marketing', name: 'Marketing', count: documents.filter(d => d.category === 'Marketing').length }
  ];

  const filteredDocuments = documents.filter(doc => {
    // Filtre de recherche
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par catégorie
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    // Filtre par statut
    const matchesStatus = activeTab === 'all' || 
                         (activeTab === 'approved' && doc.status === 'approved') ||
                         (activeTab === 'pending' && doc.status === 'pending') ||
                         (activeTab === 'recent' && new Date(doc.uploadDate) > new Date(new Date().setDate(new Date().getDate() - 7)));
    
    // Filtre par montant (pas applicable pour documents, juste pour montrer la structure)
    // const matchesValue = true; // Documents n'ont pas de valeur
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="h-8 w-8 text-green-500" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="h-8 w-8 text-orange-500" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <ImageIcon className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload
      console.log('Files selected:', e.target.files);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              Gestion Électronique de Documents
            </h1>
            <p className="text-gray-600 mt-2">Organisez, gérez et suivez tous vos documents en un seul endroit</p>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 border-2 border-blue-700 shadow-lg hover:shadow-xl font-semibold">
                <Upload className="h-5 w-5" />
                <span>Télécharger Document</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg md:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">Télécharger un Document</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Drag and Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Glissez-déposez vos fichiers ici
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    ou cliquez pour sélectionner
                  </p>
                  <button
                    onClick={handleFileSelect}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Parcourir les fichiers
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-gray-400 mt-4">
                    Formats supportés: PDF, DOC, XLS, PPT, Images (max 10MB)
                  </p>
                </div>

                {/* Metadata Form */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Catégorie</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Sélectionner une catégorie</option>
                      <option value="Contrats">Contrats</option>
                      <option value="Devis">Devis</option>
                      <option value="Factures">Factures</option>
                      <option value="Projets">Projets</option>
                      <option value="RH">RH</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Entreprise associée</label>
                    <Input placeholder="Nom de l'entreprise" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-700">Tags</label>
                    <Input placeholder="Ajouter des tags (séparés par des virgules)" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsUploadDialogOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setIsUploadDialogOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Télécharger
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Documents</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{documents.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Approuvés</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{documents.filter(d => d.status === 'approved').length}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">En Attente</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{documents.filter(d => d.status === 'pending').length}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Catégories</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{categories.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Folder className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-0 bg-white p-0 rounded-lg border-2 border-gray-300 shadow-md overflow-hidden">
            <TabsTrigger value="all" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none border-r border-gray-300 last:border-r-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:bg-gray-50">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Tous</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none border-r border-gray-300 last:border-r-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:bg-gray-50">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Récents</span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none border-r border-gray-300 last:border-r-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:bg-gray-50">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Approuvés</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none border-r border-gray-300 last:border-r-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:bg-gray-50">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Attente</span>
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:text-blue-700 data-[state=active]:font-bold hover:bg-gray-50">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Partagés</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher par nom, entreprise, tags..."
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
          >
            <Kanban className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Documents Display - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Aucun document trouvé</p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="border-0 shadow-md hover:shadow-lg transition-all hover:scale-105 bg-white cursor-pointer overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Document Icon and Name */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getFileIcon(doc.type)}
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{doc.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{doc.size}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 py-3 border-t border-b border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Catégorie:</span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">{doc.category}</Badge>
                      </div>
                      {doc.company && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Entreprise:</span>
                          <span className="font-medium text-gray-900">{doc.company}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Téléchargé par:</span>
                        <span className="text-gray-900 text-xs">{doc.uploadedBy}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-gray-900 text-xs">{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 2 && (
                          <Badge className="bg-gray-100 text-gray-700 text-xs">+{doc.tags.length - 2}</Badge>
                        )}
                      </div>
                    )}

                    {/* Status and Actions */}
                    <div className="flex justify-between items-center pt-3">
                      <Badge className={`${getStatusColor(doc.status)} text-xs`}>
                        {getStatusLabel(doc.status)}
                      </Badge>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Télécharger">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Documents Display - List View */}
      {viewMode === 'list' && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Entreprise
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Taille
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Aucun document trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getFileIcon(doc.type)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{doc.name}</p>
                              <p className="text-xs text-gray-500">v{doc.version}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200">{doc.category}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-900 font-medium">{doc.company || '-'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-600">{doc.size}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={`${getStatusColor(doc.status)} text-xs font-semibold`}>
                            {getStatusLabel(doc.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Télécharger">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors" title="Voir">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors" title="Historique">
                              <History className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Partager">
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Display - Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['approved', 'pending', 'rejected'].map((status) => {
            const statusDocuments = filteredDocuments.filter(d => d.status === status);
            const statusLabels = {
              approved: 'Approuvés',
              pending: 'En Attente',
              rejected: 'Rejetés'
            };
            const statusColors = {
              approved: 'bg-emerald-50 border-emerald-200',
              pending: 'bg-amber-50 border-amber-200',
              rejected: 'bg-red-50 border-red-200'
            };
            const iconColors = {
              approved: 'text-emerald-600',
              pending: 'text-amber-600',
              rejected: 'text-red-600'
            };

            return (
              <div key={status} className={`${statusColors[status as keyof typeof statusColors]} border-2 rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-4">
                  {status === 'approved' && <CheckCircle className={`h-5 w-5 ${iconColors[status]}`} />}
                  {status === 'pending' && <Clock className={`h-5 w-5 ${iconColors[status]}`} />}
                  {status === 'rejected' && <AlertCircle className={`h-5 w-5 ${iconColors[status]}`} />}
                  <h3 className="font-bold text-gray-900">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </h3>
                  <span className="ml-auto bg-white px-2 py-1 rounded text-xs font-bold text-gray-700">
                    {statusDocuments.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusDocuments.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucun document
                    </div>
                  ) : (
                    statusDocuments.map((doc) => (
                      <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white cursor-move">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                              {getFileIcon(doc.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm line-clamp-2">{doc.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{doc.size}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 py-3 border-t border-b border-gray-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Catégorie:</span>
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">{doc.category}</Badge>
                            </div>
                            {doc.company && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Entreprise:</span>
                                <span className="font-medium text-gray-900">{doc.company}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Date:</span>
                              <span className="text-gray-900">{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>

                          {doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {doc.tags.slice(0, 1).map((tag, index) => (
                                <Badge key={index} className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {doc.tags.length > 1 && (
                                <Badge className="bg-gray-100 text-gray-700 text-xs">+{doc.tags.length - 1}</Badge>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2 pt-3 mt-3 border-t">
                            <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium" title="Télécharger">
                              <Download className="h-4 w-4 mx-auto" />
                            </button>
                            <button className="flex-1 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-medium" title="Voir">
                              <Eye className="h-4 w-4 mx-auto" />
                            </button>
                            <button className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium" title="Supprimer">
                              <Trash2 className="h-4 w-4 mx-auto" />
                            </button>
                          </div>
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

      {/* Advanced GED Features Section */}
      <div className="mt-12 space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Fonctionnalités Avancées de GED</h2>
              <p className="text-indigo-100 mt-1">Gestion complète du cycle de vie des documents avec workflows, versioning et contrôle d'accès</p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="workflow" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-0 bg-gradient-to-r from-slate-50 to-blue-50 p-0 rounded-lg border-b-2 border-gray-300 overflow-hidden">
                <TabsTrigger value="workflow" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none border-r border-gray-200 last:border-r-0 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-white transition-all py-4">
                  <FileCheck className="h-5 w-5" />
                  <span className="hidden sm:inline">Workflows</span>
                </TabsTrigger>
                <TabsTrigger value="versioning" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none border-r border-gray-200 last:border-r-0 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-white transition-all py-4">
                  <History className="h-5 w-5" />
                  <span className="hidden sm:inline">Versions</span>
                </TabsTrigger>
                <TabsTrigger value="access" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none border-r border-gray-200 last:border-r-0 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-white transition-all py-4">
                  <Lock className="h-5 w-5" />
                  <span className="hidden sm:inline">Accès</span>
                </TabsTrigger>
                <TabsTrigger value="classification" className="flex items-center justify-center gap-2 text-xs md:text-sm rounded-none data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-white transition-all py-4">
                  <Zap className="h-5 w-5" />
                  <span className="hidden sm:inline">Classification IA</span>
                </TabsTrigger>
              </TabsList>

              {/* Approval Workflow Tab */}
              <TabsContent value="workflow" className="p-8 space-y-6 bg-white">
                <div className="grid gap-6">
                  {[
                    {
                      name: 'Contrat_Acme_2026.pdf',
                      status: 'approved',
                      uploadedBy: 'Marie Dupont',
                      steps: [
                        { name: 'Service Commercial', status: 'approved', date: '2026-01-19', person: 'Jean Martin' },
                        { name: 'Direction Générale', status: 'approved', date: '2026-01-20', person: 'Pierre Leclerc' }
                      ]
                    },
                    {
                      name: 'Devis_TechStart_Q1.pdf',
                      status: 'pending',
                      uploadedBy: 'Jean Martin',
                      steps: [
                        { name: 'Service Commercial', status: 'approved', date: '2026-01-18', person: 'Sophie Bernard' },
                        { name: 'Direction Générale', status: 'pending', date: null, person: null }
                      ]
                    }
                  ].map((doc, idx) => (
                    <Card key={idx} className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg">
                              <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{doc.name}</h3>
                              <p className="text-sm text-gray-500">Envoyé par {doc.uploadedBy}</p>
                            </div>
                          </div>
                          <Badge className={doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1' : 'bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1'}>
                            {doc.status === 'approved' ? '✓ Approuvé' : '⏳ En attente'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          {doc.steps.map((step, stepIdx) => (
                            <div key={stepIdx} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {step.status === 'approved' ? (
                                  <div className="p-2 bg-emerald-100 rounded-full flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                  </div>
                                ) : (
                                  <div className="p-2 bg-amber-100 rounded-full flex-shrink-0">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-gray-900">{step.name}</p>
                                  {step.person && <p className="text-xs text-gray-500">Par {step.person}</p>}
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-gray-600 flex-shrink-0">{step.date || 'Attente'}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Versioning Tab */}
              <TabsContent value="versioning" className="p-8 space-y-6 bg-white">
                <div className="space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <Card key={idx} className={`border-2 shadow-md hover:shadow-lg transition-all ${idx === 0 ? 'border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50' : 'border-gray-200'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${idx === 0 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                              <FileJson className={`h-6 w-6 ${idx === 0 ? 'text-indigo-600' : 'text-gray-600'}`} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">Version {3 - idx}</p>
                              <p className={`text-sm ${idx === 0 ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                                {idx === 0 ? '★ Version actuelle' : `Modifié il y a ${idx} jour${idx > 1 ? 's' : ''}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all hover:shadow-md">
                              Consulter
                            </button>
                            {idx !== 0 && (
                              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-bold rounded-lg transition-all">
                                Restaurer
                              </button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Access Control Tab */}
              <TabsContent value="access" className="p-8 space-y-6 bg-white">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
                  <Share2 className="h-5 w-5" />
                  Partager le Document
                </Button>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Accès Actuels</h3>
                  {[
                    { user: 'Marie Dupont', role: 'Propriétaire', permission: 'Admin', icon: '👤', color: 'indigo' },
                    { user: 'Jean Martin', role: 'Manager', permission: 'Éditer', icon: '👥', color: 'blue' },
                    { user: 'Sophie Bernard', role: 'User', permission: 'Consulter', icon: '👁️', color: 'emerald' }
                  ].map((access, idx) => (
                    <Card key={idx} className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{access.user}</p>
                              <p className="text-sm text-gray-500">{access.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-indigo-100 text-indigo-800 font-bold text-xs px-3 py-1">
                              {access.permission}
                            </Badge>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Classification IA Tab */}
              <TabsContent value="classification" className="p-8 space-y-6 bg-white">
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-900 text-lg">Classification Automatique par IA</p>
                      <p className="text-sm text-purple-800 mt-2">
                        Les documents sont automatiquement analysés et classifiés en fonction de leur contenu, avec un score de confiance pour chaque classification
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { type: 'Contrats', confidence: 98 },
                    { type: 'Contrat Commercial', confidence: 96 },
                    { type: 'Client: Acme Corporation', confidence: 94 }
                  ].map((classification, idx) => (
                    <Card key={idx} className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
                      <CardContent className="p-5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-100 rounded-lg">
                                <Tag className="h-4 w-4 text-indigo-600" />
                              </div>
                              <span className="font-bold text-gray-900">{classification.type}</span>
                            </div>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                              {classification.confidence}% confiance
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all"
                              style={{ width: `${classification.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;
