import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { MoreHorizontal, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import EvaluationService from '@/app/services/hr/EvaluationService';
import { Evaluation } from '@/app/types/hr/HRTypes';

export const AnnualReviews = () => {
    const [reviews, setReviews] = useState<Evaluation[]>([]);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        const data = await EvaluationService.getEvaluations();
        setReviews(data);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'scheduled': return 'bg-blue-100 text-blue-700';
            case 'in-progress': return 'bg-orange-100 text-orange-700';
            case 'signed': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Terminé';
            case 'scheduled': return 'Planifié';
            case 'in-progress': return 'En cours';
            case 'signed': return 'Signé';
            default: return status;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Campagne d'évaluations 2025</h3>
                <Button>Nouvelle Évaluation</Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evaluateur</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reviews.map((review) => (
                            <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                                {review.employeeName.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-gray-900">{review.employeeName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                    {review.type === 'annual' ? 'Annuel' : review.type === 'probation' ? 'Période d\'essai' : review.type}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {review.reviewer}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(review.date).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    {review.score ? (
                                        <span className={review.score >= 80 ? 'text-green-600' : 'text-orange-600'}>
                                            {review.score}/100
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${getStatusColor(review.status)} border-0`}>
                                        {getStatusLabel(review.status)}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
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
