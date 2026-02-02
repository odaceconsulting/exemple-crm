import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Download, FileText, CheckCircle, Clock } from 'lucide-react';
import PayrollService from '@/app/services/hr/PayrollService';
import { Payslip } from '@/app/types/hr/HRTypes';

export const Payslips = () => {
    const [payslips, setPayslips] = useState<Payslip[]>([]);

    useEffect(() => {
        loadPayslips();
    }, []);

    const loadPayslips = async () => {
        const data = await PayrollService.getPayslips();
        setPayslips(data);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'generated': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net à payer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date paiement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payslips.map((payslip) => (
                            <tr key={payslip.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {payslip.period}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {payslip.employeeName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {payslip.grossSalary.toLocaleString('fr-FR')} €
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {payslip.netSalary.toLocaleString('fr-FR')} €
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(payslip.paymentDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${getStatusColor(payslip.status)} border-0`}>
                                        {payslip.status === 'paid' ? 'Payé' :
                                            payslip.status === 'generated' ? 'Généré' : 'Brouillon'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                        <Download className="h-4 w-4 mr-2" />
                                        PDF
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
