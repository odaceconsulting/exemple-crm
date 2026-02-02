import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Search, Filter, Clock, MapPin, Euro, GraduationCap } from 'lucide-react';
import TrainingService from '@/app/services/hr/TrainingService';
import { Training } from '@/app/types/hr/HRTypes';

export const TrainingCatalog = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadTrainings();
    }, []);

    const loadTrainings = async () => {
        const data = await TrainingService.getCatalog();
        setTrainings(data);
    };

    const filteredTrainings = trainings.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher une formation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtres
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrainings.map((training) => (
                    <Card key={training.id} className="flex flex-col border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {training.category}
                                </Badge>
                                <Badge variant="secondary" className="bg-gray-100">
                                    {training.format === 'online' ? 'En ligne' : training.format === 'onsite' ? 'Présentiel' : 'Hybride'}
                                </Badge>
                            </div>
                            <CardTitle className="text-lg line-clamp-2 min-h-[56px]">{training.title}</CardTitle>
                            <p className="text-sm text-gray-500">{training.provider}</p>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <p className="text-sm text-gray-600 line-clamp-3">{training.description}</p>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>{training.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Euro className="h-4 w-4 text-gray-400" />
                                    <span>{training.cost > 0 ? `${training.cost} €` : 'Gratuit'}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {training.skills.map(skill => (
                                    <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-gray-100 pt-4">
                            <div className="w-full flex justify-between items-center">
                                <span className="text-xs text-gray-500">Prochaine session: {training.nextSession}</span>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">S'inscrire</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
