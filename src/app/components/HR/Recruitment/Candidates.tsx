import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Search, Filter, Mail, Phone, Calendar, Star, FileText, MoreHorizontal } from 'lucide-react';
import RecruitmentService from '@/app/services/hr/RecruitmentService';
import { Candidate } from '@/app/types/hr/HRTypes';

export const Candidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        const data = await RecruitmentService.getCandidates();
        setCandidates(data);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'screening': return 'bg-purple-100 text-purple-700';
            case 'interview': return 'bg-orange-100 text-orange-700';
            case 'offer': return 'bg-green-100 text-green-700';
            case 'hired': return 'bg-green-600 text-white';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Nouveau';
            case 'screening': return 'En lecture';
            case 'interview': return 'Entretien';
            case 'offer': return 'Offre';
            case 'hired': return 'Embauché';
            case 'rejected': return 'Rejeté';
            default: return status;
        }
    };

    const filteredCandidates = candidates.filter(c =>
        c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher un candidat..."
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

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste visé</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCandidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                                {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900">{candidate.firstName} {candidate.lastName}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Mail className="h-3 w-3" />
                                                {candidate.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-900">{candidate.position}</p>
                                </td>
                                <td className="px-6 py-4">
                                    {candidate.score && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-medium text-gray-900">{candidate.score}%</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(candidate.appliedDate).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${getStatusColor(candidate.status)} border-0`}>
                                        {getStatusLabel(candidate.status)}
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
