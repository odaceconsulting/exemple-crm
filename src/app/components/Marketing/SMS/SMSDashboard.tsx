import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { MessageSquare, Plus, Settings, BarChart, History, Globe } from 'lucide-react';
import { SMSEditor } from './SMSEditor';

export const SMSDashboard = () => {
    const [activeTab, setActiveTab] = useState('editor');

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="editor">Nouvel Envoi</TabsTrigger>
                        <TabsTrigger value="history">Historique</TabsTrigger>
                        <TabsTrigger value="api">API & Intégrations</TabsTrigger>
                        <TabsTrigger value="reports">Rapports</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="editor">
                    <Card>
                        <CardHeader>
                            <CardTitle>Créer une campagne SMS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SMSEditor />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des Campagnes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-100 p-2 rounded text-green-600">
                                                <MessageSquare className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">Soldes Hiver #{i}</p>
                                                <p className="text-xs text-gray-500">24 Janvier 2026 • 15,000 destinataires</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-8 text-sm">
                                            <div>
                                                <span className="text-gray-500 block text-xs">Délivrés</span>
                                                <span className="font-bold text-green-600">98.5%</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block text-xs">Clics</span>
                                                <span className="font-bold text-blue-600">12.4%</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block text-xs">Coût</span>
                                                <span className="font-bold text-gray-900">450€</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">O</div>
                                    Orange API
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-green-50 text-green-700 rounded border border-green-200">
                                    <span className="text-sm font-medium">Statut: Connecté</span>
                                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">API Key</label>
                                    <input type="password" value="************************" className="w-full p-2 bg-gray-100 rounded border" disabled />
                                </div>
                                <div className="text-sm text-gray-500">
                                    Solde restant: <span className="font-bold text-gray-900">450.00 EUR</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-black font-bold">M</div>
                                    MTN API
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 text-gray-500 rounded border border-gray-200">
                                    <span className="text-sm font-medium">Statut: Déconnecté</span>
                                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                </div>
                                <Button variant="outline" className="w-full">Configuration</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="reports">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytique SMS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <BarChart className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Graphiques de délivrabilité, taux de réponse, désabonnements.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
