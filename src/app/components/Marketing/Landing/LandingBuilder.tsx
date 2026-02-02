import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Save, Eye, Layout, Monitor, Smartphone, Globe } from 'lucide-react';

export const LandingBuilder = () => {
    const [formData, setFormData] = useState({
        heroTitle: 'Titre Principal Accrocheur',
        heroSubtitle: 'Sous-titre explicatif qui donne envie de cliquer sur le bouton d\'appel à l\'action ci-dessous.',
        ctaText: 'Commencer Gratuitement',
        ctaLink: '#',
        featuresTitle: 'Pourquoi nous choisir ?',
        imageUrl: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
            {/* Editor Sidebar */}
            <Card className="w-full lg:w-1/3 flex flex-col overflow-hidden">
                <CardHeader className="border-b bg-gray-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        Éditeur de Page
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 border-b pb-2">Section Héro</h3>
                        <div className="space-y-2">
                            <Label htmlFor="heroTitle">Titre Principal</Label>
                            <Input
                                id="heroTitle"
                                name="heroTitle"
                                value={formData.heroTitle}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="heroSubtitle">Sous-titre</Label>
                            <textarea
                                id="heroSubtitle"
                                name="heroSubtitle"
                                value={formData.heroSubtitle}
                                onChange={handleChange}
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image de fond (URL)</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 border-b pb-2">Action (CTA)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ctaText">Texte Bouton</Label>
                                <Input
                                    id="ctaText"
                                    name="ctaText"
                                    value={formData.ctaText}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ctaLink">Lien Bouton</Label>
                                <Input
                                    id="ctaLink"
                                    name="ctaLink"
                                    value={formData.ctaLink}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 border-b pb-2">Contenu</h3>
                        <div className="space-y-2">
                            <Label htmlFor="featuresTitle">Titre Section Fonctionnalités</Label>
                            <Input
                                id="featuresTitle"
                                name="featuresTitle"
                                value={formData.featuresTitle}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </CardContent>
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                    <Button variant="outline" className="bg-white" onClick={() => alert("Aperçu ouvert dans un nouvel onglet !")}>
                        <Eye className="h-4 w-4 mr-2" /> Aperçu
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => alert("Landing Page sauvegardée !")}>
                        <Save className="h-4 w-4 mr-2" /> Sauvegarder
                    </Button>
                </div>
            </Card>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-center gap-4 bg-white p-2 rounded-lg border shadow-sm w-fit mx-auto">
                    <Button variant="ghost" size="sm" className="bg-gray-100"><Monitor className="h-4 w-4 mr-2" /> Bureau</Button>
                    <Button variant="ghost" size="sm"><Smartphone className="h-4 w-4 mr-2" /> Mobile</Button>
                </div>

                <div className="flex-1 bg-white border rounded-xl overflow-hidden shadow-2xl relative">
                    {/* Fake Browser Header */}
                    <div className="bg-gray-100 border-b p-3 flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 bg-white h-7 rounded flex items-center px-3 text-xs text-gray-400 gap-2">
                            <Globe className="h-3 w-3" />
                            monsite.com/landing-page
                        </div>
                    </div>

                    {/* Landing Page Preview Content */}
                    <div className="h-full overflow-y-auto">
                        <div className="relative bg-slate-900 text-white py-24 px-8 text-center overflow-hidden">
                            {formData.imageUrl && (
                                <img
                                    src={formData.imageUrl}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                    alt="Hero Background"
                                />
                            )}
                            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                                <h1 className="text-5xl font-bold tracking-tight">{formData.heroTitle}</h1>
                                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                    {formData.heroSubtitle}
                                </p>
                                <div className="pt-4">
                                    <Button size="lg" className="bg-purple-600 hover:bg-purple-500 text-lg px-8 h-12">
                                        {formData.ctaText}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="py-20 px-8 bg-gray-50">
                            <div className="max-w-5xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{formData.featuresTitle}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                                                <Layout className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Fonctionnalité {i}</h3>
                                            <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
