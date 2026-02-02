import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress'; // Assuming Progress component exists
import { PlayCircle, Download, Award, Calendar } from 'lucide-react';
import TrainingService from '@/app/services/hr/TrainingService';
import { TrainingEnrollment } from '@/app/types/hr/HRTypes';

export const MyTrainings = () => {
    // Mock logged in user ID
    const currentUserId = '1';
    const [enrollments, setEnrollments] = useState<any[]>([]);

    useEffect(() => {
        loadMyTrainings();
    }, []);

    const loadMyTrainings = async () => {
        const data = await TrainingService.getMyTrainings(currentUserId);
        setEnrollments(data);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'approved': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Mes formations en cours</h3>

            {enrollments.map(({ enrollment, training }) => (
                <Card key={enrollment.id} className="border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge className={`${getStatusColor(enrollment.status)} border-0`}>
                                        {enrollment.status === 'in-progress' ? 'En cours' :
                                            enrollment.status === 'completed' ? 'Terminé' : 'Inscrit'}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        {training.provider}
                                    </span>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">{training.title}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Début: {new Date(enrollment.startDate).toLocaleDateString()}</span>
                                    </div>
                                    {enrollment.endDate && (
                                        <span>Fin: {new Date(enrollment.endDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>

                            {enrollment.status === 'completed' ? (
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-yellow-600" />
                                    Certificat
                                </Button>
                            ) : (
                                <Button className="flex items-center gap-2">
                                    <PlayCircle className="h-4 w-4" />
                                    Continuer
                                </Button>
                            )}
                        </div>

                        {enrollment.status === 'in-progress' && enrollment.progress !== undefined && (
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">{enrollment.progress}% complété</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${enrollment.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

            {enrollments.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">Vous n'avez aucune formation en cours.</p>
                    <Button variant="link" className="mt-2 text-blue-600">Parcourir le catalogue</Button>
                </div>
            )}
        </div>
    );
};
