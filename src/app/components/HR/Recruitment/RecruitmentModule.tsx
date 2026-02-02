import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { JobOffers } from './JobOffers';
import { Candidates } from './Candidates';
import { FileText, Users, Calendar } from 'lucide-react';

export const RecruitmentModule = () => {
    const [activeTab, setActiveTab] = useState('offres');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm bg-blue-50 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-blue-900">Offres Actives</p>
                                <p className="text-3xl font-bold text-blue-700 mt-2">12</p>
                                <p className="text-xs text-blue-600 mt-1">+2 ce mois</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-purple-50 border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-purple-900">Candidatures</p>
                                <p className="text-3xl font-bold text-purple-700 mt-2">48</p>
                                <p className="text-xs text-purple-600 mt-1">12 à traiter</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-orange-50 border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-orange-900">Entretiens</p>
                                <p className="text-3xl font-bold text-orange-700 mt-2">5</p>
                                <p className="text-xs text-orange-600 mt-1">Cette semaine</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Calendar className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
                    <TabsTrigger value="offres" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Offres d'emploi
                    </TabsTrigger>
                    <TabsTrigger value="candidats" className="gap-2">
                        <Users className="h-4 w-4" />
                        Candidats
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="offres">
                    <JobOffers />
                </TabsContent>

                <TabsContent value="candidats">
                    <Candidates />
                </TabsContent>
            </Tabs>
        </div>
    );
};
