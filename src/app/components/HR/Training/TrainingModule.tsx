import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { TrainingCatalog } from './TrainingCatalog';
import { MyTrainings } from './MyTrainings';
import { GraduationCap, BookOpen, Clock, Award } from 'lucide-react';

export const TrainingModule = () => {
    const [activeTab, setActiveTab] = useState('catalog');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm bg-blue-50 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-blue-900">Formations Disponibles</p>
                                <p className="text-3xl font-bold text-blue-700 mt-2">24</p>
                                <p className="text-xs text-blue-600 mt-1">Nouvelles ce mois-ci</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-orange-50 border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-orange-900">Heures de Formation</p>
                                <p className="text-3xl font-bold text-orange-700 mt-2">128h</p>
                                <p className="text-xs text-orange-600 mt-1">Total équipe 2025</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-yellow-50 border-l-4 border-l-yellow-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-yellow-900">Budget Utilisé</p>
                                <p className="text-3xl font-bold text-yellow-700 mt-2">45%</p>
                                <p className="text-xs text-yellow-600 mt-1">8 500 € restants</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Award className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
                    <TabsTrigger value="catalog" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Catalogue
                    </TabsTrigger>
                    <TabsTrigger value="my-trainings" className="gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Mes Formations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="catalog">
                    <TrainingCatalog />
                </TabsContent>

                <TabsContent value="my-trainings">
                    <MyTrainings />
                </TabsContent>
            </Tabs>
        </div>
    );
};
