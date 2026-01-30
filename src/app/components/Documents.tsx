import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/app/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
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
  FileJson,
  FolderPlus,
  ChevronRight,
  Home,
  Shield,
  PenTool,
  Link2,
  Sparkles,
  CloudUpload,
  Database
} from 'lucide-react';
import { Document as DocumentType, DocumentVersion, AccessRight, ApprovalWorkflow } from '@/app/types';
import { folderService } from '@/app/services/FolderService';
import { uploadService } from '@/app/services/UploadService';
import { searchService } from '@/app/services/SearchService';
import { metadataService } from '@/app/services/MetadataService';

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

  // New GED features state
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<any[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<any[]>([{ id: undefined, name: 'Racine' }]);
  const [uploadProgress, setUploadProgress] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // New GED features dialogs
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [showIntegrationsDialog, setShowIntegrationsDialog] = useState(false);
  const [gedFolders, setGedFolders] = useState([
    { id: '1', name: 'Contrats', count: 12 },
    { id: '2', name: 'Factures', count: 45 },
    { id: '3', name: 'Projets', count: 8 },
    { id: '4', name: 'RH', count: 23 }
  ]);
  const [uploadProgressValue, setUploadProgressValue] = useState(0);
  const [searchSuggestionsVisible, setSearchSuggestionsVisible] = useState(false);
  const [searchSuggestionsList, setSearchSuggestionsList] = useState<any[]>([]);

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
      name: 'Contrat_TechStart_Q1.pdf',
      type: 'pdf',
      category: 'Contrats',
      size: '856 KB',
      uploadDate: '2026-01-19',
      uploadedBy: 'Jean Martin',
      company: 'TechStart SAS',
      tags: ['Contrat', 'En attente'],
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
      name: 'Projet_Innovation.pptx',
      type: 'pptx',
      category: 'Projets',
      size: '5.8 MB',
      uploadDate: '2026-01-17',
      uploadedBy: 'Pierre Leclerc',
      company: 'Innovation Labs',
      tags: ['Projet', 'Commercial'],
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
      name: 'Facture_SmartTech.pdf',
      type: 'pdf',
      category: 'Factures',
      size: '320 KB',
      uploadDate: '2026-01-15',
      uploadedBy: 'Alice Rousseau',
      company: 'Smart Tech SARL',
      tags: ['Facture', 'Validé'],
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

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedDocForShare, setSelectedDocForShare] = useState<any>(null);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);
  const [newShareUser, setNewShareUser] = useState<string>('');
  const [newSharePermission, setNewSharePermission] = useState<string>('view');

  // Mock user list
  const allUsers = [
    { id: 1, name: 'Marie Dupont' },
    { id: 2, name: 'Jean Martin' },
    { id: 3, name: 'Sophie Bernard' },
    { id: 4, name: 'Alice Rousseau' },
    { id: 5, name: 'Thomas Petit' },
    { id: 6, name: 'Emma Moreau' }
  ];

  const handleDeleteDocument = (id: number) => {
    setDeleteTarget(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      const docName = documents.find(d => d.id === deleteTarget)?.name;
      setDocuments(documents.filter(d => d.id !== deleteTarget));
      alert(`Document ${docName} supprimé avec succès!`);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleShareDocument = (doc: any) => {
    setSelectedDocForShare(doc);
    setSharedUsers([]);
    setNewShareUser('');
    setNewSharePermission('view');
    setIsShareDialogOpen(true);
  };

  const handleAddShareUser = () => {
    if (newShareUser && !sharedUsers.find(u => u.name === newShareUser)) {
      const user = allUsers.find(u => u.name === newShareUser);
      if (user) {
        setSharedUsers([...sharedUsers, { ...user, permission: newSharePermission }]);
        setNewShareUser('');
        setNewSharePermission('view');
      }
    }
  };

  const handleRemoveShareUser = (userId: number) => {
    setSharedUsers(sharedUsers.filter(u => u.id !== userId));
  };

  const handleSaveShare = () => {
    console.log('Saving share settings for', selectedDocForShare.name, sharedUsers);
    setIsShareDialogOpen(false);
    alert('Document partagé avec succès!');
  };

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

      {/* Header Section - AT THE TOP */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gestion Électronique de Documents
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos documents avec arborescence, signature électronique et sécurité avancée</p>
          </div>
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Upload className="h-5 w-5 mr-2" />
            Téléverser Document
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <Home className="h-4 w-4 text-gray-500" />
        {breadcrumb.map((item, index) => (
          <React.Fragment key={item.id || 'root'}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            <button
              onClick={() => {
                setCurrentFolderId(item.id);
                setBreadcrumb(breadcrumb.slice(0, index + 1));
              }}
              className={`hover:text-blue-600 transition-colors ${index === breadcrumb.length - 1 ? 'text-blue-600 font-semibold' : 'text-gray-600'
                }`}
            >
              {item.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* New Features Bar */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setIsCreateFolderOpen(true)}
          className="p-4 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-3"
        >
          <FolderPlus className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-700">Nouveau Dossier</span>
        </button>

        <button
          onClick={() => setShowSignatureDialog(true)}
          className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-3 shadow-md"
        >
          <PenTool className="h-5 w-5" />
          <span className="font-semibold">Signature</span>
        </button>

        <button
          onClick={() => setShowSecurityDialog(true)}
          className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-3 shadow-md"
        >
          <Shield className="h-5 w-5" />
          <span className="font-semibold">Sécurité</span>
        </button>

        <button
          onClick={() => setShowIntegrationsDialog(true)}
          className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-3 shadow-md"
        >
          <Link2 className="h-5 w-5" />
          <span className="font-semibold">Intégrations</span>
        </button>
      </div>

      {/* KPI Cards - Clean 5-column grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Dossiers GED</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{gedFolders.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Folders Section */}
      {gedFolders.length > 0 && (
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-6 w-6" />
                Arborescence - Dossiers ({gedFolders.length})
              </div>
              {currentFolderId && (
                <Badge className="bg-white text-blue-600">
                  Affichage: {breadcrumb[breadcrumb.length - 1]?.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {gedFolders.map((folder) => {
                const folderDocCount = documents.filter(doc => doc.category === folder.name).length;
                const isSelected = currentFolderId === folder.id;

                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setCurrentFolderId(folder.id);
                      setBreadcrumb([...breadcrumb.slice(0, 1), { id: folder.id, name: folder.name }]);
                    }}
                    className={`p-4 bg-white rounded-lg hover:shadow-md transition-all group ${isSelected
                        ? 'border-2 border-blue-500 shadow-lg'
                        : 'border-2 border-gray-200 hover:border-blue-500'
                      }`}
                  >
                    <FolderOpen className={`h-12 w-12 mx-auto mb-2 group-hover:scale-110 transition-transform ${isSelected ? 'text-blue-600' : 'text-blue-500'
                      }`} />
                    <p className={`text-sm font-semibold text-center truncate ${isSelected ? 'text-blue-600' : 'text-gray-800'
                      }`}>{folder.name}</p>
                    <p className="text-xs text-gray-500 text-center mt-1">{folderDocCount} fichiers</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Tabs */}
      <div className="my-6 sm:my-8">
        {/* Show folder filter info if a folder is selected */}
        {currentFolderId && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold text-blue-800">
                  Affichage des documents du dossier: <span className="font-bold">{breadcrumb[breadcrumb.length - 1]?.name}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentFolderId(undefined);
                  setBreadcrumb([{ id: undefined, name: 'Racine' }]);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Afficher tous les documents
              </button>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 mb-20 sm:mb-20 md:mb-12 lg:mb-8 bg-transparent border-0 p-0">
            <TabsTrigger
              value="all"
              className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 ${activeTab === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              <FileText className="h-4 w-4" />
              <span className="inline">Tous</span>
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 ${activeTab === 'recent'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              <Clock className="h-4 w-4" />
              <span className="inline">Récents</span>
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 ${activeTab === 'approved'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span className="inline">Approuvés</span>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 ${activeTab === 'pending'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              <AlertCircle className="h-4 w-4" />
              <span className="inline">Attente</span>
            </TabsTrigger>
            <TabsTrigger
              value="shared"
              className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 ${activeTab === 'shared'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              <Share2 className="h-4 w-4" />
              <span className="inline">Partagés</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search and View Controls */}
      <div className="flex gap-3 mb-8 items-center">
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
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === 'grid'
              ? 'bg-blue-600 text-white border-2 border-blue-600'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            title="Vue Grille"
          >
            <Grid3x3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === 'list'
              ? 'bg-blue-600 text-white border-2 border-blue-600'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            title="Vue Liste"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === 'kanban'
              ? 'bg-blue-600 text-white border-2 border-blue-600'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            title="Vue Kanban"
          >
            <Kanban className="h-5 w-5" />
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700">
                            <Download className="h-4 w-4" />
                            Télécharger
                          </DropdownMenuItem>
                          {doc.type === 'pdf' && (
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-700">
                              <Eye className="h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                            onSelect={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

                    {/* Status */}
                    <div className="flex justify-between items-center pt-3">
                      <Badge className={`${getStatusColor(doc.status)} text-xs`}>
                        {getStatusLabel(doc.status)}
                      </Badge>
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
                            {doc.type === 'pdf' && (
                              <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors" title="Voir">
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleShareDocument(doc)}
                              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Partager"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Supprimer"
                            >
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
                          <div className="flex items-start gap-3 mb-3 justify-between">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                {getFileIcon(doc.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm line-clamp-2">{doc.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{doc.size}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                                  <MoreVertical className="h-4 w-4 text-gray-600" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700">
                                  <Download className="h-4 w-4" />
                                  Télécharger
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-700">
                                  <Eye className="h-4 w-4" />
                                  Voir
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                                  onSelect={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      <div className="mt-8 space-y-4">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-5 md:p-6 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg flex-shrink-0 mt-1">
              <Zap className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold">Fonctionnalités Avancées</h2>
              <p className="text-sm md:text-base text-indigo-100 mt-1">Workflows et contrôle d'accès</p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-0">
            <Tabs defaultValue="workflow" className="w-full">
              <TabsList className="grid w-full grid-cols-2 gap-2 my-6 sm:my-8 mb-16 sm:mb-16 md:mb-12 lg:mb-8 bg-transparent border-0 p-4">
                <TabsTrigger
                  value="workflow"
                  className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
                >
                  <FileCheck className="h-4 w-4" />
                  <span className="inline">Workflows</span>
                </TabsTrigger>
                <TabsTrigger
                  value="access"
                  className="flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md transition-all font-semibold text-sm border-2 bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-md"
                >
                  <Lock className="h-4 w-4" />
                  <span className="inline">Accès</span>
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
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex-shrink-0">
                              <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-900 text-base sm:text-lg break-words">{doc.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-500">Envoyé par {doc.uploadedBy}</p>
                            </div>
                          </div>
                          <Badge className={doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold px-3 py-1 flex-shrink-0' : 'bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold px-3 py-1 flex-shrink-0'}>
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

              {/* Versioning Tab - Hidden */}
              <TabsContent value="versioning" className="hidden p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white">
                <div className="space-y-3 sm:space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <Card key={idx} className={`border-2 shadow-md hover:shadow-lg transition-all ${idx === 0 ? 'border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50' : 'border-gray-200'}`}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${idx === 0 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                              <FileJson className={`h-6 w-6 ${idx === 0 ? 'text-indigo-600' : 'text-gray-600'}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 text-base sm:text-lg">Version {3 - idx}</p>
                              <p className={`text-xs sm:text-sm ${idx === 0 ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                                {idx === 0 ? '★ Version actuelle' : `Modifié il y a ${idx} jour${idx > 1 ? 's' : ''}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                            <button className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-all hover:shadow-md w-full sm:w-auto">
                              Consulter
                            </button>
                            {idx !== 0 && (
                              <button className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 text-xs sm:text-sm font-bold rounded-lg transition-all w-full sm:w-auto">
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
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Permissions</h2>

                  {/* Permissions Definition Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Consulter Permission */}
                    <Card className="border-2 border-emerald-200 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-emerald-50 to-white">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                            <Eye className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-emerald-900 text-lg">👁️ Consulter</h3>
                            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Lecture seule</p>
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-emerald-200 pt-4">
                          <p className="text-sm text-gray-700 font-medium mb-3">Autorisé :</p>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>Visualiser le document (PDF)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>Télécharger le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>Voir les métadonnées</span>
                            </li>
                          </ul>
                          <p className="text-sm text-gray-700 font-medium mt-3 mb-2">Non autorisé :</p>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 font-bold">✗</span>
                              <span>Modifier le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 font-bold">✗</span>
                              <span>Supprimer le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 font-bold">✗</span>
                              <span>Partager avec d'autres</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Éditer Permission */}
                    <Card className="border-2 border-blue-200 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-white">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                            <FileCheck className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-blue-900 text-lg">✏️ Éditer</h3>
                            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Lecture & Modification</p>
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-blue-200 pt-4">
                          <p className="text-sm text-gray-700 font-medium mb-3">Autorisé :</p>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">✓</span>
                              <span>Visualiser le document (PDF)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">✓</span>
                              <span>Télécharger le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">✓</span>
                              <span>Modifier le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">✓</span>
                              <span>Voir les métadonnées</span>
                            </li>
                          </ul>
                          <p className="text-sm text-gray-700 font-medium mt-3 mb-2">Non autorisé :</p>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 font-bold">✗</span>
                              <span>Supprimer le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 font-bold">✗</span>
                              <span>Gérer les permissions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600 font-bold">✗</span>
                              <span>Partager avec d'autres</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Admin Permission */}
                    <Card className="border-2 border-purple-200 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-white">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                            <Lock className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-purple-900 text-lg">🔐 Admin</h3>
                            <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Contrôle complet</p>
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-purple-200 pt-4">
                          <p className="text-sm text-gray-700 font-medium mb-3">Autorisé :</p>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600 font-bold">✓</span>
                              <span>Visualiser le document (PDF)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600 font-bold">✓</span>
                              <span>Télécharger le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600 font-bold">✓</span>
                              <span>Modifier le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600 font-bold">✓</span>
                              <span>Supprimer le document</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600 font-bold">✓</span>
                              <span>Gérer les permissions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-600 font-bold">✓</span>
                              <span>Partager avec d'autres</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Current Accesses */}
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
                </div>
              </TabsContent>

              {/* Classification IA Tab - Hidden */}
              <TabsContent value="classification" className="hidden p-8 space-y-6 bg-white">
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

      {/* Share Document Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Partager le Document</DialogTitle>
          </DialogHeader>
          {selectedDocForShare && (
            <div className="space-y-6 py-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>Document :</strong> {selectedDocForShare.name}
                </p>
              </div>

              {/* Add User Section */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Ajouter un utilisateur</Label>
                <div className="flex gap-2">
                  <select
                    value={newShareUser}
                    onChange={(e) => setNewShareUser(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Sélectionner un utilisateur...</option>
                    {allUsers.filter(u => !sharedUsers.find(su => su.id === u.id)).map(user => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permission Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Permissions</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setNewSharePermission('view')}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${newSharePermission === 'view'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    👁️ Consulter
                  </button>
                  <button
                    onClick={() => setNewSharePermission('edit')}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${newSharePermission === 'edit'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    onClick={() => setNewSharePermission('admin')}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${newSharePermission === 'admin'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    🔐 Admin
                  </button>
                </div>
              </div>

              {/* Add Button */}
              <Button
                onClick={handleAddShareUser}
                disabled={!newShareUser}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
              >
                Ajouter l'utilisateur
              </Button>

              {/* Shared Users List */}
              {sharedUsers.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <Label className="text-sm font-semibold">Accès partagés</Label>
                  {sharedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">
                            {user.permission === 'view' && '👁️ Consulter'}
                            {user.permission === 'edit' && '✏️ Éditer'}
                            {user.permission === 'admin' && '🔐 Admin'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveShareUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleSaveShare}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Signature Électronique */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-purple-600" />
              Workflow de Signature Électronique
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <User className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-semibold text-gray-800">Multi-signataires</p>
                <p className="text-sm text-gray-600">Plusieurs personnes peuvent signer</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                <Clock className="h-8 w-8 text-indigo-600 mb-2" />
                <p className="font-semibold text-gray-800">Signature séquentielle</p>
                <p className="text-sm text-gray-600">Ordre de signature défini</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <Zap className="h-8 w-8 text-pink-600 mb-2" />
                <p className="font-semibold text-gray-800">Rappels automatiques</p>
                <p className="text-sm text-gray-600">Notifications configurables</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <p className="font-semibold text-gray-800">Vérification</p>
                <p className="text-sm text-gray-600">Signatures vérifiables</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-800">
                <strong>Service:</strong> SignatureService.ts est prêt à gérer les workflows de signature électronique
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Sécurité Avancée */}
      <Dialog open={showSecurityDialog} onOpenChange={setShowSecurityDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Sécurité Avancée
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <Lock className="h-8 w-8 text-red-600 mb-2" />
                <p className="font-semibold text-gray-800">Chiffrement AES</p>
                <p className="text-sm text-gray-600">Documents sensibles protégés</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <FileText className="h-8 w-8 text-pink-600 mb-2" />
                <p className="font-semibold text-gray-800">Watermark</p>
                <p className="text-sm text-gray-600">Personnalisable et configurable</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                <Eye className="h-8 w-8 text-orange-600 mb-2" />
                <p className="font-semibold text-gray-800">Logs d'accès</p>
                <p className="text-sm text-gray-600">Traçabilité complète</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                <FileCheck className="h-8 w-8 text-emerald-600 mb-2" />
                <p className="font-semibold text-gray-800">Audit complet</p>
                <p className="text-sm text-gray-600">Rapports de sécurité</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-sm text-green-800">
                <strong>Service:</strong> SecurityService.ts gère le chiffrement, watermark et logs d'accès
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Intégrations CRM */}
      <Dialog open={showIntegrationsDialog} onOpenChange={setShowIntegrationsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-orange-600" />
              Intégrations avec Modules CRM
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all">
                <Folder className="h-8 w-8 text-blue-600 mb-2" />
                <p className="font-semibold text-gray-800">Entreprises</p>
                <p className="text-sm text-gray-600">145 liens actifs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all">
                <User className="h-8 w-8 text-purple-600 mb-2" />
                <p className="font-semibold text-gray-800">Contacts</p>
                <p className="text-sm text-gray-600">523 liens actifs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:border-green-400 cursor-pointer transition-all">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <p className="font-semibold text-gray-800">Opportunités</p>
                <p className="text-sm text-gray-600">89 liens actifs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 hover:border-yellow-400 cursor-pointer transition-all">
                <FileText className="h-8 w-8 text-yellow-600 mb-2" />
                <p className="font-semibold text-gray-800">Factures</p>
                <p className="text-sm text-gray-600">234 liens actifs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border-2 border-red-200 hover:border-red-400 cursor-pointer transition-all">
                <Folder className="h-8 w-8 text-red-600 mb-2" />
                <p className="font-semibold text-gray-800">Projets</p>
                <p className="text-sm text-gray-600">67 liens actifs</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer transition-all">
                <FileJson className="h-8 w-8 text-indigo-600 mb-2" />
                <p className="font-semibold text-gray-800">Emails</p>
                <p className="text-sm text-gray-600">1240 liens actifs</p>
              </div>
            </div>
            <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
              <p className="text-sm text-orange-800">
                <strong>Service:</strong> IntegrationService.ts permet de lier les documents à toutes les entités CRM
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Créer un Dossier */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-blue-600" />
              Créer un nouveau dossier
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Nom du dossier</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ex: Contrats 2026"
                className="mt-2"
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Le dossier sera créé dans l'arborescence actuelle avec FolderService.ts
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (newFolderName.trim()) {
                    setGedFolders([...gedFolders, {
                      id: Date.now().toString(),
                      name: newFolderName,
                      count: 0
                    }]);
                    setNewFolderName('');
                    setIsCreateFolderOpen(false);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Créer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
