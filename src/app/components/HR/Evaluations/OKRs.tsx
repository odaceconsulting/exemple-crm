import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress'; // Assuming Progress component exists or using standard HTML
import { Target, TrendingUp, Users, User } from 'lucide-react';
import EvaluationService from '@/app/services/hr/EvaluationService';
import { Objective } from '@/app/types/hr/HRTypes';

export const OKRs = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);

    useEffect(() => {
        loadObjectives();
    }, []);

    const loadObjectives = async () => {
        const data = await EvaluationService.getObjectives();
        setObjectives(data);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'individual': return <User className="h-4 w-4 text-blue-600" />;
            case 'team': return <Users className="h-4 w-4 text-purple-600" />;
            case 'company': return <TrendingUp className="h-4 w-4 text-green-600" />;
            default: return <Target className="h-4 w-4 text-gray-600" />;
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'bg-green-600';
        if (progress >= 50) return 'bg-blue-600';
        return 'bg-orange-500';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj) => (
                <Card key={obj.id} className="border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-gray-100 p-2 rounded-lg">
                                {getTypeIcon(obj.type)}
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${obj.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    obj.status === 'at-risk' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                }`}>
                                {obj.status === 'in-progress' ? 'En cours' :
                                    obj.status === 'completed' ? 'Terminé' :
                                        obj.status === 'at-risk' ? 'À risque' : 'Non démarré'}
                            </span>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2">{obj.title}</h4>
                        <p className="text-sm text-gray-500 mb-6 h-10 line-clamp-2">{obj.description}</p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">{obj.progress}%</span>
                                <span className="text-gray-400">Échéance: {new Date(obj.dueDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${getProgressColor(obj.progress)}`}
                                    style={{ width: `${obj.progress}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card className="border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors h-full min-h-[220px]">
                <div className="text-center">
                    <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                        <Target className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Nouvel Objectif</p>
                </div>
            </Card>
        </div>
    );
};
