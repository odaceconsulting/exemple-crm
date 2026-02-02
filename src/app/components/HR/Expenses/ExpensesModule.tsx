import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ExpenseReportsList } from './ExpenseReportsList';
import { SubmitExpense } from './SubmitExpense';
import { Receipt, PlusCircle, CreditCard, PieChart } from 'lucide-react';

export const ExpensesModule = () => {
    const [activeTab, setActiveTab] = useState('list');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm bg-orange-50 border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-orange-900">En attente</p>
                                <p className="text-3xl font-bold text-orange-700 mt-2">455 €</p>
                                <p className="text-xs text-orange-600 mt-1">3 notes à valider</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-green-50 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-green-900">Remboursé</p>
                                <p className="text-3xl font-bold text-green-700 mt-2">1 240 €</p>
                                <p className="text-xs text-green-600 mt-1">Ce mois-ci</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-blue-50 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-blue-900">Moyenne</p>
                                <p className="text-3xl font-bold text-blue-700 mt-2">85 €</p>
                                <p className="text-xs text-blue-600 mt-1">Par note de frais</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <PieChart className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
                    <TabsTrigger value="list" className="gap-2">
                        <Receipt className="h-4 w-4" />
                        Historique
                    </TabsTrigger>
                    <TabsTrigger value="submit" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Nouvelle demande
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <ExpenseReportsList />
                </TabsContent>

                <TabsContent value="submit">
                    <SubmitExpense />
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Import necessary icons
import { Clock, CheckCircle } from 'lucide-react';
