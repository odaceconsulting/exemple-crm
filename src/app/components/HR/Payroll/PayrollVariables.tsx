import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Plus, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import PayrollService from '@/app/services/hr/PayrollService';
import { PayrollVariable } from '@/app/types/hr/HRTypes';

export const PayrollVariables = () => {
    const [variables, setVariables] = useState<PayrollVariable[]>([]);

    useEffect(() => {
        loadVariables();
    }, []);

    const loadVariables = async () => {
        const data = await PayrollService.getVariables();
        setVariables(data);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Variables de paie du mois</h3>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter une variable
                </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {variables.map((variable) => (
                            <tr key={variable.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {variable.employeeName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                    {variable.type}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {variable.amount} €
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {variable.description}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${variable.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} border-0`}>
                                        {variable.status === 'approved' ? 'Validé' : 'En attente'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
