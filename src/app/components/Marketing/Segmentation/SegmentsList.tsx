import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Users, Plus, Save, Filter, Search, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

export const SegmentsList = () => {
    const [activeTab, setActiveTab] = useState('list');

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="list">Mes Segments</TabsTrigger>
                        <TabsTrigger value="builder">Nouveau Segment</TabsTrigger>
                        <TabsTrigger value="scoring">Scoring</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="list">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { name: "Clients VIP", count: 124, type: "Dynamique" },
                            { name: "Prospects Chauds", count: 450, type: "Dynamique" },
                            { name: "Inactifs > 3 mois", count: 890, type: "Statique" },
                            { name: "Participants Webinar", count: 65, type: "Statique" }
                        ].map((seg, i) => (
                            <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded text-green-600">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{seg.name}</h3>
                                                <p className="text-xs text-gray-500">Mis à jour il y a 2h</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${seg.type === 'Dynamique' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {seg.type}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-2xl font-bold text-gray-900">{seg.count}</p>
                                        <p className="text-xs text-gray-500">Contacts</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="builder">
                    <Card>
                        <CardHeader><CardTitle>Constructeur de Segment</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom du segment</Label>
                                    <Input placeholder="Ex: Clients Parisiens" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <select className="w-full p-2 border rounded-md">
                                        <option>Dynamique (Mise à jour auto)</option>
                                        <option>Statique (Snapshot)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                    <Filter className="h-4 w-4" /> Critères d'inclusion
                                </h4>

                                <div className="flex gap-2 items-end bg-white p-3 rounded border">
                                    <div className="space-y-1 flex-1">
                                        <Label className="text-xs">Champ</Label>
                                        <select className="w-full text-sm p-1 border rounded"><option>Ville</option><option>Age</option><option>Chiffre d'affaire</option></select>
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <Label className="text-xs">Opérateur</Label>
                                        <select className="w-full text-sm p-1 border rounded"><option>Est égal à</option><option>Contient</option><option>Commence par</option></select>
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <Label className="text-xs">Valeur</Label>
                                        <Input className="h-8" placeholder="Paris" />
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-500">X</Button>
                                </div>

                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-blue-50">
                                    <Plus className="h-3 w-3 mr-1" /> Ajouter un critère ET
                                </Button>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline">Annuler</Button>
                                <Button className="bg-green-600" onClick={() => alert("Segment créé avec succès ! (Simulation)")}>
                                    <Save className="h-4 w-4 mr-2" /> Créer Segment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="scoring">
                    <Card>
                        <CardHeader>
                            <CardTitle>Règles de Scoring</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <BarChart3 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Configuration des points (Ouverture email = +5, Clic = +10, Visite prix = +20).
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
