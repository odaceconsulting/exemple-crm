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
  Zap
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
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Gestion Électronique de Documents</h1>
          <p className="text-gray-500 mt-1">Organisez et gérez tous vos documents</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2 border-2 border-blue-700">
                <Upload className="h-4 w-4" />
                Upload Document
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

      {/* Search and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, entreprise ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <FolderOpen className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{documents.length}</p>
            <p className="text-indigo-100 text-sm">Documents totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.type)}
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <User className="h-3 w-3" />
                            <span>{doc.uploadedBy}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline">{doc.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{doc.company || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{doc.size}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusLabel(doc.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsVersionHistoryOpen(true);
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                          title="Historique"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsAccessControlOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                          title="Droits d'accès"
                        >
                          <Lock className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedDoc(doc);
                            setIsApprovalWorkflowOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Approbation"
                        >
                          <FileCheck className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Voir">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Télécharger">
                          <Download className="h-4 w-4" />
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

          {filteredDocuments.length === 0 && (
            <div className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun document trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced GED Features Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Fonctionnalités Avancées de GED</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="workflow" className="w-full">
            <TabsList className="w-full border-b border-gray-200 rounded-none bg-transparent p-0">
              <TabsTrigger value="workflow" className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none">
                <FileCheck className="h-4 w-4 mr-2" />
                Workflows d'Approbation
              </TabsTrigger>
              <TabsTrigger value="versioning" className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none">
                <History className="h-4 w-4 mr-2" />
                Versioning
              </TabsTrigger>
              <TabsTrigger value="access" className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none">
                <Lock className="h-4 w-4 mr-2" />
                Contrôle d'Accès
              </TabsTrigger>
              <TabsTrigger value="classification" className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none">
                <Zap className="h-4 w-4 mr-2" />
                Classification IA
              </TabsTrigger>
            </TabsList>

            {/* Approval Workflow Tab */}
            <TabsContent value="workflow" className="p-6 space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    name: 'Contrat_Acme_2026.pdf',
                    status: 'approved',
                    steps: [
                      { name: 'Service Commercial', status: 'approved', date: '2026-01-19' },
                      { name: 'Direction Générale', status: 'approved', date: '2026-01-20' }
                    ]
                  },
                  {
                    name: 'Devis_TechStart_Q1.pdf',
                    status: 'pending',
                    steps: [
                      { name: 'Service Commercial', status: 'approved', date: '2026-01-18' },
                      { name: 'Direction Générale', status: 'pending', date: null }
                    ]
                  }
                ].map((doc, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">{doc.name}</h3>
                    <div className="space-y-3">
                      {doc.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">{step.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {step.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {step.status === 'pending' && <Clock className="h-5 w-5 text-orange-600" />}
                            <span className="text-xs text-gray-500">{step.date || 'En attente'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Versioning Tab */}
            <TabsContent value="versioning" className="p-6 space-y-4">
              {selectedDoc && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Document sélectionné: <span className="font-medium">{selectedDoc.name}</span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[...Array(selectedDoc.version)].map((_, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Version {selectedDoc.version - idx}</p>
                          <p className="text-sm text-gray-500">
                            {idx === 0 ? 'Actuel' : `Modifié il y a ${idx} jours`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                            Voir
                          </button>
                          {idx !== 0 && (
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                              Restaurer
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Access Control Tab */}
            <TabsContent value="access" className="p-6 space-y-4">
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager le Document
                </Button>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Accès Actuels</h3>
                  <div className="space-y-2">
                    {[
                      { user: 'Marie Dupont', role: 'Propriétaire', permission: 'Admin' },
                      { user: 'Jean Martin', role: 'Manager', permission: 'Éditer' },
                      { user: 'Sophie Bernard', role: 'User', permission: 'Consulter' }
                    ].map((access, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{access.user}</p>
                          <p className="text-xs text-gray-500">{access.role}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{access.permission}</span>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Classification IA Tab */}
            <TabsContent value="classification" className="p-6 space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Classification Automatique par IA</p>
                    <p className="text-xs text-indigo-700 mt-1">
                      Les documents sont automatiquement classés et catégorisés en fonction de leur contenu
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { type: 'Contrats', confidence: 98 },
                  { type: 'Contrat Commercial', confidence: 96 },
                  { type: 'Client: Acme Corporation', confidence: 94 }
                ].map((classification, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{classification.type}</span>
                      <span className="text-sm text-gray-600">{classification.confidence}% confiance</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${classification.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <span className="font-medium">Note:</span> Vous pouvez valider ou corriger les classifications pour améliorer la précision
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Version History Dialog */}
      {selectedDoc && (
        <Dialog open={isVersionHistoryOpen} onOpenChange={setIsVersionHistoryOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Historique des versions - {selectedDoc.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-80 overflow-y-auto py-2">
              {[...Array(selectedDoc.version)].map((_, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Version {selectedDoc.version - idx}</p>
                    <p className="text-xs text-gray-500">{idx === 0 ? 'Actuel' : `Modifié il y a ${idx} jours`}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">Voir</button>
                    {idx !== 0 && <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">Restaurer</button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsVersionHistoryOpen(false)}>Fermer</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Access Control Dialog */}
      {selectedDoc && (
        <Dialog open={isAccessControlOpen} onOpenChange={setIsAccessControlOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Droits d'accès - {selectedDoc.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {[
                { user: 'Marie Dupont', role: 'Propriétaire', permission: 'Admin' },
                { user: 'Jean Martin', role: 'Manager', permission: 'Éditer' },
                { user: 'Sophie Bernard', role: 'User', permission: 'Consulter' }
              ].map((a, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{a.user}</p>
                    <p className="text-xs text-gray-500">{a.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select defaultValue={a.permission} className="px-2 py-1 border rounded">
                      <option>Admin</option>
                      <option>Éditer</option>
                      <option>Consulter</option>
                      <option>Aucun</option>
                    </select>
                    <button className="p-1 text-red-500" onClick={() => alert('Suppression simulée')}><Trash2 className="h-4 w-4"/></button>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => alert('Partager (simulation)')}>Partager le document</Button>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsAccessControlOpen(false)}>Fermer</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Workflow Dialog */}
      {selectedDoc && (
        <Dialog open={isApprovalWorkflowOpen} onOpenChange={setIsApprovalWorkflowOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Approbation - {selectedDoc.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-gray-600">Statut actuel: <span className="font-medium">{getStatusLabel(selectedDoc.status)}</span></p>
              <div className="space-y-2">
                {[
                  { name: 'Service Commercial', status: 'approved', date: '2026-01-18' },
                  { name: 'Direction Générale', status: selectedDoc.status === 'approved' ? 'approved' : 'pending', date: selectedDoc.status === 'approved' ? '2026-01-20' : null }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{step.name}</p>
                      <p className="text-xs text-gray-500">{step.date || 'En attente'}</p>
                    </div>
                    <div>
                      {step.status === 'approved' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Clock className="h-5 w-5 text-orange-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsApprovalWorkflowOpen(false)}>Fermer</Button>
              <Button onClick={() => {
                // simulate approve
                setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'approved' } : d));
                setIsApprovalWorkflowOpen(false);
                alert('Document approuvé (simulation)');
              }}>Approuver</Button>
              <Button variant="outline" onClick={() => {
                setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'rejected' } : d));
                setIsApprovalWorkflowOpen(false);
                alert('Document rejeté (simulation)');
              }}>Rejeter</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Documents;
