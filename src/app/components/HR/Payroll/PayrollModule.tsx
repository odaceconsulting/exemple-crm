import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Payslips } from './Payslips';
import { PayrollVariables } from './PayrollVariables';
import { DollarSign, FileText, TrendingUp } from 'lucide-react';

export const PayrollModule = () => {
    const [activeTab, setActiveTab] = useState('payslips');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm bg-green-50 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-green-900">Masse Salariale</p>
                                <p className="text-3xl font-bold text-green-700 mt-2">142 k€</p>
                                <p className="text-xs text-green-600 mt-1">Mois en cours</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-blue-50 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-blue-900">Bulletins Générés</p>
                                <p className="text-3xl font-bold text-blue-700 mt-2">45/48</p>
                                <p className="text-xs text-blue-600 mt-1">Échéance: 30/01</p>
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
                                <p className="text-sm font-medium text-purple-900">Variables</p>
                                <p className="text-3xl font-bold text-purple-700 mt-2">12.5 k€</p>
                                <p className="text-xs text-purple-600 mt-1">Primes & Heures Sup.</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
                    <TabsTrigger value="payslips" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Bulletins de salaire
                    </TabsTrigger>
                    <TabsTrigger value="variables" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Variables de paie
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="payslips">
                    <Payslips />
                </TabsContent>

                <TabsContent value="variables">
                    <PayrollVariables />
                </TabsContent>
            </Tabs>
        </div>
    );
};
