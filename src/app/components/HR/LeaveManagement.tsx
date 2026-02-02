import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Calendar, Check, X, AlertTriangle, Clock, Plane } from 'lucide-react';

interface LeaveRequest {
    id: string;
    employeeName: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    status: string;
}

interface LeaveCounter {
    employeeName: string;
    vacation: { total: number; used: number; remaining: number };
    sick: { total: number; used: number; remaining: number };
}

interface LeaveAlert {
    id: string;
    type: string;
    employeeName: string;
    message: string;
    severity: string;
}

interface LeaveManagementProps {
    requests: LeaveRequest[];
    counters: LeaveCounter[];
    alerts: LeaveAlert[];
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({ requests, counters, alerts }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return 'Approuvé';
            case 'pending': return 'En attente';
            case 'rejected': return 'Rejeté';
            default: return status;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'vacation': return 'Vacances';
            case 'sick': return 'Maladie';
            case 'personal': return 'Personnel';
            default: return type;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'warning': return 'bg-orange-50 border-l-orange-500';
            case 'info': return 'bg-blue-50 border-l-blue-500';
            case 'error': return 'bg-red-50 border-l-red-500';
            default: return 'bg-gray-50 border-l-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* Leave Alerts */}
            {alerts.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            Alertes Congés
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div key={alert.id} className={`p-4 border-l-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{alert.employeeName}</p>
                                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Leave Requests */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Plane className="h-5 w-5 text-blue-600" />
                            Demandes de Congés
                        </CardTitle>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Nouvelle Demande
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {requests.map((request) => (
                            <div key={request.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="font-semibold text-gray-900">{request.employeeName}</p>
                                            <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
                                            <Badge className={getStatusColor(request.status)}>
                                                {getStatusLabel(request.status)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(request.startDate).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            <span>→</span>
                                            <span>{new Date(request.endDate).toLocaleDateString('fr-FR')}</span>
                                            <span className="font-medium text-blue-600">({request.days} jours)</span>
                                        </div>
                                    </div>
                                    {request.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                                <Check className="h-4 w-4 mr-1" />
                                                Approuver
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                                <X className="h-4 w-4 mr-1" />
                                                Refuser
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Leave Counters */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        Compteurs de Congés
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collaborateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vacances</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maladie</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {counters.map((counter, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{counter.employeeName}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">{counter.vacation.remaining}</span>
                                                <span className="text-gray-500"> / {counter.vacation.total} jours</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(counter.vacation.remaining / counter.vacation.total) * 100}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-900">{counter.sick.remaining}</span>
                                                <span className="text-gray-500"> / {counter.sick.total} jours</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${(counter.sick.remaining / counter.sick.total) * 100}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${counter.vacation.remaining < 5 ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {counter.vacation.remaining + counter.sick.remaining} jours
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
