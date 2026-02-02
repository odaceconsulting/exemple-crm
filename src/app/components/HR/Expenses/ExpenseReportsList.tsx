import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Search, Filter, Calendar, DollarSign, FileText, CheckCircle, XCircle } from 'lucide-react';
import ExpenseService from '@/app/services/hr/ExpenseService';
import { ExpenseReport } from '@/app/types/hr/HRTypes';

export const ExpenseReportsList = () => {
    const [expenses, setExpenses] = useState<ExpenseReport[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        const data = await ExpenseService.getExpenses();
        setExpenses(data);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reimbursed': return 'bg-green-100 text-green-700';
            case 'approved': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-orange-100 text-orange-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'reimbursed': return 'Remboursé';
            case 'approved': return 'Validé';
            case 'rejected': return 'Refusé';
            default: return 'En attente';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'transport': return 'Transport';
            case 'meals': return 'Repas';
            case 'accommodation': return 'Hébergement';
            case 'supplies': return 'Fournitures';
            default: return 'Autre';
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Justificatif</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(expense.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {expense.employeeName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {expense.description}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {getCategoryLabel(expense.category)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {expense.amount.toFixed(2)} €
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${getStatusColor(expense.status)} border-0`}>
                                        {getStatusLabel(expense.status)}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
