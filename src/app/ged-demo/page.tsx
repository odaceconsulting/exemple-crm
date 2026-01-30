'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import { Label } from '@/app/components/ui/label';
import {
    FolderPlus,
    FolderOpen,
    Upload,
    Search,
    Shield,
    PenTool,
    Link2,
    CheckCircle,
    Clock,
    FileText,
    Sparkles,
    Database,
    ChevronRight,
    Home,
    Plus,
    Eye,
    Lock,
    Users,
    Mail,
    Building2,
    Briefcase,
    TrendingUp
} from 'lucide-react';

/**
 * Page GED Améliorée - Démonstration complète et fonctionnelle
 */
export default function GEDEnhancedPage() {
    const [folders, setFolders] = useState([
        { id: '1', name: 'Contrats', count: 12 },
        { id: '2', name: 'Factures', count: 45 },
        { id: '3', name: 'Projets', count: 8 },
        { id: '4', name: 'RH', count: 23 }
    ]);

    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showSignature, setShowSignature] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);
    const [showIntegrations, setShowIntegrations] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [newFolderName, setNewFolderName] = useState('');

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            setFolders([...folders, {
                id: Date.now().toString(),
                name: newFolderName,
                count: 0
            }]);
            setNewFolderName('');
            setShowCreateFolder(false);
        }
    };

    const handleUpload = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setShowUpload(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length > 2) {
            setSearchResults([
                { id: 1, title: 'Contrat_Acme_2026.pdf', type: 'document' },
                { id: 2, title: 'Facture_2026_001.pdf', type: 'document' },
                { id: 3, title: 'Dossier: Projets', type: 'folder' }
            ]);
        } else {
            setSearchResults([]);
        }
    };

    const stats = [
        { label: 'Services', value: '8', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Types', value: '300+', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Features', value: '40+', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Dossiers', value: folders.length.toString(), icon: FolderOpen, color: 'text-orange-600', bg: 'bg-orange-100' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-4">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">Module GED Amélioré</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Gestion Électronique de Documents
                </h1>
                <p className="text-lg text-gray-600">
                    8 services • 300+ types • Toutes les fonctionnalités avancées
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                                </div>
                                <div className={`p-3 ${stat.bg} rounded-lg`}>
                                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Button
                    onClick={() => setShowCreateFolder(true)}
                    className="h-20 bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700"
                >
                    <div className="flex flex-col items-center gap-2">
                        <FolderPlus className="h-6 w-6" />
                        <span className="font-semibold">Nouveau Dossier</span>
                    </div>
                </Button>

                <Button
                    onClick={() => setShowUpload(true)}
                    className="h-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-6 w-6" />
                        <span className="font-semibold">Upload Avancé</span>
                    </div>
                </Button>

                <Button
                    onClick={() => setShowSignature(true)}
                    className="h-20 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                >
                    <div className="flex flex-col items-center gap-2">
                        <PenTool className="h-6 w-6" />
                        <span className="font-semibold">Signature</span>
                    </div>
                </Button>

                <Button
                    onClick={() => setShowSecurity(true)}
                    className="h-20 bg-gradient-to-r from-red-500 to-pink-500 text-white"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Shield className="h-6 w-6" />
                        <span className="font-semibold">Sécurité</span>
                    </div>
                </Button>
            </div>

            {/* Recherche */}
            <Card className="mb-8 shadow-lg">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Recherche full-text..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>
                    {searchResults.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {searchResults.map((result) => (
                                <div key={result.id} className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer flex items-center gap-3">
                                    {result.type === 'folder' ? <FolderOpen className="h-5 w-5 text-blue-600" /> : <FileText className="h-5 w-5 text-blue-600" />}
                                    <span className="font-medium">{result.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dossiers */}
            <Card className="mb-8 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-6 w-6" />
                        Dossiers ({folders.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {folders.map((folder) => (
                            <button
                                key={folder.id}
                                className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                            >
                                <FolderOpen className="h-16 w-16 text-blue-500 mx-auto mb-3" />
                                <p className="font-semibold text-center">{folder.name}</p>
                                <p className="text-sm text-gray-500 text-center">{folder.count} fichiers</p>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Services */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gray-800 text-white">
                    <CardTitle>✅ Services Implémentés</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: 'FolderService.ts', desc: 'Gestion hiérarchique', icon: FolderOpen },
                            { name: 'UploadService.ts', desc: 'Upload avec compression', icon: Upload },
                            { name: 'SearchService.ts', desc: 'Recherche full-text', icon: Search },
                            { name: 'MetadataService.ts', desc: 'Champs personnalisés', icon: Database },
                            { name: 'SignatureService.ts', desc: 'Workflow signature', icon: PenTool },
                            { name: 'SecurityService.ts', desc: 'Chiffrement', icon: Shield },
                            { name: 'NotificationService.ts', desc: 'Notifications', icon: Mail },
                            { name: 'IntegrationService.ts', desc: 'Liens CRM', icon: Link2 }
                        ].map((service, idx) => (
                            <div key={idx} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <service.icon className="h-5 w-5 text-green-600" />
                                    <code className="text-sm font-mono text-blue-600">{service.name}</code>
                                </div>
                                <p className="text-sm text-gray-600">{service.desc}</p>
                                <Badge className="mt-2 bg-green-500">Complet</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Créer un dossier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Nom du dossier</Label>
                            <Input
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Ex: Contrats 2026"
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowCreateFolder(false)}>Annuler</Button>
                            <Button onClick={handleCreateFolder}>Créer</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Avancé</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="border-2 border-dashed p-8 text-center rounded-lg">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p>Glissez-déposez vos fichiers</p>
                            <p className="text-sm text-gray-500">Compression auto &gt; 1MB</p>
                        </div>
                        {uploadProgress > 0 && (
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Upload...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} />
                            </div>
                        )}
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setShowUpload(false)}>Annuler</Button>
                            <Button onClick={handleUpload}>Démarrer</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSignature} onOpenChange={setShowSignature}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Workflow de Signature</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <Users className="h-8 w-8 text-purple-600 mb-2" />
                            <p className="font-semibold">Multi-signataires</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg">
                            <Clock className="h-8 w-8 text-indigo-600 mb-2" />
                            <p className="font-semibold">Séquentiel</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSecurity} onOpenChange={setShowSecurity}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Sécurité Avancée</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="p-4 bg-red-50 rounded-lg">
                            <Lock className="h-8 w-8 text-red-600 mb-2" />
                            <p className="font-semibold">Chiffrement AES</p>
                        </div>
                        <div className="p-4 bg-pink-50 rounded-lg">
                            <FileText className="h-8 w-8 text-pink-600 mb-2" />
                            <p className="font-semibold">Watermark</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showIntegrations} onOpenChange={setShowIntegrations}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Intégrations CRM</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                        {[
                            { name: 'Entreprises', icon: Building2, count: 145 },
                            { name: 'Contacts', icon: Users, count: 523 },
                            { name: 'Factures', icon: FileText, count: 234 }
                        ].map((int, idx) => (
                            <div key={idx} className="p-4 bg-orange-50 rounded-lg">
                                <int.icon className="h-8 w-8 text-orange-600 mb-2" />
                                <p className="font-semibold">{int.name}</p>
                                <p className="text-sm">{int.count} liens</p>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
