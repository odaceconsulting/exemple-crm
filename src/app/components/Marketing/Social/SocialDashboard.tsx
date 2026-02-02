import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Share2, Plus, Calendar, Linkedin, Facebook, Twitter, Instagram, BarChart2, Image as ImageIcon } from 'lucide-react';

export const SocialDashboard = () => {
    const [activeTab, setActiveTab] = useState('calendar');
    const [isNewPostOpen, setIsNewPostOpen] = useState(false);

    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        setIsNewPostOpen(false);
        // Logic to add post would go here
        alert("Post planifié avec succès !");
    };

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <TabsList className="bg-white border">
                        <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                        <TabsTrigger value="posts">Publications</TabsTrigger>
                        <TabsTrigger value="analytics">Engagement</TabsTrigger>
                    </TabsList>

                    <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-pink-600 hover:bg-pink-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Créer une publication</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreatePost} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="networks">Réseaux</Label>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-200 bg-blue-50"><Linkedin className="h-4 w-4" /> LinkedIn</Button>
                                        <Button type="button" variant="outline" size="sm" className="gap-2 text-blue-600"><Facebook className="h-4 w-4" /> Facebook</Button>
                                        <Button type="button" variant="outline" size="sm" className="gap-2 text-pink-600"><Instagram className="h-4 w-4" /> Instagram</Button>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Contenu du post</Label>
                                    <Textarea id="content" placeholder="Quoi de neuf ?" className="h-32" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Média</Label>
                                    <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
                                        <ImageIcon className="h-8 w-8 mb-2" />
                                        <span className="text-xs">Ajouter une image ou une vidéo</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input type="date" id="date" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="time">Heure</Label>
                                        <Input type="time" id="time" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-pink-600 hover:bg-pink-700">Planifier</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <TabsContent value="calendar">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Planning - Mars 2026</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Mois</Button>
                                <Button variant="outline" size="sm">Semaine</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                                {days.map(day => (
                                    <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                                {dates.map(date => (
                                    <div key={date} className="bg-white p-2 min-h-[100px] hover:bg-gray-50 transition-colors relative group">
                                        <span className="text-xs text-gray-400">{date}</span>
                                        {date === 12 && (
                                            <div className="mt-1 p-1 bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 truncate cursor-pointer">
                                                <Linkedin className="h-3 w-3 inline mr-1" />
                                                Article Blog
                                            </div>
                                        )}
                                        {date === 15 && (
                                            <div className="mt-1 p-1 bg-blue-600 text-white text-xs rounded border border-blue-700 truncate cursor-pointer">
                                                <Facebook className="h-3 w-3 inline mr-1" />
                                                Promo Flash
                                            </div>
                                        )}
                                        <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600" onClick={() => setIsNewPostOpen(true)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="posts">
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&q=80)' }}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900">Lancement de la nouvelle collection</h3>
                                            <span className="text-xs text-gray-500">Publié il y a 2h</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">Découvrez nos derniers produits en exclusivité sur le site web ! #Fashion #New #2026</p>
                                        <div className="flex gap-4 mt-3">
                                            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                <Linkedin className="h-3 w-3" /> LinkedIn
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded">
                                                <Instagram className="h-3 w-3" /> Instagram
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-right min-w-[100px]">
                                        <div>
                                            <span className="block font-bold text-gray-900">1,240</span>
                                            <span className="text-xs text-gray-500">Vues</span>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-gray-900">45</span>
                                            <span className="text-xs text-gray-500">Likes</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardHeader>
                            <CardTitle>Engagement Social</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
                                <BarChart2 className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                Croissance des abonnés, Taux d'engagement par réseau.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
