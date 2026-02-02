import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Layout, Plus, Eye, BarChart3, FileText } from 'lucide-react';
import { LandingBuilder } from './LandingBuilder';

export const LandingList = () => {
    const [activeTab, setActiveTab] = useState('list');

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="list">Mes Pages</TabsTrigger>
                        <TabsTrigger value="builder">Nouveau Design</TabsTrigger>
                        <TabsTrigger value="templates">Modèles</TabsTrigger>
                        <TabsTrigger value="analytics">Performances</TabsTrigger>
                    </TabsList>
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setActiveTab('builder')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle Page
                    </Button>
                </div>

                <TabsContent value="list">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden group hover:shadow-lg transition-all">
                                <div className="h-40 bg-gray-100 relative group-hover:bg-gray-200 transition-colors">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => setActiveTab('builder')}>
                                            <Layout className="h-4 w-4 mr-2" /> Éditer
                                        </Button>
                                        <Button variant="secondary" size="sm">
                                            <Eye className="h-4 w-4 mr-2" /> Voir
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Webinar Inscription #{i}</h3>
                                            <p className="text-xs text-gray-500">Publié le 12 Fév 2026</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">En ligne</span>
                                    </div>
                                    <div className="mt-4 flex gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="block font-bold text-gray-900">1,250</span>
                                            Visites
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900">32%</span>
                                            Conv.
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="builder">
                    <LandingBuilder />
                </TabsContent>

                <TabsContent value="templates">
                    <Card>
                        <CardHeader><CardTitle>Galerie de Modèles</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <Layout className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Galerie de templates responsive (SaaS, E-commerce, Event...)
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardHeader><CardTitle>Statistiques Globales</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <BarChart3 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Heatmaps, analyse du trafic, A/B testing reports.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
