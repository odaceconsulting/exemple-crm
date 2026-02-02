import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';

interface ReportingData {
    headcount: {
        total: number;
        byDepartment: { department: string; count: number }[];
    };
    turnover: {
        turnoverRate: number;
        departures: number;
        averageHeadcount: number;
    };
    payroll: {
        totalPayroll: number;
        averageSalary: number;
        medianSalary: number;
    };
}

interface HRReportingProps {
    data: ReportingData | null;
}

export const HRReporting: React.FC<HRReportingProps> = ({ data }) => {
    if (!data) {
        return (
            <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Effectif Total</p>
                                <p className="text-3xl font-semibold text-gray-900 mt-2">{data.headcount.total}</p>
                                <p className="text-sm text-gray-600 mt-1">Collaborateurs</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Taux de Turnover</p>
                                <p className="text-3xl font-semibold text-gray-900 mt-2">{data.turnover.turnoverRate}%</p>
                                <p className="text-sm text-gray-600 mt-1">{data.turnover.departures} départs</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Salaire Moyen</p>
                                <p className="text-3xl font-semibold text-gray-900 mt-2">{data.payroll.averageSalary.toLocaleString('fr-FR')} €</p>
                                <p className="text-sm text-gray-600 mt-1">Par collaborateur</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Headcount by Department */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Effectifs par Département
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.headcount.byDepartment.map((dept, index) => {
                            const percentage = (dept.count / data.headcount.total) * 100;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                                        <span className="text-sm text-gray-600">{dept.count} ({percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Payroll Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Masse Salariale
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Total Annuel</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {data.payroll.totalPayroll.toLocaleString('fr-FR')} €
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Salaire Moyen</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {data.payroll.averageSalary.toLocaleString('fr-FR')} €
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Salaire Médian</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {data.payroll.medianSalary.toLocaleString('fr-FR')} €
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                            Analyse du Turnover
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Taux de Rotation</p>
                                <p className="text-2xl font-bold text-orange-700">
                                    {data.turnover.turnoverRate}%
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Départs</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {data.turnover.departures}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Effectif Moyen</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {data.turnover.averageHeadcount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Info */}
            <Card className="border-0 shadow-sm bg-blue-50">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <BarChart3 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Indicateurs Clés</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>• Effectif total: {data.headcount.total} collaborateurs</li>
                                <li>• Taux de turnover: {data.turnover.turnoverRate}% (objectif &lt; 15%)</li>
                                <li>• Masse salariale annuelle: {data.payroll.totalPayroll.toLocaleString('fr-FR')} €</li>
                                <li>• Coût moyen par collaborateur: {data.payroll.averageSalary.toLocaleString('fr-FR')} €/an</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
