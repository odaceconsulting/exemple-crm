import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { GitBranch, Plus, Zap, Clock, Mail, MessageSquare, Save, Play } from 'lucide-react';

export const WorkflowList = () => {
    const [activeTab, setActiveTab] = useState('list');

    const handleSaveWorkflow = () => {
        alert("Workflow sauvegardé et activé avec succès !");
        setActiveTab('list');
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="list">Mes Workflows</TabsTrigger>
                        <TabsTrigger value="builder">Éditeur</TabsTrigger>
                        <TabsTrigger value="triggers">Déclencheurs</TabsTrigger>
                    </TabsList>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setActiveTab('builder')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Workflow
                    </Button>
                </div>

                <TabsContent value="list">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-indigo-100 p-2 rounded text-indigo-600">
                                        <GitBranch className="h-6 w-6" />
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Actif</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Bienvenue Nouveaux Inscrits</h3>
                                <p className="text-sm text-gray-500 mb-4">Envoi email J+0, SMS J+3 si pas d'ouverture.</p>
                                <div className="flex gap-4 text-xs text-gray-500">
                                    <span><strong>1,240</strong> Enrôlés</span>
                                    <span><strong>45%</strong> Conv.</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-gray-300">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-indigo-100 p-2 rounded text-indigo-600">
                                        <GitBranch className="h-6 w-6" />
                                    </div>
                                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Brouillon</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Relance Panier Abandonné</h3>
                                <p className="text-sm text-gray-500 mb-4">Email de rappel après 2h d'inactivité.</p>
                                <div className="flex gap-4 text-xs text-gray-500">
                                    <span><strong>0</strong> Enrôlés</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="builder">
                    <Card className="h-[600px] bg-gray-50 relative overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow flex flex-col gap-2">
                            <Button variant="outline" size="sm" className="justify-start gap-2"><Zap className="h-4 w-4 text-yellow-500" /> Trigger</Button>
                            <Button variant="outline" size="sm" className="justify-start gap-2"><Clock className="h-4 w-4 text-gray-500" /> Délai</Button>
                            <Button variant="outline" size="sm" className="justify-start gap-2"><Mail className="h-4 w-4 text-blue-500" /> Email</Button>
                            <Button variant="outline" size="sm" className="justify-start gap-2"><MessageSquare className="h-4 w-4 text-orange-500" /> SMS</Button>
                        </div>

                        {/* Actions */}
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <Button variant="outline" size="sm" className="bg-white" onClick={() => setActiveTab('list')}>Annuler</Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSaveWorkflow}>
                                <Save className="h-4 w-4 mr-2" /> Sauvegarder
                            </Button>
                        </div>

                        {/* Visual Mockup of Nodes */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-8">
                            <div className="w-64 p-4 bg-white rounded-lg shadow-lg border-l-4 border-l-yellow-500 text-center cursor-pointer hover:shadow-xl transition-shadow">
                                <p className="text-xs text-gray-500 text-left mb-1">DÉCLENCHEUR</p>
                                <p className="font-semibold">Inscription Formulaire</p>
                            </div>
                            <div className="h-8 border-l-2 border-gray-300 border-dashed"></div>
                            <div className="w-64 p-4 bg-white rounded-lg shadow-lg border-l-4 border-l-blue-500 text-center cursor-pointer hover:shadow-xl transition-shadow">
                                <p className="text-xs text-gray-500 text-left mb-1">ACTION</p>
                                <p className="font-semibold">Envoyer Email "Bienvenue"</p>
                            </div>
                            <div className="h-8 border-l-2 border-gray-300 border-dashed"></div>
                            <div className="w-64 p-4 bg-white rounded-lg shadow-lg border-l-4 border-l-gray-500 text-center cursor-pointer hover:shadow-xl transition-shadow">
                                <p className="text-xs text-gray-500 text-left mb-1">DÉLAI</p>
                                <p className="font-semibold">Attendre 3 jours</p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="triggers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuration des Triggers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <Zap className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Liste des événements trackés (Webhooks, API, Visites site).
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
