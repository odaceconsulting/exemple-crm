import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Mail, Plus, FileText, BarChart2, Zap, Users } from 'lucide-react';
import { EmailEditor } from './EmailEditor';

export const EmailDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);

    // State for campaigns including initial dummy data
    const [campaigns, setCampaigns] = useState([
        { id: 1, name: "Newsletter Mars #1", date: "12 Mars 2026 à 10:00", opened: 1240, clicked: 320, status: "Envoyer" },
        { id: 2, name: "Newsletter Mars #2", date: "15 Mars 2026 à 14:30", opened: 980, clicked: 210, status: "Envoyer" },
        { id: 3, name: "Promo Flash Printemps", date: "20 Mars 2026 à 09:00", opened: 2100, clicked: 850, status: "Envoyer" },
    ]);
    const [currentCampaign, setCurrentCampaign] = useState<any>(null);
    const [newCampaignData, setNewCampaignData] = useState({ name: '', subject: '', segment: '' });

    const handleCreateCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        const newCampaign = {
            id: campaigns.length + 1,
            name: newCampaignData.name || "Nouvelle Campagne",
            date: "Brouillon",
            opened: 0,
            clicked: 0,
            status: "Brouillon",
            ...newCampaignData
        };

        setCampaigns([newCampaign, ...campaigns]);
        setCurrentCampaign(newCampaign);
        setIsNewCampaignOpen(false);
        setActiveTab('editor');
    };

    const handleSaveCampaign = () => {
        // Here we would typically update the campaign content in a real backend
        alert("Campagne sauvegardée avec succès ! Vous pouvez la retrouver dans l'onglet 'Campagnes'.");
        setActiveTab('campaigns');
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
                        <TabsTrigger value="editor">Éditeur</TabsTrigger>
                        <TabsTrigger value="templates">Modèles</TabsTrigger>
                        <TabsTrigger value="analytics">Rapports</TabsTrigger>
                    </TabsList>

                    <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle Campagne
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Créer une nouvelle campagne</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateCampaign} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom de la campagne</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Newsletter Avril 2026"
                                        required
                                        value={newCampaignData.name}
                                        onChange={(e) => setNewCampaignData({ ...newCampaignData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="subject">Objet de l'email</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Découvrez nos nouveautés..."
                                        required
                                        value={newCampaignData.subject}
                                        onChange={(e) => setNewCampaignData({ ...newCampaignData, subject: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="segment">Segment cible</Label>
                                    <select
                                        id="segment"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newCampaignData.segment}
                                        onChange={(e) => setNewCampaignData({ ...newCampaignData, segment: e.target.value })}
                                    >
                                        <option value="">Sélectionner une liste...</option>
                                        <option value="all">Tous les contacts</option>
                                        <option value="customers">Clients VIP</option>
                                        <option value="prospects">Prospects Chauds</option>
                                    </select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Commencer le design</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Emails Envoyés</p>
                                <p className="text-2xl font-bold text-gray-900">24,500</p>
                                <p className="text-xs text-green-600 mt-1">+12% cette semaine</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Taux d'ouverture</p>
                                <p className="text-2xl font-bold text-gray-900">42.8%</p>
                                <p className="text-xs text-green-600 mt-1">+2.4% vs moyenne</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Taux de clic</p>
                                <p className="text-2xl font-bold text-gray-900">12.5%</p>
                                <p className="text-xs text-red-600 mt-1">-0.5% vs moyenne</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-500">Désabonnements</p>
                                <p className="text-2xl font-bold text-gray-900">2%</p>
                                <p className="text-xs text-green-600 mt-1">Stable</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dernières Campagnes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {campaigns.slice(0, 3).map((campaign) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{campaign.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {campaign.status === 'Brouillon' ? 'Brouillon' : `Envoyé le ${campaign.date}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">Ouvertures</p>
                                                <p className="font-semibold text-gray-900">{campaign.opened}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">Clics</p>
                                                <p className="font-semibold text-gray-900">{campaign.clicked}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setCurrentCampaign(campaign);
                                                setActiveTab('editor');
                                            }}>Éditer</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="campaigns">
                    <Card>
                        <CardHeader>
                            <CardTitle>Toutes les Campagnes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {campaigns.map((campaign) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded ${campaign.status === 'Brouillon' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{campaign.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {campaign.status === 'Brouillon' ? 'Brouillon - Non envoyé' : campaign.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${campaign.status === 'Brouillon' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                                {campaign.status}
                                            </span>
                                            <Button variant="outline" size="sm" onClick={() => {
                                                setCurrentCampaign(campaign);
                                                setActiveTab('editor');
                                            }}>
                                                Modifier
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="editor">
                    <EmailEditor onSave={handleSaveCampaign} campaign={currentCampaign} />
                </TabsContent>

                <TabsContent value="templates">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group">
                                <div className="h-40 bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                                        <Button variant="secondary" size="sm">Utiliser</Button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-medium">Template Newsletter #{i}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Design moderne pour annonces produits</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rapports Détaillés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <BarChart2 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Graphiques d'évolution, heatmap des clics, export PDF.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
