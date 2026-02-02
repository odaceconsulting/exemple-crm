import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { FileSearch, MapPin, Calendar, Users, Plus, Filter, Search } from 'lucide-react';
import RecruitmentService from '@/app/services/hr/RecruitmentService';
import { JobOffer } from '@/app/types/hr/HRTypes';

export const JobOffers = () => {
    const [offers, setOffers] = useState<JobOffer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newOffer, setNewOffer] = useState<Partial<JobOffer>>({
        type: 'CDI',
        status: 'published',
        requirements: []
    });

    useEffect(() => {
        loadOffers();
    }, []);

    const loadOffers = async () => {
        const data = await RecruitmentService.getJobOffers();
        setOffers(data);
    };

    const handleCreateOffer = async () => {
        if (newOffer.title && newOffer.department && newOffer.location) {
            await RecruitmentService.createJobOffer(newOffer as any);
            setIsAddDialogOpen(false);
            loadOffers();
            setNewOffer({ type: 'CDI', status: 'published', requirements: [] });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700 border-green-200';
            case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'closed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredOffers = offers.filter(offer =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher une offre..."
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
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nouvelle Offre
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Créer une Offre d'Emploi</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Intitulé du poste</Label>
                                <Input
                                    value={newOffer.title || ''}
                                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                    placeholder="Ex: Développeur Senior"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Département</Label>
                                <Select
                                    value={newOffer.department}
                                    onValueChange={(val) => setNewOffer({ ...newOffer, department: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IT">IT</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Sales">Sales</SelectItem>
                                        <SelectItem value="HR">RH</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Lieu</Label>
                                <Input
                                    value={newOffer.location || ''}
                                    onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
                                    placeholder="Ex: Paris"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Type de contrat</Label>
                                <Select
                                    value={newOffer.type}
                                    onValueChange={(val: any) => setNewOffer({ ...newOffer, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CDI">CDI</SelectItem>
                                        <SelectItem value="CDD">CDD</SelectItem>
                                        <SelectItem value="Stage">Stage</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Description</Label>
                                <Input
                                    value={newOffer.description || ''}
                                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                    placeholder="Brève description du poste..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                            <Button onClick={handleCreateOffer} className="bg-blue-600">Créer l'offre</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => (
                    <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{offer.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className="font-medium text-blue-600">{offer.department}</span>
                                        <span>•</span>
                                        <span>{offer.type}</span>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(offer.status)} variant="outline">
                                    {offer.status === 'published' ? 'Publiée' : offer.status === 'draft' ? 'Brouillon' : 'Clôturée'}
                                </Badge>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>{offer.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>Publiée le {new Date(offer.postedDate).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium">{offer.candidatesCount} candidats</span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                    Gérer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
