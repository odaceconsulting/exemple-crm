import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { AnnualReviews } from './AnnualReviews';
import { OKRs } from './OKRs';
import { Target, FileText, Award, TrendingUp } from 'lucide-react';

export const EvaluationsModule = () => {
    const [activeTab, setActiveTab] = useState('reviews');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm bg-indigo-50 border-l-4 border-l-indigo-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-indigo-900">Évaluations 2025</p>
                                <p className="text-3xl font-bold text-indigo-700 mt-2">85%</p>
                                <p className="text-xs text-indigo-600 mt-1">Complétées</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <FileText className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-green-50 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-green-900">Objectifs Atteints</p>
                                <p className="text-3xl font-bold text-green-700 mt-2">124</p>
                                <p className="text-xs text-green-600 mt-1">+12% vs 2024</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Target className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-yellow-50 border-l-4 border-l-yellow-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-yellow-900">Performance Moy.</p>
                                <p className="text-3xl font-bold text-yellow-700 mt-2">4.2/5</p>
                                <p className="text-xs text-yellow-600 mt-1">Top 10% secteur</p>
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
                    <TabsTrigger value="reviews" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Évaluations Annuelles
                    </TabsTrigger>
                    <TabsTrigger value="okrs" className="gap-2">
                        <Target className="h-4 w-4" />
                        Objectifs (OKRs)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="reviews">
                    <AnnualReviews />
                </TabsContent>

                <TabsContent value="okrs">
                    <OKRs />
                </TabsContent>
            </Tabs>
        </div>
    );
};
